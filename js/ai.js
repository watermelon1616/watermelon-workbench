/* ==========================================================
   watermelon的工作台 · AI 助手
   · 右上角浮动（闪电头像），可折叠
   · Enter 发送 / Shift+Enter 换行
   · 真 AI 生成：连接用户自填的 OpenAI 兼容后端（数据只发到你填的接口）
   · 没填 key 时走本地引擎（基于你的真实数据联动，不联网）
   · 设置界面：可上下滚动浏览，内置常见服务商一键填充 + 取 Key 步骤 + 测试连接
   ========================================================== */
const FishAI = (() => {
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
  // 风格只是提示词，可任意扩展（用户也可在输入框直接写明风格）
  const STYLES = ['高级', '清晰', '清新', '官方', '温暖', '专业', '短视频'];

  // 常见 OpenAI 兼容服务商：一键填充接口 + 取 Key 步骤（真实可用地址）
  const PROVIDERS = [
    {
      id: 'deepseek', name: 'DeepSeek', color: '#4D6BFE',
      baseURL: 'https://api.deepseek.com/v1', model: 'deepseek-chat',
      keyUrl: 'https://platform.deepseek.com/api_keys',
      steps: [
        '打开 DeepSeek 开放平台并登录（platform.deepseek.com）',
        '进入「API Keys」页面，点「创建 API Key」',
        '复制生成的 sk- 开头的密钥',
        '回到本设置，粘贴到「API Key」框，点「测试连接」'
      ]
    },
    {
      id: 'qwen', name: '通义千问', color: '#615CED',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus',
      keyUrl: 'https://dashscope.console.aliyun.com/apiKey',
      steps: [
        '登录阿里云百炼 / DashScope 控制台',
        '左侧「API Key 管理」→「创建 API Key」',
        '复制 sk- 开头的密钥',
        '回到本设置，粘贴到「API Key」框，点「测试连接」'
      ]
    },
    {
      id: 'kimi', name: 'Kimi (月之暗面)', color: '#111827',
      baseURL: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k',
      keyUrl: 'https://platform.moonshot.cn/console/api-keys',
      steps: [
        '打开 Kimi 开放平台并登录（platform.moonshot.cn）',
        '进入「API Key 管理」→「新建」',
        '复制 sk- 开头的密钥',
        '回到本设置，粘贴后点「测试连接」'
      ]
    },
    {
      id: 'openai', name: 'OpenAI', color: '#10A37F',
      baseURL: 'https://api.openai.com/v1', model: 'gpt-4o-mini',
      keyUrl: 'https://platform.openai.com/api-keys',
      steps: [
        '登录 OpenAI 平台（platform.openai.com）',
        '右上「API Keys」→「Create new secret key」',
        '复制 sk- 开头的密钥（只显示一次）',
        '回到本设置，粘贴后点「测试连接」'
      ]
    },
    {
      id: 'custom', name: '自定义', color: '#8A6D3B',
      baseURL: '', model: '',
      keyUrl: '',
      steps: [
        '填入你自己的 OpenAI 兼容接口地址（通常以 /v1 结尾）',
        '填入模型名与 API Key',
        '点「测试连接」验证可用性'
      ]
    }
  ];

  const fmt = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  const NAME = 'watermelon的工作台';

  let root, panel, log, ta, styleRow, modeEl, setEl, sendBtn, chatEl, connEl, testBtn, providersEl, stepsEl, openKeyBtn, setStylesEl, eyeBtn;
  let curStyle = '';
  let busy = false;
  let curProvider = PROVIDERS[0];

  function init() {
    // 浮动头像（右上角）
    const fab = U.el('button', 'ai-fab', '⚡');
    fab.id = 'aiFab';
    fab.title = NAME;
    fab.onclick = toggle;
    document.body.appendChild(fab);

    // 面板
    panel = U.el('section', 'ai-panel');
    panel.id = 'aiPanel';
    panel.innerHTML = `
      <div class="ai-head">
        <div class="ai-avatar">⚡</div>
        <div class="ai-htext">
          <div class="ai-name">${NAME}</div>
          <div class="ai-status"><span class="ai-dot"></span><span id="aiOnline">在线</span></div>
        </div>
        <button class="ai-gear" id="aiGear" title="AI 设置">⚙</button>
        <button class="ai-collapse" id="aiClose" title="收起">▾</button>
      </div>
      <div class="ai-mode" id="aiMode"></div>

      <div class="ai-body" id="aiChat">
        <div class="ai-log" id="aiLog"></div>
        <div class="ai-style-row" id="aiStyles"></div>
        <div class="ai-input-wrap">
          <textarea id="aiIdea" rows="2" placeholder="说点什么，或写下想法让 AI 帮你写文案…（Enter 发送，Shift+Enter 换行）"></textarea>
          <button class="ai-send" id="aiSend">发送</button>
        </div>
      </div>

      <div class="ai-set" id="aiSet" hidden>
        <div class="ai-set-top">
          <button class="ai-back" id="aiBack">← 返回</button>
          <span class="ai-set-title">AI 设置</span>
        </div>
        <div class="ai-set-scroll" id="aiSetScroll">
          <section class="ai-sec">
            <h4>① 连接状态</h4>
            <div id="aiConn" class="ai-conn off">未连接真·AI</div>
            <button class="btn sm" id="aiTest">测试连接</button>
            <div class="ai-sub" id="aiTestMsg"></div>
          </section>

          <section class="ai-sec">
            <h4>② 接口与密钥</h4>
            <label>接口地址</label>
            <input id="aiBase" class="input" placeholder="https://api.deepseek.com/v1" />
            <label>API Key</label>
            <div class="ai-key-row">
              <input id="aiKey" class="input" type="password" placeholder="sk-..." />
              <button class="ai-eye" id="aiEye" title="显示/隐藏">👁</button>
            </div>
            <label>模型名</label>
            <input id="aiModel" class="input" placeholder="deepseek-chat" />
          </section>

          <section class="ai-sec">
            <h4>③ 选服务商（一键填接口）</h4>
            <div class="ai-providers" id="aiProviders"></div>
          </section>

          <section class="ai-sec" id="aiStepsSec">
            <h4>④ 获取 API Key 步骤</h4>
            <div id="aiSteps" class="ai-steps"></div>
            <button class="btn sm" id="aiOpenKey">打开官网获取 Key</button>
          </section>

          <section class="ai-sec">
            <h4>⑤ 默认风格（可选）</h4>
            <div class="ai-set-styles" id="aiSetStyles"></div>
            <div class="ai-sub">不选则每次手动选风格；选中后生成默认套用该风格。</div>
          </section>

          <section class="ai-sec">
            <div class="ai-set-ops">
              <button class="btn sm" id="aiSetSave">保存配置</button>
              <button class="btn sm ghost" id="aiSetClear">清空</button>
            </div>
            <div class="ai-sub">数据只发到你填的接口，不经第三方。留空则走本地引擎（基于你的真实数据改写）。</div>
          </section>
        </div>
      </div>`;
    document.body.appendChild(panel);

    root = fab;
    log = panel.querySelector('#aiLog');
    ta = panel.querySelector('#aiIdea');
    styleRow = panel.querySelector('#aiStyles');
    modeEl = panel.querySelector('#aiMode');
    setEl = panel.querySelector('#aiSet');
    chatEl = panel.querySelector('#aiChat');
    sendBtn = panel.querySelector('#aiSend');
    connEl = panel.querySelector('#aiConn');
    testBtn = panel.querySelector('#aiTest');
    providersEl = panel.querySelector('#aiProviders');
    stepsEl = panel.querySelector('#aiSteps');
    openKeyBtn = panel.querySelector('#aiOpenKey');
    setStylesEl = panel.querySelector('#aiSetStyles');
    eyeBtn = panel.querySelector('#aiEye');

    panel.querySelector('#aiClose').onclick = () => setPanel(false);
    panel.querySelector('#aiGear').onclick = () => openSettings();
    panel.querySelector('#aiBack').onclick = () => closeSettings();
    sendBtn.onclick = () => send();

    // 风格 chips
    styleRow.innerHTML = STYLES.map(s => `<button class="ai-sty" data-s="${s}">${s}</button>`).join('')
      + `<button class="ai-sty ai-sty-cus" data-s="__cus">+ 自定义</button>`;
    styleRow.querySelectorAll('.ai-sty').forEach(b => {
      b.onclick = () => {
        const s = b.dataset.s;
        if (s === '__cus') {
          const v = prompt('输入你想要的风格（例如：小红书种草风 / 周报体 / 给领导的）');
          if (v && v.trim()) { curStyle = v.trim(); renderStyles(); }
          return;
        }
        curStyle = (curStyle === s) ? '' : s;
        renderStyles();
      };
    });

    // 发送快捷键
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });

    // 设置交互
    bindSettings();

    loadSettings();
    renderMode();
    renderStyles();
    renderProviders();
    renderSteps(curProvider);

    // 首次进入给一条欢迎语（仅当已展开时）
    bot(`你好，我是 <b>${NAME}</b> 的 AI 助手 ⚡<br>可以直接跟我聊天，或写下想法让我帮你写文案。选个风格再发，会按那个语气来。想接真·AI，点右上角 ⚙ 设置。`);

    setPanel(true); // 默认展开，fab 收起
  }

  function renderStyles() {
    styleRow.querySelectorAll('.ai-sty').forEach(b => {
      const s = b.dataset.s;
      if (s === '__cus') { b.classList.toggle('on', false); b.textContent = curStyle ? `✎ ${curStyle}` : '+ 自定义'; return; }
      b.classList.toggle('on', curStyle === s);
    });
  }

  function renderMode() {
    if (Store.hasAI()) {
      modeEl.className = 'ai-mode on';
      modeEl.innerHTML = `🟢 已连接真·AI（${U.esc(Store.getAI().model || '')}）`;
      connEl.className = 'ai-conn on';
      connEl.textContent = '已连接真·AI';
    } else {
      modeEl.className = 'ai-mode off';
      modeEl.innerHTML = `🟡 本地引擎（点 ⚙ 填 key 开启真·AI）`;
      connEl.className = 'ai-conn off';
      connEl.textContent = '未连接真·AI';
    }
  }

  function loadSettings() {
    const a = Store.getAI() || {};
    panel.querySelector('#aiBase').value = a.baseURL || '';
    // API Key 由服务端单独保管（data/.secrets.json），前端只拿到占位符，不显示真值
    const keyEl = panel.querySelector('#aiKey');
    if (a.apiKey === '__stored__') {
      keyEl.value = '';
      keyEl.placeholder = '已安全保存 · 留空即不修改';
    } else {
      keyEl.value = a.apiKey || '';
      keyEl.placeholder = 'sk-...';
    }
    panel.querySelector('#aiModel').value = a.model || 'deepseek-chat';
    curStyle = a.defaultStyle || '';
    // 反推当前服务商
    const hit = PROVIDERS.find(p => p.baseURL && p.baseURL === a.baseURL && p.model === a.model);
    curProvider = hit || PROVIDERS.find(p => p.id === 'custom');
    renderProviders();
    renderSteps(curProvider);
    renderSetStyles();
  }

  function renderProviders() {
    providersEl.innerHTML = PROVIDERS.map(p => {
      const on = p.id === curProvider.id ? ' on' : '';
      const dot = p.color ? `<i style="background:${p.color}"></i>` : '';
      return `<button class="ai-prov${on}" data-id="${p.id}">${dot}${p.name}</button>`;
    }).join('');
    providersEl.querySelectorAll('.ai-prov').forEach(b => {
      b.onclick = () => {
        const p = PROVIDERS.find(x => x.id === b.dataset.id);
        curProvider = p;
        if (p.baseURL) {
          panel.querySelector('#aiBase').value = p.baseURL;
          panel.querySelector('#aiModel').value = p.model;
        }
        renderProviders();
        renderSteps(p);
      };
    });
  }

  function renderSteps(p) {
    if (!p) return;
    stepsEl.innerHTML = p.steps.map((s, i) => `<div class="ai-step"><b>${i + 1}</b><span>${U.esc(s)}</span></div>`).join('');
    if (p.keyUrl) {
      openKeyBtn.hidden = false;
      openKeyBtn.dataset.url = p.keyUrl;
    } else {
      openKeyBtn.hidden = true;
    }
  }

  function renderSetStyles() {
    setStylesEl.innerHTML = STYLES.map(s => `<button class="ai-sty ${curStyle === s ? 'on' : ''}" data-s="${s}">${s}</button>`).join('')
      + `<button class="ai-sty ${!curStyle ? 'on' : ''}" data-s="__none">不预设</button>`;
    setStylesEl.querySelectorAll('.ai-sty').forEach(b => {
      b.onclick = () => {
        const s = b.dataset.s;
        curStyle = (s === '__none') ? '' : s;
        renderSetStyles();
      };
    });
  }

  function openSettings() {
    chatEl.hidden = true;
    setEl.hidden = false;
    panel.querySelector('#aiSetScroll').scrollTop = 0;
    loadSettings();
    renderMode();
  }
  function closeSettings() {
    setEl.hidden = true;
    chatEl.hidden = false;
  }

  function bindSettings() {
    // 显示/隐藏 key
    eyeBtn.onclick = () => {
      const k = panel.querySelector('#aiKey');
      k.type = k.type === 'password' ? 'text' : 'password';
    };
    // 测试连接
    testBtn.onclick = runTest;
    // 打开官网获取 Key
    openKeyBtn.onclick = () => openExternal(openKeyBtn.dataset.url);

    panel.querySelector('#aiSetSave').onclick = () => {
      // 输入框留空 = 沿用服务端已保存的 Key，不会误清空
      const typed = panel.querySelector('#aiKey').value.trim();
      const prev = (Store.getAI() || {}).apiKey || '';
      Store.setAI({
        baseURL: panel.querySelector('#aiBase').value.trim(),
        apiKey: typed || (prev === '__stored__' ? '__stored__' : ''),
        model: panel.querySelector('#aiModel').value.trim() || 'deepseek-chat',
        defaultStyle: curStyle
      });
      renderMode();
      closeSettings();
      bot(Store.hasAI() ? '已连接真·AI ✅ 现在生成的文案由模型实时撰写。' : '已保存（当前为空，将使用本地引擎）。');
    };
    panel.querySelector('#aiSetClear').onclick = () => {
      Store.setAI({ baseURL: '', apiKey: '', model: 'deepseek-chat', defaultStyle: '' });
      loadSettings(); renderMode();
      bot('已清空 AI 配置，回到本地引擎。');
    };
  }

  async function runTest() {
    const baseURL = panel.querySelector('#aiBase').value.trim();
    // 留空则用服务端已保管的 Key（占位符由服务端解析成真值）
    const stored = (Store.getAI() || {}).apiKey === '__stored__';
    const apiKey = panel.querySelector('#aiKey').value.trim() || (stored ? '__stored__' : '');
    const model = panel.querySelector('#aiModel').value.trim() || 'deepseek-chat';
    const msg = panel.querySelector('#aiTestMsg');
    if (!baseURL || !apiKey) {
      msg.textContent = '请先填写接口地址与 API Key';
      msg.className = 'ai-sub warn';
      return;
    }
    testBtn.disabled = true;
    msg.textContent = '正在测试连接…';
    msg.className = 'ai-sub';
    try {
      const r = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseURL, apiKey, model })
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        msg.textContent = `✅ 连接成功（${j.ms || ''}ms），接口可用`;
        msg.className = 'ai-sub ok';
      } else {
        msg.textContent = '❌ ' + (j.error || ('HTTP ' + r.status));
        msg.className = 'ai-sub warn';
      }
    } catch (e) {
      msg.textContent = '❌ 请求失败：' + e.message + '（本地服务模式才支持测试，浏览器版需先启动本地服务）';
      msg.className = 'ai-sub warn';
    } finally {
      testBtn.disabled = false;
    }
  }

  // 在桌面应用里用系统浏览器打开链接；网页版用新标签页
  function openExternal(url) {
    if (!url) return;
    if (window.electronAPI && window.electronAPI.openExternal) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank', 'noopener');
    }
  }

  function toggle() { setPanel(panel.classList.contains('hidden')); }
  function setPanel(open) {
    if (open) { panel.classList.remove('hidden'); root.classList.add('hide'); }
    else { panel.classList.add('hidden'); root.classList.remove('hide'); }
  }

  function bot(html) {
    const m = U.el('div', 'ai-msg bot', `<div class="ai-ava">⚡</div><div class="ai-txt">${html}</div>`);
    log.appendChild(m); log.scrollTop = log.scrollHeight;
    return m;
  }
  function user(html) {
    const m = U.el('div', 'ai-msg me', `<div class="ai-txt">${html}</div>`);
    log.appendChild(m); log.scrollTop = log.scrollHeight;
    return m;
  }
  function loading(text) {
    const m = U.el('div', 'ai-msg bot', `<div class="ai-ava">⚡</div><div class="ai-txt">${text || '思考中…'}</div>`);
    log.appendChild(m); log.scrollTop = log.scrollHeight;
    return m;
  }

  // ---------- 发送 ----------
  function send() {
    const text = ta.value.trim();
    if (!text || busy) return;
    user(U.esc(text));
    ta.value = '';
    const style = curStyle || '';
    busy = true; sendBtn.disabled = true;
    const lm = loading('AI 正在思考…');

    gen(text, style).then((out) => {
      lm.querySelector('.ai-txt').innerHTML = out;
    }).catch((err) => {
      lm.querySelector('.ai-txt').innerHTML = `⚠️ ${U.esc(err.message || err)}<br><span class="ai-sub">若想用真·AI，点 ⚙ 填一个 OpenAI 兼容接口。</span>`;
    }).finally(() => {
      busy = false; sendBtn.disabled = false; log.scrollTop = log.scrollHeight;
    });
  }

  // ---------- 生成：真 AI 或本地引擎 ----------
  async function gen(text, style) {
    if (Store.hasAI()) {
      const sys = buildSystem(style);
      const messages = [
        { role: 'system', content: sys },
        { role: 'user', content: text }
      ];
      const a = Store.getAI();
      let r;
      try {
        r = await fetch('/api/gen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, baseURL: a.baseURL, apiKey: a.apiKey, model: a.model })
        });
      } catch (e) {
        return `本地模式可用，但真·AI 请求失败（可能没在本地服务下运行）：<br>${U.esc(e.message)}<br><br>` + localGen(text, style);
      }
      if (!r.ok) {
        let msg = '请求失败';
        try { msg = (await r.json()).error || msg; } catch (e) {}
        return `⚠️ ${U.esc(msg)}<br><br>已回退本地引擎：<br>` + localGen(text, style);
      }
      const j = await r.json();
      return (j.text || '（空响应）');
    }
    // 本地引擎
    return localGen(text, style);
  }

  function buildSystem(style) {
    const s = style ? `用户希望的文案风格是「${style}」。` : '';
    const ds = (Store.getAI() && Store.getAI().defaultStyle) ? '' : '';
    return `你是「watermelon的工作台」的 AI 助手，一个贴心、有审美的中文个人效率助理。${s}
要求：
1. 直接输出成品内容，不要使用「好的，这是…」「以下是…」这类客套开场白。
2. 除非用户要求，否则不要用引号或代码块包裹正文。
3. 文案要自然、有信息量、可执行；涉及计划时给出具体可落地的步骤。
4. 语言简洁克制，不堆砌辞藻。`;
  }

  // ---------- 本地引擎（兜底，联网/密钥都不需要） ----------
  function localGen(text, style) {
    const t = text.replace(/\s+/g, ' ').trim();
    if (style === '高级') {
      return `<b>✨ 高级版</b><br><br>${U.esc(t)}<br><br>——更克制地表达：删去冗余，留下主张；让每个词都承担信息。质感来自你敢省略什么，而非堆砌什么。`;
    }
    if (style === '清晰') {
      return `<b>🔍 清晰版</b><br><br>核心：${U.esc(t)}<br><br>一句话讲清：是什么、为什么、下一步做什么。去掉修饰，只留主干。`;
    }
    if (style === '清新') {
      return `<b>🌿 清新版</b><br><br>想把这个分享给你呀～<br>${U.esc(t)}<br><br>慢慢来，比较快，一起把它变好看 ☁️`;
    }
    if (style === '官方') {
      return `<b>📜 官方版</b><br><br>【事项】${U.esc(t)}<br>【说明】现就上述事项予以说明，请相关方知悉并按流程落实。<br>【落款】${U.todayCN().split(' · ')[0]}　（工作台本地生成）`;
    }
    if (style === '专业') {
      return `<b>📈 专业版</b><br><br>${U.esc(t)}<br><br>要点拆解：背景 → 动作 → 结果预期。用数据说话，结论先行。`;
    }
    if (style === '温暖') {
      return `<b>🤍 温暖版</b><br><br>想跟你说：${U.esc(t)}<br><br>你已经做得很好了，这一步只是顺着心意往前走，不急 🌟`;
    }
    // 默认：基于真实数据的联动改写
    return `<b>📝 文案草稿（本地引擎）</b><br><br>${U.esc(t)}<br><br><span class="ai-sub">提示：连真·AI 后这里会由模型实时撰写，语气更自然。点 ⚙ 填一个 OpenAI 兼容接口即可。</span>`;
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', FishAI.init);
