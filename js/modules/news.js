/* ==========================================================
   新闻热点 —— 财经新闻（小白向知识剖析） + 政治新闻（考公向）
   ========================================================== */

const NewsModule = (() => {
  const KEY = 'news';
  let tab = 'finance';

  function d() { return Store.data.news; }

  // 每天推送 3 条，同一天固定
  function todayFinance() { return U.dayPick(NEWS_FINANCE, 3, 0); }
  function todayPolitics() { return U.dayPick(NEWS_POLITICS, 3, 5); }

  function render() {
    document.getElementById('view').innerHTML = `
      <section class="card fade-in" style="padding:16px 22px">
        <div class="card-head" style="margin-bottom:12px">
          <h2 style="font-size:16px">📰 今日热点</h2>
          <span class="tag">${U.todayCN()}</span>
          <div class="spacer"></div>
          <span class="sub">每天自动更新 · 已读 ${d().read.length} 条</span>
        </div>
        <div class="seg">
          <button data-tab="finance" class="${tab === 'finance' ? 'on' : ''}">💹 财经新闻</button>
          <button data-tab="politics" class="${tab === 'politics' ? 'on' : ''}">🏛️ 政治新闻（考公）</button>
          <button data-tab="phrases" class="${tab === 'phrases' ? 'on' : ''}">✒️ 好词好句库</button>
        </div>
      </section>
      ${tab === 'finance' ? renderFinance() : tab === 'politics' ? renderPolitics() : renderPhrases()}
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
    const list = todayFinance();
    return `
      <section class="card fade-in">
        <div class="card-head">
          <h2>💹 财经新闻 · 每条都带知识点剖析</h2>
          <span class="tag green">零基础也能看懂</span>
        </div>
        <div style="font-size:12.5px;color:#7C7566;margin-bottom:16px;line-height:1.75">
          你现在是小白，所以每条新闻下面我都拆了一个「<b>知识点</b>」——不是解释新闻本身，而是解释<b>新闻背后那个反复出现的原理</b>。原理只有几十个，新闻却有无数条。把原理吃透，以后看什么都通。
        </div>
        ${list.map(n => `
          <div class="news-item">
            <div class="ni-top">
              <span class="tag">${n.tag}</span>
              ${d().read.includes(n.id) ? '<span class="tag green">已读 ✓</span>' : ''}
              <div class="spacer"></div>
              <button class="btn sm" data-read="${n.id}">${d().read.includes(n.id) ? '已标记' : '标记已读'}</button>
            </div>
            <div class="ni-title">${U.esc(n.title)}</div>
            <div class="ni-sum">${U.esc(n.summary)}</div>
            <div class="kbox">
              <div class="kbox-t">💡 知识点剖析 · ${U.esc(n.know.t)}</div>
              <div class="kbox-c">${n.know.c}</div>
            </div>
            <div class="row" style="margin-top:11px">
              <span style="font-size:11.5px;color:#ADA492">关键词：</span>
              ${n.terms.map(t => `<span class="tag grey">${U.esc(t)}</span>`).join('')}
            </div>
          </div>`).join('')}
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
    const list = todayPolitics();
    return `
      <section class="card fade-in">
        <div class="card-head">
          <h2>🏛️ 政治时事 · 考公向</h2>
          <span class="tag red">申论 + 面试通用</span>
        </div>
        <div style="font-size:12.5px;color:#7C7566;margin-bottom:16px;line-height:1.75">
          每条时事都配了<b>答题框架</b>和<b>可直接背的句子</b>。申论和面试的本质是「用规范的话把道理讲清楚」，<b>框架比辞藻重要</b>。
        </div>
        ${list.map(n => `
          <div class="news-item pol">
            <div class="ni-top">
              <span class="tag red">${n.tag}</span>
              ${d().read.includes(n.id) ? '<span class="tag green">已读 ✓</span>' : ''}
              <div class="spacer"></div>
              <button class="btn sm" data-read="${n.id}">${d().read.includes(n.id) ? '已标记' : '标记已读'}</button>
            </div>
            <div class="ni-title">${U.esc(n.title)}</div>
            <div class="ni-sum">${U.esc(n.summary)}</div>
            <div class="kbox">
              <div class="kbox-t">🎯 ${U.esc(n.know.t)}</div>
              <div class="kbox-c">${n.know.c}</div>
            </div>
            <div class="row" style="margin-top:12px;margin-bottom:10px">
              <span style="font-size:11.5px;color:#ADA492">高频词：</span>
              ${n.words.map(w => `<span class="tag">${U.esc(w)}</span>`).join('')}
            </div>
            <div class="phrase-grid">
              ${n.sentences.map(s => `
                <div class="phrase">
                  <button class="ph-copy" data-copy="${U.esc(s.s)}">复制</button>
                  <div class="ph-main">${U.esc(s.s)}</div>
                  <div class="ph-note">💡 ${U.esc(s.n)}</div>
                  <button class="btn sm" data-fav="${U.esc(s.s)}" style="margin-top:9px;padding:4px 10px;font-size:11.5px">
                    ${d().favPhrases.includes(s.s) ? '★ 已收藏' : '☆ 收藏'}
                  </button>
                </div>`).join('')}
            </div>
          </div>`).join('')}
      </section>`;
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

  // ---------- 交互 ----------
  function bind() {
    document.querySelectorAll('[data-tab]').forEach(b => {
      b.onclick = () => { tab = b.dataset.tab; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    });

    document.querySelectorAll('[data-read]').forEach(b => {
      b.onclick = () => {
        const id = b.dataset.read;
        if (!d().read.includes(id)) d().read.push(id);
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
  }

  return {
    key: KEY,
    title: '新闻热点',
    sub: () => '财经看趋势 · 政治备考公，每天三条不贪多',
    icon: '📰',
    render
  };
})();
