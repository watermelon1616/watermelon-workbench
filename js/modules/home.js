/* ==========================================================
   首页（Home）—— 今日概览 + 日历复盘
   · 今日概览：除「首页」外所有板块的打卡卡片（黑→黄）+ 各板块学习分钟 + 饼图
   · 日历复盘：从 2026-08-02 起的日历，完成事项橙色方框打勾；底部复盘总结 + 逐条编辑 + 最近复盘
   ========================================================== */

const HomeModule = (() => {
  const KEY = 'home';
  const CAL_START = '2026-08-02';

  // 板块元信息（与 Store.checkins 的 key 对应）
  const META = [
    { key: 'todo', title: '待办事项', icon: '✅', color: '#FF5C6E' },
    { key: 'piggy', title: '御用金库', icon: '🐷', color: '#F2A413' },
    { key: 'speaking', title: '口语练习', icon: '🎙️', color: '#3FAE7B' },
    { key: 'listening', title: '听力练习', icon: '🎧', color: '#7B6BE0' },
    { key: 'podcast', title: '每日播客', icon: '📻', color: '#FF8A5C' },
    { key: 'news', title: '新闻热点', icon: '📰', color: '#4A90D9' },
    { key: 'tcm', title: '中药知识', icon: '🌿', color: '#2BB673' },
    { key: 'fitness', title: '运动养生', icon: '💪', color: '#E0567A' }
  ];

  let calMonth = new Date(2026, 7, 1); // 默认 2026-08

  function d() { return Store.data; }
  function T() { return Store.today(); }

  // ---------- 通用：环形图 ----------
  function donut(segs, size = 150, stroke = 20) {
    const total = segs.reduce((s, x) => s + (x.value || 0), 0);
    if (total <= 0) return `<div class="donut-empty">今天还没记录学习分钟<br>点卡片上的 ＋分钟 记一笔</div>`;
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, cx = size / 2, cy = size / 2;
    let off = 0;
    const arcs = segs.filter(s => s.value > 0).map(s => {
      const len = (s.value / total) * c;
      const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})"></circle>`;
      off += len;
      return el;
    }).join('');
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${arcs}
      <circle cx="${cx}" cy="${cy}" r="${r - stroke / 2}" fill="#fff"></circle>
      <text x="${cx}" y="${cy - 1}" text-anchor="middle" font-size="26" font-weight="800" fill="#3D392F">${total}</text>
      <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#ADA492">分钟 / 今日</text>
    </svg>`;
  }

  // 某天各板块的「完成情况」标签
  function dayItems(dateStr) {
    const items = [];
    META.forEach(m => {
      if ((Store.data.checkins[m.key] || []).includes(dateStr)) items.push(m.title);
    });
    (Store.data.todo.todos || []).forEach(t => {
      if (t.done && (t.doneAt || '').slice(0, 10) === dateStr) items.push('待办完成');
    });
    return items;
  }

  // ---------- 今日概览 ----------
  function renderOverview() {
    const t = T();
    const todayMin = Store.getMinutes(t) || {};
    const cards = META.map(m => {
      const checked = (Store.data.checkins[m.key] || []).includes(t);
      const min = todayMin[m.key] || 0;
      return `
        <div class="ov-card" style="--c:${m.color}">
          <div class="ov-top">
            <span class="ov-ico">${m.icon}</span>
            <span class="ov-title">${m.title}</span>
            <button class="ov-check ${checked ? 'on' : ''}" data-check="${m.key}" title="今日打卡">
              ${checked ? '✓' : ''}
            </button>
          </div>
          <div class="ov-meta">
            <span class="ov-min">🕒 ${min} 分钟</span>
            <span class="ov-streak">连续 ${Store.streak(m.key)} 天</span>
          </div>
          <div class="ov-add">
            <span>记学习时长</span>
            <button data-min="${m.key}" data-n="5">+5</button>
            <button data-min="${m.key}" data-n="15">+15</button>
            <button data-min="${m.key}" data-n="30">+30</button>
          </div>
        </div>`;
    }).join('');

    const donutSegs = META.map(m => ({ label: m.title, value: todayMin[m.key] || 0, color: m.color }));

    const checkedCount = META.filter(m => (Store.data.checkins[m.key] || []).includes(t)).length;

    return `
      <section class="card fade-in">
        <div class="card-head">
          <h2>🌞 今日概览</h2>
          <span class="tag">${U.todayCN()}</span>
          <div class="spacer"></div>
          <span class="sub">今天已打卡 ${checkedCount} / ${META.length} 个板块</span>
        </div>
        <div class="ov-wrap">
          <div class="ov-grid">${cards}</div>
          <div class="ov-donut">
            <div style="font-size:13px;color:#7C7566;margin-bottom:8px;text-align:center">今日各板块学习分钟占比</div>
            ${donut(donutSegs)}
            <div class="ov-legend">
              ${META.map(m => `<span><i style="background:${m.color}"></i>${m.title}</span>`).join('')}
            </div>
          </div>
        </div>
      </section>`;
  }

  // ---------- 日历复盘 ----------
  function renderCalendar() {
    const y = calMonth.getFullYear(), mo = calMonth.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const days = new Date(y, mo + 1, 0).getDate();
    const cls = ['日', '一', '二', '三', '四', '五', '六'];

    let cells = '';
    for (let i = 0; i < first; i++) cells += `<div class="cal-cell empty"></div>`;
    for (let day = 1; day <= days; day++) {
      const ds = `${y}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const before = ds < CAL_START;
      const items = before ? [] : dayItems(ds);
      const has = items.length > 0;
      cells += `
        <div class="cal-cell ${before ? 'disabled' : ''} ${has ? 'has' : ''}" ${before ? '' : `data-date="${ds}"`}>
          <span class="cal-d">${day}</span>
          ${has ? `<span class="cal-tag">${items.slice(0, 2).join('·')}${items.length > 2 ? '…' : ''}</span>` : ''}
          ${has ? '<span class="cal-check">✓</span>' : ''}
        </div>`;
    }

    const prevM = new Date(y, mo - 1, 1), nextM = new Date(y, mo + 1, 1);
    return `
      <section class="card fade-in" style="margin-top:18px">
        <div class="card-head">
          <h2>📅 日历复盘</h2>
          <span class="tag">从 ${CAL_START.slice(5).replace('-', '月')}日 起</span>
          <div class="spacer"></div>
          <div class="cal-nav">
            <button id="calPrev">‹</button>
            <span id="calLabel">${y} 年 ${mo + 1} 月</span>
            <button id="calNext">›</button>
          </div>
        </div>
        <div class="cal-week">${cls.map(c => `<span>${c}</span>`).join('')}</div>
        <div class="cal-grid" id="calGrid">${cells}</div>
        <div class="cal-tip">🟠 橙色方框 = 当天有完成的事项（如口语练习打卡、待办完成）。点方框看明细。</div>
      </section>`;
  }

  // 复盘分析（近 14 天）
  function renderReview() {
    const t = T();
    const span = 14;
    const counts = {};
    META.forEach(m => counts[m.key] = 0);
    let activeDays = 0;
    const daySet = new Set();
    for (let i = 0; i < span; i++) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const ds = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
      META.forEach(m => {
        if ((Store.data.checkins[m.key] || []).includes(ds)) { counts[m.key]++; daySet.add(ds); }
      });
    }
    activeDays = daySet.size;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const sorted = META.map(m => ({ ...m, n: counts[m.key] })).sort((a, b) => b.n - a.n);
    const top = sorted.filter(x => x.n > 0)[0];
    const segs = sorted.map(m => ({ label: m.title, value: m.n, color: m.color }));
    const reviewDates = Object.keys(Store.data.reviews || {}).sort().reverse();

    const analysis = total === 0
      ? '近 14 天还没有打卡记录，从今天的第一张卡片开始吧 🍉'
      : `近 14 天你共打卡 <b>${total}</b> 次，覆盖 <b>${activeDays}</b> 天。投入最久的是 <b style="color:${top.color}">${top.title}</b>（${top.n} 次）。`;

    return `
      <section class="card fade-in" style="margin-top:18px;background:linear-gradient(120deg,#FFF8E6,#F0FAF4)">
        <div class="card-head"><h2>📊 复盘分析总结</h2><span class="tag">近 14 天</span></div>
        <div class="rv-wrap">
          <div class="rv-donut">${donut(segs, 150, 20)}<div style="text-align:center;font-size:12px;color:#7C7566;margin-top:4px">近 14 天各板块投入占比（打卡次数）</div></div>
          <div class="rv-text">
            <div class="rv-block"><div class="rv-h">近期做了什么</div><div>${analysis}</div></div>
            <div class="rv-block"><div class="rv-h">投入方向</div><div class="rv-bars">
              ${sorted.map(m => `<div class="rv-bar"><span class="rv-bar-name">${m.icon} ${m.title}</span><span class="rv-bar-track"><i style="width:${total ? Math.round(m.n / total * 100) : 0}%;background:${m.color}"></i></span><span class="rv-bar-n">${m.n}</span></div>`).join('')}
            </div></div>
          </div>
        </div>
      </section>

      <section class="card fade-in" style="margin-top:18px">
        <div class="card-head"><h2>✍️ 今日复盘</h2><span class="tag">${T().slice(5).replace('-', '月')}日</span></div>
        <textarea class="input" id="reviewBox" rows="4" placeholder="今天学了什么？有什么感悟或卡点？写下来，明天回看会很有用。">${U.esc(Store.getReview(T()))}</textarea>
        <div class="row" style="margin-top:10px;justify-content:flex-end">
          <button class="btn primary" id="saveReview">保存今日复盘</button>
        </div>
      </section>

      <section class="card fade-in" style="margin-top:18px">
        <div class="card-head"><h2>🗂️ 最近复盘</h2><span class="tag">${reviewDates.length} 篇</span></div>
        ${reviewDates.length ? `<div class="rv-list">${reviewDates.map(ds => `
          <div class="rv-item" data-review="${ds}">
            <span class="rv-date">${ds.slice(5).replace('-', '月')}日</span>
            <span class="rv-snip">${U.esc((Store.getReview(ds) || '').slice(0, 28))}${(Store.getReview(ds) || '').length > 28 ? '…' : ''}</span>
            <span class="rv-go">查看 ›</span>
          </div>`).join('')}</div>` : `<div class="empty"><span class="big">📝</span>还没有复盘记录，写完上面那篇就有了</div>`}
      </section>`;
  }

  function render() {
    document.getElementById('view').innerHTML =
      renderOverview() + renderCalendar() + renderReview();
    bind();
  }

  function bind() {
    // 打卡切换
    document.querySelectorAll('[data-check]').forEach(b => {
      b.onclick = () => {
        const k = b.dataset.check;
        const on = Store.toggleCheckIn(k);
        App.refreshStreak();
        U.toast(on ? `「${META.find(m => m.key === k).title}」打卡 ✓` : '已取消今日打卡', on ? 'ok' : 'warn');
        render();
      };
    });
    // 记分钟
    document.querySelectorAll('[data-min]').forEach(b => {
      b.onclick = () => {
        Store.addMinutes(b.dataset.min, Number(b.dataset.n));
        U.toast(`已记录 ${b.dataset.n} 分钟 ✓`, 'ok');
        render();
      };
    });
    // 日历翻月
    const prev = document.getElementById('calPrev'), next = document.getElementById('calNext');
    if (prev) prev.onclick = () => { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1); render(); };
    if (next) next.onclick = () => { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1); render(); };
    // 日历格子明细
    document.querySelectorAll('.cal-cell[data-date]').forEach(cell => {
      cell.onclick = () => showDay(cell.dataset.date);
    });
    // 保存复盘
    const sv = document.getElementById('saveReview');
    if (sv) sv.onclick = () => {
      Store.setReview(T(), document.getElementById('reviewBox').value);
      U.toast('今日复盘已保存到电脑 ✓', 'ok');
      render();
    };
    // 查看历史复盘
    document.querySelectorAll('[data-review]').forEach(it => {
      it.onclick = () => {
        const ds = it.dataset.review;
        U.prompt({
          title: `复盘 · ${ds.slice(5).replace('-', '月')}日`,
          sub: '可修改后保存',
          value: Store.getReview(ds),
          placeholder: '写下你那天的复盘…',
          okText: '保存',
          onOk: (v) => { Store.setReview(ds, v); U.toast('已更新 ✓', 'ok'); render(); }
        });
      };
    });
  }

  function showDay(ds) {
    const items = dayItems(ds);
    U.confirm({
      title: `${ds.slice(5).replace('-', '月')}日 的完成情况`,
      sub: items.length ? items.map(i => '· ' + i).join('\n') : '这一天还没有记录任何完成事项。',
      okText: '知道了'
    });
  }

  return {
    key: KEY,
    title: '首页',
    sub: () => '今日概览 · 日历复盘，一眼看清今天和这段日子',
    icon: '🏠',
    render
  };
})();
