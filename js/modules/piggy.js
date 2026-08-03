/* ==========================================================
   存钱罐 —— 上：总金额   下：购物玩乐 / 旅游 / 储蓄 / 基金（+自定义）
   总额和每个分类都能自己填数字
   新增：自定义用途(＋) · 本月预算 · 占比饼图 · 每月情况
   ========================================================== */

const PiggyModule = (() => {
  const KEY = 'piggy';
  function d() { return Store.data.piggy; }

  function sumJars() { return d().jars.reduce((s, j) => s + (Number(j.amount) || 0), 0); }
  function totalShown() {
    return d().manualTotal != null ? Number(d().manualTotal) : sumJars();
  }
  function unassigned() { return totalShown() - sumJars(); }

  // 新增用途可用的 emoji / 颜色
  const EMOJI_POOL = ['💡', '🎁', '🍰', '📚', '🏠', '🚗', '🎮', '☕', '🐱', '🍔', '👟', '💊', '🎨', '🐶'];
  const COLOR_POOL = ['#FF5C6E', '#F2A413', '#3FAE7B', '#7B6BE0', '#36B7C9', '#E07AB0', '#9CCC65', '#FF8A50'];

  function addLog(name, amt, color, note) {
    d().ledger.unshift({
      id: U.uid(), name, amt, color, note: note || '',
      at: Store.nowISO()
    });
    if (d().ledger.length > 300) d().ledger.length = 300;
  }

  function monthKey(iso) { return String(iso).slice(0, 7); }
  function monthSpent(mk) {
    return d().ledger.reduce((s, l) => s + (monthKey(l.at) === mk && (Number(l.amt) || 0) < 0 ? -Number(l.amt) : 0), 0);
  }
  function recentMonths(n) {
    const out = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mk = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      out.push({ mk, label: `${dt.getMonth() + 1}月`, spent: monthSpent(mk) });
    }
    return out;
  }

  function render() {
    const total = totalShown();
    const un = unassigned();
    const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const budget = d().budget != null ? Number(d().budget) : null;
    const spentMonth = monthSpent(thisMonth);
    const months = recentMonths(6);
    const barPct = budget != null ? Math.min(100, spentMonth / budget * 100) : 0;
    const barBg = spentMonth > budget ? 'var(--melon-red)' : 'linear-gradient(90deg,var(--yellow),var(--melon-green))';
    const barTxt = budget != null
      ? `已用 ${budget > 0 ? (spentMonth / budget * 100).toFixed(0) : 0}% · ${spentMonth > budget ? '⚠️ 已超支 ¥' + U.money(spentMonth - budget) : '还在预算内，稳'}`
      : '';

    const view = document.getElementById('view');

    view.innerHTML = `
      <!-- ============ 总金额 ============ -->
      <section class="piggy-total fade-in" style="margin-bottom:20px">
        <div class="pt-label">御用金库总额</div>
        <div class="pt-num"><small>¥</small>${U.money(total)}</div>
        <div class="pt-sub">
          ${d().manualTotal != null
        ? `手动设定 · 四个罐子共 ¥${U.money(sumJars())}${Math.abs(un) > 0.004 ? ` · ${un > 0 ? `还有 ¥${U.money(un)} 没分类` : `已超出 ¥${U.money(-un)}`}` : ' · 刚好分完 ✓'}`
        : '自动 = 下面四个罐子之和'}
        </div>
        <div class="pt-actions">
          <button class="btn sm" id="setTotal">✏️ 直接填总额</button>
          <button class="btn sm" id="autoTotal">🔄 改回自动合计</button>
          <button class="btn sm" id="quickIn">💰 记一笔存入</button>
        </div>
      </section>

      <!-- ============ 四个罐子（+ 加号新增） ============ -->
      <div class="card-head" style="margin:4px 2px 14px">
        <h2 style="font-size:17px">🏛️ 我的金库（点金额可直接改）</h2>
        <span class="tag">随时点 ＋ 加新用途</span>
        <div class="spacer"></div>
        <span class="sub">共 ¥${U.money(sumJars())}</span>
      </div>

      <div class="jar-grid fade-in" style="margin-bottom:22px">
        ${d().jars.map(renderJar).join('')}
        <div class="jar-add" id="addJar" title="添加一个新用途">
          <div class="ja-plus">＋</div>
          <div class="ja-txt">添加用途</div>
        </div>
      </div>

      <!-- ============ 占比饼图 ============ -->
      <section class="card fade-in">
        <div class="card-head"><h2>🥧 钱都去哪了（占比饼图）</h2><div class="spacer"></div>
          <span class="sub">看看钱分布得均不均匀</span></div>
        ${sumJars() > 0 ? renderDonut() : `<div class="empty"><span class="big">🐷</span>还一分钱都没存呢，先往罐子里放点吧</div>`}
      </section>

      <!-- ============ 本月预算 + 每月情况 ============ -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>📅 本月预算 & 每月情况</h2>
          <div class="spacer"></div>
          <button class="btn sm" id="setBudget">${budget != null ? '✏️ 改预算' : '➕ 设本月预算'}</button>
        </div>
        <div class="budget-top">
          <div class="budget-card ${budget != null && spentMonth > budget ? 'over' : ''}">
            <div class="bc-label">本月已花费</div>
            <div class="bc-num">¥${U.money(spentMonth)}</div>
          </div>
          <div class="budget-card">
            <div class="bc-label">本月预算</div>
            <div class="bc-num">${budget != null ? '¥' + U.money(budget) : '未设置'}</div>
          </div>
          <div class="budget-card">
            <div class="bc-label">本月剩余</div>
            <div class="bc-num">${budget != null ? '¥' + U.money(Math.max(0, budget - spentMonth)) : '—'}</div>
          </div>
        </div>
        ${budget != null ? `
        <div class="budget-bar"><i style="width:${barPct}%;background:${barBg}"></i></div>
        <div class="budget-bar-txt" style="margin-bottom:14px">${barTxt}</div>
        ` : '<div style="font-size:12.5px;color:#ADA492;margin-bottom:14px">设一个本月预算，月底就知道钱花得值不值。</div>'}

        <div class="month-table">
          <div class="mt-head"><span>月份</span><span>实际花费</span><span>预算</span><span>结余</span></div>
          ${months.map(m => {
            const b = budget != null ? budget : 0;
            const over = budget != null && m.spent > b;
            return `<div class="mt-row ${over ? 'over' : ''}">
              <span>${m.label}</span>
              <span>¥${U.money(m.spent)}</span>
              <span>${budget != null ? '¥' + U.money(b) : '—'}</span>
              <span style="color:${over ? 'var(--melon-red)' : 'var(--melon-green)'}">${budget != null ? (over ? '-¥' + U.money(m.spent - b) : '+¥' + U.money(b - m.spent)) : '—'}</span>
            </div>`;
          }).join('')}
        </div>
      </section>

      <!-- ============ 流水 ============ -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>📒 存取记录</h2>
          <div class="spacer"></div>
          ${d().ledger.length ? `<button class="btn sm" id="clearLog">清空记录</button>` : ''}
        </div>
        ${d().ledger.length ? `<div class="ledger">${d().ledger.slice(0, 60).map(renderLog).join('')}</div>`
        : `<div class="empty"><span class="big">📭</span>还没有记录，每一次存钱都会记在这里</div>`}
      </section>
    `;
    bind();
  }

  function renderJar(j) {
    const amt = Number(j.amount) || 0;
    const goal = Number(j.goal) || 0;
    const pct = goal > 0 ? Math.min(100, amt / goal * 100) : 0;
    return `
      <div class="jar" style="--jar-color:${j.color};--jar-bg:${j.bg}" data-key="${j.key}">
        <div class="jar-head">
          <div class="jar-emoji">${j.emoji}</div>
          <div style="flex:1;min-width:0">
            <div class="jar-name">${U.esc(j.name)}</div>
            <div class="jar-desc">${U.esc(j.desc || '')}</div>
          </div>
          <div class="jar-tools">
            <button class="jt" data-act="rename" title="改名/换图标">✎</button>
            <button class="jt" data-act="del" title="删除这个罐子">✕</button>
          </div>
        </div>
        <div class="jar-amount" data-act="edit" style="cursor:pointer" title="点一下直接改金额"><small>¥</small>${U.money(amt)}</div>
        <div class="jar-bar"><i style="width:${pct}%"></i></div>
        <div class="jar-pct">
          <span>目标 ¥${U.money(goal)}</span>
          <span data-act="goal" style="cursor:pointer;text-decoration:underline dotted">${pct.toFixed(0)}% · 改目标</span>
        </div>
        <div class="jar-ops">
          <button class="btn sm green" data-act="in">＋ 存入</button>
          <button class="btn sm" data-act="out">－ 取出</button>
        </div>
      </div>`;
  }

  function renderDonut() {
    const segs = d().jars.map(j => ({ label: j.name, value: Number(j.amount) || 0, color: j.color }));
    const total = segs.reduce((s, x) => s + Math.max(0, x.value), 0);
    const size = 184, r = 70, cx = 92, cy = 92, sw = 28;
    const C = 2 * Math.PI * r;
    let off = 0, circles = '';
    if (total <= 0) {
      circles = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#F0E6D2" stroke-width="${sw}"/>`;
    } else {
      segs.forEach(s => {
        const len = Math.max(0, s.value) / total * C;
        if (len > 0.5) {
          circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`;
          off += len;
        }
      });
    }
    const legend = d().jars.map(j => {
      const w = total > 0 ? (Number(j.amount) || 0) / total * 100 : 0;
      return `<div style="display:flex;align-items:center;gap:7px;font-size:12.5px">
        <span style="width:10px;height:10px;border-radius:3px;background:${j.color};flex:0 0 10px"></span>
        <span style="flex:1">${j.emoji} ${U.esc(j.name)}</span>
        <b style="font-variant-numeric:tabular-nums">${w.toFixed(1)}%</b>
        <span style="color:#ADA492;min-width:78px;text-align:right">¥${U.money(j.amount)}</span>
      </div>`;
    }).join('');
    return `
      <div class="donut-wrap">
        <div class="donut">${`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${circles}<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="12" fill="#7C7566">总存款</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="19" font-weight="800" fill="#3D392F">¥${U.money(total)}</text></svg>`}</div>
        <div class="donut-legend">${legend}</div>
      </div>
      <div class="kbox" style="margin-top:8px">
        <div class="kbox-t">🍉 小建议</div>
        <div class="kbox-c">${advice()}</div>
      </div>`;
  }

  function advice() {
    const s = sumJars();
    if (s <= 0) return '先从每周固定存一小笔开始，金额不重要，习惯才重要。';
    const g = (k) => (Number((d().jars.find(j => j.key === k) || {}).amount) || 0) / s * 100;
    const fun = g('fun'), save = g('save'), fund = g('fund'), travel = g('travel');
    const tips = [];
    if (fun > 40) tips.push(`<b>购物玩乐占了 ${fun.toFixed(0)}%</b>，稍微多了点。学生阶段建议压到 30% 以内，把差额挪去储蓄。`);
    if (save < 30) tips.push(`储蓄只占 ${save.toFixed(0)}%。<b>应急钱建议先攒够 3 个月生活费</b>，这是所有理财的地基，比买基金优先级高。`);
    if (fund > 0 && save >= 30) tips.push(`储蓄底子够了，基金这部分可以考虑<b>每月定投</b>，用时间摊平价格波动。`);
    if (fund === 0) tips.push('基金罐还是空的。等应急钱攒够了，可以先用几百块试试指数基金定投，重点是<b>体验波动</b>而不是赚钱。');
    if (travel > 0) tips.push(`旅游罐 ¥${U.money((d().jars.find(j => j.key === 'travel') || {}).amount)}，这是给自己的奖励，别有负罪感。`);
    return tips.slice(0, 3).map(t => '· ' + t).join('<br>');
  }

  function renderLog(l) {
    const p = (n) => String(n).padStart(2, '0');
    const dt = new Date(l.at);
    return `<div class="ledger-row">
      <span class="lr-dot" style="background:${l.color}"></span>
      <span class="lr-name">${U.esc(l.name)}${l.note ? `<span style="color:#ADA492;font-size:11.5px"> · ${U.esc(l.note)}</span>` : ''}</span>
      <span class="lr-date">${dt.getMonth() + 1}/${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}</span>
      <span class="lr-amt ${l.amt >= 0 ? 'in' : 'out'}">${l.amt >= 0 ? '+' : '−'}¥${U.money(Math.abs(l.amt))}</span>
    </div>`;
  }

  // ---------- 交互 ----------
  function bind() {
    document.getElementById('setTotal').onclick = () => {
      U.prompt({
        title: '直接填写总金额', sub: '填多少就显示多少，和下面四个罐子互不影响',
        type: 'number', value: totalShown() || '', placeholder: '例：3500',
        onOk: (v) => {
          const n = parseFloat(v);
          if (isNaN(n)) return U.toast('请填一个数字', 'warn');
          d().manualTotal = n;
          Store.checkIn(KEY); Store.save(); App.refreshStreak(); render();
          U.toast('总额已更新 💰', 'ok');
        }
      });
    };

    document.getElementById('autoTotal').onclick = () => {
      d().manualTotal = null;
      Store.save(); render();
      U.toast('总额改回自动合计', 'ok');
    };

    document.getElementById('quickIn').onclick = () => {
      U.prompt({
        title: '记一笔存入', sub: '会平均放进「储蓄」罐，之后可以自己调',
        type: 'number', placeholder: '例：200',
        onOk: (v) => {
          const n = parseFloat(v);
          if (isNaN(n) || n <= 0) return U.toast('请填一个大于 0 的数字', 'warn');
          const jar = d().jars.find(j => j.key === 'save');
          jar.amount = (Number(jar.amount) || 0) + n;
          addLog(jar.name, n, jar.color, '快速存入');
          done('存进储蓄罐 ¥' + U.money(n));
        }
      });
    };

    // 本月预算
    const sb = document.getElementById('setBudget');
    if (sb) sb.onclick = () => {
      U.prompt({
        title: '设置本月预算', sub: '这是「每月花费」的上限，会用于看每个月花超没超',
        type: 'number', value: d().budget != null ? d().budget : '', placeholder: '例：1500',
        onOk: (v) => {
          const n = parseFloat(v);
          if (isNaN(n) || n < 0) return U.toast('请填一个不小于 0 的数字', 'warn');
          d().budget = n;
          Store.save(); render();
          U.toast('本月预算已设为 ¥' + U.money(n) + ' 📅', 'ok');
        }
      });
    };

    document.getElementById('addJar').onclick = () => {
      U.prompt({
        title: '添加一个存钱用途', sub: '比如「考证基金」「数码」「宠物」，会得到一个专属钱罐',
        placeholder: '例：考证基金',
        onOk: (v) => {
          v = (v || '').trim();
          if (!v) return;
          const used = d().jars.length;
          d().jars.push({
            key: 'c' + U.uid(),
            name: v,
            emoji: EMOJI_POOL[used % EMOJI_POOL.length],
            desc: '自定义的金库',
            amount: 0, goal: 1000,
            color: COLOR_POOL[used % COLOR_POOL.length],
            bg: '#FFF3D6'
          });
          Store.save(); render();
          U.toast('新金库已就位 🫙', 'ok');
        }
      });
    };

    const cl = document.getElementById('clearLog');
    if (cl) cl.onclick = () => U.confirm({
      title: '清空存取记录？', sub: '罐子里的钱不会变，只是不再显示历史流水。',
      okText: '清空', danger: true,
      onOk: () => { d().ledger = []; Store.save(); render(); }
    });

    document.querySelectorAll('.jar').forEach(card => {
      const key = card.dataset.key;
      const jar = d().jars.find(j => j.key === key);
      card.querySelectorAll('[data-act]').forEach(btn => {
        btn.onclick = () => {
          const act = btn.dataset.act;
          if (act === 'edit') {
            U.prompt({
              title: `${jar.emoji} ${jar.name} —— 直接填金额`,
              sub: '想放多少就填多少，随时可以改',
              type: 'number', value: jar.amount || '', placeholder: '例：800',
              onOk: (v) => {
                const n = parseFloat(v);
                if (isNaN(n) || n < 0) return U.toast('请填一个不小于 0 的数字', 'warn');
                const diff = n - (Number(jar.amount) || 0);
                jar.amount = n;
                if (Math.abs(diff) > 0.004) addLog(jar.name, diff, jar.color, '手动修改');
                done(`${jar.name} 已更新为 ¥${U.money(n)}`);
              }
            });
          } else if (act === 'in' || act === 'out') {
            const isIn = act === 'in';
            U.prompt({
              title: `${isIn ? '往' : '从'}「${jar.name}」${isIn ? '里存入' : '中取出'}`,
              sub: `当前 ¥${U.money(jar.amount)}`,
              type: 'number', placeholder: '例：100',
              okText: isIn ? '存进去' : '取出来',
              onOk: (v) => {
                const n = parseFloat(v);
                if (isNaN(n) || n <= 0) return U.toast('请填一个大于 0 的数字', 'warn');
                if (!isIn && n > (Number(jar.amount) || 0)) return U.toast('罐子里没这么多钱哦', 'warn');
                jar.amount = (Number(jar.amount) || 0) + (isIn ? n : -n);
                addLog(jar.name, isIn ? n : -n, jar.color, isIn ? '存入' : '取出');
                done(`${isIn ? '存入' : '取出'} ¥${U.money(n)}`);
              }
            });
          } else if (act === 'goal') {
            U.prompt({
              title: `${jar.name} 的目标金额`, sub: '定个小目标，看着进度条涨很爽',
              type: 'number', value: jar.goal || '', placeholder: '例：5000',
              onOk: (v) => {
                const n = parseFloat(v);
                if (isNaN(n) || n < 0) return U.toast('请填一个数字', 'warn');
                jar.goal = n; Store.save(); render();
              }
            });
          } else if (act === 'rename') {
            U.prompt({
              title: `改「${jar.name}」的名字 / 图标`,
              sub: '格式：名字|图标（图标可省略，如「考证基金|📚」）',
              value: `${jar.name}|${jar.emoji}`, placeholder: '考证基金|📚',
              onOk: (v) => {
                v = (v || '').trim();
                if (!v) return;
                const parts = v.split('|');
                jar.name = parts[0].trim() || jar.name;
                if (parts[1] && parts[1].trim()) jar.emoji = parts[1].trim();
                Store.save(); render();
                U.toast('已更新 ✎', 'ok');
              }
            });
          } else if (act === 'del') {
            U.confirm({
              title: `删除「${jar.name}」？`, sub: '这个罐子的余额和记录会一起消失，确定吗？',
              okText: '删除', danger: true,
              onOk: () => {
                d().jars = d().jars.filter(j => j.key !== key);
                Store.save(); render();
                U.toast('已删除该用途', 'ok');
              }
            });
          }
        };
      });
    });
  }

  function done(msg) {
    Store.checkIn(KEY);
    Store.save();
    App.refreshStreak();
    render();
    U.toast(msg + ' 🍉', 'ok');
  }

  return {
    key: KEY,
    title: '御用金库',
    sub: () => '总额和金库都能自己填，钱要花在明白处',
    icon: '🏛️',
    render
  };
})();
