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
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
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

async function importData(data) {
  if (!data || !Array.isArray(data.gifts)) throw new Error('无效的备份文件');
  for (const g of data.gifts) {
    await saveGift(g);
  }
  if (data.prefs) setPrefs(data.prefs);
  return data.gifts.length;
}
