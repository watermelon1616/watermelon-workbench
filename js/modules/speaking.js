/* ==========================================================
   口语练习 —— 会计 / 外贸 / 接待客户
   · 未读完的单词/句子第二天仍保留（按天生成、存在历史里）
   · 每个单词/句子可单独打勾标记已学
   · 日历点哪天看哪天的内容（温习）
   ========================================================== */

const SpeakingModule = (() => {
  const KEY = 'speaking';
  const TYPES = ['accounting', 'trade', 'client'];
  let cur = 'accounting';
  let spkMonth = new Date();

  function d() { return Store.data.speaking; }
  function pack() { return SPEAKING_CORPUS[cur]; }
  function hist() { if (!d().history) d().history = {}; if (!d().history[cur]) d().history[cur] = {}; return d().history[cur]; }

  // 指定日期的批次（首次访问该天才生成，之后一直保留 → 没读完也不会丢）
  function ensureBatch(type, dateStr) {
    const h = d().history[type] || (d().history[type] = {});
    if (!h[dateStr]) {
      const p = SPEAKING_CORPUS[type];
      const off = TYPES.indexOf(type) * 3;
      h[dateStr] = {
        dialogIdx: dayIndexFor(dateStr, p.dialogs.length, off),
        words: dayPickFor(p.words, 8, off, dateStr).map(w => ({ en: w.en, ph: w.ph, cn: w.cn, learned: false })),
        sentences: dayPickFor(p.sentences, 5, off, dateStr).map(s => ({ en: s.en, cn: s.cn, learned: false }))
      };
      Store.save();
    }
    return h[dateStr];
  }

  function batchLearned(b) { return b ? b.words.filter(w => w.learned).length + b.sentences.filter(s => s.learned).length : 0; }
  function batchTotal(b) { return b ? b.words.length + b.sentences.length : 0; }

  // 任意日期内容（与「今天」同源算法，保证历史可复现）
  function dayIndexFor(dateStr, len, offset = 0) {
    if (!len) return 0;
    const start = new Date(2024, 0, 1);
    const [y, m, d] = dateStr.split('-').map(Number);
    const dd = new Date(y, m - 1, d);
    const days = Math.floor((dd - start) / 86400000);
    return ((days + offset) % len + len) % len;
  }
  function dayPickFor(arr, n, offset, dateStr) {
    if (!arr || !arr.length) return [];
    const out = [], used = new Set();
    const base = dayIndexFor(dateStr, arr.length, offset);
    for (let i = 0; i < Math.min(n, arr.length); i++) {
      let idx = (base + i * 7 + i * i) % arr.length;
      let guard = 0;
      while (used.has(idx) && guard++ < arr.length) idx = (idx + 1) % arr.length;
      used.add(idx); out.push(arr[idx]);
    }
    return out;
  }

  function render() {
    const AVAIL = TYPES.filter(t => SPEAKING_CORPUS[t]);
    if (!AVAIL.includes(cur)) cur = AVAIL[0] || 'accounting';
    const p = pack();
    const today = Store.today();
    const batch = ensureBatch(cur, today);
    const learned = batchLearned(batch), total = batchTotal(batch);
    const dialog = p.dialogs[batch.dialogIdx];

    document.getElementById('view').innerHTML = `
      <!-- 三类切换 -->
      <section class="card fade-in" style="padding:18px 22px">
        <div class="card-head" style="margin-bottom:12px">
          <h2 style="font-size:16px">🎙️ 今天的口语练习</h2>
          <span class="tag">${U.todayCN()}</span>
          <div class="spacer"></div>
          <span class="sub">今日进度 ${learned} / ${total} ${learned === total && total ? '🎉' : ''}</span>
        </div>
        <div class="seg">
          ${AVAIL.map(t => {
      const pp = SPEAKING_CORPUS[t];
      const b = ensureBatch(t, today);
      const done = batchLearned(b) === batchTotal(b) && batchTotal(b) > 0;
      return `<button data-type="${t}" class="${t === cur ? 'on' : ''}">${pp.emoji} ${pp.name}${done ? ' ✓' : ''}</button>`;
    }).join('')}
        </div>
        <div style="margin-top:12px;font-size:12.5px;color:#7C7566">${p.desc}</div>
        <div class="row" style="margin-top:12px">
          <div class="progress" style="flex:1"><i style="width:${total ? learned / total * 100 : 0}%"></i></div>
        </div>
      </section>

      ${renderCalendar()}

      <!-- 情景对话 -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>${p.emoji} ${U.esc(dialog.topic)}</h2>
          <span class="tag" style="background:${p.color}1a;color:${p.color}">${U.esc(dialog.scene)}</span>
          <div class="spacer"></div>
          <div class="speed-ctrl">
            语速 <input type="range" id="rate" min="0.5" max="1.2" step="0.05" value="${Store.data.settings.rate}">
            <span id="rateTxt">${Number(Store.data.settings.rate).toFixed(2)}×</span>
          </div>
          <button class="btn sm melon" id="playAll">▶ 整段播放</button>
          <button class="btn sm" id="stopAll">■ 停</button>
        </div>
        <div id="dialogBox">
          ${dialog.lines.map((l, i) => renderLine(l, i, today)).join('')}
        </div>
        <div class="row" style="margin-top:16px;justify-content:space-between">
          <span style="font-size:12px;color:#ADA492">🔊 听原声 · 🎤 按一下开始录音，再按一下结束 · ▶ 回放自己的声音</span>
        </div>
      </section>

      <!-- 核心单词（可逐条打勾） -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>📖 今日核心单词</h2>
          <span class="tag green">点 ✅ 打勾 · 点卡片听读音</span>
          <div class="spacer"></div>
          <button class="btn sm" id="readWords">🔊 连读一遍</button>
        </div>
        <div class="word-grid">
          ${batch.words.map((w, i) => `
            <div class="word-card spk-word ${w.learned ? 'done' : ''}" data-word="${i}">
              <span class="lk" data-lk="${i}">${w.learned ? '✓' : ''}</span>
              <div class="wc-en">${U.esc(w.en)} <span class="spk">🔊</span></div>
              <div class="wc-ph">${U.esc(w.ph)}</div>
              <div class="wc-cn">${U.esc(w.cn)}</div>
            </div>`).join('')}
        </div>
      </section>

      <!-- 实用句子（可逐条打勾） -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>💬 实用小句子</h2>
          <span class="tag red">背下来直接能用</span>
          <div class="spacer"></div>
          <button class="btn sm" id="readSents">🔊 连读一遍</button>
        </div>
        ${batch.sentences.map((s, i) => `
          <div class="sent-item ${s.learned ? 'done' : ''}" style="border-left-color:${p.color}">
            <span class="lk" data-slk="${i}">${s.learned ? '✓' : ''}</span>
            <div class="si-body">
              <div class="si-en">${U.esc(s.en)}</div>
              <div class="si-cn">${U.esc(s.cn)}</div>
            </div>
            <div class="dl-ops">
              <button class="op-btn" data-say="${U.esc(s.en)}" title="听读音">🔊</button>
              <button class="op-btn ${d().records['sent_' + cur + '_' + today + '_' + i] ? 'has-audio' : ''}" data-rec="sent_${cur}_${today}_${i}" data-text="${U.esc(s.en)}" title="跟读录音">🎤</button>
              ${d().records['sent_' + cur + '_' + today + '_' + i] ? `<button class="op-btn" data-play="sent_${cur}_${today}_${i}" title="听我自己的">▶</button>` : ''}
            </div>
          </div>`).join('')}
      </section>

      <!-- 打卡统计 -->
      <section class="card fade-in" style="background:linear-gradient(120deg,#FFFAE8,#F0FAF4)">
        <div class="card-head"><h2>🏆 口语坚持记录</h2></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px">
          ${st('连续坚持', Store.streak(KEY), '天', '#FF5C6E')}
          ${st('累计练习', Store.totalDays(KEY), '天', '#F2A413')}
          ${st('最长纪录', Store.bestStreak(KEY), '天', '#3FAE7B')}
          ${st('录音条数', Object.keys(d().records).length, '条', '#7B6BE0')}
        </div>
      </section>
    `;
    bind(today, batch);
  }

  function st(label, num, unit, color) {
    return `<div style="background:#fff;border-radius:16px;padding:15px 17px;box-shadow:0 3px 12px rgba(180,150,90,.08)">
      <div style="font-size:12px;color:#ADA492">${label}</div>
      <div style="font-size:26px;font-weight:800;color:${color};margin-top:4px">${num}<span style="font-size:13px;margin-left:3px">${unit}</span></div>
    </div>`;
  }

  function renderLine(l, i, ds) {
    const rk = `dlg_${cur}_${ds}_${i}`;
    const has = !!d().records[rk];
    return `
      <div class="dialog-line ${l.r === 'B' ? 'b' : ''}" data-idx="${i}">
        <div class="dl-role">${l.r === 'A' ? '👤' : '🙋'}</div>
        <div class="dl-body">
          <div class="dl-en">${U.esc(l.en)}</div>
          <div class="dl-cn">${U.esc(l.cn)}</div>
        </div>
        <div class="dl-ops">
          <button class="op-btn" data-say="${U.esc(l.en)}" title="听他怎么读">🔊</button>
          <button class="op-btn ${has ? 'has-audio' : ''}" data-rec="${rk}" data-text="${U.esc(l.en)}" title="我来跟读">🎤</button>
          ${has ? `<button class="op-btn" data-play="${rk}" title="回放我的录音">▶</button>` : ''}
        </div>
      </div>`;
  }

  // ---------- 日历（点哪天看哪天） ----------
  function renderCalendar() {
    const y = spkMonth.getFullYear(), mo = spkMonth.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const days = new Date(y, mo + 1, 0).getDate();
    const cls = ['日', '一', '二', '三', '四', '五', '六'];
    const h = d().history[cur] || {};

    let cells = '';
    for (let i = 0; i < first; i++) cells += `<div class="cal-cell empty"></div>`;
    for (let day = 1; day <= days; day++) {
      const ds = `${y}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const b = h[ds];
      const n = b ? batchLearned(b) : 0;
      cells += `
        <div class="cal-cell ${b ? 'has' : ''}" ${b ? `data-date="${ds}"` : ''}>
          <span class="cal-d">${day}</span>
          ${b ? `<span class="cal-num">${n}</span>` : ''}
        </div>`;
    }
    return `
      <section class="card fade-in" style="margin-top:18px">
        <div class="card-head">
          <h2>📅 口语日历</h2>
          <span class="tag">点带绿字的天，看那天练了什么</span>
          <div class="spacer"></div>
          <div class="cal-nav">
            <button id="spkPrev">‹</button>
            <span>${y} 年 ${mo + 1} 月</span>
            <button id="spkNext">›</button>
          </div>
        </div>
        <div class="cal-week">${cls.map(c => `<span>${c}</span>`).join('')}</div>
        <div class="cal-grid">${cells}</div>
        <div class="cal-tip">🟢 绿字 = 那天已学会的单词+句子数量。点格子回看那天的内容并补打勾。</div>
      </section>`;
  }

  function showDayReview(type, ds) {
    const b = (d().history[type] || {})[ds];
    if (!b) return;
    const p = SPEAKING_CORPUS[type];
    const dialog = p.dialogs[b.dialogIdx];
    const root = document.getElementById('modalRoot');
    const words = b.words.map(w => `<div class="word-card" data-say="${U.esc(w.en)}"><div class="wc-en">${w.learned ? '✅ ' : '⬜ '}${U.esc(w.en)} <span class="spk">🔊</span></div><div class="wc-ph">${U.esc(w.ph)}</div><div class="wc-cn">${U.esc(w.cn)}</div></div>`).join('');
    const sents = b.sentences.map(s => `<div class="sent-item" style="border-left-color:${p.color}"><div class="si-body"><div class="si-en">${s.learned ? '✅ ' : '⬜ '}${U.esc(s.en)}</div><div class="si-cn">${U.esc(s.cn)}</div></div><button class="op-btn" data-say="${U.esc(s.en)}">🔊</button></div>`).join('');
    root.innerHTML = `<div class="modal-mask"><div class="modal" style="max-width:600px">
      <h3>${p.emoji} ${U.esc(p.name)} · ${ds.slice(5).replace('-', '月')}日</h3>
      <div class="m-sub">已学会 ${batchLearned(b)} / ${batchTotal(b)}（点空白处关闭，🔊 可听）</div>
      <div style="max-height:60vh;overflow:auto;margin-top:12px">
        <div style="font-weight:700;margin:10px 0 6px">🗣️ 情景对话 · ${U.esc(dialog.topic)}</div>
        ${dialog.lines.map(l => `<div style="font-size:13px;margin:4px 0"><b>${l.r === 'A' ? '👤' : '🙋'}</b> ${U.esc(l.en)}<br><span style="color:#9a917f">${U.esc(l.cn)}</span></div>`).join('')}
        <div style="font-weight:700;margin:14px 0 6px">📖 单词</div>
        <div class="word-grid">${words}</div>
        <div style="font-weight:700;margin:14px 0 6px">💬 句子</div>
        ${sents}
      </div>
    </div></div>`;
    root.querySelector('.modal-mask').onclick = (e) => { if (e.target.classList.contains('modal-mask')) root.innerHTML = ''; };
    root.querySelectorAll('[data-say]').forEach(b => { b.onclick = (e) => { e.stopPropagation(); Speech.speak(b.dataset.say, { formal: true }); }; });
  }

  // ---------- 交互 ----------
  function bind(ds, batch) {
    document.querySelectorAll('.seg button[data-type]').forEach(b => {
      b.onclick = () => { Speech.stop(); cur = b.dataset.type; render(); };
    });

    const rate = document.getElementById('rate');
    if (rate) rate.oninput = () => {
      Store.data.settings.rate = parseFloat(rate.value);
      document.getElementById('rateTxt').textContent = Number(rate.value).toFixed(2) + '×';
      Store.save();
    };

    const c = batch;
    document.getElementById('playAll').onclick = () => {
      Speech.speakQueue(c.words.map(w => w.en).concat(c.sentences.map(s => s.en)), {
        formal: true,
        onLine: (i) => {
          document.querySelectorAll('.dialog-line').forEach(e => e.classList.remove('speaking'));
        },
        onAll: () => document.querySelectorAll('.dialog-line').forEach(e => e.classList.remove('speaking'))
      });
    };
    document.getElementById('stopAll').onclick = () => {
      Speech.stop();
      document.querySelectorAll('.dialog-line').forEach(e => e.classList.remove('speaking'));
    };

    document.getElementById('readWords').onclick = () => {
      Speech.speakQueue(c.words.map(w => w.en), { rate: 0.8, formal: true });
    };
    document.getElementById('readSents').onclick = () => {
      Speech.speakQueue(c.sentences.map(s => s.en), { formal: true });
    };

    // 单词打勾 / 听
    document.querySelectorAll('.spk-word').forEach(card => {
      const i = Number(card.dataset.word);
      const lk = card.querySelector('.lk');
      lk.onclick = (e) => {
        e.stopPropagation();
        c.words[i].learned = !c.words[i].learned;
        Store.checkIn(KEY); Store.save(); App.refreshStreak();
        render();
      };
      card.onclick = () => Speech.speak(c.words[i].en, { rate: 0.75, formal: true });
    });

    // 句子打勾
    document.querySelectorAll('[data-slk]').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        const i = Number(b.dataset.slk);
        c.sentences[i].learned = !c.sentences[i].learned;
        Store.checkIn(KEY); Store.save(); App.refreshStreak();
        render();
      };
    });

    document.querySelectorAll('[data-say]').forEach(b => {
      if (b.closest('.spk-word')) return;
      b.onclick = (e) => { e.stopPropagation(); Speech.speak(b.dataset.say, { formal: true }); };
    });

    document.querySelectorAll('[data-rec]').forEach(b => {
      b.onclick = async (e) => {
        e.stopPropagation();
        const k = b.dataset.rec;
        if (Speech.isRecording()) {
          const wasThis = Speech.recordingKey() === k;
          await Speech.stopRecord();
          if (wasThis) return;
        }
        Speech.stop();
        const ok = await Speech.startRecord(k, (dataUrl) => {
          d().records[k] = dataUrl;
          Store.checkIn(KEY); Store.save(); App.refreshStreak();
          render();
          U.toast('录好了，点 ▶ 听听自己 🍉', 'ok');
        });
        if (ok) { b.classList.add('rec-on'); b.textContent = '⏺'; U.toast('正在录音…读完后再点一次结束', 'warn'); }
      };
    });

    document.querySelectorAll('[data-play]').forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); Speech.playData(d().records[b.dataset.play]); };
    });

    // 日历
    const prev = document.getElementById('spkPrev'), next = document.getElementById('spkNext');
    if (prev) prev.onclick = () => { spkMonth = new Date(spkMonth.getFullYear(), spkMonth.getMonth() - 1, 1); render(); };
    if (next) next.onclick = () => { spkMonth = new Date(spkMonth.getFullYear(), spkMonth.getMonth() + 1, 1); render(); };
    document.querySelectorAll('.cal-cell[data-date]').forEach(cell => {
      cell.onclick = () => showDayReview(cur, cell.dataset.date);
    });
  }

  return {
    key: KEY,
    title: '口语练习',
    sub: () => '会计 · 外贸 · 接待客户，每天自动换新内容',
    icon: '🎙️',
    render,
    onLeave: () => Speech.stop()
  };
})();
