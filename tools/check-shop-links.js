/**
 * 检查 js/data.js 里商店链接的 HTTP 状态。
 * 用法：node tools/check-shop-links.js
 * 404 / 410 视为失败；403、登录墙、超时仍保留官方商品链接（脚本会标注）。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const ctx = { console: { log() {} } };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(root, 'js/icons.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') +
  '\nthis.GIFTS = GIFTS;',
  ctx
);

const GIFTS = ctx.GIFTS;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

function checkUrl(url) {
  const args = [
    '-sI', '-L', '--connect-timeout', '8', '--max-time', '15',
    '--max-redirs', '6', '-A', UA,
    '-w', '||%{http_code}',
    url
  ];
  const r = spawnSync('curl', args, { encoding: 'utf8', timeout: 20000 });
  if (r.error) return { status: 'ERR', detail: r.error.message };
  const out = r.stdout || '';
  const m = out.match(/\|\|(\d{3})\s*$/);
  const status = m ? Number(m[1]) : 0;
  return { status: status || 'ERR', detail: (m ? String(status) : out.slice(-120).trim()) };
}

const rows = [];
for (const g of GIFTS) {
  if (!g.shop || !g.shop.url) continue;
  const res = checkUrl(g.shop.url);
  rows.push({
    id: g.id,
    platform: g.shop.platform,
    url: g.shop.url,
    status: res.status,
    detail: res.detail
  });
  const tag = res.status === 200 ? 'OK ' : (res.status === 404 || res.status === 410 ? 'FAIL' : 'WARN');
  console.log(`${tag}  ${g.id}  ${g.shop.platform}  ${res.status}  ${g.shop.url}`);
}

const counts = {};
for (const r of rows) {
  const key = String(r.status);
  counts[key] = (counts[key] || 0) + 1;
}
console.log('\n--- 汇总 ---');
console.log('checked', rows.length);
Object.keys(counts).sort().forEach((k) => console.log(`  ${k}: ${counts[k]}`));

const dead = rows.filter((r) => r.status === 404 || r.status === 410);
if (dead.length) {
  console.log('\n需要替换的失效链接：');
  dead.forEach((r) => console.log(`  ${r.id}  ${r.url}`));
  process.exit(1);
}
