/* ==========================================================
   口语练习 —— 会计 / 外贸 / 接待客户
   每天自动换内容 · 点喇叭听读音 · 点麦克风跟读录音
   ========================================================== */

const SpeakingModule = (() => {
  const KEY = 'speaking';
  const TYPES = ['accounting', 'trade', 'client'];
  let cur = 'accounting';

  function d() { return Store.data.speaking; }
  function pack() { return SPEAKING_CORPUS[cur]; }

  // 今天这一类给到的内容（每天自动轮换）
  function todayContent(type) {
    const p = SPEAKING_CORPUS[type];
    const off = TYPES.indexOf(type) * 3;
    return {
      dialog: p.dialogs[U.dayIndex(p.dialogs.length, off)],
      words: U.dayPick(p.words, 8, off),
      sentences: U.dayPick(p.sentences, 5, off)
    };
  }

  function doneKey(type) { return `${Store.today()}_${type}`; }
  function isDone(type) { return !!d().done[doneKey(type)]; }

  // 任意日期的内容（与「今天」同源算法，保证历史可复现）
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
  function contentForDate(type, dateStr) {
    const p = SPEAKING_CORPUS[type];
    const off = TYPES.indexOf(type) * 3;
    return {
      dialog: p.dialogs[dayIndexFor(dateStr, p.dialogs.length, off)],
      words: dayPickFor(p.words, 8, off, dateStr),
      sentences: dayPickFor(p.sentences, 5, off, dateStr)
    };
  }

  function render() {
    // 只渲染语料里真实存在的分类（语料若缺某类也不崩）
    const AVAIL = TYPES.filter(t => SPEAKING_CORPUS[t]);
    if (!AVAIL.includes(cur)) cur = AVAIL[0] || 'accounting';
    const c = todayContent(cur);
    const p = pack();
    const doneCount = AVAIL.filter(isDone).length;

    document.getElementById('view').innerHTML = `
      <!-- 三类切换 -->
      <section class="card fade-in" style="padding:18px 22px">
        <div class="card-head" style="margin-bottom:12px">
          <h2 style="font-size:16px">🎙️ 今天的三段口语</h2>
          <span class="tag">${U.todayCN()}</span>
          <div class="spacer"></div>
          <span class="sub">今日完成 ${doneCount} / 3</span>
        </div>
        <div class="seg">
          ${AVAIL.map(t => {
      const pp = SPEAKING_CORPUS[t];
      return `<button data-type="${t}" class="${t === cur ? 'on' : ''}">${pp.emoji} ${pp.name}${isDone(t) ? ' ✓' : ''}</button>`;
    }).join('')}
        </div>
        <div style="margin-top:12px;font-size:12.5px;color:#7C7566">${p.desc}</div>
      </section>

      <!-- 情景对话 -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>${p.emoji} ${U.esc(c.dialog.topic)}</h2>
          <span class="tag" style="background:${p.color}1a;color:${p.color}">${U.esc(c.dialog.scene)}</span>
          <div class="spacer"></div>
          <div class="speed-ctrl">
            语速 <input type="range" id="rate" min="0.5" max="1.2" step="0.05" value="${Store.data.settings.rate}">
            <span id="rateTxt">${Number(Store.data.settings.rate).toFixed(2)}×</span>
          </div>
          <button class="btn sm melon" id="playAll">▶ 整段播放</button>
          <button class="btn sm" id="stopAll">■ 停</button>
        </div>

        <div id="dialogBox">
          ${c.dialog.lines.map((l, i) => renderLine(l, i)).join('')}
        </div>

        <div class="row" style="margin-top:16px;justify-content:space-between">
          <span style="font-size:12px;color:#ADA492">🔊 听原声 · 🎤 按一下开始录音，再按一下结束 · ▶ 回放自己的声音</span>
          <button class="btn ${isDone(cur) ? '' : 'green'}" id="markDone">
            ${isDone(cur) ? '✓ 今天这类已完成' : '我练完了，打卡'}
          </button>
        </div>
      </section>

      <!-- 核心单词 -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>📖 今日核心单词</h2>
          <span class="tag green">点卡片就能听</span>
          <div class="spacer"></div>
          <button class="btn sm ghost" id="wordHistory" title="查看历史日期的内容复习">📅 历史</button>
          <button class="btn sm" id="readWords">🔊 连读一遍</button>
        </div>
        <div class="word-grid">
          ${c.words.map(w => `
            <div class="word-card" data-say="${U.esc(w.en)}">
              <div class="wc-en">${U.esc(w.en)} <span class="spk">🔊</span></div>
              <div class="wc-ph">${U.esc(w.ph)}</div>
              <div class="wc-cn">${U.esc(w.cn)}</div>
            </div>`).join('')}
        </div>
      </section>

      <!-- 实用句子 -->
      <section class="card fade-in">
        <div class="card-head">
          <h2>💬 实用小句子</h2>
          <span class="tag red">背下来直接能用</span>
          <div class="spacer"></div>
          <button class="btn sm ghost" id="sentHistory" title="查看历史日期的内容复习">📅 历史</button>
          <button class="btn sm" id="readSents">🔊 连读一遍</button>
        </div>
        ${c.sentences.map((s, i) => `
          <div class="sent-item" style="border-left-color:${p.color}">
            <div class="si-body">
              <div class="si-en">${U.esc(s.en)}</div>
              <div class="si-cn">${U.esc(s.cn)}</div>
            </div>
            <div class="dl-ops">
              <button class="op-btn" data-say="${U.esc(s.en)}" title="听读音">🔊</button>
              <button class="op-btn ${d().records['s_' + cur + '_' + i] ? 'has-audio' : ''}" data-rec="s_${cur}_${i}" data-text="${U.esc(s.en)}" title="跟读录音">🎤</button>
              ${d().records['s_' + cur + '_' + i] ? `<button class="op-btn" data-play="s_${cur}_${i}" title="听我自己的">▶</button>` : ''}
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
        <div style="margin-top:15px;font-size:13px;color:#7C7566;line-height:1.85">
          🍉 <b>怎么练最有效</b>：先点「整段播放」听两遍 → 跟着念，别看中文 → 用麦克风录一遍自己的 → 回放对比，重点听<b>连读、重音和句尾语调</b>。一次 10 分钟就够，关键是天天来。
        </div>
      </section>
    `;
    bind();
  }

  function st(label, num, unit, color) {
    return `<div style="background:#fff;border-radius:16px;padding:15px 17px;box-shadow:0 3px 12px rgba(180,150,90,.08)">
      <div style="font-size:12px;color:#ADA492">${label}</div>
      <div style="font-size:26px;font-weight:800;color:${color};margin-top:4px">${num}<span style="font-size:13px;margin-left:3px">${unit}</span></div>
    </div>`;
  }

  function renderLine(l, i) {
    const rk = `d_${cur}_${i}`;
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

  // ---------- 交互 ----------
  function bind() {
    document.querySelectorAll('.seg button[data-type]').forEach(b => {
      b.onclick = () => { Speech.stop(); cur = b.dataset.type; render(); };
    });

    const rate = document.getElementById('rate');
    rate.oninput = () => {
      Store.data.settings.rate = parseFloat(rate.value);
      document.getElementById('rateTxt').textContent = Number(rate.value).toFixed(2) + '×';
      Store.save();
    };

    const c = todayContent(cur);

    document.getElementById('playAll').onclick = () => {
      const lines = c.dialog.lines.map(l => l.en);
      Speech.speakQueue(lines, {
        formal: true,
        onLine: (i) => {
          document.querySelectorAll('.dialog-line').forEach(e => e.classList.remove('speaking'));
          const el = document.querySelector(`.dialog-line[data-idx="${i}"]`);
          if (el) { el.classList.add('speaking'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
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

    const wh = document.getElementById('wordHistory');
    if (wh) wh.onclick = () => showHistory(cur, 'words');
    const sh = document.getElementById('sentHistory');
    if (sh) sh.onclick = () => showHistory(cur, 'sents');

    document.querySelectorAll('.word-card').forEach(card => {
      card.onclick = () => Speech.speak(card.dataset.say, { rate: 0.75, formal: true });
    });

    document.querySelectorAll('[data-say]').forEach(b => {
      if (b.classList.contains('word-card')) return;
      b.onclick = (e) => { e.stopPropagation(); Speech.speak(b.dataset.say, { formal: true }); };
    });

    document.querySelectorAll('[data-rec]').forEach(b => {
      b.onclick = async (e) => {
        e.stopPropagation();
        const k = b.dataset.rec;
        if (Speech.isRecording()) {
          const wasThis = Speech.recordingKey() === k;
          await Speech.stopRecord();
          if (wasThis) return;   // 结束本条录音
        }
        Speech.stop();
        const ok = await Speech.startRecord(k, (dataUrl) => {
          d().records[k] = dataUrl;
          Store.checkIn(KEY);
          Store.save();
          App.refreshStreak();
          render();
          U.toast('录好了，点 ▶ 听听自己 🍉', 'ok');
        });
        if (ok) {
          b.classList.add('rec-on');
          b.textContent = '⏺';
          U.toast('正在录音…读完后再点一次结束', 'warn');
        }
      };
    });

    document.querySelectorAll('[data-play]').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        Speech.playData(d().records[b.dataset.play]);
      };
    });

    document.getElementById('markDone').onclick = () => {
      const k = doneKey(cur);
      if (d().done[k]) { U.toast('今天这一类已经打过卡啦', 'warn'); return; }
      d().done[k] = true;
      Store.checkIn(KEY);
      Store.save();
      App.refreshStreak();
      const n = TYPES.filter(isDone).length;
      render();
      U.toast(n === 3 ? '三类全部完成！今天口语满分 🍉' : `完成 ${n}/3，继续下一类吧`, 'ok');
    };
  }

  // 历史内容复习（按日期回看当天单词 / 句子）
  function showHistory(type, mode) {
    U.prompt({
      title: '查看哪一天的内容？',
      sub: '输入日期，回看那天给你练的单词 / 句子（用于复习）',
      value: Store.today(), placeholder: 'YYYY-MM-DD',
      okText: '查看',
      onOk: (v) => {
        v = (v || '').trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return U.toast('日期格式不对，用 2026-08-01 这种', 'warn');
        const c = contentForDate(type, v);
        const p = SPEAKING_CORPUS[type];
        const root = document.getElementById('modalRoot');
        const body = mode === 'words'
          ? `<div class="word-grid">${c.words.map(w => `<div class="word-card" data-say="${U.esc(w.en)}"><div class="wc-en">${U.esc(w.en)} <span class="spk">🔊</span></div><div class="wc-ph">${U.esc(w.ph)}</div><div class="wc-cn">${U.esc(w.cn)}</div></div>`).join('')}</div>`
          : c.sentences.map(s => `<div class="sent-item" style="border-left-color:${p.color}"><div class="si-body"><div class="si-en">${U.esc(s.en)}</div><div class="si-cn">${U.esc(s.cn)}</div></div><button class="op-btn" data-say="${U.esc(s.en)}" title="听读音">🔊</button></div>`).join('');
        root.innerHTML = `<div class="modal-mask"><div class="modal" style="max-width:580px">
          <h3>${p.emoji} ${U.esc(p.name)} · ${v.slice(5).replace('-', '月')}日 复习</h3>
          <div class="m-sub">${mode === 'words' ? '当日核心单词' : '当日实用小句子'}（点空白处关闭，🔊 可听）</div>
          <div style="max-height:62vh;overflow:auto;margin-top:12px">${body}</div>
        </div></div>`;
        root.querySelector('.modal-mask').onclick = (e) => { if (e.target.classList.contains('modal-mask')) root.innerHTML = ''; };
        root.querySelectorAll('[data-say]').forEach(b => {
          b.onclick = (e) => { e.stopPropagation(); Speech.speak(b.dataset.say, { formal: true }); };
        });
      }
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
