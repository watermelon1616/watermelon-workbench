/* ==========================================================
   播客 —— 金融 / 理财 / 人际交往 / 提升自我
   卡片浏览 + 全文阅读 + 朗读收听 + 笔记
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

  // 今日推荐博客：头部热门 + 中腰部优质（粤语 / 普通话可听）
  const BLOGS = [
    {
      tier: '头部热门', title: '普通人怎么用现金流思维管钱', author: '远山财经', tag: '理财',
      summary: '不追热点、不焦虑涨跌，先把每月的钱分成「活钱 / 保命 / 增值」三份。',
      text: '大家好，今天聊一个特别朴素但管用的思路：现金流思维。很多人一理财就想着怎么赚钱，其实第一步是想清楚钱每个月是怎么流进流出的。我把自己的钱分成三份：第一份是活钱，覆盖三到六个月的开销，放在随时能取的地方；第二份是保命钱，用来买保险和应急；第三份才是增值钱，拿去定投和复利。顺序不能乱，先活下来，再谈增长。'
    },
    {
      tier: '头部热门', title: '外贸新人第一次报价别踩的坑', author: '老周做外贸', tag: '外贸',
      summary: '报价不是报低价就能拿下，关键是把条款、交期和隐性成本一次说清。',
      text: '做外贸第一单最怕的就是报价报得漂亮，结果后面全是坑。我建议新人报价时一定把三件事写清楚：第一，价格条款是 FOB 还是 CIF，运费谁承担；第二，交期写具体日期，别写大约；第三，把模具费、打样费这些隐性成本提前说，不要等客人问。信任不是靠低价建立的，是靠你把不确定变成确定。'
    },
    {
      tier: '中腰部优质', title: '每天十五分钟，听力是怎么练出来的', author: '小语听力', tag: '学习',
      summary: '碎片化时间反复磨耳朵，比一次听两小时更有效。',
      text: '很多人问我听力怎么提升，我的答案很无聊：每天十五分钟，但要坚持。通勤的时候听一段，洗澡的时候听一段，关键是反复听同一段直到每个词都清楚。不要贪多，一段听懂了比十段听个大概有用得多。语言是肌肉记忆，不是知识，靠的是重复而不是理解。'
    },
    {
      tier: '中腰部优质', title: '人际交往里最被低估的能力：接话', author: '阿岚沟通课', tag: '人际',
      summary: '会说话不是抢着说，而是让对方觉得被听见。',
      text: '我们总以为会沟通就是能说，其实更重要的是会接。别人说完一句话，你先接住他的情绪，再接住他的内容，最后才表达自己的看法。比如同事说今天好累，你回一句确实最近项目紧，这就是接住了。让人舒服的从来不是金句，而是被认真听见的瞬间。'
    },
    {
      tier: '中腰部优质', title: '黄帝内经里的「早睡」到底值不值', author: '本草小记', tag: '养生',
      summary: '子时前入睡，是性价比最高的养生，没有之一。',
      text: '黄帝内经讲天人合一，放到今天看就是顺节律生活。夜里十一点到凌晨三点是肝胆修复的黄金时间，这时候还在刷手机，身体就少了一次自我修复。早睡不是玄学，是最便宜的养生。哪怕只是比昨天早半小时睡，长期下来气色和精力都会不一样。'
    }
  ];

  let cat = 'all';
  let reading = null;

  function d() { return Store.data.podcast; }

  function render() {
    if (reading) return renderReader();

    const list = cat === 'all' ? PODCAST_CORPUS : PODCAST_CORPUS.filter(p => p.cat === cat);
    const todayPick = PODCAST_CORPUS[U.dayIndex(PODCAST_CORPUS.length)];

    document.getElementById('view').innerHTML = `
      <!-- 今日推荐 -->
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

  // ---------- 今日推荐博客 ----------
  function renderBlogs() {
    return `
      <section class="card fade-in" style="margin-top:18px;background:linear-gradient(125deg,#FFF3E0,#FDEBF2);border:none">
        <div class="card-head">
          <h2>🎙️ 今日推荐博客</h2>
          <span class="tag red">头部热门 + 中腰部优质</span>
          <div class="spacer"></div>
          <span class="sub">点语言按钮听粤语 / 普通话</span>
        </div>
        <div class="blog-list">
          ${BLOGS.map(b => `
            <div class="blog-item">
              <div class="blog-head">
                <span class="blog-tier ${b.tier === '头部热门' ? 'hot' : ''}">${b.tier}</span>
                <span class="blog-title">${U.esc(b.title)}</span>
              </div>
              <div class="blog-meta">${U.esc(b.author)} · ${U.esc(b.tag)}</div>
              <div class="blog-sum">${U.esc(b.summary)}</div>
              <div class="blog-ops">
                <button class="btn sm" data-blog-audio="${U.esc(b.text)}" data-lang="zh-HK">🗣️ 粤语</button>
                <button class="btn sm" data-blog-audio="${U.esc(b.text)}" data-lang="zh-CN">🗣️ 普通话</button>
              </div>
            </div>`).join('')}
        </div>
      </section>`;
  }

  // ---------- 阅读器 ----------
  let curCass = null;
  function killCass() { if (curCass) { curCass.destroy(); curCass = null; } }

  function renderReader() {
    const p = PODCAST_CORPUS.find(x => x.id === reading);
    if (!p) { reading = null; return render(); }
    const note = d().notes[p.id] || '';

    // 把正文拆成可朗读的分段，每段一个序号，方便高亮
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
    document.querySelectorAll('[data-blog-audio]').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        Speech.stop();
        Speech.speak(b.dataset.blogAudio, { lang: b.dataset.lang, rate: 0.9, formal: false });
        U.toast(b.dataset.lang === 'zh-HK' ? '正在用粤语朗读 🗣️' : '正在用普通话朗读 🗣️', 'ok');
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
    onEnter: () => { reading = null; killCass(); },
    onLeave: () => { killCass(); Speech.stop(); }
  };
})();
