/* ==========================================================
   运动养生 —— 晨间运动 / 日间学习微运动 / 晚间静养运动
   提供「跟练」：分步计时 + 语音引导（本地无视频，以图解+计时替代）
   ========================================================== */

const FitnessModule = (() => {
  const KEY = 'fitness';
  let tab = 'morning';

  function d() { return Store.data.fitness; }
  const GROUPS = [
    { k: 'morning', name: '🌅 晨间运动', sub: '起床后唤醒身体' },
    { k: 'day', name: '📚 日间学习微运动', sub: '久坐间隙动一动' },
    { k: 'night', name: '🌙 晚间静养运动', sub: '睡前放松助眠' }
  ];

  function render() {
    const list = FITNESS[tab] || [];
    document.getElementById('view').innerHTML = `
      <section class="card fade-in" style="padding:16px 22px">
        <div class="card-head" style="margin-bottom:12px">
          <h2 style="font-size:16px">🤸 运动养生</h2>
          <span class="tag">跟着练，不费脑</span>
          <div class="spacer"></div>
          <span class="sub">点「开始跟练」分步计时带练</span>
        </div>
        <div class="seg">
          ${GROUPS.map(g => `<button data-tab="${g.k}" class="${tab === g.k ? 'on' : ''}">${g.name}</button>`).join('')}
        </div>
      </section>
      <section class="card fade-in">
        <div class="card-head"><h2>${GROUPS.find(g => g.k === tab).name}</h2>
          <span class="tag grey">${GROUPS.find(g => g.k === tab).sub}</span>
          <div class="spacer"></div>
          <span class="sub">${list.length} 个动作 · 已练 ${Object.keys(d().done).length} 个</span></div>
        <div class="fit-grid">
          ${list.map(ex => renderEx(ex)).join('')}
        </div>
      </section>
      <section class="card fade-in" style="background:linear-gradient(120deg,#FFF6DC,#FFF0F1)">
        <div style="font-size:13px;color:#7C7566;line-height:1.85">
          <b style="font-size:15px;color:#3D392F">🍉 打卡记录</b><br>
          连续 <b style="color:#FF5C6E">${Store.streak(KEY)}</b> 天 ·
          累计 <b style="color:#F2A413">${Store.totalDays(KEY)}</b> 天 ·
          最长 <b style="color:#3FAE7B">${Store.bestStreak(KEY)}</b> 天
        </div>
      </section>
    `;
    bind();
  }

  function renderEx(ex) {
    const done = !!d().done[ex.id];
    const stepsTxt = ex.steps.map((s, i) => `${i + 1}. ${s.text}（${s.t}″）`).join('　');
    return `
      <div class="fit-card">
        <div class="fit-emoji">${ex.emoji}</div>
        <div class="fit-body">
          <div class="fit-name">${U.esc(ex.name)} ${done ? '<span class="tag green">练过 ✓</span>' : ''}</div>
          <div class="fit-tags"><span class="tag">🎯 ${U.esc(ex.target)}</span><span class="tag grey">⏱ ${ex.dur}″</span></div>
          <div class="fit-steps">${U.esc(stepsTxt)}</div>
        </div>
        <button class="btn melon fit-go" data-go="${ex.id}">▶ 开始跟练</button>
      </div>`;
  }

  // ---------- 跟练播放器 ----------
  function startFollow(ex) {
    const root = document.getElementById('modalRoot');
    let step = 0, remain = ex.steps[0].t, playing = true, timer = null;

    const box = U.el('div', 'follow');
    root.appendChild(box);

    function paint() {
      const s = ex.steps[step];
      const total = ex.steps.length;
      box.innerHTML = `
        <div class="follow-card">
          <button class="follow-close" id="fClose">✕</button>
          <div class="follow-emoji">${ex.emoji}</div>
          <div class="follow-name">${U.esc(ex.name)} <span class="tag">${U.esc(ex.target)}</span></div>
          <div class="follow-prog">第 ${step + 1} / ${total} 步</div>
          <div class="follow-ring" id="fRing">
            <div class="follow-num" id="fNum">${remain}</div>
            <div class="follow-unit">秒</div>
          </div>
          <div class="follow-step" id="fStep">${U.esc(s.text)}</div>
          <div class="follow-bar"><i id="fBar" style="width:${(1 - remain / s.t) * 100}%"></i></div>
          <div class="follow-ctrls">
            <button class="btn sm" id="fPrev">⏮ 上一步</button>
            <button class="btn primary" id="fPlay">${playing ? '⏸ 暂停' : '▶ 继续'}</button>
            <button class="btn sm" id="fNext">下一步 ⏭</button>
          </div>
          <div class="follow-steps">
            ${ex.steps.map((x, i) => `<div class="fs ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}">${i + 1}. ${U.esc(x.text)}</div>`).join('')}
          </div>
        </div>`;
      box.querySelector('#fClose').onclick = close;
      box.querySelector('#fPrev').onclick = () => goto(step - 1);
      box.querySelector('#fNext').onclick = () => goto(step + 1);
      box.querySelector('#fPlay').onclick = toggle;
      box.onclick = (e) => { if (e.target === box) close(); };
    }

    function speakStep() { Speech.speak(ex.steps[step].text, { lang: 'zh-CN', rate: 0.95 }); }

    function tick() {
      if (!playing) return;
      remain--;
      const s = ex.steps[step];
      const bar = box.querySelector('#fBar');
      const num = box.querySelector('#fNum');
      if (bar) bar.style.width = ((1 - remain / s.t) * 100) + '%';
      if (num) num.textContent = remain;
      if (remain <= 0) {
        if (step + 1 < ex.steps.length) goto(step + 1);
        else finish();
      }
    }

    function goto(i) {
      if (i < 0) i = 0;
      if (i >= ex.steps.length) { finish(); return; }
      step = i; remain = ex.steps[i].t; playing = true;
      paint(); speakStep();
    }

    function toggle() {
      playing = !playing;
      const btn = box.querySelector('#fPlay');
      if (btn) btn.textContent = playing ? '⏸ 暂停' : '▶ 继续';
      if (playing) speakStep();
    }

    function finish() {
      clearInterval(timer);
      Speech.stop();
      const finished = !d().done[ex.id];
      d().done[ex.id] = Store.today();
      Store.checkIn(KEY); Store.save(); App.refreshStreak();
      box.innerHTML = `
        <div class="follow-card done-card">
          <div class="follow-emoji">🍉</div>
          <div class="follow-name">${U.esc(ex.name)} 完成啦！</div>
          <div class="follow-step">坚持就是进步，明天再来一组～</div>
          <button class="btn primary" id="fOk">好的 👌</button>
        </div>`;
      box.querySelector('#fOk').onclick = close;
    }

    function close() {
      clearInterval(timer); Speech.stop();
      box.classList.add('out'); setTimeout(() => box.remove(), 220);
    }

    paint();
    speakStep();
    timer = setInterval(tick, 1000);
  }

  // ---------- 交互 ----------
  function bind() {
    document.querySelectorAll('[data-tab]').forEach(b => {
      b.onclick = () => { tab = b.dataset.tab; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    });
    document.querySelectorAll('[data-go]').forEach(b => {
      b.onclick = () => {
        const ex = (FITNESS.morning.concat(FITNESS.day, FITNESS.night)).find(x => x.id === b.dataset.go);
        if (ex) startFollow(ex);
      };
    });
  }

  return {
    key: KEY, title: '运动养生', icon: '🤸',
    sub: () => '晨间 · 日间微运动 · 晚间静养，跟着练',
    render
  };
})();
