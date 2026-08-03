/* ==========================================================
   中药知识 —— 天人合一
   顶部选项（从左到右）：药材知识库 → 日常运用 → 穴位库 → 词条解释
   药材库：黄帝内经溯源 + 本草常识，基础 100 条，每日自动 +10 条
   ========================================================== */

const TcmModule = (() => {
  const KEY = 'tcm';
  let tab = 'herb';

  function d() { return Store.data.tcm; }

  /** 每日 +10：根据上次解锁日期，补上缺失天数的新增条目 */
  function ensureDailyHerbs() {
    const dt = d();
    const pool = TCM_HERBS.length;
    if (typeof dt.herbUnlocked !== 'number' || dt.herbUnlocked < 100) dt.herbUnlocked = 100;
    if (!dt.herbDay) dt.herbDay = Store.today();
    const t = Store.today();
    if (t === dt.herbDay) return;
    const parse = (s) => { const p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
    const diff = Math.max(0, Math.floor((parse(t) - parse(dt.herbDay)) / 86400000));
    if (diff > 0) {
      const target = Math.min(pool, dt.herbUnlocked + diff * 10);
      if (target > dt.herbUnlocked) dt._newHerbs = target - dt.herbUnlocked;
      dt.herbUnlocked = target;
      dt.herbDay = t;
      Store.save();
    }
  }

  function render() {
    ensureDailyHerbs();
    document.getElementById('view').innerHTML = `
      <section class="card fade-in" style="padding:16px 22px">
        <div class="card-head" style="margin-bottom:12px">
          <h2 style="font-size:16px">☯️ 天人合一</h2>
          <span class="tag">黄帝内经 · 中医养生</span>
          <div class="spacer"></div>
          <span class="sub">点卡片可收藏 / 标记</span>
        </div>
        <div class="seg">
          <button data-tab="herb" class="${tab === 'herb' ? 'on' : ''}">🪴 药材知识库</button>
          <button data-tab="daily" class="${tab === 'daily' ? 'on' : ''}">🍵 日常运用</button>
          <button data-tab="point" class="${tab === 'point' ? 'on' : ''}">📍 穴位库</button>
          <button data-tab="terms" class="${tab === 'terms' ? 'on' : ''}">📖 词条解释</button>
        </div>
      </section>
      ${tab === 'herb' ? renderHerb() : tab === 'daily' ? renderDaily() : tab === 'point' ? renderPoint() : renderTerms()}
      <section class="card fade-in" style="background:linear-gradient(120deg,#FFF6DC,#FFF0F1)">
        <div style="font-size:13px;color:#7C7566;line-height:1.85">
          <b style="font-size:15px;color:#3D392F">🍉 打卡记录</b><br>
          连续 <b style="color:#FF5C6E">${Store.streak(KEY)}</b> 天 ·
          累计 <b style="color:#F2A413">${Store.totalDays(KEY)}</b> 天 ·
          最长 <b style="color:#3FAE7B">${Store.bestStreak(KEY)}</b> 天 ·
          已收藏 <b>${d().read.length}</b> 条
        </div>
      </section>
    `;
    bind();
  }

  // ---------- 药材知识库 ----------
  function renderHerb() {
    const pool = TCM_HERBS.length;
    const unlocked = Math.min(d().herbUnlocked, pool);
    const list = TCM_HERBS.slice(0, unlocked);
    const allDone = unlocked >= pool;
    const banner = d()._newHerbs > 0
      ? `<div class="kbox" style="margin-bottom:16px;background:linear-gradient(120deg,#EAF7EF,#E6F0FF)">
           <div class="kbox-t">🆕 今日新解锁 ${d()._newHerbs} 条中药知识</div>
           <div class="kbox-c">已滚动更新到「药材知识库」，从黄帝内经里又攒了一波养生干货，慢慢看～</div>
         </div>`
      : '';
    return `
      ${banner}
      <section class="card fade-in">
        <div class="card-head"><h2>🪴 药材知识库</h2>
          <span class="tag green">黄帝内经溯源</span>
          <div class="spacer"></div>
          <span class="sub">已解锁 ${unlocked} / 共 ${pool} 条${allDone ? ' · 已全部集齐 🎉' : ' · 每日自动 +10'}</span></div>
        <div class="herb-grid">
          ${list.map(h => `
            <div class="herb-card ${d().read.includes(h.id) ? 'fav' : ''}" data-id="${h.id}">
              <div class="herb-img">${h.emoji}</div>
              <div class="herb-name">${U.esc(h.name)}</div>
              <div class="herb-py">${U.esc(h.py || '')}</div>
              <div class="herb-nature">${U.esc(h.nature)}</div>
              <div class="herb-func">${U.esc(h.func)}</div>
              <div class="herb-use"><b>怎么用：</b>${U.esc(h.use)}</div>
              <button class="btn sm ${d().read.includes(h.id) ? '' : 'primary'}" data-fav="${h.id}" style="margin-top:10px">
                ${d().read.includes(h.id) ? '★ 已收藏' : '☆ 收藏'}
              </button>
            </div>`).join('')}
        </div>
      </section>`;
  }

  // ---------- 日常运用 ----------
  function renderDaily() {
    return `
      <section class="card fade-in">
        <div class="card-head"><h2>🍵 日常运用 · 中药搭配</h2>
          <span class="tag red">照着泡就能用</span></div>
        <div style="font-size:12.5px;color:#7C7566;margin-bottom:16px;line-height:1.75">
          下面都是平和、适合学生党的日常搭配，量都不大，重在坚持。体质特殊或正在服药，先问医生。
        </div>
        <div class="daily-grid">
          ${TCM_DAILY.map(x => `
            <div class="daily-card">
              <div class="daily-top">
                <span class="daily-emoji">${x.emoji}</span>
                <div>
                  <div class="daily-name">${U.esc(x.name)}</div>
                  <span class="tag" style="background:#FFF0F1;color:#E0455A">${U.esc(x.cat)}</span>
                </div>
              </div>
              <div class="daily-mix"><b>搭配：</b>${U.esc(x.mix)}</div>
              <div class="daily-how"><b>做法：</b>${U.esc(x.how)}</div>
              <div class="daily-effect"><b>功效：</b>${U.esc(x.effect)}</div>
            </div>`).join('')}
        </div>
      </section>`;
  }

  // ---------- 穴位库 ----------
  function renderPoint() {
    return `
      <section class="card fade-in">
        <div class="card-head"><h2>📍 穴位库</h2>
          <span class="tag green">按哪里 · 有什么用</span>
          <div class="spacer"></div>
          <span class="sub">找准位置，按揉到有酸胀感</span></div>
        <div class="point-grid">
          ${TCM_POINTS.map(p => `
            <div class="point-card">
              <div class="point-head"><span class="point-emoji">${p.emoji}</span>
                <div><div class="point-name">${U.esc(p.name)}</div>
                <div class="point-where">📍 ${U.esc(p.where)}</div></div>
              </div>
              <div class="point-effect"><b>功效：</b>${U.esc(p.effect)}</div>
              <div class="point-how"><b>按法：</b>${U.esc(p.how)}</div>
            </div>`).join('')}
        </div>
        <div class="kbox" style="margin-top:6px">
          <div class="kbox-t">🍉 取穴小提醒</div>
          <div class="kbox-c">「横指」= 自己的手指宽度；孕妇忌按合谷、三阴交；力度以<b>酸胀不刺痛</b>为准，别死命掐。症状严重请就医，穴位只是日常辅助。</div>
        </div>
      </section>`;
  }

  // ---------- 词条解释（独立顶部选项，位于穴位库右侧） ----------
  function renderTerms() {
    return `
      <section class="card fade-in">
        <div class="card-head"><h2>📖 词条解释</h2>
          <span class="tag">这些「说法」到底是什么意思</span>
          <div class="spacer"></div>
          <span class="sub">共 ${TCM_TERMS.length} 条身体养生词条</span></div>
        <div class="term-grid">
          ${TCM_TERMS.map(t => `
            <div class="term-card">
              <div class="term-head"><span class="term-emoji">${t.emoji}</span>${U.esc(t.word)}</div>
              <div class="term-mean">${U.esc(t.mean)}</div>
              <div class="term-sub">常见表现</div>
              <ul class="term-list">${t.show.map(x => `<li>${U.esc(x)}</li>`).join('')}</ul>
              <div class="term-sub">调理方式</div>
              <ul class="term-list green">${t.fix.map(x => `<li>${U.esc(x)}</li>`).join('')}</ul>
            </div>`).join('')}
        </div>
      </section>`;
  }

  // ---------- 交互 ----------
  function bind() {
    document.querySelectorAll('[data-tab]').forEach(b => {
      b.onclick = () => { tab = b.dataset.tab; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    });
    document.querySelectorAll('[data-fav]').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        const id = b.dataset.fav;
        const i = d().read.indexOf(id);
        if (i >= 0) d().read.splice(i, 1);
        else { d().read.push(id); U.toast('已收藏 ★', 'ok'); }
        Store.checkIn(KEY); Store.save(); App.refreshStreak(); render();
      };
    });
  }

  return {
    key: KEY, title: '天人合一', icon: '☯️',
    sub: () => '药材库 · 日常搭配 · 穴位库 · 词条，养生不求人',
    render
  };
})();
