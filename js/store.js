/* ==========================================================
   store.js —— 数据中心
   双保险：① 存服务器本地文件 data/watermelon-data.json
          ② 同时存浏览器 localStorage（服务器没开也能用）
   ========================================================== */

const Store = (() => {
  const LS_KEY = 'watermelon_workbench_v1';
  let hasServer = false;
  let saveTimer = null;

  // ---------- 默认数据 ----------
  function defaults() {
    return {
      version: 1,
      createdAt: new Date().toISOString(),

      // 每个模块独立的打卡记录：{ 模块key: ['2025-01-01', ...] }
      checkins: {
        todo: [], piggy: [], speaking: [], listening: [], podcast: [], news: [],
        tcm: [], fitness: []
      },

      todo: {
        habits: [
          { id: 'h1', text: '早起后喝一杯温水', createdAt: nowISO(), history: [] },
          { id: 'h2', text: '背 20 个会计 / 外贸英语单词', createdAt: nowISO(), history: [] },
          { id: 'h3', text: '看 15 分钟财经新闻', createdAt: nowISO(), history: [] },
          { id: 'h4', text: '运动 20 分钟', createdAt: nowISO(), history: [] },
          { id: 'h5', text: '睡前复盘今天做了什么', createdAt: nowISO(), history: [] }
        ],
        todos: [
          { id: 't1', text: '整理中级财务会计第三章笔记', done: false, createdAt: nowISO(), doneAt: null },
          { id: 't2', text: '做一套六级听力真题', done: false, createdAt: nowISO(), doneAt: null }
        ]
      },

      piggy: {
        total: 0,
        manualTotal: null,      // 用户手动填写的总额（填了就以它为准）
        budget: null,           // 本月预算（每月花费上限）
        jars: [
          { key: 'fun', name: '购物玩乐', emoji: '🛍️', desc: '想买就买的快乐基金', amount: 0, goal: 2000, color: '#FF5C6E', bg: '#FFE1E4' },
          { key: 'travel', name: '旅游', emoji: '✈️', desc: '说走就走的底气', amount: 0, goal: 5000, color: '#F2A413', bg: '#FFF3D6' },
          { key: 'save', name: '储蓄', emoji: '🐷', desc: '压箱底的安全感', amount: 0, goal: 10000, color: '#3FAE7B', bg: '#E4F6EC' },
          { key: 'fund', name: '基金', emoji: '📈', desc: '让钱自己去打工', amount: 0, goal: 6000, color: '#7B6BE0', bg: '#EDEAFB' }
        ],
        ledger: []
      },

      speaking: { done: {}, records: {}, history: {}, favWords: [] },
      listening: { progress: {}, answers: {} },
      podcast: { listened: [], notes: {} },
      news: { read: [], favPhrases: [], notes: {} },
      tcm: {
        read: [],
        favHerb: [],
        herbUnlocked: 100,   // 药材库已解锁条数（每日 +10）
        herbDay: today()     // 上次解锁日期（用于每日新增）
      },
      fitness: { done: {}, notes: {} },

      minutes: {},    // 各模块学习分钟：{ 'YYYY-MM-DD': { moduleKey: 分钟数 } }
      reviews: {},    // 每日复盘：{ 'YYYY-MM-DD': '文字' }

      settings: {
        rate: 0.9, voice: '', lastOpen: today(),
        // AI 文案生成后端（OpenAI 兼容）。留空则用本地引擎。
        ai: { baseURL: '', apiKey: '', model: 'deepseek-chat' }
      }
    };
  }

  let data = defaults();

  // ---------- 工具 ----------
  function today() {
    const d = new Date(), p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  function nowISO() { return new Date().toISOString(); }

  // 深合并：保证老数据升级后不丢字段
  function merge(base, patch) {
    if (!patch || typeof patch !== 'object') return base;
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (const k of Object.keys(patch)) {
      const pv = patch[k], bv = out[k];
      if (Array.isArray(pv)) out[k] = pv;
      else if (pv && typeof pv === 'object' && bv && typeof bv === 'object' && !Array.isArray(bv)) out[k] = merge(bv, pv);
      else if (pv !== undefined) out[k] = pv;
    }
    return out;
  }

  // ---------- 加载 ----------
  async function load() {
    let local = null, server = null;

    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) local = JSON.parse(raw);
    } catch (e) { console.warn('本地缓存解析失败', e); }

    try {
      const r = await fetch('/api/data', { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        hasServer = true;
        if (j.data) server = j.data;
      }
    } catch (e) { hasServer = false; }

    // 谁新用谁
    let source = null;
    if (server && local) {
      source = (new Date(server.__savedAt || 0) >= new Date(local.__savedAt || 0)) ? server : local;
    } else source = server || local;

    if (source) data = merge(defaults(), source);

    // 拿服务器文件路径给用户看
    if (hasServer) {
      try {
        const info = await (await fetch('/api/info')).json();
        data.__dataFile = info.dataFile;
      } catch (e) { /* ignore */ }
    }
    return data;
  }

  // ---------- 保存 ----------
  function setStatus(state, text) {
    const dot = document.getElementById('saveDot');
    const txt = document.getElementById('saveText');
    if (!dot || !txt) return;
    dot.className = 'save-dot' + (state === 'saving' ? ' saving' : state === 'err' ? ' err' : '');
    txt.textContent = text;
  }

  async function flush() {
    data.__savedAt = nowISO();
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) { console.warn('本地存储写入失败', e); }

    // 云端同步（方案③）：已配置并登录则把整份快照异步推到 Supabase（最后写入为准）
    if (window.Sync && Sync.isConfigured() && Sync.isSignedIn()) {
      Sync.push(data).catch(() => {});
    }

    // 云端版 / 无本地服务：localStorage 就是正式存储，这是正常状态不是异常
    if (!hasServer) {
      const t = new Date();
      const p = (n) => String(n).padStart(2, '0');
      setStatus('ok', `已保存 ${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`);
      return;
    }

    setStatus('saving', '正在保存…');
    try {
      const r = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const t = new Date();
      const p = (n) => String(n).padStart(2, '0');
      setStatus('ok', `已保存到电脑 ${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`);
    } catch (e) {
      // 区分网络错（多半是开了公网链接）和写入错
      setStatus('err', '保存到文件失败（浏览器里还留着）· 检查是否打开了 localhost:3000');
    }
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 350);   // 防抖，避免频繁写盘
  }

  // ---------- 打卡 & 连续天数 ----------
  function checkIn(moduleKey) {
    if (!data.checkins[moduleKey]) data.checkins[moduleKey] = [];
    const t = today();
    if (!data.checkins[moduleKey].includes(t)) {
      data.checkins[moduleKey].push(t);
      data.checkins[moduleKey].sort();
      save();
      return true;   // 今天第一次打卡
    }
    return false;
  }

  function dayDiff(a, b) {
    return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  }

  /** 当前连续天数（今天没打卡但昨天打了，仍算连续，鼓励用户今天继续） */
  function streak(moduleKey) {
    const list = (data.checkins[moduleKey] || []).slice().sort();
    if (!list.length) return 0;
    const t = today();
    const last = list[list.length - 1];
    const gap = dayDiff(last, t);
    if (gap > 1) return 0;              // 断了
    let n = 1;
    for (let i = list.length - 1; i > 0; i--) {
      if (dayDiff(list[i - 1], list[i]) === 1) n++;
      else break;
    }
    return n;
  }

  /** 历史最长连续天数 */
  function bestStreak(moduleKey) {
    const list = (data.checkins[moduleKey] || []).slice().sort();
    if (!list.length) return 0;
    let best = 1, cur = 1;
    for (let i = 1; i < list.length; i++) {
      if (dayDiff(list[i - 1], list[i]) === 1) { cur++; best = Math.max(best, cur); }
      else cur = 1;
    }
    return best;
  }

  function checkedToday(moduleKey) {
    return (data.checkins[moduleKey] || []).includes(today());
  }

  function totalDays(moduleKey) {
    return (data.checkins[moduleKey] || []).length;
  }

  // ---------- 打卡切换 & 学习分钟 & 复盘 ----------
  function toggleCheckIn(moduleKey) {
    if (!data.checkins[moduleKey]) data.checkins[moduleKey] = [];
    const t = today();
    const i = data.checkins[moduleKey].indexOf(t);
    if (i >= 0) { data.checkins[moduleKey].splice(i, 1); save(); return false; }
    data.checkins[moduleKey].push(t); data.checkins[moduleKey].sort(); save(); return true;
  }

  function addMinutes(moduleKey, n) {
    n = Number(n) || 0; if (!n) return;
    const t = today();
    if (!data.minutes[t]) data.minutes[t] = {};
    data.minutes[t][moduleKey] = (data.minutes[t][moduleKey] || 0) + n;
    save();
  }

  function getMinutes(date, moduleKey) {
    const d = data.minutes[date];
    if (!d) return 0;
    return moduleKey ? (d[moduleKey] || 0) : d;
  }

  function setReview(date, text) {
    if (text && String(text).trim()) data.reviews[date] = String(text).trim();
    else delete data.reviews[date];
    save();
  }
  function getReview(date) { return data.reviews[date] || ''; }

  // ---------- AI 文案生成配置 ----------
  function getAI() { return data.settings.ai; }
  function setAI(patch) {
    data.settings.ai = Object.assign({}, data.settings.ai, patch);
    save();
  }
  function hasAI() {
    const a = data.settings.ai;
    return !!(a && a.baseURL && a.apiKey);
  }

  // ---------- 导入 / 导出 ----------
  function exportFile() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Watermelon工作台备份-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }

  // ---------- 合并导入辅助 ----------
  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  function deepClone(v) { try { return JSON.parse(JSON.stringify(v)); } catch (e) { return v; } }

  // 数组合并去重：对象按 id/key/date/ts/time/createdAt 去重，标量按值去重
  function mergeArrays(a, b) {
    const seen = new Set();
    const out = [];
    const keyOf = (x) => {
      if (isObj(x)) return x.id || x.key || x.date || x.ts || x.time || x.createdAt || JSON.stringify(x);
      return String(x);
    };
    for (const item of [].concat(a || [], b || [])) {
      const kk = keyOf(item);
      if (!seen.has(kk)) { seen.add(kk); out.push(item); }
    }
    return out;
  }

  // 把 src 合并进 target：字典键并集、数组去重合并、数字取 max、其余标量保留 target 现有值（不覆盖）
  function mergeInto(target, src) {
    for (const k of Object.keys(src)) {
      if (k.startsWith('__')) continue;
      const sv = src[k], tv = target[k];
      if (Array.isArray(sv)) {
        target[k] = mergeArrays(tv && Array.isArray(tv) ? tv : [], sv);
      } else if (isObj(sv)) {
        if (!isObj(tv)) target[k] = deepClone(sv);
        else mergeInto(tv, sv);
      } else {
        if (tv === undefined || tv === null) target[k] = sv;
        else if (typeof tv === 'number' && typeof sv === 'number') target[k] = Math.max(tv, sv);
        // 其他标量（含字符串配置）：保留当前设备现有值，不覆盖
      }
    }
  }

  // 合并导入：以当前数据为基础，把备份数据合并进来（不覆盖现有）
  function mergeImport(incoming) {
    mergeInto(data, incoming || {});
  }

  function importFile(file, cb, mode) {
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const obj = JSON.parse(rd.result);
        if (mode === 'merge') mergeImport(obj);
        else data = merge(defaults(), obj);
        flush();
        cb(true);
      } catch (e) { cb(false, e.message); }
    };
    rd.readAsText(file);
  }

  /** 用远程数据整体替换本地（云端同步拉取后调用，最后写入为准） */
  function setData(obj) {
    data = merge(defaults(), obj || {});
    save();
  }

  return {
    get data() { return data; },
    get hasServer() { return hasServer; },
    load, save, flush, today, nowISO,
    checkIn, streak, bestStreak, checkedToday, totalDays,
    toggleCheckIn, addMinutes, getMinutes, setReview, getReview,
    getAI, setAI, hasAI,
    exportFile, importFile, setData
  };
})();
