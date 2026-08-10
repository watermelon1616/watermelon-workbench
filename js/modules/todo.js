/* ==========================================================
   待办事项 —— 上：今日计划日历 + 每日习惯   下：待办清单
   待办布局：左打勾 · 中时间 · 右事项
   新增：顶部「今日计划」日历，点日期跳到那天的事项与习惯打卡
   ========================================================== */

const TodoModule = (() => {
  const KEY = 'todo';
  let viewDate = T();

  function d() { return Store.data.todo; }
  function T() { return Store.today(); }

  // 习惯在指定日期是否完成
  function habitDone(h, date) { return (h.history || []).includes(date || T()); }

  function habitStreak(h) {
    const list = (h.history || []).slice().sort();
    if (!list.length) return 0;
    const diff = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
    if (diff(list[list.length - 1], T()) > 1) return 0;
    let n = 1;
    for (let i = list.length - 1; i > 0; i--) {
      if (diff(list[i - 1], list[i]) === 1) n++; else break;
    }
    return n;
  }

  function afterChange() {
    const anyHabit = d().habits.some(h => habitDone(h));
    const anyTodo = d().todos.some(t => t.done && (t.doneAt || '').slice(0, 10) === T());
    if (anyHabit || anyTodo) Store.checkIn(KEY);
    Store.save();
    App.refreshStreak();
    render();
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const [y, m, day] = iso.split('-');
    return `${Number(m)}月${Number(day)}日`;
  }
  function isOverdue(iso) {
    if (!iso) return false;
    return iso < T();
  }

  // ---------- 今日计划日历 ----------
  function renderPlanCal() {
    let base = new Date(viewDate + 'T00:00:00');
    const y = base.getFullYear(), mo = base.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const days = new Date(y, mo + 1, 0).getDate();
    const cls = ['日', '一', '二', '三', '四', '五', '六'];

    let cells = '';
    for (let i = 0; i < first; i++) cells += `<div class="cal-cell empty"></div>`;
    for (let day = 1; day <= days; day++) {
      const ds = `${y}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const cnt = d().todos.filter(t => t.date === ds).length;
      const hdone = d().habits.filter(h => habitDone(h, ds)).length;
      const mark = (cnt > 0 || hdone > 0) ? 'has' : '';
      cells += `<div class="cal-cell ${ds === viewDate ? 'sel' : ''} ${mark}" data-pdate="${ds}">
        <span class="cal-d">${day}</span>
        ${mark ? `<span class="cal-dot"></span>` : ''}
      </div>`;
    }
    const prevM = new Date(y, mo - 1, 1), nextM = new Date(y, mo + 1, 1);
    return `
      <section class="card fade-in" style="background:linear-gradient(120deg,#FFF6DC,#FFEAF0)">
        <div class="card-head">
          <h2>🗓️ 今日计划</h2>
          <span class="tag">点日期看那天的事</span>
          <div class="spacer"></div>
          <div class="cal-nav">
            <button id="pPrev">‹</button>
            <span id="pLabel">${y} 年 ${mo + 1} 月</span>
            <button id="pNext">›</button>
          </div>
        </div>
        <div class="cal-week">${cls.map(c => `<span>${c}</span>`).join('')}</div>
        <div class="cal-grid sm">${cells}</div>
      </section>`;
  }

  // ---------- 渲染 ----------
  function render() {
    const habits = d().habits;
    const todos = d().todos;

    const habitDoneCount = habits.filter(h => habitDone(h, viewDate)).length;
    const todoDoneCount = todos.filter(t => t.done).length;

    const habitSorted = habits.slice().sort((a, b) => (habitDone(a, viewDate) ? 1 : 0) - (habitDone(b, viewDate) ? 1 : 0));
    const viewTodos = todos.filter(t => !t.date || t.date === viewDate);
    const todoSorted = viewTodos.slice().sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const ta = a.time || '99:99', tb = b.time || '99:99';
      if (ta !== tb) return ta < tb ? -1 : 1;
      if (a.done) return new Date(b.doneAt || 0) - new Date(a.doneAt || 0);
      return 0;
    });

    const viewLabel = viewDate === T() ? '今天' : viewDate;

    const view = document.getElementById('view');
    view.innerHTML = `
      ${renderPlanCal()}

      <!-- ============ 每日习惯 ============ -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>☀️ 每日习惯</h2>
          <span class="tag">${viewLabel} · 可拖拽排序</span>
          <div class="spacer"></div>
          <span class="sub">${viewLabel} 完成 ${habitDoneCount} / ${habits.length}</span>
          <button class="btn sm primary" id="addHabit">+ 添加习惯</button>
        </div>
        <div class="check-list" id="habitList">
          ${habits.length ? habitSorted.map(renderHabit).join('') : emptyBox('还没有习惯，点右上角加一个吧', '🌱')}
        </div>
        <div class="progress-wrap">
          <div class="progress-bar"><div class="progress-fill" style="width:${habits.length ? habitDoneCount / habits.length * 100 : 0}%"></div></div>
          <div class="progress-txt">${habitProgressText(habitDoneCount, habits.length)}</div>
        </div>
      </section>

      <!-- ============ 待办事项 ============ -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>📝 待办清单</h2>
          <span class="tag green">左打勾 · 中时间 · 右事项</span>
          <div class="spacer"></div>
          <span class="sub">${viewLabel} · 已完成 ${todoDoneCount} / ${todos.length}</span>
        </div>

        <div class="row" style="margin-bottom:15px">
          <input class="input" id="todoInput" placeholder="今天还要做点什么？写下来，回车添加" style="flex:1;min-width:140px">
          <input type="time" id="todoTime" class="input" style="flex:0 0 104px;width:104px" title="可选：设定时间">
          <input type="date" id="todoDate" class="input" style="flex:0 0 150px" title="可选：日期（默认今天）" value="${viewDate}">
          <button class="btn primary" id="addTodo">添加</button>
        </div>

        <div class="check-list" id="todoList">
          ${viewTodos.length ? renderTodoList(todoSorted) : emptyBox('这一天还没有待办，加一件吧', '🍃')}
        </div>
      </section>

      <!-- ============ 小结 ============ -->
      <section class="card fade-in" style="background:linear-gradient(120deg,#FFFAE8,#FFF1F2)">
        <div class="card-head"><h2>🍉 今日小结</h2></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px">
          ${statBox('今天完成', habitDoneCount + todoDoneCountToday(), '件事', '#FF5C6E')}
          ${statBox('连续坚持', Store.streak(KEY), '天', '#F2A413')}
          ${statBox('累计打卡', Store.totalDays(KEY), '天', '#3FAE7B')}
          ${statBox('最长纪录', Store.bestStreak(KEY), '天', '#7B6BE0')}
        </div>
        <div style="margin-top:16px;font-size:13px;color:#7C7566;line-height:1.8">
          ${encourage(habitDoneCount, habits.length)}
        </div>
      </section>
    `;
    bind();
  }

  function todoDoneCountToday() {
    return d().todos.filter(t => t.done && (t.doneAt || '').slice(0, 10) === T()).length;
  }

  function statBox(label, num, unit, color) {
    return `<div style="background:#fff;border-radius:16px;padding:15px 17px;box-shadow:0 3px 12px rgba(180,150,90,.08)">
      <div style="font-size:12px;color:#ADA492">${label}</div>
      <div style="font-size:27px;font-weight:800;color:${color};margin-top:4px;font-variant-numeric:tabular-nums">${num}<span style="font-size:13px;font-weight:600;margin-left:3px">${unit}</span></div>
    </div>`;
  }

  function renderHabit(h) {
    const done = habitDone(h, viewDate);
    const st = habitStreak(h);
    return `
      <div class="check-item ${done ? 'done' : ''}" data-type="habit" data-id="${h.id}" draggable="true">
        <button class="cbox" data-act="toggle">
          <svg viewBox="0 0 24 24"><polyline points="4,12 10,18 20,6"></polyline></svg>
        </button>
        <div class="ci-body">
          <div class="ci-text">${U.esc(h.text)}</div>
          <div class="ci-meta">
            <span>累计 ${(h.history || []).length} 天</span>
            ${done ? '<span style="color:#3FAE7B">已完成 ✓</span>' : (viewDate === T() ? '<span>今天还没做</span>' : '<span>这天未记录</span>')}
          </div>
        </div>
        ${st > 0 ? `<span class="ci-fire">🔥 ${st} 天</span>` : ''}
        <div class="ci-tools">
          <button class="ci-mini" data-act="edit" title="编辑">✎</button>
          ${done ? '' : `<button class="ci-del" data-act="del" title="删除这个习惯">✕</button>`}
        </div>
      </div>`;
  }

  function renderTodoList(list) {
    let html = '';
    let dividerPut = false;
    const hasDone = list.some(t => t.done);
    const hasUndone = list.some(t => !t.done);
    for (const t of list) {
      if (t.done && !dividerPut && hasDone && hasUndone) {
        html += `<div class="done-divider">已完成 · 留个纪念，不会删掉 🍉</div>`;
        dividerPut = true;
      }
      html += renderTodo(t);
    }
    return html;
  }

  function renderTodo(t) {
    const dateTag = t.date
      ? `<span class="${isOverdue(t.date) && !t.done ? 'overdue' : ''}">📅 ${fmtDate(t.date)}${isOverdue(t.date) && !t.done ? ' 逾期' : ''}</span>`
      : '';
    return `
      <div class="check-item todo-item ${t.done ? 'done' : ''}" data-type="todo" data-id="${t.id}" draggable="true">
        <button class="cbox" data-act="toggle">
          <svg viewBox="0 0 24 24"><polyline points="4,12 10,18 20,6"></polyline></svg>
        </button>
        <button class="todo-time" data-act="time" title="设置 / 修改时间">${t.time ? U.esc(t.time) : '—'}</button>
        <div class="ci-body">
          <div class="ci-text">${U.esc(t.text)}</div>
          <div class="ci-meta">
            <span>${U.dateCN(t.createdAt)} 添加</span>
            ${t.done ? `<span style="color:#3FAE7B">${U.dateCN(t.doneAt)} 完成 ✓</span>` : ''}
            ${dateTag}
          </div>
        </div>
        <div class="ci-tools">
          <button class="ci-mini" data-act="date" title="设置 / 修改日期">📅</button>
          <button class="ci-mini" data-act="edit" title="编辑">✎</button>
          ${t.done
        ? `<button class="btn sm" data-act="undo" style="padding:4px 10px;font-size:11.5px">↩ 撤销</button>`
        : `<button class="ci-del" data-act="del" title="删除">✕</button>`}
        </div>
      </div>`;
  }

  function emptyBox(txt, ico) {
    return `<div class="empty"><span class="big">${ico}</span>${txt}</div>`;
  }

  function habitProgressText(done, total) {
    if (!total) return '先添加几个想坚持的小习惯吧';
    if (done === total) return '🎉 今天的习惯全部完成！这一天没白过。';
    return `还差 ${total - done} 个就全部完成啦，冲一下？`;
  }

  function encourage(done, total) {
    const s = Store.streak(KEY);
    if (s >= 30) return '已经坚持一个月以上了。习惯到这一步，基本就是你身体的一部分了 🍉';
    if (s >= 7) return `连续 ${s} 天。研究说 21 天成习惯，你已经走完 ${Math.round(s / 21 * 100)}%。`;
    if (s >= 3) return `连续 ${s} 天了，别断在第 4 天 —— 大多数人都是这里放弃的。`;
    if (done > 0) return '今天动起来了，这就比昨天强。明天记得回来打卡。';
    return '哪怕只完成一件小事，今天也算数。从最简单的那个开始。';
  }

  // ---------- 拖拽排序 ----------
  let dragId = null;
  function wireDrag(item, arr) {
    item.draggable = true;
    item.ondragstart = (e) => { dragId = item.dataset.id; item.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; };
    item.ondragend = () => { dragId = null; document.querySelectorAll('.check-item').forEach(x => x.classList.remove('dragging', 'drag-over')); };
    item.ondragover = (e) => { e.preventDefault(); item.classList.add('drag-over'); };
    item.ondragleave = () => item.classList.remove('drag-over');
    item.ondrop = (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      const tgtId = item.dataset.id;
      if (!dragId || dragId === tgtId) return;
      const from = arr.findIndex(x => x.id === dragId);
      const to = arr.findIndex(x => x.id === tgtId);
      if (from < 0 || to < 0) return;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      Store.save(); render();
    };
  }

  // ---------- 交互 ----------
  function bind() {
    document.getElementById('addHabit').onclick = () => {
      U.prompt({
        title: '添加一个每日习惯',
        sub: '越具体越容易坚持，比如「背 20 个会计英语单词」',
        placeholder: '例：每天读 10 分钟财经新闻',
        okText: '加上',
        onOk: (v) => {
          v = (v || '').trim();
          if (!v) return;
          d().habits.push({ id: U.uid(), text: v, createdAt: Store.nowISO(), history: [] });
          Store.save(); render();
          U.toast('习惯已添加，明天见 🌱', 'ok');
        }
      });
    };

    const inp = document.getElementById('todoInput');
    const timeInp = inp.parentElement.querySelector('#todoTime');
    const dateInp = document.getElementById('todoDate');
    const add = () => {
      const v = (inp.value || '').trim();
      if (!v) return;
      d().todos.push({
        id: U.uid(), text: v, done: false,
        createdAt: Store.nowISO(), doneAt: null,
        date: dateInp.value || viewDate,
        time: timeInp.value || null
      });
      inp.value = ''; timeInp.value = ''; dateInp.value = viewDate;
      Store.save(); render();
      document.getElementById('todoInput').focus();
    };
    document.getElementById('addTodo').onclick = add;
    inp.onkeydown = (e) => { if (e.key === 'Enter') add(); };

    // 今日计划日历
    const pp = document.getElementById('pPrev'), pn = document.getElementById('pNext');
    if (pp) pp.onclick = () => { const b = new Date(viewDate + 'T00:00:00'); viewDate = `${b.getFullYear()}-${String(b.getMonth()).padStart(2, '0')}-01`; render(); };
    if (pn) pn.onclick = () => { const b = new Date(viewDate + 'T00:00:00'); viewDate = `${b.getFullYear()}-${String(b.getMonth() + 2).padStart(2, '0')}-01`; render(); };
    document.querySelectorAll('.cal-cell[data-pdate]').forEach(c => {
      c.onclick = () => { viewDate = c.dataset.pdate; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    });

    document.getElementById('view').querySelectorAll('.check-item').forEach(item => {
      const type = item.dataset.type, id = item.dataset.id;
      const arr = type === 'habit' ? d().habits : d().todos;
      wireDrag(item, arr);
      item.querySelectorAll('[data-act]').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const act = btn.dataset.act;
          if (type === 'habit') handleHabit(id, act);
          else handleTodo(id, act);
        };
      });
    });
  }

  function editText(type, obj) {
    U.prompt({
      title: '编辑内容', sub: '改完点确定即可',
      value: obj.text, placeholder: '写点什么…',
      onOk: (v) => {
        v = (v || '').trim();
        if (!v) return;
        obj.text = v;
        Store.save(); render();
        U.toast('已更新 ✎', 'ok');
      }
    });
  }

  function editDate(obj) {
    U.prompt({
      title: '设置日期', sub: '格式：YYYY-MM-DD（如 2025-03-20），留空表示不限',
      value: obj.date || '', placeholder: '2025-03-20',
      onOk: (v) => {
        v = (v || '').trim();
        if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return U.toast('日期格式不对，用 2025-03-20 这种', 'warn');
        obj.date = v || null;
        Store.save(); render();
        U.toast(v ? '日期已设好 📅' : '已清除日期', 'ok');
      }
    });
  }

  function editTime(obj) {
    U.prompt({
      title: '设置时间', sub: '格式 HH:MM（如 09:30）',
      value: obj.time || '', placeholder: '09:30',
      onOk: (v) => {
        v = (v || '').trim();
        if (v && !/^\d{2}:\d{2}$/.test(v)) return U.toast('时间格式不对，用 09:30 这种', 'warn');
        obj.time = v || null;
        Store.save(); render();
        U.toast(v ? '时间已设好 ⏰' : '已清除时间', 'ok');
      }
    });
  }

  function handleHabit(id, act) {
    const h = d().habits.find(x => x.id === id);
    if (!h) return;
    if (act === 'toggle') {
      h.history = h.history || [];
      const i = h.history.indexOf(viewDate);
      if (i >= 0) h.history.splice(i, 1);
      else {
        h.history.push(viewDate);
        h.history.sort();
        const st = habitStreak(h);
        U.celebrate('你真棒！这个自律的小西瓜 🍉');
      }
      afterChange();
    } else if (act === 'edit') {
      editText('habit', h);
    } else if (act === 'del') {
      U.confirm({
        title: '删掉这个习惯？',
        sub: `「${U.esc(h.text)}」的打卡记录也会一起消失，确定吗？`,
        okText: '删掉', danger: true,
        onOk: () => {
          d().habits = d().habits.filter(x => x.id !== id);
          Store.save(); render();
        }
      });
    }
  }

  function handleTodo(id, act) {
    const t = d().todos.find(x => x.id === id);
    if (!t) return;
    if (act === 'toggle' || act === 'undo') {
      t.done = !t.done;
      // 打勾记录到「正在查看的那天」，这样补打昨天的✓不会算到今天
      t.doneAt = t.done ? (viewDate + 'T' + Store.nowISO().slice(11)) : null;
      if (t.done) U.celebrate('你真棒！这个自律的小西瓜 🍉');
      afterChange();
    } else if (act === 'edit') {
      editText('todo', t);
    } else if (act === 'date') {
      editDate(t);
    } else if (act === 'time') {
      editTime(t);
    } else if (act === 'del') {
      d().todos = d().todos.filter(x => x.id !== id);
      Store.save(); render();
    }
  }

  return {
    key: KEY,
    title: '待办事项',
    sub: () => `${U.todayCN()} · 先把今天要做的事理清楚`,
    icon: '✅',
    render
  };
})();
