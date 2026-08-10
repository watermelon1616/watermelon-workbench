/* 每日播客榜单构建脚本
 * 服务端运行（GitHub Action / 本地），无密钥、无第三方代理。
 * 1) 拉 Apple Podcasts 中国区热门榜（高质量中文播客）
 * 2) 对头部若干档，查 itunes lookup 拿到 RSS feed，取最新单集标题+简介
 * 3) 写 data/podcasts.json（站点同域加载，规避浏览器跨域）
 */
const fs = require('fs');
const OUT = process.argv[2] || 'data/podcasts.json';

function stripHtml(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ').trim();
}
const T = (ms) => new Promise(r => setTimeout(r, ms));
async function jget(u, timeout = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: ctrl.signal });
    if (!r.ok) throw new Error(u + ' -> ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}
async function charts(country, limit) {
  const j = await jget(`https://rss.marketingtools.apple.com/api/v2/${country}/podcasts/top/${limit}/podcasts.json`);
  return (j.feed && j.feed.results) || [];
}
async function feedOf(url) {
  try {
    const m = String(url).match(/\/id(\d+)/);
    if (!m) return null;
    const lu = await jget(`https://itunes.apple.com/lookup?id=${m[1]}&country=cn`);
    const feedUrl = lu.results && lu.results[0] && lu.results[0].feedUrl;
    if (!feedUrl) return null;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const fr = await fetch(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: ctrl.signal });
    clearTimeout(t);
    if (!fr.ok) return null;
    const xml = await fr.text();
    const it = xml.match(/<item>([\s\S]*?)<\/item>/);
    if (!it) return null;
    const b = it[1];
    const title = stripHtml((b.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
    const sum = stripHtml(
      (b.match(/<description>([\s\S]*?)<\/description>/) || [])[1] ||
      (b.match(/<itunes:summary>([\s\S]*?)<\/itunes:summary>/) || [])[1]
    );
    return { episode: title.slice(0, 120), summary: sum.slice(0, 480) };
  } catch (e) { return null; }
}

(async () => {
  let cn = [], us = [];
  try { cn = await charts('cn', 20); } catch (e) { console.error('cn charts fail:', e.message); }
  try { us = await charts('us', 10); } catch (e) { console.error('us charts fail:', e.message); }
  if (!cn.length && !us.length) { console.error('both charts failed, abort (keep old file)'); process.exit(0); }

  // 头部 10 档 enriched 最新单集
  for (let i = 0; i < Math.min(cn.length, 10); i++) {
    await T(250);
    const f = await feedOf(cn[i].url);
    if (f) cn[i]._ep = f;
  }

  const norm = (x) => ({
    id: String(x.id),
    name: x.name,
    artist: x.artistName,
    genre: (x.genres && x.genres[0] && x.genres[0].name) || '',
    url: x.url,
    art: x.artworkUrl100,
    episode: x._ep ? x._ep.episode : null,
    summary: x._ep ? x._ep.summary : null
  });

  const out = {
    updated: new Date().toISOString().slice(0, 10),
    cn: cn.map(norm),
    us: us.map(norm)
  };
  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log('OK wrote', OUT, '| cn=', cn.length, 'us=', us.length,
    '| cn with episode=', cn.filter(c => c._ep).length);
})();
