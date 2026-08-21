/* ==========================================================
   app.js —— 主控制器
   左侧导航顺序（从上到下）：
   待办事项 → 御用金库 → 口语练习 → 听力练习 → 每日播客 → 新闻热点
   ========================================================== */

const App = (() => {
  const MODULES = [
    HomeModule,       // 0. 首页（今日概览 + 日历复盘）
    TodoModule,       // 1. 待办事项
    PiggyModule,      // 2. 存钱罐
    SpeakingModule,   // 3. 口语练习
    ListeningModule,  // 4. 听力练习
    PodcastModule,    // 5. 播客
    NewsModule,       // 6. 新闻热点
    TcmModule,        // 7. 中药知识
    FitnessModule     // 8. 运动养生
  ];

  let cur = MODULES[0];

  function renderNav() {
    document.getElementById('nav').innerHTML = MODULES.map(m => `
      <button class="nav-item ${m === cur ? 'active' : ''}" data-key="${m.key}">
        <span class="ico">${m.icon}</span>
        <span>${m.title}</span>
        <span class="nav-badge ${Store.streak(m.key) > 0 ? 'show' : ''}">${Store.streak(m.key)}</span>
      </button>`).join('');

    document.querySelectorAll('.nav-item').forEach(b => {
      b.onclick = () => go(b.dataset.key);
    });
  }

  function go(key) {
    const m = MODULES.find(x => x.key === key);
    if (!m || m === cur) return;
    if (cur && cur.onLeave) cur.onLeave();
    cur = m;
    localStorage.setItem('wm_last_tab', key);
    if (cur.onEnter) cur.onEnter();
    renderNav();
    paint();
    closeDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** 移动端收起左侧抽屉 */
  function closeDrawer() {
    const sb = document.querySelector('.sidebar');
    const mask = document.getElementById('drawerMask');
    if (sb) sb.classList.remove('open');
    if (mask) mask.classList.remove('show');
  }

  function paint() {
    // 标题恢复为一横排（不换行）
    document.getElementById('pageTitle').textContent = cur.title;
    document.getElementById('pageSub').textContent = typeof cur.sub === 'function' ? cur.sub() : (cur.sub || '');
    refreshStreak();
    cur.render();
  }

  /** 刷新右上角「已连续坚持 N 天」 */
  function refreshStreak() {
    // 首页不显示打卡徽标
    const streakBox = document.querySelector('.streak');
    if (streakBox) streakBox.style.display = (cur.key === 'home') ? 'none' : '';
    const s = Store.streak(cur.key);
    const best = Store.bestStreak(cur.key);
    document.getElementById('streakNum').textContent = s;
    document.getElementById('streakBest').textContent = `最长 ${best} 天`;
    const ico = document.getElementById('streakIco');
    ico.textContent = s >= 30 ? '🏆' : s >= 14 ? '🍉' : s >= 7 ? '🔥' : s >= 1 ? '🌱' : '⚡';
    // 顺带更新侧边栏小徽章
    document.querySelectorAll('.nav-item').forEach(b => {
      const badge = b.querySelector('.nav-badge');
      const n = Store.streak(b.dataset.key);
      badge.textContent = n;
      badge.classList.toggle('show', n > 0);
    });
  }

  // ---------- 备份按钮 ----------
  function bindFooter() {
    document.getElementById('btnExport').onclick = () => {
      Store.exportFile();
      U.toast('备份文件已下载 📦', 'ok');
    };
    // 覆盖导入
    const fi = document.getElementById('fileImport');
    document.getElementById('btnImport').onclick = () => fi.click();
    fi.onchange = () => {
      const f = fi.files[0];
      if (!f) return;
      U.confirm({
        title: '导入备份会覆盖现在的数据', sub: '确定要用这个备份文件替换当前所有内容吗？',
        okText: '确定导入', danger: true,
        onOk: () => Store.importFile(f, (ok, err) => {
          if (ok) { U.toast('导入成功，正在刷新…', 'ok'); setTimeout(() => location.reload(), 700); }
          else U.toast('导入失败：' + err, 'err');
        })
      });
      fi.value = '';
    };
    // 合并导入（不覆盖现有数据，重复项去重）
    const fm = document.getElementById('fileMerge');
    document.getElementById('btnMerge').onclick = () => fm.click();
    fm.onchange = () => {
      const f = fm.files[0];
      if (!f) return;
      U.confirm({
        title: '合并导入（不覆盖现有数据）',
        sub: '会把备份里的数据合并进来，与现有数据拼成完整一份；重复项自动去重，现有数据不会丢。',
        okText: '合并导入',
        onOk: () => Store.importFile(f, (ok, err) => {
          if (ok) { U.toast('已合并导入，正在刷新…', 'ok'); setTimeout(() => location.reload(), 700); }
          else U.toast('导入失败：' + err, 'err');
        }, 'merge')
      });
      fm.value = '';
    };
    // 设置（含云端同步）
    const bs = document.getElementById('btnSettings');
    if (bs) bs.onclick = openSettings;
  }

  // ---------- 备份提醒条 ----------
  // 云端版数据只在本设备浏览器里，攒多了必须提醒导出，否则清缓存就全没了。
  // 侧边栏那两个按钮在手机上要点汉堡菜单才看得到，所以这里在主区顶部再放一条。
  function countEntries() {
    const d = Store.data || {};
    let n = 0;
    const walk = (v, depth) => {
      if (depth > 3 || v == null) return;
      if (Array.isArray(v)) { n += v.length; return; }
      if (typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], depth + 1);
    };
    for (const k of Object.keys(d)) {
      if (k.startsWith('__') || k === 'settings') continue;
      walk(d[k], 0);
    }
    return n;
  }

  function maybeRemindBackup() {
    if (Store.hasServer) return;                     // 本地模式已经写盘了，不用催
    const s = Store.data.settings || (Store.data.settings = {});
    const now = Date.now();
    const last = Number(s.lastBackupTip || 0);
    if (now - last < 7 * 24 * 3600 * 1000) return;   // 7 天内提醒过就算了
    const n = countEntries();
    if (n < 20) return;                              // 数据太少不打扰

    const host = document.querySelector('.main');
    if (!host || document.getElementById('backupTip')) return;

    const bar = document.createElement('div');
    bar.id = 'backupTip';
    bar.className = 'backup-tip';
    bar.innerHTML =
      '<span class="bt-ico">📦</span>' +
      '<span class="bt-msg">已经攒了 <b>' + n + '</b> 条数据了，导出一份备份吧 —— ' +
      '清浏览器缓存或换设备时能一键恢复。</span>' +
      '<button class="bt-go" id="btTipGo">导出备份</button>' +
      '<button class="bt-x" id="btTipX" aria-label="关闭">×</button>';

    const head = host.querySelector('.page-head');
    if (head && head.nextSibling) host.insertBefore(bar, head.nextSibling);
    else host.insertBefore(bar, host.firstChild);

    const dismiss = () => {
      s.lastBackupTip = Date.now();
      Store.save();
      bar.remove();
    };
    document.getElementById('btTipGo').onclick = () => {
      Store.exportFile();
      U.toast('备份文件已下载 📦', 'ok');
      dismiss();
    };
    document.getElementById('btTipX').onclick = dismiss;
  }

  // ---------- 移动端抽屉开关 ----------
  function bindDrawer() {
    const sb = document.querySelector('.sidebar');
    const mask = document.getElementById('drawerMask');
    const btn = document.getElementById('menuBtn');
    if (btn) btn.onclick = (e) => {
      e.stopPropagation();
      sb.classList.toggle('open');
      mask.classList.toggle('show');
    };
    if (mask) mask.onclick = () => closeDrawer();
  }

  // ---------- 全局「停止朗读」按钮（TTS 旁都有 data-stop，这里统一处理） ----------
  function bindGlobalStop() {
    document.addEventListener('click', (e) => {
      const s = e.target.closest('[data-stop]');
      if (s) { e.stopPropagation(); Speech.stop(); U.toast('已停止朗读', 'warn'); }
    });
  }

  // ---------- 应用内「安装到主屏幕」 ----------
  let deferredPrompt = null;
  function bindInstall() {
    const ib = document.getElementById('btnInstall');
    if (!ib) return;
    window.addEventListener('appinstalled', () => {
      ib.hidden = true;
      U.toast('安装成功，现在它是独立 App 啦 🎉', 'ok');
    });
    if (!ib.hidden && deferredPrompt) ib.hidden = false;
    ib.onclick = async () => {
      if (!deferredPrompt) {
        U.toast('请用浏览器菜单「安装应用 / 添加到主屏幕」', 'warn');
        return;
      }
      deferredPrompt.prompt();
      try {
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') U.toast('已加入主屏幕，去桌面看看吧 🎉', 'ok');
      } catch (e) { /* ignore */ }
      deferredPrompt = null;
      ib.hidden = true;
    };
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      ib.hidden = false;   // 显示「安装到主屏幕」按钮
    });
  }

  // ---------- 云端同步状态标识 ----------
  function renderSyncStatus(state, text) {
    const dot = document.getElementById('syncDot');
    const txt = document.getElementById('syncText');
    if (!dot || !txt) return;
    dot.className = 'sync-dot ' +
      (state === 'connected' ? 'on' : state === 'syncing' || state === 'connecting' ? 'busy' : 'off');
    txt.textContent = text || (state === 'connected' ? '已连接云端' : '未连接云端');
  }

  // ---------- 设置弹窗（含云端同步） ----------
  function openSettings() {
    const root = document.getElementById('modalRoot');
    const cfg = Sync.getConfig();
    const signedIn = Sync.isSignedIn();
    const auto = Sync.isAuto();
    const email = Sync.userEmail();

    const sql = 'create table if not exists workbench_data (\n  user_id uuid primary key references auth.users(id) on delete cascade,\n  data jsonb not null default \'{}\'::jsonb,\n  updated_at timestamptz not null default now()\n);\nalter table workbench_data enable row level security;\ncreate policy "own row" on workbench_data\n  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);';

    const authBlock = signedIn ? `
      <div class="set-row">
        <label>已登录</label>
        <div class="set-line">📧 ${U.esc(email)} <button class="mini-btn" id="sbOut">退出登录</button></div>
      </div>
      <div class="set-row">
        <label>立即同步</label>
        <button class="mini-btn" id="sbNow">↑ 把本机数据推到云端</button>
      </div>`
      : `
      <div class="set-row">
        <label>邮箱</label>
        <input class="set-input" id="sbEmail" type="email" placeholder="you@example.com" value="">
      </div>
      <div class="set-row set-inline">
        <input class="set-input" id="sbCode" type="text" inputmode="numeric" placeholder="6~8 位验证码（收到链接直接点即可）" maxlength="8">
        <button class="mini-btn" id="sbSend">发送验证码</button>
        <button class="mini-btn" id="sbLogin">登录并同步</button>
      </div>`;

    root.innerHTML = `
      <div class="modal-mask">
        <div class="modal set-modal">
          <h3>⚙️ 设置</h3>
          <p class="m-sub">云端同步：让手机和电脑共用同一份数据</p>

          <div class="sync-status big" id="syncStatus2">
            <span class="sync-dot" id="syncDot2"></span>
            <span id="syncText2"></span>
          </div>

          <div class="set-sec">
            <div class="set-row">
              <label>Supabase 项目 URL</label>
              <input class="set-input" id="sbUrl" type="text" placeholder="https://xxxx.supabase.co" value="${U.esc(cfg.url)}">
            </div>
            <div class="set-row">
              <label>Anon Key（公开密钥）</label>
              <input class="set-input" id="sbKey" type="text" placeholder="eyJhbGciOi..." value="${U.esc(cfg.anonKey)}">
            </div>
            <button class="mini-btn" id="sbSaveCfg">保存配置</button>
          </div>

          <div class="set-sec">
            <h4>账号（各设备用同一邮箱 = 同一份数据）</h4>
            ${authBlock}
          </div>

          <div class="set-row set-inline">
            <label class="set-check"><input type="checkbox" id="sbAuto" ${auto ? 'checked' : ''}> 自动同步（改完自动上传云端）</label>
          </div>

          <details class="set-help">
            <summary>如何获取 Supabase 配置 / 建表？</summary>
            <ol>
              <li>supabase.com 建免费项目</li>
              <li>Authentication → Providers → Email，确认开启；默认即支持 OTP（6~8 位数字）和魔法链接</li>
              <li>SQL Editor 粘贴下面语句执行（建表 + 权限）</li>
              <li>Project Settings → API 复制 Project URL 与 anon public key 填上方</li>
              <li>Authentication → URL Configuration → Site URL 改成你的云端版地址，否则邮件链接会跳错页面</li>
            </ol>
            <pre class="set-sql">${U.esc(sql)}</pre>
          </details>

          <div class="modal-foot">
            <button class="btn" id="sbClose">关闭</button>
          </div>
        </div>
      </div>`;

    const close = () => { root.innerHTML = ''; };
    root.querySelector('.modal-mask').onclick = (e) => { if (e.target.classList.contains('modal-mask')) close(); };
    document.getElementById('sbClose').onclick = close;

    // 同步状态（弹窗内也显示）
    Sync.onStatus((s, t) => {
      const d = document.getElementById('syncDot2'), x = document.getElementById('syncText2');
      if (d) d.className = 'sync-dot ' + (s === 'connected' ? 'on' : s === 'syncing' || s === 'connecting' ? 'busy' : 'off');
      if (x) x.textContent = t;
    });

    document.getElementById('sbSaveCfg').onclick = async () => {
      const r = await Sync.configure(document.getElementById('sbUrl').value, document.getElementById('sbKey').value);
      if (!r.ok) U.toast('连接失败：' + r.err, 'err');
      openSettings(); // 重建以反映登录态
    };

    const autoEl = document.getElementById('sbAuto');
    if (autoEl) autoEl.onchange = () => Sync.setAuto(autoEl.checked);

    if (signedIn) {
      document.getElementById('sbOut').onclick = async () => { await Sync.signOut(); openSettings(); };
      document.getElementById('sbNow').onclick = async () => { await Sync.push(Store.data); U.toast('已推送到云端 ☁️', 'ok'); };
    } else {
      document.getElementById('sbSend').onclick = async () => {
        const em = document.getElementById('sbEmail').value;
        if (!em) { U.toast('请先填邮箱', 'warn'); return; }
        const r = await Sync.signIn(em);
        if (r.ok) U.toast('验证码已发送到邮箱', 'ok'); else U.toast('发送失败：' + r.err, 'err');
      };
      document.getElementById('sbLogin').onclick = async () => {
        const em = document.getElementById('sbEmail').value;
        const code = document.getElementById('sbCode').value;
        if (!em || !code) { U.toast('请填邮箱和验证码', 'warn'); return; }
        const r = await Sync.verifyOtp(em, code);
        if (r.ok) {
          U.toast('登录成功，正在同步…', 'ok');
          const remote = await Sync.pull();
          if (remote) { Store.setData(remote); U.toast('已拉取云端数据 ☁️', 'ok'); }
          openSettings();
        } else U.toast('登录失败：' + r.err, 'err');
      };
    }
  }

  // ---------- 启动 ----------
  async function boot() {
    await Store.load();

    // 云端同步初始化：恢复会话 + 拉取最新数据
    try {
      await Sync.init();
      if (Sync.isConfigured() && Sync.isSignedIn()) {
        const remote = await Sync.pull();
        if (remote) { Store.setData(remote); U.toast('已从云端同步最新数据 ☁️', 'ok'); }
      }
    } catch (e) { console.warn('云端同步初始化失败', e); }

    // 显示数据存放位置
    const pathEl = document.getElementById('savePath');
    const loc = location.hostname;
    const isLocal = (loc === 'localhost' || loc === '127.0.0.1' || /^192\.168\./.test(loc) || /^10\./.test(loc));
    if (Store.hasServer && Store.data.__dataFile) {
      // 本地模式：数据实时写 D 盘
      pathEl.textContent = '📁 ' + Store.data.__dataFile;
      Store.flush();
    } else if (isLocal) {
      // 本机打开但服务没起 —— 提示怎么启动，但不制造焦虑
      pathEl.innerHTML = '💾 数据存在这台电脑的浏览器里，随时可用。' +
        '<br><span style="opacity:.75">想让数据直接写进 D 盘的话，双击桌面的「Watermelon 的工作台」图标启动本地服务。</span>';
    } else {
      // 云端版：数据在本设备浏览器里
      pathEl.innerHTML = '☁️ 云端版 · 数据存在<b>这台设备的浏览器</b>里，关掉页面也在。' +
        '<br><span style="opacity:.75">换设备用需要「导出备份」再到新设备「导入恢复」。建议每周导出一次。</span>';
    }

    // 数据攒到一定量时，温和提醒导出备份（每 7 天最多提醒一次）
    setTimeout(() => maybeRemindBackup(), 1500);

    // 回到上次停留的板块
    const last = localStorage.getItem('wm_last_tab');
    const m = MODULES.find(x => x.key === last);
    if (m) cur = m;
    if (cur.onEnter) cur.onEnter();

    renderNav();
    bindFooter();
    bindDrawer();
    bindInstall();
    bindGlobalStop();
    if (window.Sync) Sync.onStatus(renderSyncStatus);  // 同步状态标识实时刷新
    paint();

    // 每天第一次打开时的问候
    const t = Store.today();
    if (Store.data.settings.lastOpen !== t) {
      Store.data.settings.lastOpen = t;
      Store.save();
      const h = new Date().getHours();
      const hi = h < 6 ? '这么晚还没睡？' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
      setTimeout(() => U.toast(`${hi}，今天也来啦 🍉`, 'ok'), 600);
    }

    // 离开页面前强制保存一次
    window.addEventListener('beforeunload', () => {
      try {
        localStorage.setItem('watermelon_workbench_v1', JSON.stringify(Store.data));
        if (Store.hasServer && navigator.sendBeacon) {
          navigator.sendBeacon('/api/data', new Blob([JSON.stringify(Store.data)], { type: 'application/json' }));
        }
      } catch (e) { /* ignore */ }
    });

    // 每 2 分钟自动存一次盘，双保险
    setInterval(() => Store.flush(), 120000);
  }

  return { boot, go, refreshStreak, paint };
})();

document.addEventListener('DOMContentLoaded', App.boot);
