/* ==========================================================
   听力练习 —— 六级历年真题选段
   逐句精听 · 原文可遮挡 · 做题看解析
   ========================================================== */

const ListeningModule = (() => {
  const KEY = 'listening';
  let idx = 0;          // 当前材料
  let showScript = false;
  let showAnswer = false;
  let curLine = -1;
  let curCass = null;
  function killCass() { if (curCass) { curCass.destroy(); curCass = null; } }

  function d() { return Store.data.listening; }
  function item() { return LISTENING_CORPUS[idx]; }

  function init() {
    // 每天默认推荐一篇，同一天固定
    idx = U.dayIndex(LISTENING_CORPUS.length);
    showScript = false; showAnswer = false; curLine = -1;
  }

  function ansKey() { return `${item().id}`; }
  function myAnswers() { return d().answers[ansKey()] || {}; }

  function render() {
    const it = item();
    const my = myAnswers();
    const answered = Object.keys(my).length;
    const rightCount = it.questions.filter((q, i) => my[i] === q.answer).length;

    document.getElementById('view').innerHTML = `
      <!-- 选材料 -->
      <section class="card fade-in" style="padding:18px 22px">
        <div class="card-head" style="margin-bottom:12px">
          <h2 style="font-size:16px">🎧 六级听力真题库</h2>
          <span class="tag">今日推荐第 ${idx + 1} 篇</span>
          <div class="spacer"></div>
          <span class="sub">共 ${LISTENING_CORPUS.length} 篇 · 每天自动换一篇</span>
        </div>
        <div class="seg" style="flex-wrap:wrap">
          ${LISTENING_CORPUS.map((x, i) => {
      const done = d().progress[x.id];
      return `<button data-i="${i}" class="${i === idx ? 'on' : ''}">${done ? '✓ ' : ''}${x.typeCN}·${U.esc(x.titleCN)}</button>`;
    }).join('')}
        </div>
      </section>

      <!-- 播放器 -->
      <section class="audio-panel fade-in" style="margin-bottom:20px">
        <div class="row" style="align-items:flex-start">
          <div style="flex:1;min-width:200px">
            <div class="ap-title">${U.esc(it.title)}</div>
            <div class="ap-meta">${U.esc(it.titleCN)} · ${it.year} · ${it.type} · 难度 ${it.level}</div>
          </div>
          <span class="tag red">${it.typeCN}</span>
        </div>
        <div class="ap-controls">
          <div class="cass-hint" style="margin:0">🎞️ 录音带跟听：整篇播放后可随时暂停、拖动进度条，走神了往回拉就能重听。</div>
          <div id="cassWrap" style="margin-top:14px;width:100%"></div>
        </div>
        <div style="margin-top:12px;font-size:12px;color:#7C7566;line-height:1.7">
          🍉 正确练法：先<b>盲听两遍</b>不看原文 → 做题 → 再<b>逐句精听</b>（点单句左边的 🔊）→ 最后看原文和解析。
        </div>
      </section>

      <!-- 题目 -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>📝 真题练习</h2>
          <div class="spacer"></div>
          ${answered ? `<span class="tag ${rightCount === it.questions.length ? 'green' : 'red'}">答对 ${rightCount} / ${it.questions.length}</span>` : ''}
          <button class="btn sm ${showAnswer ? '' : 'primary'}" id="toggleAns">${showAnswer ? '隐藏解析' : '看答案解析'}</button>
        </div>
        ${it.questions.map((q, qi) => renderQ(q, qi, my)).join('')}
      </section>

      <!-- 原文 -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>📄 听力原文</h2>
          <span class="tag grey">点每句左边的 🔊 可单句重听</span>
          <div class="spacer"></div>
          <button class="btn sm" id="toggleScript">${showScript ? '🙈 遮住原文' : '👀 显示原文'}</button>
        </div>
        <div id="scriptBox" class="${showScript ? '' : 'blurred'}">
          ${it.script.map((l, i) => `
            <div class="script-line ${i === curLine ? 'on' : ''}" data-line="${i}">
              <span style="opacity:.4;font-size:11px;margin-right:6px">${String(i + 1).padStart(2, '0')}</span>
              🔊 ${U.esc(l.en)}
              <span class="cn">${U.esc(l.cn)}</span>
            </div>`).join('')}
        </div>
      </section>

      <!-- 生词 + 技巧 -->
      <section class="card fade-in">
        <div class="card-head"><h2>🔑 本篇生词</h2><div class="spacer"></div>
          <button class="btn sm" id="readWords">🔊 连读</button></div>
        <div class="word-grid" style="margin-bottom:18px">
          ${it.words.map(w => `
            <div class="word-card" data-say="${U.esc(w.en)}">
              <div class="wc-en">${U.esc(w.en)} <span class="spk">🔊</span></div>
              <div class="wc-ph">${U.esc(w.ph)}</div>
              <div class="wc-cn">${U.esc(w.cn)}</div>
            </div>`).join('')}
        </div>
        <div class="kbox">
          <div class="kbox-t">🎯 这一题型的解题技巧</div>
          <div class="kbox-c">${it.tip}</div>
        </div>
      </section>

      <!-- 打卡 -->
      <section class="card fade-in" style="background:linear-gradient(120deg,#FFF6DC,#FFF0F1)">
        <div class="row" style="justify-content:space-between">
          <div style="font-size:13px;color:#7C7566;line-height:1.8">
            <b style="font-size:15px;color:#3D392F">听力坚持记录</b><br>
            连续 <b style="color:#FF5C6E">${Store.streak(KEY)}</b> 天 ·
            累计 <b style="color:#F2A413">${Store.totalDays(KEY)}</b> 天 ·
            最长 <b style="color:#3FAE7B">${Store.bestStreak(KEY)}</b> 天 ·
            已完成 <b>${Object.keys(d().progress).length}</b> / ${LISTENING_CORPUS.length} 篇
          </div>
          <button class="btn ${d().progress[it.id] ? '' : 'green'}" id="markDone">
            ${d().progress[it.id] ? '✓ 这篇已完成' : '我练完了，打卡'}
          </button>
        </div>
      </section>
    `;
    bind();
  }

  function renderQ(q, qi, my) {
    const sel = my[qi];
    return `
      <div class="q-item">
        <div class="q-title">${qi + 1}. ${U.esc(q.q)}</div>
        <div class="q-opts">
          ${q.opts.map((o, oi) => {
      let cls = '';
      if (sel === oi) cls = 'sel';
      if (showAnswer || sel !== undefined) {
        if (oi === q.answer) cls = 'right';
        else if (sel === oi) cls = 'wrong';
      }
      return `<button class="q-opt ${cls}" data-q="${qi}" data-o="${oi}">
                      <b>${'ABCD'[oi]}.</b> ${U.esc(o)}
                    </button>`;
    }).join('')}
        </div>
        ${(showAnswer || sel !== undefined) ? `
          <div class="kbox green" style="margin-top:11px">
            <div class="kbox-t">✅ 正确答案 ${'ABCD'[q.answer]} · 为什么</div>
            <div class="kbox-c">${q.why}</div>
          </div>` : ''}
      </div>`;
  }

  // ---------- 交互 ----------
  function bind() {
    document.querySelectorAll('.seg button[data-i]').forEach(b => {
      b.onclick = () => {
        killCass();
        idx = Number(b.dataset.i);
        showScript = false; showAnswer = false; curLine = -1;
        render();
      };
    });

    // 录音带跟听整篇原文
    killCass();
    const segs = item().script.map(l => ({ text: l.en, lang: 'en' }));
    curCass = Speech.makeCassette({
      title: item().titleCN || item().title, segments: segs, lang: 'en',
      rate: Store.data.settings.rate || 0.95,
      onLine: (i) => {
        curLine = i;
        document.querySelectorAll('.script-line').forEach(e => e.classList.remove('on'));
        const el = document.querySelector(`.script-line[data-line="${i}"]`);
        if (el) el.classList.add('on');
      }
    });
    document.getElementById('cassWrap').appendChild(curCass.el);

    document.getElementById('toggleScript').onclick = () => { showScript = !showScript; render(); };
    document.getElementById('toggleAns').onclick = () => { showAnswer = !showAnswer; render(); };

    document.querySelectorAll('.script-line').forEach(el => {
      el.onclick = () => {
        const i = Number(el.dataset.line);
        killCass();
        Speech.speak(item().script[i].en, { rate: 0.8 });
        document.querySelectorAll('.script-line').forEach(e => e.classList.remove('on'));
        el.classList.add('on');
        curLine = i;
      };
    });

    document.querySelectorAll('.q-opt').forEach(b => {
      b.onclick = () => {
        const qi = Number(b.dataset.q), oi = Number(b.dataset.o);
        const k = ansKey();
        if (!d().answers[k]) d().answers[k] = {};
        d().answers[k][qi] = oi;
        Store.checkIn(KEY);
        Store.save();
        App.refreshStreak();
        const right = item().questions[qi].answer === oi;
        U.toast(right ? '答对了 ✓' : `错了，正确答案是 ${'ABCD'[item().questions[qi].answer]}`, right ? 'ok' : 'warn');
        render();
      };
    });

    document.querySelectorAll('.word-card').forEach(c => {
      c.onclick = () => { killCass(); Speech.speak(c.dataset.say, { rate: 0.75 }); };
    });
    document.getElementById('readWords').onclick = () => {
      killCass();
      Speech.speakQueue(item().words.map(w => w.en), { rate: 0.75 });
    };

    document.getElementById('markDone').onclick = () => {
      const it = item();
      if (d().progress[it.id]) { U.toast('这篇已经打过卡了', 'warn'); return; }
      d().progress[it.id] = Store.today();
      Store.checkIn(KEY);
      Store.save();
      App.refreshStreak();
      render();
      U.toast('听力打卡完成 🎧', 'ok');
    };
  }

  return {
    key: KEY,
    title: '听力练习',
    sub: () => '六级历年真题选段 · 盲听 → 做题 → 精听 → 看解析',
    icon: '🎧',
    render: () => { render(); },
    onEnter: init,
    onLeave: () => { killCass(); Speech.stop(); }
  };
})();
