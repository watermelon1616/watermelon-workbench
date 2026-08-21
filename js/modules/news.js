/* ==========================================================
   新闻热点 —— 财经新闻（小白向知识剖析） + 政治新闻（考公向）
   · 每条都能朗读（连读开关）
   · 未读的当天不更新；标记已读后第二天才换新的
   · 日历点哪天，看那天标记已读的新闻，方便温习
   ========================================================== */

const NewsModule = (() => {
  const KEY = 'news';
  let tab = 'finance';
  let newsMonth = new Date();

  function d() { return Store.data.news; }
  function readByDate() { if (!d().readByDate) d().readByDate = {}; return d().readByDate; }
  function chainOn() { return !!Store.data.settings.newsChain; }

  function srcOf(t) { return t === 'finance' ? NEWS_FINANCE : NEWS_POLITICS; }
  function keyOf(t) { return t === 'finance' ? 'curFinance' : 'curPolitics'; }
  function offsetOf(t) { return t === 'finance' ? 0 : 5; }

  function nextId(src, curId) {
    const i = src.findIndex(x => x.id === curId);
    if (i < 0) return src[0].id;
    return src[(i + 1) % src.length].id;
  }

  // 保证当天该 tab 的三条内容是固定的；已读的槽位在「新的一天」才换成新的
  function ensureCurrent(t) {
    const src = srcOf(t), key = keyOf(t);
    if (!d()[key] || d()[key].length !== 3) {
      d()[key] = U.dayPick(src, 3, offsetOf(t)).map(x => x.id);
    }
    if (d().lastRotate !== Store.today()) {
      for (let i = 0; i < d()[key].length; i++) {
        if (d().read.includes(d()[key][i])) d()[key][i] = nextId(src, d()[key][i]);
      }
      d().lastRotate = Store.today();
      Store.save();
    }
  }

  function curItems(t) {
    ensureCurrent(t);
    const src = srcOf(t);
    return d()[keyOf(t)].map(id => src.find(x => x.id === id)).filter(Boolean);
  }

  function itemText(n) {
    return `${n.title}。${n.summary}。知识点：${n.know.t}。${n.know.c}`;
  }

  function render() {
    document.getElementById('view').innerHTML = `
      <section class="card fade-in" style="padding:16px 22px">
        <div class="card-head" style="margin-bottom:12px">
          <h2 style="font-size:16px">📰 今日热点</h2>
          <span class="tag">${U.todayCN()}</span>
          <div class="spacer"></div>
          <label class="chain"><input type="checkbox" id="newsChain" ${chainOn() ? 'checked' : ''}> 连读（点一条连播当天三条）</label>
        </div>
        <div class="seg">
          <button data-tab="finance" class="${tab === 'finance' ? 'on' : ''}">💹 财经新闻</button>
          <button data-tab="politics" class="${tab === 'politics' ? 'on' : ''}">🏛️ 政治新闻（考公）</button>
          <button data-tab="phrases" class="${tab === 'phrases' ? 'on' : ''}">✒️ 好词好句库</button>
        </div>
      </section>
      ${tab === 'finance' ? renderFinance() : tab === 'politics' ? renderPolitics() : renderPhrases()}
      ${renderCalendar()}
      <section class="card fade-in" style="background:linear-gradient(120deg,#FFF6DC,#FFF0F1)">
        <div style="font-size:13px;color:#7C7566;line-height:1.85">
          <b style="font-size:15px;color:#3D392F">🍉 阅读记录</b><br>
          连续 <b style="color:#FF5C6E">${Store.streak(KEY)}</b> 天 ·
          累计 <b style="color:#F2A413">${Store.totalDays(KEY)}</b> 天 ·
          最长 <b style="color:#3FAE7B">${Store.bestStreak(KEY)}</b> 天 ·
          收藏金句 <b>${d().favPhrases.length}</b> 条
        </div>
      </section>
    `;
    bind();
  }

  // ---------- 财经 ----------
  function renderFinance() {
    const list = curItems('finance');
    return `
      <section class="card fade-in">
        <div class="card-head">
          <h2>💹 财经新闻 · 每条都带知识点剖析</h2>
          <span class="tag green">零基础也能看懂</span>
        </div>
        <div style="font-size:12.5px;color:#7C7566;margin-bottom:16px;line-height:1.75">
          你现在是小白，所以每条新闻下面我都拆了一个「<b>知识点</b>」——不是解释新闻本身，而是解释<b>新闻背后那个反复出现的原理</b>。原理只有几十个，新闻却有无数条。把原理吃透，以后看什么都通。
        </div>
        ${list.map((n, idx) => renderNewsItem(n, idx)).join('')}
        <div class="kbox green" style="margin-top:6px">
          <div class="kbox-t">🍉 给小白的学习路线（按顺序来，别跳）</div>
          <div class="kbox-c">
            <b>第一步（1 个月）</b>：只搞懂四个词 —— <b>利率、通胀、GDP、汇率</b>。它们是所有财经新闻的地基。<br>
            <b>第二步（1 个月）</b>：学会看三张表。你有专业优势，重点练<b>「净利润 vs 经营性现金流」</b>的对照阅读。<br>
            <b>第三步（1 个月）</b>：理解四个估值指标 —— <b>PE、PB、ROE、股息率</b>，找三家熟悉的公司连续跟踪。<br>
            <b>第四步</b>：小额实践。用几百块钱定投一只宽基指数基金，<b>目的是体验波动，不是赚钱</b>。<br>
            <b>永远不要做的事</b>：借钱投资、押注单只股票、追听来的「内幕消息」。
          </div>
        </div>
      </section>`;
  }

  // ---------- 政治 ----------
  function renderPolitics() {
    const list = curItems('politics');
    return `
      <section class="card fade-in">
        <div class="card-head">
          <h2>🏛️ 政治时事 · 考公向</h2>
          <span class="tag red">申论 + 面试通用</span>
        </div>
        <div style="font-size:12.5px;color:#7C7566;margin-bottom:16px;line-height:1.75">
          每条时事都配了<b>答题框架</b>和<b>可直接背的句子</b>。申论和面试的本质是「用规范的话把道理讲清楚」，<b>框架比辞藻重要</b>。
        </div>
        ${list.map((n, idx) => renderNewsItem(n, idx, true)).join('')}
      </section>`;
  }

  function renderNewsItem(n, idx, isPol) {
    const read = d().read.includes(n.id);
    return `
      <div class="news-item ${isPol ? 'pol' : ''}">
        <div class="ni-top">
          <span class="tag ${isPol ? 'red' : ''}">${n.tag}</span>
          ${read ? '<span class="tag green">已读 ✓</span>' : ''}
          <div class="spacer"></div>
          <button class="btn sm" data-listen="${idx}" title="朗读这条新闻">🔊 朗读</button>
          <button class="btn sm stop-btn" data-stop>■ 停</button>
          <button class="btn sm" data-read="${n.id}">${read ? '已标记' : '标记已读'}</button>
        </div>
        <div class="ni-title">${U.esc(n.title)}</div>
        <div class="ni-sum">${U.esc(n.summary)}</div>
        <div class="kbox">
          <div class="kbox-t">💡 知识点剖析 · ${U.esc(n.know.t)}</div>
          <div class="kbox-c">${n.know.c}</div>
        </div>
        <div class="row" style="margin-top:11px">
          <span style="font-size:11.5px;color:#ADA492">关键词：</span>
          ${(n.terms || n.words || []).map(t => `<span class="tag grey">${U.esc(t)}</span>`).join('')}
        </div>
      </div>`;
  }

  // ---------- 好词好句 ----------
  function renderPhrases() {
    const fav = d().favPhrases;
    return `
      ${fav.length ? `
      <section class="card fade-in">
        <div class="card-head"><h2>★ 我收藏的金句</h2>
          <div class="spacer"></div><span class="sub">${fav.length} 条</span></div>
        <div class="phrase-grid">
          ${fav.map(s => `
            <div class="phrase" style="border-color:#FFD9A8;background:#FFFAE8">
              <button class="ph-copy" data-copy="${U.esc(s)}">复制</button>
              <div class="ph-main">${U.esc(s)}</div>
              <button class="btn sm" data-unfav="${U.esc(s)}" style="margin-top:9px;padding:4px 10px;font-size:11.5px">取消收藏</button>
            </div>`).join('')}
        </div>
      </section>` : ''}

      ${Object.keys(GONGKAO_PHRASES).map(k => `
        <section class="card fade-in">
          <div class="card-head">
            <h2>✒️ ${k}部分</h2>
            <span class="tag ${k === '开头' ? '' : k === '结尾' ? 'red' : 'green'}">${GONGKAO_PHRASES[k].length} 条</span>
            <div class="spacer"></div>
            <span class="sub">鼠标移上去可以复制</span>
          </div>
          <div class="phrase-grid">
            ${GONGKAO_PHRASES[k].map(p => `
              <div class="phrase">
                <button class="ph-copy" data-copy="${U.esc(p.s)}">复制</button>
                <div class="ph-main">${U.esc(p.s)}</div>
                <div class="ph-note">💡 ${U.esc(p.n)}</div>
                <button class="btn sm" data-fav="${U.esc(p.s)}" style="margin-top:9px;padding:4px 10px;font-size:11.5px">
                  ${fav.includes(p.s) ? '★ 已收藏' : '☆ 收藏'}
                </button>
              </div>`).join('')}
          </div>
        </section>`).join('')}

      <section class="card fade-in">
        <div class="card-head"><h2>📌 用好词好句的三条纪律</h2></div>
        <div class="kbox">
          <div class="kbox-c">
            <b>一、别堆砌。</b>一篇申论用两三句就够了，通篇排比反而暴露没内容。判卷老师最反感<b>「辞藻华丽、言之无物」</b>。<br><br>
            <b>二、位置要对。</b>金句放在<b>开头点题</b>和<b>结尾升华</b>处最有效，中间的分析部分要用<b>朴实、准确、有逻辑</b>的语言。<br><br>
            <b>三、必须理解。</b>用之前问自己：这句话到底在说什么道理？<b>用错场合比不用更减分。</b>比如「船到中流浪更急」是形容攻坚期，用来描述形势大好就闹笑话了。
          </div>
        </div>
      </section>`;
  }

  // ---------- 日历温习 ----------
  function renderCalendar() {
    const y = newsMonth.getFullYear(), mo = newsMonth.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const days = new Date(y, mo + 1, 0).getDate();
    const cls = ['日', '一', '二', '三', '四', '五', '六'];
    const rbd = readByDate();

    let cells = '';
    for (let i = 0; i < first; i++) cells += `<div class="cal-cell empty"></div>`;
    for (let day = 1; day <= days; day++) {
      const ds = `${y}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const ids = rbd[ds] || [];
      const n = ids.length;
      cells += `
        <div class="cal-cell ${n ? 'has' : ''}" ${n ? `data-date="${ds}"` : ''}>
          <span class="cal-d">${day}</span>
          ${n ? `<span class="cal-num">${n}</span>` : ''}
        </div>`;
    }
    return `
      <section class="card fade-in" style="margin-top:18px">
        <div class="card-head">
          <h2>📅 新闻日历</h2>
          <span class="tag">点带绿字的天，温习那天已读的新闻</span>
          <div class="spacer"></div>
          <div class="cal-nav">
            <button id="newsPrev">‹</button>
            <span>${y} 年 ${mo + 1} 月</span>
            <button id="newsNext">›</button>
          </div>
        </div>
        <div class="cal-week">${cls.map(c => `<span>${c}</span>`).join('')}</div>
        <div class="cal-grid">${cells}</div>
        <div class="cal-tip">🟢 绿字 = 那天你标记已读的新闻条数。点格子回看内容温习。</div>
      </section>`;
  }

  function showDayNews(ds) {
    const ids = readByDate()[ds] || [];
    const all = NEWS_FINANCE.concat(NEWS_POLITICS);
    const items = ids.map(id => all.find(x => x.id === id)).filter(Boolean);
    const root = document.getElementById('modalRoot');
    const body = items.length ? items.map(n => `
      <div class="news-item" style="margin-bottom:12px">
        <div class="ni-title">${U.esc(n.title)}</div>
        <div class="ni-sum">${U.esc(n.summary)}</div>
        <div class="row" style="margin-top:8px">
          <button class="btn sm" data-say="${U.esc(itemText(n))}">🔊 朗读</button>
        </div>
      </div>`).join('') : '这一天没有已读记录。';
    root.innerHTML = `<div class="modal-mask"><div class="modal" style="max-width:600px">
      <h3>📰 ${ds.slice(5).replace('-', '月')}日 已读新闻</h3>
      <div class="m-sub">共 ${items.length} 条 · 点空白处关闭</div>
      <div style="max-height:62vh;overflow:auto;margin-top:12px">${body}</div>
    </div></div>`;
    root.querySelector('.modal-mask').onclick = (e) => { if (e.target.classList.contains('modal-mask')) root.innerHTML = ''; };
    root.querySelectorAll('[data-say]').forEach(b => { b.onclick = (e) => { e.stopPropagation(); Speech.speak(b.dataset.say, { lang: 'zh-CN' }); }; });
  }

  // ---------- 交互 ----------
  function bind() {
    document.querySelectorAll('[data-tab]').forEach(b => {
      b.onclick = () => { tab = b.dataset.tab; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    });

    const chain = document.getElementById('newsChain');
    if (chain) chain.onchange = () => { Store.data.settings.newsChain = chain.checked; Store.save(); };

    document.querySelectorAll('[data-listen]').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        Speech.stop();
        const list = curItems(tab);
        const start = Number(b.dataset.listen);
        if (chainOn()) {
          const queue = [];
          for (let k = 0; k < list.length; k++) queue.push({ text: itemText(list[(start + k) % list.length]), lang: 'zh-CN' });
          Speech.speakQueue(queue, { rate: 0.95, formal: true });
          U.toast('连读中 · 当天三条依次播放 📰', 'ok');
        } else {
          Speech.speak(itemText(list[start]), { lang: 'zh-CN', rate: 0.95, formal: true });
        }
      };
    });

    document.querySelectorAll('[data-read]').forEach(b => {
      b.onclick = () => {
        const id = b.dataset.read;
        if (!d().read.includes(id)) {
          d().read.push(id);
          const ds = Store.today();
          const rbd = readByDate();
          (rbd[ds] = rbd[ds] || []).push(id);
        }
        Store.checkIn(KEY); Store.save(); App.refreshStreak(); render();
        U.toast('已读 ✓ 知识又进账一点 🍉', 'ok');
      };
    });

    document.querySelectorAll('[data-copy]').forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); U.copy(b.dataset.copy); };
    });

    document.querySelectorAll('[data-fav]').forEach(b => {
      b.onclick = () => {
        const s = b.dataset.fav;
        const i = d().favPhrases.indexOf(s);
        if (i >= 0) d().favPhrases.splice(i, 1);
        else { d().favPhrases.push(s); U.toast('已收藏 ★', 'ok'); }
        Store.checkIn(KEY); Store.save(); App.refreshStreak(); render();
      };
    });

    document.querySelectorAll('[data-unfav]').forEach(b => {
      b.onclick = () => {
        const i = d().favPhrases.indexOf(b.dataset.unfav);
        if (i >= 0) d().favPhrases.splice(i, 1);
        Store.save(); render();
      };
    });

    const prev = document.getElementById('newsPrev'), next = document.getElementById('newsNext');
    if (prev) prev.onclick = () => { newsMonth = new Date(newsMonth.getFullYear(), newsMonth.getMonth() - 1, 1); render(); };
    if (next) next.onclick = () => { newsMonth = new Date(newsMonth.getFullYear(), newsMonth.getMonth() + 1, 1); render(); };
    document.querySelectorAll('.cal-cell[data-date]').forEach(cell => {
      cell.onclick = () => showDayNews(cell.dataset.date);
    });
  }

  return {
    key: KEY,
    title: '新闻热点',
    sub: () => '财经看趋势 · 政治备考公，每天三条不贪多',
    icon: '📰',
    render
  };
})();
