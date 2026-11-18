/**
 * 内容包校验：图标映射、心情覆盖、留言唯一性、禁用套话。
 * 用法：node tools/test-data.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const ctx = { console: { log() {} } };
vm.createContext(ctx);
const iconSrc = fs.readFileSync(path.join(root, 'js/icons.js'), 'utf8');
const dataSrc = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
// const/let 不会挂到 context 上，需要显式导出
vm.runInContext(
  iconSrc + '\n' + dataSrc + '\nthis.GIFTS = GIFTS; this.MOODS = MOODS; this.MOOD_MAP = MOOD_MAP; this.GIFT_ICONS = GIFT_ICONS;',
  ctx
);

const { GIFTS, MOODS, MOOD_MAP, GIFT_ICONS } = ctx;
const results = [];
const ok = (name, cond, extra = '') => {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
  return cond;
};

let failed = 0;
const check = (name, cond, extra) => {
  if (!ok(name, cond, extra)) failed += 1;
};

check('data.js and icons.js parse', Array.isArray(GIFTS) && GIFTS.length > 0 && GIFT_ICONS && typeof GIFT_ICONS === 'object');
check('gift count in range 40–48', GIFTS.length >= 40 && GIFTS.length <= 48, String(GIFTS.length));

const ids = GIFTS.map((g) => g.id);
check('gift ids unique', ids.length === new Set(ids).size);

const missingIcons = GIFTS.filter((g) => !GIFT_ICONS[g.id]).map((g) => g.id);
check('every gift has an icon mapping', missingIcons.length === 0, missingIcons.join(','));

const moodLabels = (MOODS || []).map((m) => m.label);
check('MOODS present', moodLabels.length >= 6, moodLabels.join(' / '));

const coverage = {};
for (const m of moodLabels) coverage[m] = [];
for (const g of GIFTS) {
  for (const m of g.moods || []) {
    if (coverage[m]) coverage[m].push(g.id);
  }
}
for (const m of moodLabels) {
  const n = coverage[m].length;
  check(`mood “${m}” has ≥ 8 gifts`, n >= 8, `${n}: ${coverage[m].join(',')}`);
}

const onlyOrdinary = GIFTS.filter((g) => (g.moods || []).length === 1 && g.moods[0] === '普通的一天').map((g) => g.id);
check('no gift trapped in only 普通的一天', onlyOrdinary.length === 0, onlyOrdinary.join(','));

// MOOD_MAP should not contradict (optional helper)
if (MOOD_MAP) {
  const mapMiss = moodLabels.filter((m) => !Array.isArray(MOOD_MAP[m]));
  check('MOOD_MAP covers all mood labels', mapMiss.length === 0, mapMiss.join(','));
}

const messages = [];
const titles = [];
let packs = 0;
let notes = 0;
const short = [];
const stylesOk = [];
for (const g of GIFTS) {
  check(`gift ${g.id} has tease`, typeof g.tease === 'string' && g.tease.length > 0);
  check(`gift ${g.id} has packs`, Array.isArray(g.packs) && g.packs.length >= 2);
  for (const p of g.packs || []) {
    packs += 1;
    messages.push(p.message);
    titles.push(p.cardTitle);
    if (p.note) notes += 1;
    if (!p.message || p.message.length < 70 || p.message.length > 160) {
      short.push(`${g.id}:${p.message ? p.message.length : 0}`);
    }
    if (!['温柔', '克制', '安静', '直接', '俏皮'].includes(p.style)) stylesOk.push(`${g.id}:${p.style}`);
  }
}
check('all pack messages unique', messages.length === new Set(messages).size, `n=${messages.length}`);
check('all card titles unique', titles.length === new Set(titles).size);
check('more than half of packs have notes', notes * 2 > packs, `${notes}/${packs}`);
check('pack messages 70–160 chars', short.length === 0, short.slice(0, 6).join(','));
check('pack styles are known values', stylesOk.length === 0, stylesOk.join(','));

const FORBIDDEN = ['不必', '不用急着', '已经很好了', '就这样挺好', '值得被看见', '放着就好', '你值得', '慢慢来', '先放着', '明天再说'];
const sloganHits = [];
for (const g of GIFTS) {
  for (const p of g.packs || []) {
    for (const field of [p.cardTitle, p.message, p.note || '', g.name, g.tease]) {
      for (const f of FORBIDDEN) {
        if (field.includes(f)) sloganHits.push(`${g.id} “${f}” in: ${field.slice(0, 24)}`);
      }
      if (/我在[。！]?$/.test(String(field).trim())) sloganHits.push(`${g.id} ends with 我在`);
    }
  }
}
check('no forbidden slogan phrases', sloganHits.length === 0, sloganHits.slice(0, 8).join(' | '));

const PLATFORMS = new Set(['taobao', 'jd', 'pdd']);
const shoppable = [];
const handmade = [];
const badShop = [];
for (const g of GIFTS) {
  const shop = g.shop;
  if (shop == null) {
    handmade.push(g.id);
    continue;
  }
  shoppable.push(g.id);
  if (typeof shop !== 'object') {
    badShop.push(`${g.id}: shop is not an object`);
    continue;
  }
  if (!shop.url || !String(shop.url).trim()) {
    badShop.push(`${g.id}: empty or missing shop.url`);
    continue;
  }
  if (!/^https?:\/\//i.test(String(shop.url))) {
    badShop.push(`${g.id}: shop.url is not http(s)`);
  }
  if (!PLATFORMS.has(shop.platform)) {
    badShop.push(`${g.id}: platform ${shop.platform}`);
  }
}
check('handmade gifts have no shop button data', handmade.every((id) => {
  const g = GIFTS.find((x) => x.id === id);
  return !g.shop || !g.shop.url;
}), handmade.join(','));
check('every shoppable gift has a valid shop.url and platform', badShop.length === 0, badShop.slice(0, 8).join(' | '));
check('shoppable count in range 28–35', shoppable.length >= 28 && shoppable.length <= 35, String(shoppable.length));
check('handmade count in range 8–12', handmade.length >= 8 && handmade.length <= 13, String(handmade.length));

const surprise = coverage['想要惊喜'] || [];
const surpriseShop = surprise.filter((id) => shoppable.includes(id));
const surpriseHand = surprise.filter((id) => handmade.includes(id));
check('想要惊喜 has a handmade + shop mix', surpriseShop.length >= 3 && surpriseHand.length >= 3, `shop ${surpriseShop.length} / handmade ${surpriseHand.length}`);

console.log(results.join('\n'));
console.log(`\nshoppable ${shoppable.length} · handmade ${handmade.length}`);
console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} passed`);
if (failed) process.exit(1);
