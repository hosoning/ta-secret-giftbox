/**
 * IndexedDB 封装 - 礼物陈列室本地存储
 */

const DB_NAME = 'TA_Secret_GiftBox';
const DB_VERSION = 1;
const STORE_NAME = 'gifts';
const PREF_KEY = 'ta_giftbox_prefs';

let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('giftId', 'giftId', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('favorited', 'favorited', { unique: false });
      }
    };
  });
}

async function saveGift(record) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

async function getAllGifts() {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const list = req.result || [];
      list.sort((a, b) => b.timestamp - a.timestamp);
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

async function getGift(id) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deleteGift(id) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function clearAllGifts() {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function toggleFavorite(id) {
  const gift = await getGift(id);
  if (!gift) return null;
  gift.favorited = !gift.favorited;
  await saveGift(gift);
  return gift;
}

// localStorage 偏好
function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
  } catch {
    return {};
  }
}

function setPrefs(prefs) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch (e) { /* 存储不可用（如部分无痕模式）时忽略 */ }
}

function getRecentGiftIds(limit = 8) {
  const prefs = getPrefs();
  return prefs.recentGiftIds || [];
}

function addRecentGiftId(giftId) {
  const prefs = getPrefs();
  let recent = prefs.recentGiftIds || [];
  recent = recent.filter(id => id !== giftId);
  recent.unshift(giftId);
  if (recent.length > 12) recent = recent.slice(0, 12);
  prefs.recentGiftIds = recent;
  setPrefs(prefs);
}

// 导出 / 导入
async function exportAll() {
  const gifts = await getAllGifts();
  const prefs = getPrefs();
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    gifts,
    prefs
  };
}

/** 校验并规范化一条导入的礼物记录，无效返回 null */
function normalizeGiftRecord(g) {
  if (!g || typeof g !== 'object') return null;
  if (typeof g.id !== 'string' || !g.id) return null;
  if (typeof g.giftName !== 'string' || !g.giftName) return null;
  if (typeof g.message !== 'string' || !g.message) return null;
  const ts = typeof g.timestamp === 'number' ? g.timestamp : Date.parse(g.timestamp);
  if (!isFinite(ts)) return null;
  const str = (v, max) => (v == null ? '' : String(v)).slice(0, max);
  return {
    id: str(g.id, 80),
    timestamp: ts,
    userName: str(g.userName, 24),
    taName: str(g.taName, 24),
    mood: str(g.mood, 20),
    giftId: str(g.giftId, 40),
    giftName: str(g.giftName, 60),
    category: str(g.category, 20),
    themes: Array.isArray(g.themes) ? g.themes.map(t => str(t, 20)).slice(0, 8) : [],
    icon: str(g.icon, 8),
    cardTitle: str(g.cardTitle, 80),
    message: str(g.message, 4000),
    note: g.note ? str(g.note, 400) : null,
    style: str(g.style, 10),
    favorited: !!g.favorited,
    materialVersion: str(g.materialVersion || '1.0', 10)
  };
}

/**
 * 导入备份：逐条校验，返回 { added, updated, skipped }
 * 名字等偏好仅在本机尚未设置时才使用备份中的值，避免覆盖当前设置。
 */
async function importData(data) {
  const list = Array.isArray(data) ? data : (data && Array.isArray(data.gifts) ? data.gifts : null);
  if (!list) throw new Error('无效的备份文件');
  const existing = new Set((await getAllGifts()).map(g => g.id));
  let added = 0, updated = 0, skipped = 0;
  for (const raw of list) {
    const g = normalizeGiftRecord(raw);
    if (!g) { skipped++; continue; }
    if (existing.has(g.id)) updated++; else added++;
    await saveGift(g);
  }
  if (!added && !updated) throw new Error('备份中没有有效记录');
  if (data && data.prefs && typeof data.prefs === 'object') {
    const prefs = getPrefs();
    if (!prefs.userName && data.prefs.userName) prefs.userName = String(data.prefs.userName).slice(0, 12);
    if (!prefs.taName && data.prefs.taName) prefs.taName = String(data.prefs.taName).slice(0, 12);
    setPrefs(prefs);
  }
  return { added, updated, skipped };
}
