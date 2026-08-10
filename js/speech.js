/* ==========================================================
   speech.js —— 朗读（听他怎么读）+ 录音跟读 + 录音带跟听
   用的是浏览器自带能力，不用联网、不用装东西。
   建议用 Chrome / Edge 打开，发音最自然。

   本次升级：
   1) 重写朗读队列，修复「点了暂停/停止却跳到下一段继续念」的 bug
   2) 新增 Tape 录音带播放器 —— 分段、进度条可拖动、随时滑到任意位置重听
   3) 优选更自然的中文嗓音（神经网络音色优先），语速更顺
   ========================================================== */

const Speech = (() => {
  const synth = window.speechSynthesis;
  let voices = [];
  let preferredEn = null;
  let preferredZh = null;
  let preferredZhFormal = null;      // 正规官方/四六级播音腔嗓音
  let preferredYue = null;           // 粤语嗓音（Google 粤语 / 香港粤语等）
  let gen = 0;                       // 代际令牌，用来忽略被取消的旧朗读

  const NARRATION_RATE = 0.95;       // 中文朗读默认语速，更顺更自然
  const FORMAL_RATE = 0.92;          // 正规官方/四六级播音腔：语速稳
  const FORMAL_PITCH = 0.95;         // 正规官方/四六级播音腔：音调压低一点，更正式

  function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices() || [];
    // 英文：优先自然女声
    const en = voices.filter(v => /^en(-|_)/i.test(v.lang));
    const likeEn = ['Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Samantha', 'Karen', 'Microsoft Zira'];
    preferredEn = en.find(v => likeEn.some(k => v.name.includes(k)))
      || en.find(v => /US|GB/i.test(v.lang)) || en[0] || null;

    // 中文：优先「神经网络」音色，明显比老嗓音更像人
    const zh = voices.filter(v => /^zh/i.test(v.lang));
    const likeZh = ['Xiaoxiao', 'Yunxi', 'Huihui', 'Yaoyao', 'Ting-Ting', 'Ting', 'Mei',
      'Microsoft Xiaoxiao', 'Microsoft Yunxi', 'Microsoft Huihui', 'Google 普通话', 'Google 粤语'];
    preferredZh = zh.find(v => likeZh.some(k => v.name.includes(k)))
      || zh.find(v => /neural|online/i.test(v.name))
      || zh[0] || null;

    // 正规官方 / 四六级播音腔：偏「新闻主播」式嗓音（男声云希、中性慧慧优先，
    // 其后是带 neural/online 的字正腔圆嗓音）
    const likeZhFormal = ['Yunxi', '云希', 'Huihui', '慧慧', 'Kangkang', 'Xiaoxiao', 'Yaoyao',
      'Microsoft Yunxi', 'Microsoft Huihui', 'Microsoft Xiaoxiao', 'Microsoft Kangkang',
      'Google 普通话', 'Ting-Ting', 'Google 粤语'];
    preferredZhFormal = zh.find(v => likeZhFormal.some(k => v.name.includes(k)))
      || zh.find(v => /neural|online|broadcast|news/i.test(v.name))
      || preferredZh || zh[0] || null;

    // 粤语：优先真正的粤语嗓音（lang 含 zh-HK / yue，或名字含「粤/廣東/广东/Cantonese」）
    const yue = voices.filter(v => /zh-HK|yue|粤|廣東|广东|Cantonese/i.test(v.lang + ' ' + v.name));
    preferredYue = yue[0] || null;
  }

  if (synth) {
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }

  function pickVoice(lang, formal) {
    if (lang === 'zh-HK' || lang === 'yue' || lang === 'zh-yue') return preferredYue || preferredZh || preferredEn;
    if (!lang || /zh/.test(lang)) return (formal ? preferredZhFormal : preferredZh) || preferredEn;
    return preferredEn || preferredZh;
  }

  function buildUtterance(text, opt) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = opt.lang || 'zh-CN';
    const formal = !!opt.formal;
    // 中文用更顺的语速，英文沿用设置；正规播音腔用更稳的语速与略低的音高
    u.rate = opt.rate != null ? opt.rate
      : (/zh/.test(u.lang) ? (formal ? FORMAL_RATE : NARRATION_RATE) : (Store.data.settings.rate || 0.9));
    u.pitch = opt.pitch != null ? opt.pitch : (formal ? FORMAL_PITCH : 1);
    const v = opt.voice || pickVoice(u.lang, formal);
    if (v) u.voice = v;
    return u;
  }

  let current = null;

  // ---------- 浮层「停止朗读」按钮（随时可停） ----------
  let stopBtn = null;
  function ensureStopBtn() {
    if (stopBtn) return stopBtn;
    const b = document.createElement('button');
    b.id = 'speechStop';
    b.className = 'speech-stop';
    b.innerHTML = '⏹ 停止朗读';
    b.onclick = () => { stop(); U.toast('已停止朗读', 'warn'); };
    document.body.appendChild(b);
    stopBtn = b;
    return b;
  }
  function showStop() { ensureStopBtn().classList.add('show'); }
  function hideStop() { if (stopBtn) stopBtn.classList.remove('show'); }

  /** 朗读一段（口语跟读、单词卡片用） */
  function speak(text, opt = {}) {
    if (!synth) { U.toast('这个浏览器不支持朗读，建议用 Chrome 或 Edge', 'warn'); return; }
    stop();
    const u = buildUtterance(text, opt);
    u.onstart = () => { showStop(); opt.onStart && opt.onStart(); };
    u.onend = () => { current = null; hideStop(); opt.onEnd && opt.onEnd(); };
    u.onerror = () => { current = null; hideStop(); opt.onEnd && opt.onEnd(); };
    current = u;
    synth.speak(u);
  }

  /** 逐句朗读（连读单词等小场景用，支持真正的停止/暂停） */
  function speakQueue(lines, opt = {}) {
    if (!synth) { U.toast('这个浏览器不支持朗读，建议用 Chrome 或 Edge', 'warn'); return; }
    stop();
    let i = 0;
    const myGen = ++gen;
    const next = () => {
      if (myGen !== gen) return;          // 已被取消
      if (i >= lines.length) { hideStop(); opt.onAll && opt.onAll(); return; }
      const item = lines[i];
      const text = typeof item === 'string' ? item : item.text;
      const u = buildUtterance(text, opt);
      const idx = i;
      u.onstart = () => opt.onLine && opt.onLine(idx);
      u.onend = () => {
        if (myGen !== gen) return;        // 取消/暂停后不再前进
        i++; next();
      };
      u.onerror = () => {
        if (myGen !== gen) return;
        i++; next();
      };
      current = u;
      synth.speak(u);
    };
    next();
  }

  function stop() {
    if (synth) { gen++; synth.cancel(); }   // 代际 +1，旧的 onend 全部失效
    current = null;
    hideStop();
    window.dispatchEvent(new Event('speech-stop'));   // 让录音带播放器同步停止
  }

  function speaking() { return synth ? synth.speaking : false; }
  function availableVoices(lang) {
    if (!synth) return [];
    if (lang === 'zh') return voices.filter(v => /^zh/i.test(v.lang));
    if (lang === 'en') return voices.filter(v => /^en/i.test(v.lang));
    return voices.slice();
  }

  // ==========================================================
  //  Tape —— 录音带播放器（分段 / 暂停 / 拖动定位 / 回拉重听）
  // ==========================================================
  const Tape = (() => {
    function create() {
      let segs = [];
      let idx = 0;
      let paused = false;
      let stopped = true;
      let rate = NARRATION_RATE;
      let voice = null;
      let myGen = 0;
      let cb = {};

      function emitProgress(frac) {
        cb.onProgress && cb.onProgress(Math.max(0, Math.min(1, frac)));
      }
      function segProgress() {
        if (!segs.length) return 0;
        return Math.min(1, idx / segs.length);
      }

      function speakCurrent() {
        if (idx < 0) idx = 0;
        if (idx >= segs.length) { stopped = true; paused = false; cb.onState && cb.onState('stopped'); cb.onEnd && cb.onEnd(); return; }
        const item = segs[idx];
        const u = buildUtterance(item.text, { lang: item.lang || 'zh-CN', rate, voice });
        myGen = ++gen;
        const myLocal = myGen;
        u.onstart = () => { cb.onLine && cb.onLine(idx); cb.onState && cb.onState('playing'); };
        u.onboundary = (e) => {
          if (myLocal !== gen) return;
          const len = Math.max(1, (item.text || '').length);
          emitProgress((idx + (e.charIndex || 0) / len) / segs.length);
        };
        u.onend = () => {
          if (myLocal !== gen) return;       // 已被取消 / 暂停
          if (paused || stopped) return;
          idx++;
          emitProgress(segProgress());
          speakCurrent();
        };
        u.onerror = () => {
          if (myLocal !== gen) return;
          if (paused || stopped) return;
          idx++;
          emitProgress(segProgress());
          if (idx < segs.length) speakCurrent();
        };
        current = u;
        synth.speak(u);
      }

      function play(from) {
        if (!synth) { U.toast('这个浏览器不支持朗读，建议用 Chrome 或 Edge', 'warn'); return; }
        if (from != null) idx = from;
        if (idx >= segs.length) idx = 0;
        stopped = false; paused = false;
        speakCurrent();
      }

      function pause() {
        if (stopped) return;
        paused = true;
        gen++; synth.cancel();
        cb.onState && cb.onState('paused');
      }
      function resume() {
        if (stopped) return;
        paused = false;
        speakCurrent();
      }
      function stopAll() {
        stopped = true; paused = false;
        gen++; synth.cancel();
        emitProgress(segProgress());
        cb.onState && cb.onState('stopped');
      }
      function seek(frac, autoplay) {
        gen++; synth.cancel();
        const target = Math.max(0, Math.min(segs.length - 1, Math.floor(frac * segs.length)));
        idx = target;
        emitProgress(segProgress());
        cb.onLine && cb.onLine(idx);
        if (autoplay || (!stopped && !paused)) {
          stopped = false; paused = false;
          speakCurrent();
          cb.onState && cb.onState('playing');
        } else {
          cb.onState && cb.onState(paused ? 'paused' : 'stopped');
        }
      }
      // 拖动时只预览位置、不重新朗读，松手再决定要不要播
      function preview(frac) {
        gen++; synth.cancel();
        idx = Math.max(0, Math.min(segs.length - 1, Math.floor(frac * segs.length)));
        emitProgress(segProgress());
        cb.onLine && cb.onLine(idx);
        cb.onState && cb.onState(paused ? 'paused' : (stopped ? 'stopped' : 'playing'));
      }
      function setRate(r) { rate = r; }
      function setVoice(v) { voice = v; }
      function load(list, opt) {
        segs = list; idx = 0; paused = false; stopped = true;
        if (opt && opt.rate != null) rate = opt.rate;
        cb = opt || {};
        emitProgress(0);
      }
      function getInfo() { return { idx, total: segs.length, paused, stopped }; }

      return { play, pause, resume, stop: stopAll, seek, preview, setRate, setVoice, load, getInfo };
    }
    return { create };
  })();

  // ==========================================================
  //  makeCassette —— 可复用的「录音带」组件（播客/听力通用）
  //  opts: { segments:[{text,lang}], lang, rate, onLine }
  //  返回 { el, tape, load(segments,opt), destroy() }
  // ==========================================================
  function makeCassette(opts) {
    const tape = Tape.create();
    const onStopReq = () => tape.stop();
    window.addEventListener('speech-stop', onStopReq);
    const wrap = U.el('div', 'cassette');
    wrap.innerHTML = `
      <div class="cass-visual">
        <div class="cass-reel"><span></span></div>
        <div class="cass-brand">
          <div class="cass-title">🎞️ ${U.esc(opts.title || '音频跟听')}</div>
          <div class="cass-state" id="cState">准备好了，点播放开始</div>
        </div>
        <div class="cass-reel"><span></span></div>
      </div>
      <div class="cass-controls">
        <button class="cass-play" id="cPlay" title="播放 / 暂停">▶</button>
        <div class="cass-track" id="cTrack">
          <div class="cass-fill" id="cFill"></div>
          <div class="cass-knob" id="cKnob"></div>
        </div>
        <div class="cass-time" id="cTime">1 / ${opts.segments.length}</div>
      </div>
      <div class="cass-foot">
        <div class="speed-ctrl">语速 <input type="range" id="cRate" min="0.6" max="1.2" step="0.05" value="${opts.rate || NARRATION_RATE}">
          <span id="cRateTxt">${(opts.rate || NARRATION_RATE).toFixed(2)}×</span></div>
        <div class="cass-voices" id="cVoices"></div>
      </div>`;

    const $ = (id) => wrap.querySelector(id);
    const playBtn = $('#cPlay'), fill = $('#cFill'), knob = $('#cKnob'),
      timeEl = $('#cTime'), stateEl = $('#cState'), track = $('#cTrack'),
      rateEl = $('#cRate'), rateTxt = $('#cRateTxt'), voicesBox = $('#cVoices');

    let dragging = false, wasPlaying = false;

    // 嗓音选择（优先中文）
    const vlist = availableVoices('zh');
    if (vlist.length > 1) {
      voicesBox.innerHTML = '<select class="input sm" id="cVoice">' +
        vlist.map(v => `<option value="${U.esc(v.name)}">${U.esc(v.name)}</option>`).join('') + '</select>';
      const sel = voicesBox.querySelector('#cVoice');
      sel.onchange = () => { tape.setVoice(vlist.find(v => v.name === sel.value) || null); };
    }

    function setPlayIcon(s) {
      playBtn.textContent = s === 'playing' ? '⏸' : '▶';
      wrap.classList.toggle('is-playing', s === 'playing');
    }

    tape.load(opts.segments, {
      rate: opts.rate || NARRATION_RATE,
      onProgress: (frac) => {
        const pct = (frac * 100).toFixed(2);
        fill.style.width = pct + '%';
        knob.style.left = pct + '%';
      },
      onLine: (i) => {
        timeEl.textContent = `${i + 1} / ${opts.segments.length}`;
        opts.onLine && opts.onLine(i);
      },
      onState: (s) => {
        setPlayIcon(s);
        stateEl.textContent = s === 'playing' ? '正在朗读…' : s === 'paused' ? '已暂停 · 可拖动继续' : '已停止';
        opts.onState && opts.onState(s);
      },
      onEnd: () => { stateEl.textContent = '播放完毕 ✓'; }
    });

    playBtn.onclick = () => {
      const info = tape.getInfo();
      if (info.stopped) tape.play(0);
      else if (info.paused) tape.resume();
      else tape.pause();
    };

    rateEl.oninput = () => {
      rateTxt.textContent = Number(rateEl.value).toFixed(2) + '×';
      tape.setRate(Number(rateEl.value));
    };

    // 进度条拖动：松手时若之前在播放则从该位置继续
    function fracFromEvent(e) {
      const r = track.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      return Math.max(0, Math.min(1, x / r.width));
    }
    function onDown(e) {
      dragging = true;
      const info = tape.getInfo();
      wasPlaying = !info.stopped && !info.paused;
      if (wasPlaying) tape.pause();
      tape.preview(fracFromEvent(e));   // 拖动中只预览位置
      e.preventDefault();
    }
    function onMove(e) { if (dragging) tape.preview(fracFromEvent(e)); }
    function onUp(e) {
      if (!dragging) return;
      dragging = false;
      const f = fracFromEvent(e.changedTouches ? { clientX: e.changedTouches[0].clientX } : e);
      tape.seek(f, wasPlaying);             // 之前在播放 → 从新位置继续
    }
    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    track.addEventListener('touchstart', onDown, { passive: false });
    track.addEventListener('touchmove', onMove, { passive: false });
    track.addEventListener('touchend', onUp);

    function destroy() {
      tape.stop();
      window.removeEventListener('speech-stop', onStopReq);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }

    return { el: wrap, tape, destroy };
  }

  // ---------------- 录音跟读 ----------------
  let recorder = null, chunks = [], stream = null, recKey = null;

  async function startRecord(key, onStop) {
    if (recorder) await stopRecord();
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      U.toast('浏览器不支持录音，请用 Chrome / Edge', 'warn');
      return false;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      U.toast('需要允许使用麦克风才能跟读哦', 'warn');
      return false;
    }
    chunks = [];
    recKey = key;
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const rd = new FileReader();
      rd.onload = () => onStop && onStop(rd.result);
      rd.readAsDataURL(blob);
      if (stream) stream.getTracks().forEach(t => t.stop());
      stream = null; recorder = null;
    };
    recorder.start();
    return true;
  }

  function stopRecord() {
    return new Promise((res) => {
      if (!recorder) return res();
      const r = recorder;
      const old = r.onstop;
      r.onstop = (e) => { old && old(e); res(); };
      r.stop();
    });
  }

  function isRecording() { return !!recorder; }
  function recordingKey() { return recKey; }

  function playData(dataUrl) {
    stop();
    const a = new Audio(dataUrl);
    a.play().catch(() => U.toast('播放失败', 'err'));
    return a;
  }

  return {
    speak, speakQueue, stop, speaking,
    makeCassette, availableVoices,
    startRecord, stopRecord, isRecording, recordingKey, playData
  };
})();
