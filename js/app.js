/**
 * 《TA 的秘密礼盒》主逻辑
 */

(function () {
  'use strict';

  // ---------- 状态 ----------
  const state = {
    userName: '',
    taName: '',
    selectedMood: null,
    currentGift: null,   // { gift, pack, record }
    viewingId: null,
    filter: 'all',
    searchQuery: ''
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
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (screens[name]) screens[name].classList.add('active');
    window.scrollTo(0, 0);
  }

  function uid() {
    return 'g_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // ---------- 抽取逻辑（绑定内容包，优先降低近期重复） ----------
  function pickGift(moodLabel) {
    const recentIds = getRecentGiftIds();
    let pool = GIFTS.filter(g => {
      const moods = g.moods || [];
      return moods.includes(moodLabel);
    });
    if (pool.length === 0) pool = GIFTS.slice();

    // 降低近期重复：把最近出现的放到后面
    pool = pool.slice().sort((a, b) => {
      const ia = recentIds.indexOf(a.id);
      const ib = recentIds.indexOf(b.id);
      if (ia === -1 && ib === -1) return Math.random() - 0.5;
      if (ia === -1) return -1;
      if (ib === -1) return 1;
      return ib - ia; // 越近越往后
    });

    // 从前半段随机选，兼顾新鲜与随机
    const half = Math.max(1, Math.ceil(pool.length * 0.6));
    const candidates = pool.slice(0, half);
    const gift = candidates[Math.floor(Math.random() * candidates.length)];

    // 从该礼物的 packs 中随机选一套（绑定）
    const pack = gift.packs[Math.floor(Math.random() * gift.packs.length)];

    addRecentGiftId(gift.id);
    return { gift, pack };
  }

  // ---------- 名字 ----------
  function loadNames() {
    const prefs = getPrefs();
    if (prefs.userName) {
      state.userName = prefs.userName;
      $('#input-user-name').value = prefs.userName;
    }
    if (prefs.taName) {
      state.taName = prefs.taName;
      $('#input-ta-name').value = prefs.taName;
    }
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
      const el = document.createElement('div');
      el.className = 'mood-item';
      el.dataset.mood = m.label;
      el.innerHTML = `<div class="mood-label">${m.label}</div><div class="mood-desc">${m.desc}</div>`;
      el.addEventListener('click', () => {
        $$('.mood-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
        state.selectedMood = m.label;
        $('#btn-mood-next').disabled = false;
      });
      grid.appendChild(el);
    });
  }

  // ---------- 拆礼动画 ----------
  let unboxTimer = null;
  let unboxSkipped = false;

  function startUnbox() {
    unboxSkipped = false;
    const box = $('#unbox-box');
    const icon = $('#unbox-gift-icon');
    const stage = $('#unbox-stage');
    const hint = $('#unbox-hint');
    const skip = $('#skip-hint');

    box.classList.remove('opened');
    stage.classList.remove('revealed');
    icon.style.opacity = '0';
    icon.style.transform = 'translate(-50%, -50%) scale(0)';
    icon.textContent = state.currentGift.gift.icon;
    hint.textContent = '点击礼盒拆开';
    hint.style.display = '';
    skip.style.display = 'none';

    showScreen('unbox');

    const doOpen = () => {
      if (unboxSkipped) return;
      unboxSkipped = true;
      box.classList.add('opened');
      stage.classList.add('revealed');
      hint.style.display = 'none';
      skip.style.display = 'none';
      clearTimeout(unboxTimer);
      setTimeout(() => showReveal(), 900);
    };

    // 点击礼盒或任意处
    const clickHandler = (e) => {
      e.preventDefault();
      doOpen();
      stage.removeEventListener('click', clickHandler);
      document.removeEventListener('click', clickHandler);
    };

    // 先等用户点击礼盒
    stage.addEventListener('click', clickHandler, { once: true });

    // 3 秒后显示跳过提示，再点任意处可跳过
    unboxTimer = setTimeout(() => {
      if (!unboxSkipped) {
        skip.style.display = '';
        document.addEventListener('click', clickHandler, { once: true });
      }
    }, 2800);
  }

  // ---------- 揭示 ----------
  async function showReveal() {
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
      materialVersion: '1.0'
    };

    state.currentGift.record = record;
    await saveGift(record);

    // 填充内容
    $('#reveal-icon').textContent = gift.icon;
    $('#reveal-name').textContent = gift.name;
    $('#reveal-theme').textContent = (gift.themes || []).join(' · ') || gift.category;
    $('#reveal-card-title').textContent = pack.cardTitle;
    $('#reveal-message').textContent = pack.message;

    const noteLayer = $('#layer-note');
    if (pack.note) {
      $('#reveal-note').textContent = pack.note;
      noteLayer.style.display = '';
    } else {
      noteLayer.style.display = 'none';
    }

    $('#reveal-meta').textContent = `${state.taName || 'TA'} → ${state.userName || '你'} · ${state.selectedMood} · ${formatTime(record.timestamp)}`;

    // 收藏按钮状态
    const favBtn = $('#btn-favorite');
    favBtn.textContent = '♡ 收藏';
    favBtn.dataset.id = record.id;

    // 分层出现
    const layers = ['layer-gift', 'layer-card', 'layer-note'];
    layers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('visible');
    });

    showScreen('reveal');

    setTimeout(() => $('#layer-gift').classList.add('visible'), 80);
    setTimeout(() => $('#layer-card').classList.add('visible'), 350);
    if (pack.note) {
      setTimeout(() => $('#layer-note').classList.add('visible'), 600);
    }
  }

  // ---------- 陈列室 ----------
  async function renderCollection() {
    let list = await getAllGifts();
    const q = state.searchQuery.trim().toLowerCase();
    if (state.filter === 'favorited') {
      list = list.filter(g => g.favorited);
    }
    if (q) {
      list = list.filter(g =>
        (g.giftName || '').toLowerCase().includes(q) ||
        (g.cardTitle || '').toLowerCase().includes(q) ||
        (g.message || '').toLowerCase().includes(q) ||
        (g.category || '').toLowerCase().includes(q) ||
        (g.mood || '').toLowerCase().includes(q)
      );
    }

    const container = $('#gift-list');
    const empty = $('#empty-state');
    container.innerHTML = '';

    if (list.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    list.forEach(g => {
      const el = document.createElement('div');
      el.className = 'gift-item';
      el.innerHTML = `
        <span class="item-icon">${g.icon || '🎁'}</span>
        <div class="item-info">
          <div class="item-name">${g.giftName}</div>
          <div class="item-meta">${g.mood || ''} · ${formatTime(g.timestamp)}</div>
        </div>
        <span class="item-fav ${g.favorited ? 'on' : ''}">${g.favorited ? '♥' : '♡'}</span>
      `;
      el.addEventListener('click', () => openDetail(g.id));
      container.appendChild(el);
    });
  }

  async function openDetail(id) {
    const g = await getGift(id);
    if (!g) return;
    state.viewingId = id;

    $('#detail-icon').textContent = g.icon || '🎁';
    $('#detail-name').textContent = g.giftName;
    $('#detail-theme').textContent = (g.themes || []).join(' · ') || g.category || '';
    $('#detail-card-title').textContent = g.cardTitle;
    $('#detail-message').textContent = g.message;

    const noteWrap = $('#detail-note-wrap');
    if (g.note) {
      $('#detail-note').textContent = g.note;
      noteWrap.style.display = '';
      noteWrap.classList.add('visible');
    } else {
      noteWrap.style.display = 'none';
    }

    $('#detail-meta').textContent = `${g.taName || 'TA'} → ${g.userName || '你'} · ${g.mood || ''} · ${formatTime(g.timestamp)}`;

    const favBtn = $('#btn-detail-fav');
    favBtn.textContent = g.favorited ? '♥ 已收藏' : '♡ 收藏';
    favBtn.dataset.id = id;

    showScreen('detail');
  }

  // ---------- 分享图 ----------
  function drawShareImage(record) {
    const canvas = $('#share-canvas');
    const ctx = canvas.getContext('2d');
    const W = 600, H = 800;
    canvas.width = W;
    canvas.height = H;

    // 背景
    const grd = ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, '#0c1410');
    grd.addColorStop(0.5, '#14201a');
    grd.addColorStop(1, '#0c1410');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // 装饰边框
    ctx.strokeStyle = 'rgba(201,168,76,0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, W - 48, H - 48);

    // 标题
    ctx.fillStyle = '#e8d5a3';
    ctx.font = '600 28px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TA 的秘密礼盒', W / 2, 80);

    // 图标
    ctx.font = '72px serif';
    ctx.fillText(record.icon || '🎁', W / 2, 180);

    // 礼物名
    ctx.fillStyle = '#c9a84c';
    ctx.font = '600 26px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(record.giftName || '', W / 2, 240);

    // 卡片标题
    ctx.fillStyle = '#e8e4d9';
    ctx.font = '500 20px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(record.cardTitle || '', W / 2, 300);

    // 留言（自动换行）
    ctx.fillStyle = '#c8c4b8';
    ctx.font = '16px "PingFang SC", "Microsoft YaHei", sans-serif';
    const msg = record.message || '';
    const maxWidth = W - 100;
    const lineHeight = 28;
    let y = 360;
    const paragraphs = msg.split('\n');
    paragraphs.forEach(para => {
      let line = '';
      for (let i = 0; i < para.length; i++) {
        const test = line + para[i];
        if (ctx.measureText(test).width > maxWidth && line) {
          ctx.fillText(line, W / 2, y);
          line = para[i];
          y += lineHeight;
        } else {
          line = test;
        }
      }
      if (line) {
        ctx.fillText(line, W / 2, y);
        y += lineHeight;
      }
      y += 8;
    });

    // 小纸条
    if (record.note) {
      y += 16;
      ctx.fillStyle = 'rgba(201,168,76,0.5)';
      ctx.font = '13px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.fillText('— ' + record.note, W / 2, y);
    }

    // 底部信息
    ctx.fillStyle = '#6b6558';
    ctx.font = '13px "PingFang SC", "Microsoft YaHei", sans-serif';
    const bottom = `${record.taName || 'TA'} → ${record.userName || '你'}  ·  ${record.mood || ''}`;
    ctx.fillText(bottom, W / 2, H - 60);
    ctx.fillText('数字象征性礼物 · 仅供收藏', W / 2, H - 36);

    return canvas;
  }

  function showShare(record) {
    drawShareImage(record);
    $('#share-modal').classList.add('active');
  }

  // ---------- 对话框 ----------
  let dialogResolve = null;
  function confirmDialog(title, message) {
    return new Promise(resolve => {
      dialogResolve = resolve;
      $('#dialog-title').textContent = title;
      $('#dialog-message').textContent = message;
      $('#dialog-overlay').classList.add('active');
    });
  }

  // ---------- 事件绑定 ----------
  function bindEvents() {
    // 封面
    $('#btn-start').addEventListener('click', () => {
      loadNames();
      showScreen('names');
    });
    $('#btn-to-collection').addEventListener('click', async () => {
      await renderCollection();
      showScreen('collection');
    });

    // 名字
    $('#btn-names-next').addEventListener('click', () => {
      state.userName = $('#input-user-name').value.trim() || '你';
      state.taName = $('#input-ta-name').value.trim() || 'TA';
      saveNames();
      state.selectedMood = null;
      $$('.mood-item').forEach(i => i.classList.remove('selected'));
      $('#btn-mood-next').disabled = true;
      showScreen('mood');
    });
    $('#btn-names-back').addEventListener('click', () => showScreen('cover'));

    // 心情
    $('#btn-mood-next').addEventListener('click', () => {
      if (!state.selectedMood) return;
      const picked = pickGift(state.selectedMood);
      state.currentGift = picked;
      startUnbox();
    });
    $('#btn-mood-back').addEventListener('click', () => showScreen('names'));

    // 揭示页
    $('#btn-favorite').addEventListener('click', async () => {
      const id = $('#btn-favorite').dataset.id;
      if (!id) return;
      const g = await toggleFavorite(id);
      if (g) {
        $('#btn-favorite').textContent = g.favorited ? '♥ 已收藏' : '♡ 收藏';
      }
    });
    $('#btn-share').addEventListener('click', () => {
      if (state.currentGift && state.currentGift.record) {
        showShare(state.currentGift.record);
      }
    });
    $('#btn-again').addEventListener('click', () => {
      state.selectedMood = null;
      $$('.mood-item').forEach(i => i.classList.remove('selected'));
      $('#btn-mood-next').disabled = true;
      showScreen('mood');
    });
    $('#btn-to-collection-from-reveal').addEventListener('click', async () => {
      await renderCollection();
      showScreen('collection');
    });

    // 陈列室
    $('#btn-collection-back').addEventListener('click', () => showScreen('cover'));
    $('#search-input').addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCollection();
    });
    $('#filter-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.filter = tab.dataset.filter;
      renderCollection();
    });

    $('#btn-export').addEventListener('click', async () => {
      const data = await exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ta-giftbox-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    $('#btn-import').addEventListener('click', () => $('#import-file').click());
    $('#import-file').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const count = await importData(data);
        await renderCollection();
        alert(`成功导入 ${count} 条礼物记录`);
      } catch (err) {
        alert('导入失败：文件格式不正确');
      }
      e.target.value = '';
    });

    $('#btn-clear-all').addEventListener('click', async () => {
      const ok = await confirmDialog('清空全部礼物？', '此操作不可恢复。建议先导出备份。');
      if (ok) {
        await clearAllGifts();
        await renderCollection();
      }
    });

    // 详情
    $('#btn-detail-fav').addEventListener('click', async () => {
      const id = state.viewingId;
      if (!id) return;
      const g = await toggleFavorite(id);
      if (g) {
        $('#btn-detail-fav').textContent = g.favorited ? '♥ 已收藏' : '♡ 收藏';
      }
    });
    $('#btn-detail-share').addEventListener('click', async () => {
      const g = await getGift(state.viewingId);
      if (g) showShare(g);
    });
    $('#btn-detail-delete').addEventListener('click', async () => {
      const ok = await confirmDialog('删除这条礼物？', '删除后无法恢复。');
      if (ok) {
        await deleteGift(state.viewingId);
        await renderCollection();
        showScreen('collection');
      }
    });
    $('#btn-detail-back').addEventListener('click', async () => {
      await renderCollection();
      showScreen('collection');
    });

    // 分享弹层
    $('#btn-close-share').addEventListener('click', () => {
      $('#share-modal').classList.remove('active');
    });
    $('#btn-download-share').addEventListener('click', () => {
      const canvas = $('#share-canvas');
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `ta-gift-${Date.now()}.png`;
      a.click();
    });
    $('#share-modal').addEventListener('click', (e) => {
      if (e.target === $('#share-modal')) {
        $('#share-modal').classList.remove('active');
      }
    });

    // 对话框
    $('#dialog-cancel').addEventListener('click', () => {
      $('#dialog-overlay').classList.remove('active');
      if (dialogResolve) dialogResolve(false);
    });
    $('#dialog-confirm').addEventListener('click', () => {
      $('#dialog-overlay').classList.remove('active');
      if (dialogResolve) dialogResolve(true);
    });
  }

  // ---------- 启动 ----------
  function init() {
    renderMoods();
    loadNames();
    bindEvents();
    // 预开 DB
    openDB().catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
