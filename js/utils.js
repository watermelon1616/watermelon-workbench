/* ==========================================================
   utils.js —— 通用小工具
   ========================================================== */

const U = {
  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },

  esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  money(n) {
    const v = Number(n) || 0;
    return v.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); },

  /** 以「今天」为种子取内容，保证每天自动换、同一天不变 */
  dayIndex(len, offset = 0) {
    if (!len) return 0;
    const start = new Date(2024, 0, 1);
    const d = new Date();
    const days = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86400000);
    return ((days + offset) % len + len) % len;
  },

  /** 每天固定地从数组里抽 n 条（不重复） */
  dayPick(arr, n, offset = 0) {
    if (!arr || !arr.length) return [];
    const out = [], used = new Set();
    const base = U.dayIndex(arr.length, offset);
    for (let i = 0; i < Math.min(n, arr.length); i++) {
      let idx = (base + i * 7 + i * i) % arr.length;
      let guard = 0;
      while (used.has(idx) && guard++ < arr.length) idx = (idx + 1) % arr.length;
      used.add(idx);
      out.push(arr[idx]);
    }
    return out;
  },

  dateCN(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },

  weekdayCN() {
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date().getDay()];
  },

  todayCN() {
    const d = new Date();
    return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${U.weekdayCN()}`;
  },

  toast(msg, type = '') {
    const box = document.getElementById('toastBox');
    const t = U.el('div', 'toast ' + type, U.esc(msg));
    box.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .3s, transform .3s';
      t.style.opacity = '0';
      t.style.transform = 'translateX(24px)';
      setTimeout(() => t.remove(), 320);
    }, 2300);
  },

  /** 输入弹窗 */
  prompt({ title, sub, value = '', placeholder = '', type = 'text', okText = '确定', onOk }) {
    const root = document.getElementById('modalRoot');
    root.innerHTML = `
      <div class="modal-mask">
        <div class="modal">
          <h3>${U.esc(title)}</h3>
          ${sub ? `<div class="m-sub">${sub}</div>` : '<div style="height:12px"></div>'}
          <input class="input" id="__mi" type="${type}" value="${U.esc(value)}" placeholder="${U.esc(placeholder)}" ${type === 'number' ? 'step="0.01" inputmode="decimal"' : ''}>
          <div class="modal-foot">
            <button class="btn" id="__mc">取消</button>
            <button class="btn primary" id="__mo">${U.esc(okText)}</button>
          </div>
        </div>
      </div>`;
    const inp = document.getElementById('__mi');
    inp.focus();
    inp.select();
    const close = () => { root.innerHTML = ''; };
    const ok = () => { const v = inp.value; close(); onOk && onOk(v); };
    document.getElementById('__mc').onclick = close;
    document.getElementById('__mo').onclick = ok;
    inp.onkeydown = (e) => { if (e.key === 'Enter') ok(); if (e.key === 'Escape') close(); };
    root.querySelector('.modal-mask').onclick = (e) => { if (e.target.classList.contains('modal-mask')) close(); };
  },

  confirm({ title, sub, okText = '确定', danger = false, onOk }) {
    const root = document.getElementById('modalRoot');
    root.innerHTML = `
      <div class="modal-mask">
        <div class="modal">
          <h3>${U.esc(title)}</h3>
          <div class="m-sub">${sub || ''}</div>
          <div class="modal-foot">
            <button class="btn" id="__mc">再想想</button>
            <button class="btn ${danger ? 'melon' : 'primary'}" id="__mo">${U.esc(okText)}</button>
          </div>
        </div>
      </div>`;
    const close = () => { root.innerHTML = ''; };
    document.getElementById('__mc').onclick = close;
    document.getElementById('__mo').onclick = () => { close(); onOk && onOk(); };
  },

  copy(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => U.toast('已复制 ✓', 'ok'), () => U.toast('复制失败', 'err'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
      U.toast('已复制 ✓', 'ok');
    }
  },

  /** 打勾完成时的 🍉 庆祝弹窗 */
  celebrate(msg) {
    const root = document.getElementById('modalRoot');
    const box = U.el('div', 'celebrate');
    box.innerHTML = `
      <div class="cele-melon">🍉</div>
      <div class="cele-msg">${U.esc(msg || '你真棒！这个自律的小西瓜 🍉')}</div>
      <button class="btn primary" id="__cele">收到啦 ~</button>
    `;
    root.appendChild(box);
    const close = () => { box.classList.add('out'); setTimeout(() => box.remove(), 250); };
    box.querySelector('#__cele').onclick = close;
    box.onclick = (e) => { if (e.target === box) close(); };
    setTimeout(close, 2600);
  }
};
