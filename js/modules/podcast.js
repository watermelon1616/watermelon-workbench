/* ==========================================================
   播客 —— 金融 / 理财 / 人际交往 / 提升自我
   卡片浏览 + 全文阅读 + 录音带收听 + 笔记
   今日推荐播客：数据源 = Apple Podcasts 每日热门榜（data/podcasts.json，
   由 GitHub Action 每天 06:00 刷新）。读完才换下一期；支持连读；可跳去收听。
   ========================================================== */

const PodcastModule = (() => {
  const KEY = 'podcast';
  const CATS = [
    { k: 'all', name: '全部', emoji: '🍉', color: '#FF5C6E' },
    { k: 'finance', name: '金融知识', emoji: '📈', color: '#3FAE7B' },
    { k: 'money', name: '理财知识', emoji: '🐷', color: '#F2A413' },
    { k: 'social', name: '人际交往', emoji: '💬', color: '#7B6BE0' },
    { k: 'growth', name: '提升自我', emoji: '🌱', color: '#FF5C6E' }
  ];
  const COVER = {
    finance: 'linear-gradient(130deg,#E4F6EC,#C9EFD9)',
    money: 'linear-gradient(130deg,#FFF3D6,#FFE4A8)',
    social: 'linear-gradient(130deg,#EDEAFB,#D8D2F7)',
    growth: 'linear-gradient(130deg,#FFE1E4,#FFC9CF)'
  };

  // 离线兜底：连不上实时榜时用这份（粤语 / 普通话可听，读完才换下一期）
  const BLOGS = [
    { tier: '头部热门', title: '普通人怎么用现金流思维管钱', author: '远山财经', tag: '理财',
      summary: '不追热点、不焦虑涨跌，先把每月的钱分成「活钱 / 保命 / 增值」三份。',
      text: '大家好，今天聊一个特别朴素但管用的思路：现金流思维。很多人一理财就想着怎么赚钱，其实第一步是想清楚钱每个月是怎么流进流出的。我把自己的钱分成三份：第一份是活钱，覆盖三到六个月的开销，放在随时能取的地方；第二份是保命钱，用来买保险和应急；第三份才是增值钱，拿去定投和复利。顺序不能乱，先活下来，再谈增长。' },
    { tier: '头部热门', title: '外贸新人第一次报价别踩的坑', author: '老周做外贸', tag: '外贸',
      summary: '报价不是报低价就能拿下，关键是把条款、交期和隐性成本一次说清。',
      text: '做外贸第一单最怕的就是报价报得漂亮，结果后面全是坑。我建议新人报价时一定把三件事写清楚：第一，价格条款是 FOB 还是 CIF，运费谁承担；第二，交期写具体日期，别写大约；第三，把模具费、打样费这些隐性成本提前说，不要等客人问。信任不是靠低价建立的，是靠你把不确定变成确定。' },
    { tier: '中腰部优质', title: '每天十五分钟，听力是怎么练出来的', author: '小语听力', tag: '学习',
      summary: '碎片化时间反复磨耳朵，比一次听两小时更有效。',
      text: '很多人问我听力怎么提升，我的答案很无聊：每天十五分钟，但要坚持。通勤的时候听一段，洗澡的时候听一段，关键是反复听同一段直到每个词都清楚。不要贪多，一段听懂了比十段听个大概有用得多。语言是肌肉记忆，不是知识，靠的是重复而不是理解。' },
    { tier: '中腰部优质', title: '人际交往里最被低估的能力：接话', author: '阿岚沟通课', tag: '人际',
      summary: '会说话不是抢着说，而是让对方觉得被听见。',
      text: '我们总以为会沟通就是能说，其实更重要的是会接。别人说完一句话，你先接住他的情绪，再接住他的内容，最后才表达自己的看法。比如同事说今天好累，你回一句确实最近项目紧，这就是接住了。让人舒服的从来不是金句，而是被认真听见的瞬间。' },
    { tier: '中腰部优质', title: '黄帝内经里的「早睡」到底值不值', author: '本草小记', tag: '养生',
      summary: '子时前入睡，是性价比最高的养生，没有之一。',
      text: '黄帝内经讲天人合一，放到今天看就是顺节律生活。夜里十一点到凌晨三点是肝胆修复的黄金时间，这时候还在刷手机，身体就少了一次自我修复。早睡不是玄学，是最便宜的养生。哪怕只是比昨天早半小时睡，长期下来气色和精力都会不一样。' }
  ];

  let cat = 'all';
  let reading = null;
  let _picks = [];   // 当天 3 个主题推荐（供绑定用）

  // 深度主题（每日 3 个不同主题，避开无脑内容）
  const THEMES = [
    { key: 'logic',   label: '逻辑思维', emoji: '🧠', match: /社会与文化|新闻|哲学|宗教|政府|文化|社会|政治/ },
    { key: 'finance', label: '财经知识', emoji: '📈', match: /商业|投资|经济|财经|金融|理财|创业/ },
    { key: 'science', label: '知识科普', emoji: '🔬', match: /科学|科技|技术|自然|历史|教育|健康|医学|天文|地理|读书/ },
    { key: 'debate',  label: '思辨辩论', emoji: '⚖️', match: /新闻|社会与文化|政府|政治|社会|文化|评论/ }
  ];
  function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

  // 每天 3 个不同主题，按日期稳定、次日轮换
  function dailyPicks() {
    const p = pool();
    if (!p.length) return [];
    const buckets = THEMES.map(t => ({ ...t, items: p.filter(x => x.genre && t.match.test(x.genre)) }));
    const dayStr = Store.today();
    const drop = hashStr(dayStr) % THEMES.length;          // 4 选 3，每天轮换掉一个
    const chosen = THEMES.filter((_, i) => i !== drop);
    const picks = [];
    chosen.forEach(th => {
      const b = buckets.find(x => x.key === th.key);
      const arr = (b && b.items.length) ? b.items : p;
      const idx = hashStr(dayStr + th.key) % arr.length;
      picks.push({ theme: th, pod: arr[idx] });
    });
    // 主题没人则补其它池，凑满 3 个
    let guard = 0;
    while (picks.length < 3 && guard++ < 20) {
      const rest = p.filter(x => !picks.some(pk => pk.pod && pk.pod.id === x.id));
      if (!rest.length) break;
      picks.push({ theme: null, pod: rest[hashStr(dayStr + picks.length) % rest.length] });
    }
    return picks;
  }

  // 实时榜（由 GitHub Action 每日刷新）
  let LIVE = null;
  let _podLoaded = false, _podLoading = false;

  function d() { return Store.data.podcast; }
  function chainOn() { return !!Store.data.settings.blogChain; }

  function ensurePodcasts() {
    if (_podLoaded || _podLoading) return;
    _podLoading = true;
    fetch('data/podcasts.json?cb=' + Date.now())
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(j => { if (j && j.cn && j.cn.length) LIVE = j; })
      .catch(() => {})
      .finally(() => { _podLoaded = true; _podLoading = false; if (reading == null) render(); });
  }

  // 归一化推荐池（实时优先，离线兜底）
  function pool() {
    if (LIVE && LIVE.cn && LIVE.cn.length) {
      const arr = LIVE.cn.concat(LIVE.us || []).map(x => ({
        id: 'a' + x.id,
        name: x.name,
        artist: x.artist,
        genre: x.genre,
        url: x.url,
        art: x.art,
        episode: x.episode,
        summary: x.summary,
        summaryText: x.summary
          ? x.summary
          : `今天推荐你听《${x.name}》，由 ${x.artist} 出品，分类：${x.genre}。点下面的链接去收听吧～`,
        tier: '头部热门'
      }));
      arr.forEach((x, i) => { x.tier = i < 10 ? '头部热门' : '中腰部优质'; });
      return arr;
    }
    return BLOGS.map((b, i) => ({
      id: 'b' + i,
      name: b.title,
      artist: b.author,
      genre: b.tag,
      url: 'https://www.xiaoyuzhoufm.com/search?q=' + encodeURIComponent(b.title),
      art: null,
      episode: null,
      summary: b.summary,
      summaryText: b.text,
      tier: b.tier
    }));
  }

  function doneIds() { if (!d().blogDoneIds) d().blogDoneIds = []; return d().blogDoneIds; }

  function curBlog() {
    const p = pool();
    if (!p.length) return null;
    let id = d().blogCurId;
    if (!id || !p.find(x => x.id === id)) {
      const done = doneIds();
      const pick = p.find(x => !done.includes(x.id)) || null;
      id = pick ? pick.id : null;
      d().blogCurId = id;
    }
    return id ? p.find(x => x.id === id) : null;
  }

  function markBlogDone(id) {
    const done = doneIds();
    if (id && !done.includes(id)) done.push(id);
    const p = pool();
    const nxt = p.find(x => !done.includes(x.id)) || null;
    d().blogCurId = nxt ? nxt.id : null;
    Store.checkIn(KEY); Store.save(); App.refreshStreak();
  }

  function render() {
    ensurePodcasts();
    if (reading) return renderReader();

    const list = cat === 'all' ? PODCAST_CORPUS : PODCAST_CORPUS.filter(p => p.cat === cat);
    const todayPick = PODCAST_CORPUS[U.dayIndex(PODCAST_CORPUS.length)];

    document.getElementById('view').innerHTML = `
      <!-- 今日推荐（主节目，每天自动换） -->
      <section class="card fade-in" style="background:linear-gradient(125deg,#FFF6DC,#FFE1E4);border:none">
        <div class="card-head">
          <h2>🎧 每日推荐</h2>
          <span class="tag red">${U.todayCN()}</span>
          <div class="spacer"></div>
          <span class="sub">每天自动换一期</span>
        </div>
        <div class="row" style="align-items:flex-start;gap:16px">
          <div style="font-size:44px;line-height:1">${todayPick.emoji}</div>
          <div style="flex:1;min-width:200px">
            <div style="font-size:17px;font-weight:700;line-height:1.45">${U.esc(todayPick.title)}</div>
            <div style="font-size:13px;color:#7C7566;margin-top:7px;line-height:1.7">${U.esc(todayPick.desc)}</div>
            <div class="row" style="margin-top:13px">
              <span class="tag">${todayPick.catCN}</span>
              <span class="tag grey">${todayPick.dur}</span>
              ${d().listened.includes(todayPick.id) ? '<span class="tag green">已听 ✓</span>' : ''}
            </div>
          </div>
          <button class="btn melon" data-open="${todayPick.id}">开始阅读 →</button>
        </div>
      </section>

      <!-- 分类 -->
      <section class="card fade-in" style="padding:16px 22px">
        <div class="seg">
          ${CATS.map(c => {
      const n = c.k === 'all' ? PODCAST_CORPUS.length : PODCAST_CORPUS.filter(p => p.cat === c.k).length;
      return `<button data-cat="${c.k}" class="${c.k === cat ? 'on' : ''}">${c.emoji} ${c.name} <span style="opacity:.5">${n}</span></button>`;
    }).join('')}
        </div>
      </section>

      <!-- 列表 -->
      <div class="pod-grid fade-in" style="margin-bottom:20px">
        ${list.map(renderCard).join('')}
      </div>

      <!-- 统计 -->
      <section class="card fade-in" style="background:linear-gradient(120deg,#F0FAF4,#FFFAE8)">
        <div class="row" style="justify-content:space-between">
          <div style="font-size:13px;color:#7C7566;line-height:1.8">
            <b style="font-size:15px;color:#3D392F">收听记录</b><br>
            连续 <b style="color:#FF5C6E">${Store.streak(KEY)}</b> 天 ·
            累计 <b style="color:#F2A413">${Store.totalDays(KEY)}</b> 天 ·
            最长 <b style="color:#3FAE7B">${Store.bestStreak(KEY)}</b> 天 ·
            已听 <b>${d().listened.length}</b> / ${PODCAST_CORPUS.length} 期
          </div>
        </div>
      </section>

      ${renderBlogs()}
    `;
    bindList();
  }

  function renderCard(p) {
    const done = d().listened.includes(p.id);
    const hasNote = !!(d().notes[p.id] || '').trim();
    return `
      <div class="pod-card" data-open="${p.id}" style="cursor:pointer">
        <div class="pod-cover" style="background:${COVER[p.cat]}">
          ${p.emoji}
          ${done ? '<span style="position:absolute;right:11px;top:11px;background:#3FAE7B;color:#fff;font-size:11px;padding:3px 9px;border-radius:9px">已听 ✓</span>' : ''}
          ${hasNote ? '<span style="position:absolute;left:11px;top:11px;font-size:14px" title="有笔记">📝</span>' : ''}
        </div>
        <div class="pod-body">
          <div class="pod-title">${U.esc(p.title)}</div>
          <div class="pod-desc">${U.esc(p.desc)}</div>
          <div class="pod-foot">
            <span class="tag">${p.catCN}</span>
            <span class="pod-dur">${p.dur}</span>
          </div>
        </div>
      </div>`;
  }

  // ---------- 今日推荐播客（每天 3 个深度主题，读完才换下一期） ----------
  function renderBlogs() {
    _picks = dailyPicks();
    const done = doneIds();
    const allDone = _picks.length && _picks.every(pk => pk.pod && done.includes(pk.pod.id));
    if (allDone) {
      return `
      <section class="card fade-in" style="margin-top:18px;background:linear-gradient(125deg,#EAFBF1,#FFF7E0);border:none">
        <div class="card-head"><h2>🎙️ 今日推荐播客</h2><div class="spacer"></div><span class="tag green">今日已听完</span></div>
        <div style="padding:10px 4px;font-size:14px;color:#5b6b5b;line-height:1.8">
          🍉 今天的 3 期深度播客都听完啦，明天会换新的 3 个主题～<br>
          <span style="color:#9aa89a">数据来源：Apple Podcasts 每日热门榜</span>
        </div>
      </section>`;
    }
    const cards = _picks.map((pk, i) => {
      const cur = pk.pod;
      if (!cur) return '';
      const isDone = done.includes(cur.id);
      const apple = cur.url || 'https://www.apple.com/apple-podcasts/';
      const xyyz = 'https://www.xiaoyuzhoufm.com/search?q=' + encodeURIComponent(cur.name);
      const themeLabel = pk.theme ? pk.theme.emoji + ' ' + pk.theme.label : '🍉 今日精选';
      return `
        <div class="blog-item" style="border:2px solid ${isDone ? '#3FAE7B' : '#FFD9A8'};margin-bottom:14px">
          <div class="blog-head">
            <span class="blog-tier">${themeLabel}</span>
            <span class="blog-title">${U.esc(cur.name)}</span>
            ${isDone ? '<span class="tag green" style="margin-left:8px">已听完 ✓</span>' : ''}
          </div>
          <div class="blog-meta">${U.esc(cur.artist)} · ${U.esc(cur.genre)}</div>
          ${cur.episode ? `<div class="blog-sum"><b>🎧 最新单集：</b>${U.esc(cur.episode)}</div>` : ''}
          <div class="blog-sum">${U.esc(cur.summary || ('「' + cur.name + '」由 ' + cur.artist + ' 出品，分类：' + cur.genre + '。'))}</div>
          <div class="blog-ops">
            <button class="btn sm" data-blog="cn" data-pick="${i}">🗣️ 普通话朗读</button>
            <button class="btn sm stop-btn" data-stop>■ 停</button>
            <a class="btn sm ghost" href="${apple}" target="_blank" rel="noopener">🍎 Apple 收听</a>
            <a class="btn sm ghost" href="${xyyz}" target="_blank" rel="noopener">🟢 小宇宙</a>
            <button class="btn sm ${isDone ? '' : 'green'}" data-blog-done="${i}">${isDone ? '已听完' : '我听完了，换下一期'}</button>
          </div>
        </div>`;
    }).join('');
    return `
      <section class="card fade-in" style="margin-top:18px;background:linear-gradient(125deg,#FFF3E0,#FDEBF2);border:none">
        <div class="card-head">
          <h2>🎙️ 今日推荐播客</h2>
          <span class="tag red">每天 3 个深度主题</span>
          <div class="spacer"></div>
          <label class="chain"><input type="checkbox" id="blogChain" ${chainOn() ? 'checked' : ''}> 连读（依次播完 3 期）</label>
        </div>
        <div class="blog-list">${cards}</div>
        <div class="cal-tip">🟢 三个主题每天轮换（逻辑思维 / 财经 / 科普 / 思辨）。没听完不会换；点「我听完了」后第二天才会推新的 3 期。数据来自 Apple Podcasts 每日热门榜，每天 06:00 自动刷新。</div>
      </section>`;
  }

  // 连读：依次播完当天未听的 3 期（普通话）
  function playCurrentChain() {
    const remaining = _picks.filter(pk => pk.pod && !doneIds().includes(pk.pod.id));
    if (!remaining.length) { U.toast('今天都听完啦，明天有新推荐 🍉', 'ok'); return; }
    let k = 0;
    U.toast('连读中 · 普通话 🗣️', 'ok');
    const step = () => {
      if (k >= remaining.length) { render(); U.toast('今天的推荐都听完啦 🍉', 'ok'); return; }
      const cur = remaining[k].pod; k++;
      Speech.speak(cur.summaryText, {
        lang: 'zh-CN', rate: 0.92, formal: false,
        onEnd: () => {
          markBlogDone(cur.id);
          if (chainOn()) step();
          else { render(); }
        }
      });
    };
    step();
  }

  // ---------- 阅读器 ----------
  let curCass = null;
  function killCass() { if (curCass) { curCass.destroy(); curCass = null; } }

  function renderReader() {
    const p = PODCAST_CORPUS.find(x => x.id === reading);
    if (!p) { reading = null; return render(); }
    const note = d().notes[p.id] || '';

    const segs = [];
    const blocks = [];
    const strip = (s) => String(s).replace(/<[^>]+>/g, '');
    p.body.forEach(b => {
      if (b.h) { segs.push({ text: b.h, lang: 'zh-CN' }); blocks.push({ t: 'h', v: b.h }); }
      else if (b.p) { segs.push({ text: strip(b.p), lang: 'zh-CN' }); blocks.push({ t: 'p', v: b.p }); }
      else if (b.list) b.list.forEach(x => { segs.push({ text: strip(x), lang: 'zh-CN' }); blocks.push({ t: 'li', v: x }); });
    });

    document.getElementById('view').innerHTML = `
      <section class="card fade-in">
        <div class="card-head">
          <button class="btn sm" id="back">← 返回列表</button>
          <div class="spacer"></div>
          <span class="tag">${p.catCN}</span>
          <span class="tag grey">${p.dur}</span>
        </div>

        <h2 style="font-size:22px;line-height:1.45;margin:8px 0 6px">${p.emoji} ${U.esc(p.title)}</h2>
        <div style="font-size:13px;color:#7C7566;margin-bottom:14px">${U.esc(p.desc)}</div>

        <div class="cass-hint">🎞️ 录音带跟听：播放后想停就停，进度条可随时拖动到任意位置，走神了往回拉就能重听。声音已调得更自然～</div>
        <div id="cassWrap" style="margin-bottom:14px"></div>
        <div class="row" style="margin-bottom:22px">
          <div class="spacer"></div>
          <button class="btn ${d().listened.includes(p.id) ? '' : 'green'}" id="markDone">
            ${d().listened.includes(p.id) ? '✓ 已标记听过' : '我看完了'}
          </button>
        </div>

        <div class="pod-reader" id="reader">
          ${blocks.map(renderBlock).join('')}
        </div>
      </section>

      <section class="card fade-in">
        <div class="card-head"><h2>✍️ 我的笔记</h2>
          <span class="tag">写下来才是自己的</span>
          <div class="spacer"></div>
          <button class="btn sm primary" id="saveNote">保存</button>
        </div>
        <textarea class="input" id="noteBox" rows="5"
          placeholder="这一期哪句话打动你了？你打算做什么改变？">${U.esc(note)}</textarea>
      </section>
    `;
    bindReader(p, segs, blocks);
  }

  function renderBlock(b, i) {
    const a = `data-seg="${i}"`;
    if (b.t === 'h') return `<h3 ${a}>${b.v}</h3>`;
    if (b.t === 'p') return `<p ${a}>${b.v}</p>`;
    if (b.t === 'li') return `<p class="li-seg" ${a}>🍉 ${b.v}</p>`;
    return '';
  }

  // ---------- 绑定 ----------
  function bindList() {
    document.querySelectorAll('[data-cat]').forEach(b => {
      b.onclick = () => { cat = b.dataset.cat; render(); };
    });
    document.querySelectorAll('[data-open]').forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); killCass(); reading = b.dataset.open; Speech.stop(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    });

    const chain = document.getElementById('blogChain');
    if (chain) chain.onchange = () => { Store.data.settings.blogChain = chain.checked; Store.save(); };

    document.querySelectorAll('[data-blog]').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        Speech.stop();
        const i = Number(b.dataset.pick);
        const cur = _picks[i] && _picks[i].pod;
        if (!cur) return;
        if (chainOn()) playCurrentChain();
        else {
          Speech.speak(cur.summaryText, { lang: 'zh-CN', rate: 0.92, formal: false });
          U.toast('正在用普通话朗读 🗣️', 'ok');
        }
      };
    });

    document.querySelectorAll('[data-blog-done]').forEach(b => {
      b.onclick = () => {
        const i = Number(b.dataset.blogDone);
        const cur = _picks[i] && _picks[i].pod;
        if (cur) markBlogDone(cur.id);
        render();
        U.toast('已记录 ✓ 明天会推新的一期 🍉', 'ok');
      };
    });
  }

  function bindReader(p, segs, blocks) {
    document.getElementById('back').onclick = () => { killCass(); reading = null; Speech.stop(); render(); };

    killCass();
    curCass = Speech.makeCassette({
      title: p.title, segments: segs, lang: 'zh-CN',
      onLine: (i) => {
        document.querySelectorAll('#reader [data-seg]').forEach(e => e.classList.remove('on'));
        const el = document.querySelector(`#reader [data-seg="${i}"]`);
        if (el) { el.classList.add('on'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      },
      onState: (s) => {
        if (s === 'playing' && !d().listened.includes(p.id)) {
          Store.checkIn(KEY); Store.save(); App.refreshStreak();
        }
      }
    });
    document.getElementById('cassWrap').appendChild(curCass.el);

    document.getElementById('markDone').onclick = () => {
      if (d().listened.includes(p.id)) { U.toast('这期已经标记过啦', 'warn'); return; }
      d().listened.push(p.id);
      Store.checkIn(KEY); Store.save(); App.refreshStreak();
      renderReader();
      U.toast('已记录 ✓ 知识进账一笔 🍉', 'ok');
    };

    document.getElementById('saveNote').onclick = () => {
      d().notes[p.id] = document.getElementById('noteBox').value;
      Store.checkIn(KEY); Store.save(); App.refreshStreak();
      U.toast('笔记已保存到你的电脑 ✓', 'ok');
    };
  }

  return {
    key: KEY,
    title: '每日播客',
    sub: () => '每天一期 · 金融理财人际交往提升自我，边听边学',
    icon: '📻',
    render,
    onEnter: () => { reading = null; killCass(); ensurePodcasts(); },
    onLeave: () => { killCass(); Speech.stop(); }
  };
})();
