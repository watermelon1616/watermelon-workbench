/* ==========================================================
   sync.js —— 云端同步（Supabase）
   方案③：本地优先 + 云端数据库，跨设备数据通用。
   - 数据先写浏览器 localStorage（秒响应、断网可用）
   - 登录后异步把整份快照同步到 Supabase（最后写入为准）
   - 状态：disconnected / connecting / connected / syncing / error
   仅在用户开启同步时才会动态加载 supabase-js（不开启则零外部依赖）。
   ========================================================== */

const Sync = (() => {
  const CFG_KEY = 'wb_sb_cfg';     // { url, anonKey }
  const AUTO_KEY = 'wb_sb_auto';   // '1' | '0'

  let client = null;
  let cfg = null;
  let sess = null;                 // 当前会话（来自 supabase auth）
  let auto = true;
  let status = 'disconnected';
  let statusText = '未连接云端';
  let listeners = [];
  let libPromise = null;

  // ---------- 配置读写 ----------
  function loadCfg() {
    try { cfg = JSON.parse(localStorage.getItem(CFG_KEY) || 'null'); } catch (e) { cfg = null; }
    auto = localStorage.getItem(AUTO_KEY) !== '0';
  }
  function saveCfg() { localStorage.setItem(CFG_KEY, JSON.stringify(cfg || {})); }

  function setStatus(s, text) {
    status = s; statusText = text;
    listeners.forEach(fn => { try { fn(status, statusText); } catch (e) {} });
  }
  function onStatus(fn) { listeners.push(fn); fn(status, statusText); }

  // ---------- supabase-js（按需从 CDN 加载） ----------
  async function getLib() {
    if (window.__sbLib) return window.__sbLib;
    if (!libPromise) {
      libPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
        .then(m => { window.__sbLib = m; return m; });
    }
    return libPromise;
  }

  async function ensureClient() {
    if (client) return client;
    if (!cfg || !cfg.url || !cfg.anonKey) throw new Error('未配置 Supabase 地址和密钥');
    const { createClient } = await getLib();
    client = createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
    return client;
  }

  function isConfigured() { return !!(cfg && cfg.url && cfg.anonKey); }
  function isSignedIn() { return !!(sess && sess.user); }
  function isAuto() { return auto; }
  function setAuto(v) { auto = !!v; localStorage.setItem(AUTO_KEY, auto ? '1' : '0'); }
  function getConfig() { return cfg ? { url: cfg.url || '', anonKey: cfg.anonKey || '' } : { url: '', anonKey: '' }; }
  function userEmail() { return sess && sess.user ? (sess.user.email || '') : ''; }

  // ---------- 初始化：恢复会话 / 处理邮件链接回调 ----------
  async function init() {
    loadCfg();
    if (!isConfigured()) { setStatus('disconnected', '未连接云端'); return; }
    try {
      const c = await ensureClient();
      const h = location.hash || '';

      if (h.includes('access_token')) {
        // 邮件链接（magic link）跳回：自动读取 token 完成登录
        const { data, error } = await c.auth.getSessionFromUrl({ storeSession: true });
        if (error) throw error;
        if (data && data.session) {
          sess = data.session;
          history.replaceState(null, '', location.pathname + location.search); // 清掉 URL 里的 token
        }
      } else if (h.includes('error=')) {
        // 链接无效 / 过期
        const m = h.match(/error_description=([^&]+)/);
        setStatus('disconnected', '邮件链接已失效：' + (m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '请重新发送验证码'));
        history.replaceState(null, '', location.pathname + location.search);
        return;
      } else {
        const { data } = await c.auth.getSession();
        sess = data && data.session;
      }

      c.auth.onAuthStateChange((event, session) => {
        sess = session;
        if (session) setStatus('connected', '已连接云端');
        else setStatus('disconnected', '未连接云端');
      });
      setStatus(sess ? 'connected' : 'disconnected', sess ? '已连接云端' : '已配置，请登录');
    } catch (e) {
      setStatus('error', '连接失败：' + (e.message || e));
    }
  }

  // ---------- 配置 ----------
  async function configure(url, anonKey) {
    cfg = { url: (url || '').trim(), anonKey: (anonKey || '').trim() };
    saveCfg();
    client = null; sess = null;
    setStatus('connecting', '正在连接…');
    try {
      const c = await ensureClient();
      const { error } = await c.from('workbench_data').select('user_id').limit(1);
      if (error && error.code !== 'PGRST116' && error.code !== '42P01') throw error; // 表不存在也先放过，登录后会建
      const { data } = await c.auth.getSession();
      sess = data && data.session;
      setStatus(sess ? 'connected' : 'disconnected', sess ? '已连接云端' : '已配置，请登录');
      return { ok: true };
    } catch (e) {
      setStatus('error', '连接失败：' + (e.message || e));
      return { ok: false, err: e.message || String(e) };
    }
  }

  // ---------- 登录（邮箱验证码） ----------
  async function signIn(email) {
    if (!isConfigured()) return { ok: false, err: '请先填 Supabase 地址和密钥' };
    setStatus('connecting', '正在发送验证码…');
    try {
      const c = await ensureClient();
      const { error } = await c.auth.signInWithOtp({
        email: (email || '').trim(),
        options: {
          shouldCreateUser: true,
          data: { app: 'workbench' },
          emailRedirectTo: location.origin + location.pathname
        }
      });
      if (error) throw error;
      setStatus('connecting', '验证码已发送到邮箱，请查收');
      return { ok: true };
    } catch (e) {
      setStatus('error', '发送失败：' + (e.message || e));
      return { ok: false, err: e.message || String(e) };
    }
  }

  async function verifyOtp(email, token) {
    setStatus('connecting', '正在登录…');
    try {
      const c = await ensureClient();
      const { data, error } = await c.auth.verifyOtp({ email: (email || '').trim(), token: (token || '').trim(), type: 'email' });
      if (error) throw error;
      sess = data.session;
      setStatus('connected', '已连接云端');
      return { ok: true };
    } catch (e) {
      setStatus('error', '登录失败：' + (e.message || e));
      return { ok: false, err: e.message || String(e) };
    }
  }

  async function signOut() {
    try { const c = await ensureClient(); await c.auth.signOut(); } catch (e) {}
    sess = null;
    setStatus('disconnected', '未连接云端');
  }

  // ---------- 拉取：远程比本地新才返回数据，否则 null ----------
  async function pull() {
    if (!isConfigured() || !isSignedIn()) return null;
    try {
      const c = await ensureClient();
      const { data, error } = await c
        .from('workbench_data')
        .select('data, updated_at')
        .eq('user_id', sess.user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data || !data.data) return null;
      const remoteSaved = data.updated_at ? new Date(data.updated_at).getTime() : 0;
      const localSaved = new Date((window.Store && Store.data.__savedAt) || 0).getTime();
      return remoteSaved > localSaved ? data.data : null;
    } catch (e) {
      setStatus('error', '拉取失败：' + (e.message || e));
      return null;
    }
  }

  // ---------- 推送：最后写入为准，整份快照 upsert ----------
  async function push(snapshot) {
    if (!isConfigured() || !isSignedIn() || !auto) return;
    setStatus('syncing', '同步中…');
    try {
      const c = await ensureClient();
      const payload = {
        user_id: sess.user.id,
        data: snapshot,
        updated_at: new Date().toISOString()
      };
      const { error } = await c.from('workbench_data').upsert(payload);
      if (error) throw error;
      setStatus('connected', '已同步云端');
    } catch (e) {
      setStatus('error', '同步失败：' + (e.message || e));
    }
  }

  return {
    onStatus, init, configure, signIn, verifyOtp, signOut,
    isConfigured, isSignedIn, isAuto, setAuto, getConfig, userEmail, pull, push,
    get status() { return status; },
    get statusText() { return statusText; }
  };
})();
