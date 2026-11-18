/**
 * 《TA 的秘密礼盒》主逻辑
 * 纯静态 · IndexedDB 陈列室 · WebAudio 音效 · PWA 离线可用
 */

(function () {
  'use strict';

  const APP_VERSION = '1.3.0';

  // ---------- 状态 ----------
  const state = {
    userName: '',
    taName: '',
    selectedMood: null,
    currentGift: null,   // { gift, pack, record }
    viewingId: null,
    filter: 'all',
    searchQuery: '',
    screen: 'cover',
    reduceMotion: false
  };

  // ---------- DOM ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const screens = {
    cover: $('#screen-cover'),
    names: $('#screen-names'),
    mood: $('#screen-mood'),
    unbox: $('#screen-unbox'),
    reveal: $('#screen-reveal'),
    collection: $('#screen-collection'),
    detail: $('#screen-detail')
  };

  // ---------- 工具 ----------
  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function uid() {
    const r = new Uint32Array(2);
    crypto.getRandomValues(r);
    return 'g_' + Date.now().toString(36) + '_' + r[0].toString(36) + r[1].toString(36).slice(0, 3);
  }

  function randInt(max) {
    const limit = Math.floor(0x100000000 / max) * max;
    const a = new Uint32Array(1);
    do { crypto.getRandomValues(a); } while (a[0] >= limit);
    return a[0] % max;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function setBtn(el, iconBody, label) {
    el.innerHTML = svgIcon(iconBody, 'icon btn-icon') + `<span>${esc(label)}</span>`;
  }


  const SHOP_PLATFORMS = {
    taobao: { label: '淘宝', button: '去淘宝看看', share: '可在淘宝打开' },
    jd: { label: '京东', button: '去京东看看', share: '可在京东打开' },
    pdd: { label: '拼多多', button: '去拼多多看看', share: '可在拼多多打开' }
  };

  function safeHttpUrl(url) {
    try {
      const u = new URL(String(url || '').trim());
      if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    } catch (e) { /* 非法地址 */ }
    return '';
  }

  /** 仅当平台合法且有官方 http(s) 商品链接时返回商店信息，否则返回 null */
  function normalizeShop(shop) {
    if (!shop || typeof shop !== 'object') return null;
    const url = safeHttpUrl(shop.url);
    const meta = SHOP_PLATFORMS[shop.platform];
    if (!url || !meta) return null;
    const str = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
    const out = { platform: shop.platform, url };
    const name = str(shop.shopName, 40);
    const title = str(shop.productTitle, 80);
    const price = str(shop.priceText, 20);
    const itemId = str(shop.itemId, 40);
    if (name) out.shopName = name;
    if (title) out.productTitle = title;
    if (price) out.priceText = price;
    if (itemId) out.itemId = itemId;
    return out;
  }

  function parcelChipText(shop) {
    const s = normalizeShop(shop);
    if (!s) return '';
    const label = SHOP_PLATFORMS[s.platform].label;
    return s.shopName ? `包裹来自 ${label} · ${s.shopName}` : `包裹来自 ${label}`;
  }

  function fillParcelChip(el, shop) {
    if (!el) return;
    const text = parcelChipText(shop);
    el.hidden = !text;
    el.textContent = text;
  }

  function renderShopCard(el, shop) {
    if (!el) return;
    const s = normalizeShop(shop);
    if (!s) {
      el.hidden = true;
      el.innerHTML = '';
      el.classList.remove('visible');
      return;
    }
    const meta = SHOP_PLATFORMS[s.platform];
    const priceLine = s.priceText
      ? `参考价 ${esc(s.priceText)}，以商店页面为准`
      : '价格以商店页面为准';
    el.hidden = false;
    el.innerHTML =
      '<div class="shop-label">商店包裹</div>' +
      (s.productTitle ? `<div class="shop-product">${esc(s.productTitle)}</div>` : '') +
      `<div class="shop-price">${priceLine}</div>` +
      `<a class="btn btn-ghost shop-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(meta.button)}</a>`;
  }

  function iconForRecord(r, cls) {
    if (r.giftId && GIFT_ICONS[r.giftId]) return giftIconSvg(r.giftId, cls);
    // 兼容旧版本记录：按名称找到礼物
    const g = GIFTS.find(x => x.name === r.giftName);
    return giftIconSvg(g ? g.id : '', cls);
  }

  // ---------- 轻提示 ----------
  let toastTimer = null;
  function toast(msg, opts = {}) {
    const el = $('#toast');
    el.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = msg;
    el.appendChild(span);
    if (opts.action) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'toast-action';
      b.textContent = opts.action.label;
      b.addEventListener('click', () => { el.classList.remove('show'); opts.action.fn(); });
      el.appendChild(b);
    }
    el.classList.add('show');
    clearTimeout(toastTimer);
    if (opts.duration !== 0) toastTimer = setTimeout(() => el.classList.remove('show'), opts.duration || 2600);
  }

  // ---------- 屏幕切换 + 返回键 ----------
  function showScreen(name, opts = {}) {
    if ((name === 'unbox' || name === 'reveal') && !state.currentGift) name = 'mood';
    const prev = state.screen;
    state.screen = name;
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (screens[name]) screens[name].classList.add('active');
    window.scrollTo(0, 0);

    const entry = Object.assign({ screen: name }, opts.data || {});
    if (opts.replace) history.replaceState(entry, '');
    else if (opts.push !== false && prev !== name) history.pushState(entry, '');

    if (opts.focus !== false && prev !== name) {
      const t = screens[name] && screens[name].querySelector('[tabindex="-1"]');
      if (t) setTimeout(() => t.focus({ preventScroll: true }), 30);
    }
    if (name === 'cover') updateCoverCount();
  }

  window.addEventListener('popstate', async (e) => {
    if (overlay) { hideOverlayUI(); return; }
    const st = e.state || { screen: 'cover' };
    let target = st.screen || 'cover';
    if (target === 'unbox') { cancelUnbox(); target = 'mood'; }
    if (state.screen === 'unbox') cancelUnbox();
    if (target === 'detail' && st.id) {
      const ok = await fillDetail(st.id);
      if (!ok) target = 'collection';
    }
    if (target === 'collection') await renderCollection();
    if (target === 'mood') resetMood();
    showScreen(target, { push: false });
  });

  // ---------- 弹层（分享图 / 确认框），支持返回键关闭 ----------
  let overlay = null;
  let overlayWaiters = [];

  function openOverlay(el, onHide) {
    if (overlay) hideOverlayUI();
    overlay = { el, onHide, returnFocus: document.activeElement };
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('active'));
    document.body.classList.add('modal-open');
    history.pushState({ screen: state.screen, overlay: true, id: state.viewingId }, '');
    const first = el.querySelector('button:not(.hidden)');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 30);
  }

  function hideOverlayUI() {
    if (!overlay) return;
    const { el, onHide, returnFocus } = overlay;
    overlay = null;
    el.classList.remove('active');
    el.hidden = true;
    document.body.classList.remove('modal-open');
    if (onHide) onHide();
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
    const w = overlayWaiters; overlayWaiters = [];
    w.forEach(fn => fn());
  }

  function closeOverlay() {
    return new Promise(resolve => {
      if (!overlay) return resolve();
      overlayWaiters.push(resolve);
      if (history.state && history.state.overlay) history.back();
      else hideOverlayUI();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!overlay) return;
    if (e.key === 'Escape') { e.preventDefault(); closeOverlay(); }
    if (e.key === 'Tab') {
      const f = [...overlay.el.querySelectorAll('button')].filter(b => !b.disabled && b.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ---------- 确认对话框 ----------
  let dialogAnswer = false;
  function confirmDialog(title, message, okText = '确认') {
    dialogAnswer = false;
    $('#dialog-title').textContent = title;
    $('#dialog-message').textContent = message;
    $('#dialog-confirm').textContent = okText;
    $('#dialog-cancel').classList.remove('hidden');
    return new Promise(resolve => {
      openOverlay($('#dialog-overlay'), () => resolve(dialogAnswer));
      setTimeout(() => $('#dialog-cancel').focus({ preventScroll: true }), 40);
    });
  }

  // ---------- 抽取逻辑（绑定内容包，优先降低近期重复） ----------
  function poolForMood(moodLabel) {
    const mapped = (typeof MOOD_MAP !== 'undefined' && MOOD_MAP[moodLabel]) || [];
    const pool = GIFTS.filter(g => (g.moods || []).includes(moodLabel) || mapped.includes(g.id));
    return pool.length ? pool : GIFTS.slice();
  }

  function pickGift(moodLabel) {
    const recentIds = getRecentGiftIds();
    // 先洗牌，再把最近出现的放到后面
    let pool = poolForMood(moodLabel).slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    pool.sort((a, b) => {
      const ia = recentIds.indexOf(a.id);
      const ib = recentIds.indexOf(b.id);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return -1;
      if (ib === -1) return 1;
      return ib - ia; // 越近越往后
    });

    // 从前 60% 随机选，兼顾新鲜与随机
    const half = Math.max(1, Math.ceil(pool.length * 0.6));
    const gift = pool[randInt(half)];
    // 从该礼物的 packs 中随机选一套（绑定）
    const pack = gift.packs[randInt(gift.packs.length)];

    addRecentGiftId(gift.id);
    return { gift, pack };
  }

  // ---------- 名字 ----------
  function loadNames() {
    const prefs = getPrefs();
    state.userName = prefs.userName || '';
    state.taName = prefs.taName || '';
    $('#input-user-name').value = state.userName === '你' ? '' : state.userName;
    $('#input-ta-name').value = state.taName === 'TA' ? '' : state.taName;
  }

  function saveNames() {
    const prefs = getPrefs();
    prefs.userName = state.userName;
    prefs.taName = state.taName;
    setPrefs(prefs);
  }

  // ---------- 心情网格 ----------
  function renderMoods() {
    const grid = $('#mood-grid');
    grid.innerHTML = '';
    MOODS.forEach(m => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'mood-item';
      el.setAttribute('role', 'radio');
      el.setAttribute('aria-checked', 'false');
      el.dataset.mood = m.label;
      el.innerHTML = `${svgIcon(MOOD_ICONS[m.id] || UI_ICONS.gift, 'icon mood-icon')}<span class="mood-label">${esc(m.label)}</span><span class="mood-desc">${esc(m.desc)}</span>`;
      el.addEventListener('click', () => {
        $$('.mood-item').forEach(i => { i.classList.remove('selected'); i.setAttribute('aria-checked', 'false'); });
        el.classList.add('selected');
        el.setAttribute('aria-checked', 'true');
        state.selectedMood = m.label;
        $('#btn-mood-next').disabled = false;
      });
      grid.appendChild(el);
    });
  }

  function resetMood() {
    state.selectedMood = null;
    $$('.mood-item').forEach(i => { i.classList.remove('selected'); i.setAttribute('aria-checked', 'false'); });
    $('#btn-mood-next').disabled = true;
    $('#mood-desc').textContent = state.taName && state.taName !== 'TA'
      ? `${state.taName} 会根据你的状态准备礼物`
      : 'TA 会根据你的状态准备礼物';
  }

  // ---------- 拆礼动画 ----------
  let unboxTimers = [];
  let unboxPhase = 'idle'; // idle | opening | done

  function clearUnboxTimers() { unboxTimers.forEach(clearTimeout); unboxTimers = []; }
  function cancelUnbox() { clearUnboxTimers(); unboxPhase = 'done'; }

  function startUnbox() {
    clearUnboxTimers();
    unboxPhase = 'idle';
    const stage = $('#unbox-stage');
    stage.classList.remove('untie', 'opened', 'revealed');
    stage.disabled = false;
    $('#unbox-gift-icon').innerHTML = giftIconSvg(state.currentGift.gift.id, 'icon');
    $('#unbox-hint').textContent = '点击礼盒拆开';
    $('#unbox-from').textContent = `来自 ${state.taName || 'TA'} 的礼物`;
    showScreen('unbox');
    setTimeout(() => stage.focus({ preventScroll: true }), 60);
  }

  function openBox() {
    if (unboxPhase !== 'idle') return;
    unboxPhase = 'opening';
    const stage = $('#unbox-stage');
    stage.disabled = true;
    GiftSound.unlock();
    const fast = state.reduceMotion;
    const gift = state.currentGift.gift;
    const pack = state.currentGift.pack || {};
    const tease = (!fast && (pack.tease || gift.tease)) || '';

    // 减少动态时跳过预告语，直接出真名；完整动画会在「正在拆开……」后短暂显示 tease
    const T = fast ? [0, 60, 120, 500] : (tease ? [0, 520, 900, 1750, 2950] : [0, 520, 900, 2100]);

    $('#unbox-hint').textContent = '正在拆开……';
    stage.classList.add('untie');
    GiftSound.untie();
    unboxTimers.push(setTimeout(() => { stage.classList.add('opened'); GiftSound.open(); }, T[1]));
    if (tease) {
      unboxTimers.push(setTimeout(() => {
        $('#unbox-hint').textContent = tease;
      }, T[2]));
      unboxTimers.push(setTimeout(() => {
        stage.classList.add('revealed');
        GiftSound.reveal();
        $('#unbox-hint').textContent = gift.name;
      }, T[3]));
      unboxTimers.push(setTimeout(() => showReveal(), T[4]));
    } else {
      unboxTimers.push(setTimeout(() => {
        stage.classList.add('revealed');
        GiftSound.reveal();
        $('#unbox-hint').textContent = gift.name;
      }, T[2]));
      unboxTimers.push(setTimeout(() => showReveal(), T[3]));
    }
  }

  function skipUnbox() {
    if (unboxPhase === 'done') return;
    const wasIdle = unboxPhase === 'idle';
    clearUnboxTimers();
    if (wasIdle) { GiftSound.unlock(); GiftSound.reveal(); }
    showReveal();
  }

  // ---------- 揭示 ----------
  async function showReveal() {
    if (unboxPhase === 'done') return;
    unboxPhase = 'done';
    clearUnboxTimers();
    const { gift, pack } = state.currentGift;
    const record = {
      id: uid(),
      timestamp: Date.now(),
      userName: state.userName,
      taName: state.taName,
      mood: state.selectedMood,
      giftId: gift.id,
      giftName: gift.name,
      category: gift.category,
      themes: gift.themes || [],
      icon: gift.icon,
      cardTitle: pack.cardTitle,
      message: pack.message,
      note: pack.note || null,
      style: pack.style || '',
      favorited: false,
      materialVersion: '1.3.0',
      shop: normalizeShop(gift.shop)
    };
    state.currentGift.record = record;

    $('#reveal-icon').innerHTML = giftIconSvg(gift.id, 'icon');
    $('#reveal-name').textContent = gift.name;
    fillParcelChip($('#reveal-parcel'), record.shop);
    $('#reveal-theme').textContent = (gift.themes || []).join(' · ') || gift.category;
    $('#reveal-card-title').textContent = pack.cardTitle;
    $('#reveal-message').textContent = pack.message;

    const noteLayer = $('#layer-note');
    noteLayer.hidden = !pack.note;
    $('#reveal-note').textContent = pack.note || '';
    renderShopCard($('#layer-shop'), record.shop);

    $('#reveal-meta').textContent = `${state.taName || 'TA'} → ${state.userName || '你'} · ${state.selectedMood} · ${formatTime(record.timestamp)}`;
    setFavBtn($('#btn-favorite'), false);
    $('#btn-favorite').dataset.id = record.id;

    ['layer-gift', 'layer-card', 'layer-note', 'layer-shop'].forEach(id => $('#' + id).classList.remove('visible'));
    // 用 replace：返回键不会回到拆礼动画
    showScreen('reveal', { replace: true });

    const d = state.reduceMotion ? 0 : 1;
    setTimeout(() => $('#layer-gift').classList.add('visible'), 80 * d);
    setTimeout(() => $('#layer-card').classList.add('visible'), 380 * d);
    if (pack.note) setTimeout(() => $('#layer-note').classList.add('visible'), 680 * d);
    if (record.shop) setTimeout(() => $('#layer-shop').classList.add('visible'), (pack.note ? 900 : 680) * d);

    try {
      await saveGift(record);
    } catch (err) {
      console.warn(err);
      toast('本次礼物未能保存到陈列室（浏览器存储不可用）', { duration: 4000 });
    }
  }

  function setFavBtn(btn, on) {
    btn.innerHTML = svgIcon(UI_ICONS.heart, 'icon btn-icon' + (on ? ' filled' : '')) + `<span>${on ? '已收藏' : '收藏'}</span>`;
    btn.setAttribute('aria-pressed', String(on));
    btn.classList.toggle('is-on', on);
  }

  // ---------- 陈列室 ----------
  function renderFilterTabs(all) {
    const moodsInUse = MOODS.filter(m => all.some(g => g.mood === m.label));
    const tabs = [{ id: 'all', label: '全部' }, { id: 'favorited', label: '已收藏' }]
      .concat(moodsInUse.map(m => ({ id: 'mood:' + m.label, label: m.label })));
    if (!tabs.some(t => t.id === state.filter)) state.filter = 'all';
    $('#filter-tabs').innerHTML = tabs.map(t =>
      `<button type="button" class="filter-tab ${state.filter === t.id ? 'active' : ''}" aria-pressed="${state.filter === t.id}" data-filter="${esc(t.id)}">${esc(t.label)}</button>`
    ).join('');
  }

  async function renderCollection() {
    let all;
    try { all = await getAllGifts(); }
    catch (e) {
      $('#gift-list').innerHTML = '';
      $('#empty-state').classList.remove('hidden');
      $('#empty-title').textContent = '当前浏览器无法使用本地存储';
      $('#empty-sub').textContent = '可能处于无痕模式，陈列室暂不可用';
      $('#btn-empty-start').classList.add('hidden');
      return;
    }
    renderFilterTabs(all);
    $('#collection-count').textContent = all.length ? `共 ${all.length} 份` : '';

    let list = all;
    if (state.filter === 'favorited') list = list.filter(g => g.favorited);
    else if (state.filter.startsWith('mood:')) list = list.filter(g => g.mood === state.filter.slice(5));

    const q = state.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(g => [g.giftName, g.cardTitle, g.message, g.note, g.category, g.mood, (g.themes || []).join(' '), g.shop && g.shop.shopName, g.shop && g.shop.productTitle]
        .some(v => (v || '').toLowerCase().includes(q)));
    }

    const container = $('#gift-list');
    const empty = $('#empty-state');

    if (list.length === 0) {
      container.innerHTML = '';
      empty.classList.remove('hidden');
      const none = all.length === 0;
      $('#empty-title').textContent = none ? '还没有收到过礼物' : (q ? `没有找到与「${state.searchQuery.trim()}」相关的礼物` : '这里还是空的');
      $('#empty-sub').textContent = none ? '去拆开第一盒吧' : (q ? '换个关键词试试' : '收藏喜欢的礼物，它们会出现在这里');
      $('#btn-empty-start').classList.toggle('hidden', !none);
      return;
    }
    empty.classList.add('hidden');

    container.innerHTML = list.map(g => `
      <button type="button" class="gift-item" data-id="${esc(g.id)}">
        <span class="item-icon">${iconForRecord(g, 'icon')}</span>
        <span class="item-info">
          <span class="item-name">${esc(g.giftName)}</span>
          ${parcelChipText(g.shop) ? `<span class="item-parcel">${esc(parcelChipText(g.shop))}</span>` : ''}
          <span class="item-title">${esc(g.cardTitle)}</span>
          <span class="item-meta">${esc(g.mood || '')} · ${esc(formatTime(g.timestamp))}</span>
        </span>
        <span class="item-fav ${g.favorited ? 'on' : ''}" aria-label="${g.favorited ? '已收藏' : '未收藏'}">${svgIcon(UI_ICONS.heart, 'icon' + (g.favorited ? ' filled' : ''))}</span>
      </button>
    `).join('');
  }

  async function updateCoverCount() {
    try {
      const n = (await getAllGifts()).length;
      const b = $('#cover-count');
      b.textContent = n;
      b.classList.toggle('hidden', !n);
    } catch (e) { /* 忽略 */ }
  }

  async function fillDetail(id) {
    const g = await getGift(id).catch(() => null);
    if (!g) return false;
    state.viewingId = id;
    $('#detail-icon').innerHTML = iconForRecord(g, 'icon');
    $('#detail-name').textContent = g.giftName;
    fillParcelChip($('#detail-parcel'), g.shop);
    $('#detail-theme').textContent = (g.themes || []).join(' · ') || g.category || '';
    $('#detail-card-title').textContent = g.cardTitle;
    $('#detail-message').textContent = g.message;
    const noteWrap = $('#detail-note-wrap');
    noteWrap.hidden = !g.note;
    $('#detail-note').textContent = g.note || '';
    renderShopCard($('#detail-shop'), g.shop);
    if (g.shop) $('#detail-shop').classList.add('visible');
    $('#detail-meta').textContent = `${g.taName || 'TA'} → ${g.userName || '你'} · ${g.mood || ''} · ${formatTime(g.timestamp)}`;
    setFavBtn($('#btn-detail-fav'), !!g.favorited);
    return true;
  }

  async function openDetail(id) {
    if (await fillDetail(id)) showScreen('detail', { data: { id } });
  }

  // ---------- 分享图 ----------
  const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", "Noto Sans CJK SC", sans-serif';
  const NO_LINE_START = '，。！？、；：”’」』）》…—,.!?;:)';

  function wrapLines(ctx, text, maxWidth) {
    const lines = [];
    String(text || '').split('\n').forEach(para => {
      let line = '';
      for (const ch of para) {
        const test = line + ch;
        if (ctx.measureText(test).width > maxWidth && line) {
          if (NO_LINE_START.includes(ch)) { lines.push(test); line = ''; }
          else { lines.push(line); line = ch; }
        } else line = test;
      }
      if (line) lines.push(line);
    });
    return lines;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawSpark(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rr = i % 2 === 0 ? r : r * 0.3;
      const a = -Math.PI / 2 + i * Math.PI / 4;
      ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
  }

  async function drawShareImage(record) {
    const W = 1080, PAD = 100, INNER = W - PAD * 2;
    const m = document.createElement('canvas').getContext('2d');
    m.font = `38px ${FONT}`;
    const msgLines = wrapLines(m, record.message, INNER - 80);
    m.font = `italic 32px ${FONT}`;
    const noteLines = record.note ? wrapLines(m, record.note, INNER - 120) : [];
    m.font = `600 42px ${FONT}`;
    const titleLines = wrapLines(m, record.cardTitle, INNER - 80);

    const shop = normalizeShop(record.shop);
    const cardTop = shop ? 650 : 600;
    const cardH = 80 + titleLines.length * 58 + 40 + msgLines.length * 66 + 24;
    const noteH = noteLines.length ? 90 + noteLines.length * 50 + 40 : 0;
    const needH = cardTop + cardH + (noteH ? noteH + 40 : 0) + 230;
    const H = Math.max(1440, needH);
    const off = Math.round((H - needH) / 2); // 内容少时整体垂直居中

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 背景：墨绿丝绒
    const bg = ctx.createRadialGradient(W * 0.3, 0, 60, W * 0.5, H * 0.5, H);
    bg.addColorStop(0, '#24503b');
    bg.addColorStop(0.5, '#132a20');
    bg.addColorStop(1, '#0a1410');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 边框
    ctx.strokeStyle = 'rgba(201,168,76,0.7)';
    ctx.lineWidth = 3;
    roundRect(ctx, 40, 40, W - 80, H - 80, 28);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(201,168,76,0.25)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 58, 58, W - 116, H - 116, 20);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#e8d5a3';
    ctx.font = `600 50px ${FONT}`;
    ctx.fillText('TA 的秘密礼盒', W / 2, 170);
    ctx.fillStyle = 'rgba(232,213,163,0.6)';
    ctx.font = `28px ${FONT}`;
    ctx.fillText(`来自 ${record.taName || 'TA'} 的礼物`, W / 2, 222);

    ctx.save();
    ctx.translate(0, off);
    // 图标光晕
    const cy = 375;
    const glow = ctx.createRadialGradient(W / 2, cy, 10, W / 2, cy, 150);
    glow.addColorStop(0, 'rgba(201,168,76,0.35)');
    glow.addColorStop(1, 'rgba(201,168,76,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(W / 2 - 160, cy - 160, 320, 320);
    ctx.strokeStyle = 'rgba(201,168,76,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W / 2, cy, 105, 0, Math.PI * 2);
    ctx.stroke();
    try {
      const svg = giftIconStandalone(record.giftId || (GIFTS.find(x => x.name === record.giftName) || {}).id, '#e8d5a3', 1.25);
      const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
      ctx.drawImage(img, W / 2 - 72, cy - 72, 144, 144);
    } catch (e) { /* 图标失败时只保留光圈 */ }
    ctx.fillStyle = '#c9a84c';
    drawSpark(ctx, W / 2 + 120, cy - 90, 16);
    drawSpark(ctx, W / 2 - 128, cy + 60, 10);

    ctx.fillStyle = '#c9a84c';
    ctx.font = `600 46px ${FONT}`;
    ctx.fillText(record.giftName || '', W / 2, 545);
    if (shop) {
      ctx.fillStyle = 'rgba(232,213,163,0.75)';
      ctx.font = `26px ${FONT}`;
      ctx.fillText(SHOP_PLATFORMS[shop.platform].share, W / 2, 592);
    }

    // 卡片
    ctx.fillStyle = 'rgba(232,228,217,0.06)';
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 2;
    roundRect(ctx, PAD, cardTop, INNER, cardH, 26);
    ctx.fill();
    ctx.stroke();

    let y = cardTop + 80;
    ctx.fillStyle = '#e8d5a3';
    ctx.font = `600 42px ${FONT}`;
    titleLines.forEach(l => { ctx.fillText(l, W / 2, y); y += 58; });
    ctx.fillStyle = 'rgba(201,168,76,0.35)';
    ctx.fillRect(PAD + 60, y - 22, INNER - 120, 2);
    y += 40;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e8e4d9';
    ctx.font = `38px ${FONT}`;
    msgLines.forEach(l => { ctx.fillText(l, PAD + 40, y); y += 66; });

    // 小纸条
    if (noteLines.length) {
      const ny = cardTop + cardH + 40;
      ctx.setLineDash([10, 8]);
      ctx.strokeStyle = 'rgba(201,168,76,0.45)';
      ctx.fillStyle = 'rgba(26,42,34,0.9)';
      roundRect(ctx, PAD + 30, ny, INNER - 60, noteH, 20);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#8a7340';
      ctx.font = `26px ${FONT}`;
      ctx.fillText('附上的小纸条', PAD + 70, ny + 56);
      ctx.fillStyle = '#a09a8a';
      ctx.font = `italic 32px ${FONT}`;
      let yy = ny + 112;
      noteLines.forEach(l => { ctx.fillText(l, PAD + 70, yy); yy += 50; });
    }

    ctx.restore();
    // 底部
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(232,213,163,0.75)';
    ctx.font = `28px ${FONT}`;
    ctx.fillText(`${record.taName || 'TA'} → ${record.userName || '你'}  ·  ${record.mood || ''}  ·  ${formatTime(record.timestamp).slice(0, 10)}`, W / 2, H - 150);
    ctx.fillStyle = 'rgba(160,154,138,0.6)';
    ctx.font = `24px ${FONT}`;
    ctx.fillText(shop ? `数字象征性礼物 · ${SHOP_PLATFORMS[shop.platform].share}` : '数字象征性礼物 · 仅供收藏', W / 2, H - 104);
    return canvas;
  }

  let shareState = null;
  async function showShare(record) {
    const preview = $('#share-preview');
    preview.innerHTML = '<div class="share-loading">正在生成…</div>';
    $('#btn-native-share').classList.add('hidden');
    $('#btn-download-share').disabled = true;
    openOverlay($('#share-modal'), () => {
      if (shareState) { const u = shareState.url; setTimeout(() => URL.revokeObjectURL(u), 1000); }
      shareState = null;
    });
    try {
      const canvas = await drawShareImage(record);
      const blob = await new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error('toBlob')), 'image/png'));
      if (!overlay) return; // 用户已关闭
      const url = URL.createObjectURL(blob);
      const filename = `ta-gift-${record.giftId || 'gift'}-${record.timestamp}.png`;
      shareState = { blob, url, filename };
      const img = new Image();
      img.className = 'share-image';
      img.alt = `分享图：${record.giftName}`;
      img.src = url;
      preview.innerHTML = '';
      preview.appendChild(img);
      $('#btn-download-share').disabled = false;
      const file = typeof File === 'function' ? new File([blob], filename, { type: 'image/png' }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        shareState.file = file;
        $('#btn-native-share').classList.remove('hidden');
      }
    } catch (e) {
      console.warn(e);
      preview.innerHTML = '<div class="share-loading">图片生成失败，请重试</div>';
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  // ---------- 音效开关 ----------
  function applySound(on) {
    GiftSound.setEnabled(on);
    const b = $('#btn-sound');
    b.innerHTML = svgIcon(on ? UI_ICONS.soundOn : UI_ICONS.soundOff, 'icon');
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? '拆礼音效：开' : '拆礼音效：关');
    b.classList.toggle('off', !on);
  }

  // ---------- 安装 / 更新 ----------
  let deferredInstall = null;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  function initInstall() {
    const btn = $('#btn-install');
    if (isIOS && !isStandalone()) btn.classList.remove('hidden');
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstall = e;
      btn.classList.remove('hidden');
    });
    window.addEventListener('appinstalled', () => { btn.classList.add('hidden'); toast('已添加到桌面'); });
    btn.addEventListener('click', async () => {
      if (deferredInstall) {
        deferredInstall.prompt();
        await deferredInstall.userChoice.catch(() => {});
        deferredInstall = null;
        return;
      }
      const msg = isIOS
        ? '用 Safari 打开本页 → 点底部「分享」按钮 → 选择「添加到主屏幕」。'
        : '打开浏览器菜单（⋮ 或 ≡）→ 选择「添加到主屏幕」或「安装应用」。';
      dialogAnswer = false;
      $('#dialog-title').textContent = '添加到手机桌面';
      $('#dialog-message').textContent = msg + '添加后可像 App 一样打开，断网也能使用。';
      $('#dialog-confirm').textContent = '知道了';
      $('#dialog-cancel').classList.add('hidden');
      openOverlay($('#dialog-overlay'));
    });
  }

  function initServiceWorker() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        const prompt = (w) => toast('有新版本可用', { duration: 0, action: { label: '更新', fn: () => w.postMessage({ type: 'SKIP_WAITING' }) } });
        if (reg.waiting && navigator.serviceWorker.controller) prompt(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) prompt(nw);
          });
        });
      }).catch(err => console.warn('SW 注册失败', err));
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloading) return;
        reloading = true;
        location.reload();
      });
    });
  }

  // ---------- 事件绑定 ----------
  function bindEvents() {
    // 封面
    $('#btn-start').addEventListener('click', () => { GiftSound.unlock(); showScreen('names'); });
    $('#btn-to-collection').addEventListener('click', async () => { await renderCollection(); showScreen('collection'); });

    // 名字
    const namesNext = () => {
      state.userName = $('#input-user-name').value.trim() || '你';
      state.taName = $('#input-ta-name').value.trim() || 'TA';
      saveNames();
      resetMood();
      showScreen('mood');
    };
    $('#btn-names-next').addEventListener('click', namesNext);
    $('#input-user-name').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#input-ta-name').focus(); } });
    $('#input-ta-name').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); namesNext(); } });
    $('#btn-names-back').addEventListener('click', () => history.back());

    // 心情
    $('#btn-mood-next').addEventListener('click', () => {
      if (!state.selectedMood) return;
      if (!state.userName) { state.userName = '你'; state.taName = state.taName || 'TA'; }
      state.currentGift = pickGift(state.selectedMood);
      startUnbox();
    });
    $('#btn-mood-back').addEventListener('click', () => { loadNames(); showScreen('names'); });

    // 拆礼
    $('#unbox-stage').addEventListener('click', openBox);
    $('#btn-skip').addEventListener('click', skipUnbox);

    // 揭示页
    $('#btn-favorite').addEventListener('click', async () => {
      const id = $('#btn-favorite').dataset.id;
      if (!id) return;
      const g = await toggleFavorite(id).catch(() => null);
      if (g) { setFavBtn($('#btn-favorite'), g.favorited); toast(g.favorited ? '已放进收藏' : '已取消收藏'); }
      else toast('礼物还在保存中，请稍后再试');
    });
    $('#btn-share').addEventListener('click', () => {
      if (state.currentGift && state.currentGift.record) showShare(state.currentGift.record);
    });
    $('#btn-again').addEventListener('click', () => { resetMood(); showScreen('mood'); });
    $('#btn-to-collection-from-reveal').addEventListener('click', async () => { await renderCollection(); showScreen('collection'); });

    // 陈列室
    $('#btn-collection-back').addEventListener('click', () => showScreen('cover'));
    let searchTimer = null;
    $('#search-input').addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(renderCollection, 150);
    });
    $('#filter-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      state.filter = tab.dataset.filter;
      renderCollection();
    });
    $('#gift-list').addEventListener('click', (e) => {
      const item = e.target.closest('.gift-item');
      if (item) openDetail(item.dataset.id);
    });
    $('#btn-empty-start').addEventListener('click', () => { loadNames(); showScreen(state.userName ? 'mood' : 'names'); if (state.userName) resetMood(); });

    $('#btn-export').addEventListener('click', async () => {
      try {
        const data = await exportAll();
        if (!data.gifts.length) { toast('陈列室还是空的，暂无可导出的内容'); return; }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `ta-giftbox-backup-${new Date().toISOString().slice(0, 10)}.json`);
        toast(`已导出 ${data.gifts.length} 份礼物`);
      } catch (e) { toast('导出失败，请重试'); }
    });

    $('#btn-import').addEventListener('click', () => $('#import-file').click());
    $('#import-file').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      try {
        if (file.size > 10 * 1024 * 1024) throw new Error('too large');
        const data = JSON.parse(await file.text());
        const r = await importData(data);
        await renderCollection();
        toast(`导入完成：新增 ${r.added} 份${r.updated ? `，更新 ${r.updated} 份` : ''}${r.skipped ? `，跳过 ${r.skipped} 条无效记录` : ''}`, { duration: 4000 });
      } catch (err) {
        toast('导入失败：请选择本站导出的 JSON 备份文件', { duration: 4000 });
      }
    });

    $('#btn-clear-all').addEventListener('click', async () => {
      const n = (await getAllGifts().catch(() => [])).length;
      if (!n) { toast('陈列室已经是空的'); return; }
      const ok = await confirmDialog('清空全部礼物？', `将删除全部 ${n} 份礼物，此操作不可恢复。建议先导出备份。`, '清空');
      if (ok) {
        await clearAllGifts();
        await renderCollection();
        toast('已清空');
      }
    });

    // 详情
    $('#btn-detail-fav').addEventListener('click', async () => {
      if (!state.viewingId) return;
      const g = await toggleFavorite(state.viewingId);
      if (g) { setFavBtn($('#btn-detail-fav'), g.favorited); toast(g.favorited ? '已放进收藏' : '已取消收藏'); }
    });
    $('#btn-detail-share').addEventListener('click', async () => {
      const g = await getGift(state.viewingId);
      if (g) showShare(g);
    });
    $('#btn-detail-delete').addEventListener('click', async () => {
      const ok = await confirmDialog('删除这份礼物？', '删除后无法恢复。', '删除');
      if (ok) {
        await deleteGift(state.viewingId);
        state.viewingId = null;
        await renderCollection();
        showScreen('collection', { replace: true });
        toast('已删除');
      }
    });
    const backToCollection = async () => { await renderCollection(); showScreen('collection'); };
    $('#btn-detail-back').addEventListener('click', backToCollection);
    $('#btn-detail-top-back').addEventListener('click', backToCollection);

    // 分享弹层
    $('#btn-close-share').addEventListener('click', () => closeOverlay());
    $('#btn-download-share').addEventListener('click', () => {
      if (!shareState) return;
      downloadBlob(shareState.blob, shareState.filename);
      toast('图片已保存');
    });
    $('#btn-native-share').addEventListener('click', () => {
      if (shareState && shareState.file) navigator.share({ files: [shareState.file], title: 'TA 的秘密礼盒' }).catch(() => {});
    });
    $('#share-modal').addEventListener('click', (e) => { if (e.target === $('#share-modal')) closeOverlay(); });

    // 对话框
    $('#dialog-cancel').addEventListener('click', () => { dialogAnswer = false; closeOverlay(); });
    $('#dialog-confirm').addEventListener('click', () => { dialogAnswer = true; closeOverlay(); });
    $('#dialog-overlay').addEventListener('click', (e) => { if (e.target === $('#dialog-overlay')) { dialogAnswer = false; closeOverlay(); } });

    // 音效
    $('#btn-sound').addEventListener('click', () => {
      const on = !GiftSound.isEnabled();
      applySound(on);
      const prefs = getPrefs();
      prefs.sound = on;
      setPrefs(prefs);
      if (on) GiftSound.tap();
      toast(on ? '拆礼音效已开启' : '拆礼音效已关闭');
    });
  }

  function decorateButtons() {
    setFavBtn($('#btn-favorite'), false);
    setFavBtn($('#btn-detail-fav'), false);
    setBtn($('#btn-share'), UI_ICONS.image, '生成分享图');
    setBtn($('#btn-detail-share'), UI_ICONS.image, '生成分享图');
    setBtn($('#btn-detail-delete'), UI_ICONS.trash, '删除');
    setBtn($('#btn-export'), UI_ICONS.download, '导出备份');
    setBtn($('#btn-import'), UI_ICONS.upload, '导入恢复');
    setBtn($('#btn-clear-all'), UI_ICONS.trash, '清空全部');
    setBtn($('#btn-download-share'), UI_ICONS.download, '保存图片');
    setBtn($('#btn-native-share'), UI_ICONS.share, '分享');
    $('#btn-collection-back').innerHTML = svgIcon(UI_ICONS.back, 'icon');
    $('#btn-detail-top-back').innerHTML = svgIcon(UI_ICONS.back, 'icon');
    $('#search-icon').innerHTML = svgIcon(UI_ICONS.search, 'icon');
    $('#empty-icon').innerHTML = svgIcon(UI_ICONS.box, 'icon');
  }

  // ---------- 启动 ----------
  function init() {
    history.replaceState({ screen: 'cover' }, '');
    state.reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    decorateButtons();
    renderMoods();
    loadNames();
    applySound(getPrefs().sound !== false);
    bindEvents();
    initInstall();
    initServiceWorker();
    openDB().then(updateCoverCount).catch(() => {
      toast('当前浏览器无法保存礼物（可能为无痕模式），拆礼仍可体验', { duration: 5000 });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
