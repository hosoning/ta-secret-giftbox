/**
 * 统一风格线性 SVG 图标（24×24，描边，currentColor）
 * 替代原 emoji，保证不同手机上显示一致。
 * 新增礼物时：在 GIFT_ICONS 中按礼物 id 增加一项即可；没有对应图标时会显示通用礼盒图标。
 */
const GIFT_ICONS = {
  scarf: '<path d="M6 5c0-1 1.5-2 6-2s6 1 6 2v3c0 2-2.7 3.5-6 3.5S6 10 6 8z"/><path d="M14 10.8 15.5 21H12l-1-9.6"/><path d="M12.3 15h3.4M12.7 18h3.3"/>',
  flowers: '<circle cx="9" cy="6.5" r="2.2"/><circle cx="15" cy="6.5" r="2.2"/><circle cx="12" cy="4.2" r="2.2"/><path d="M12 6.5V11M9.5 8.6 11 11M14.5 8.6 13 11"/><path d="M7 11h10l-3.5 10h-3z"/>',
  movie_ticket: '<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14.5 7.5v1.5M14.5 11.25v1.5M14.5 15v1.5"/><path d="M7 10.5h4M7 13.5h3"/>',
  hot_cocoa: '<path d="M5 10h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 11.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8.5 3.5c-1 1 1 2 0 3.5M12.5 3.5c-1 1 1 2 0 3.5"/>',
  letter: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5v13"/>',
  tea: '<path d="M4 11h13v1a6.5 6.5 0 0 1-13 0z"/><path d="M6 21h9"/><path d="M17 12.5h1.2a2 2 0 0 1 0 4h-1.7"/><path d="M10.5 4c2 0 3 1.4 3 3-2 0-3-1.4-3-3z"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/>',
  night_light: '<path d="M15.5 3.5A6.5 6.5 0 1 0 19.5 14a5 5 0 0 1-4-10.5z"/><path d="M8 21h8M12 18.5V21"/>',
  postcard: '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M12 8v8"/><rect x="15" y="8" width="3.5" height="3.5" rx=".5"/><path d="M5.5 11h4M5.5 14h4"/>',
  keychain: '<circle cx="7.5" cy="7.5" r="3.5"/><path d="M10 10l9 9M15 15l2-2M17.5 17.5l1.5-1.5"/>',
  chocolate: '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M5 9.2h14M5 14.8h14M12 3.5v17"/>',
  journal: '<rect x="6" y="3" width="13" height="18" rx="1.5"/><path d="M4 7h3M4 12h3M4 17h3"/><path d="M15 3v6l-1.5-1.2L12 9V3"/>',
  blanket: '<rect x="3.5" y="5" width="17" height="5" rx="1.5"/><rect x="3.5" y="10" width="17" height="5" rx="1.5"/><rect x="3.5" y="15" width="17" height="4.5" rx="1.5"/>',
  candle: '<rect x="8" y="10" width="8" height="10.5" rx="1"/><path d="M12 10V8"/><path d="M12 3c1.5 1.6 2 2.6 2 3.4a2 2 0 0 1-4 0c0-.8.5-1.8 2-3.4z"/>',
  umbrella: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6.5a2 2 0 0 1-4 0"/>',
  photo_frame: '<rect x="3.5" y="4" width="17" height="16" rx="1.5"/><rect x="6.5" y="7" width="11" height="10" rx=".5"/><path d="m7 16 3.5-4 2.5 2.5 1.5-1.5 2.5 3"/>',
  star_projector: '<path d="M5 17a7 7 0 0 1 14 0z"/><path d="M4 20h16"/><path d="M12 3.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"/><path d="M6 6.5l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5zM18 6.5l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z"/>',
  perfume: '<rect x="5.5" y="10" width="13" height="10.5" rx="3"/><path d="M9.5 10V7.5h5V10M10.5 7.5V5h3v2.5"/><path d="M15.5 4.5l2.5-1"/>',
  mug: '<path d="M5 6h11v10a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 8.5h1.5a2.5 2.5 0 0 1 0 5H16"/>',
  stickers: '<path d="M6 4h9l4 4v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M15 4v4h4"/><path d="M12 9.5l1.1 2.2 2.4.3-1.75 1.7.4 2.4L12 15l-2.15 1.1.4-2.4L8.5 12l2.4-.3z"/>',
  fan: '<circle cx="12" cy="9" r="6"/><path d="M12 9c0-2 1-3.5 2.5-4M12 9c2 0 3.5 1 4 2.5M12 9c0 2-1 3.5-2.5 4M12 9c-2 0-3.5-1-4-2.5"/><path d="M12 15v6M9.5 21h5"/>',
  hand_cream: '<path d="M8 3h8l-1 13H9z"/><rect x="9.5" y="16" width="5" height="5" rx="1"/><path d="M9.3 7h5.4"/>',
  music_box: '<rect x="4" y="12" width="16" height="8.5" rx="1.5"/><path d="M4 15h16"/><path d="M10 9.5V3.5l6-1.5v6"/><circle cx="8.6" cy="9.5" r="1.4"/><circle cx="14.6" cy="8" r="1.4"/>',
  plant: '<path d="M7 14h10l-1.3 6.5H8.3z"/><path d="M12 14V8"/><path d="M12 10c-3.5 0-5-2-5-4.5 3 0 5 1.5 5 4.5zM12 8.5c0-3 1.8-5 5-5 0 3-2 5-5 5z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
  earplugs: '<path d="M7 20a2.5 2.5 0 0 1-2.5-2.5V12a2.5 2.5 0 0 1 5 0v5.5A2.5 2.5 0 0 1 7 20zM17 20a2.5 2.5 0 0 1-2.5-2.5V12a2.5 2.5 0 0 1 5 0v5.5A2.5 2.5 0 0 1 17 20z"/><path d="M7 9.5c0-3 2-5.5 5-5.5s5 2.5 5 5.5"/>',
  sticky_notes: '<path d="M7 7h13v9l-4 4H7z"/><path d="M16 20v-4h4"/><path d="M4 16V4h12"/>',
  eye_mask: '<path d="M3 10c0-2 2-3 4.5-3h9C19 7 21 8 21 10v1.5c0 3-2.5 4.5-5 4.5-2 0-3-1.5-4-1.5S10 16 8 16c-2.5 0-5-1.5-5-4.5z"/><path d="M7 11.5c.8.6 1.7.6 2.5 0M14.5 11.5c.8.6 1.7.6 2.5 0"/>',
  bookmark: '<path d="M7 3h10v18l-5-4-5 4z"/><path d="M12 7.5l.9 1.8 2 .3-1.45 1.4.35 2-1.8-1-1.8 1 .35-2L9.1 9.6l2-.3z"/>',
  hand_warmer: '<rect x="5" y="4" width="14" height="16" rx="7"/><path d="M12 8c1.8 1.8 2.5 3 2.5 4.3a2.5 2.5 0 0 1-5 0c0-.8.4-1.6 1-2.3.2.8.6 1.2 1.1 1.2-.5-.8-.6-1.9.4-3.2z"/>',
  mirror: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5.5"/><path d="M9.5 9.5a3 3 0 0 1 2-1"/>',
  room_spray: '<rect x="7" y="10" width="9" height="11" rx="2"/><path d="M9.5 10V7h4v3"/><path d="M9 7V5h6l1.5 1.5"/><path d="M19 4.5h.01M20.5 7h.01M19 9.5h.01"/>',
  pen: '<path d="M16.5 3.5l4 4L9 19l-5 1 1-5z"/><path d="M14 6l4 4"/>',
  snacks: '<circle cx="12" cy="12" r="8.5"/><path d="M9 9h.01M14.5 8.5h.01M15 14h.01M9.5 15h.01M12 12h.01"/>',
  pouch: '<path d="M4 8h16l-1.2 10.5a2 2 0 0 1-2 1.5H7.2a2 2 0 0 1-2-1.5z"/><path d="M4 8l1-3h14l1 3"/><path d="M16 8v3"/>',
  postcard_set: '<rect x="6" y="7" width="15" height="11" rx="1.5"/><path d="M3 15V5.5A1.5 1.5 0 0 1 4.5 4H17"/><path d="m8.5 16 3-3.5 2 2 1.5-1.5 3 3"/><circle cx="17" cy="10" r="1"/>',
  thermos: '<rect x="7" y="7" width="10" height="14" rx="2.5"/><path d="M8.5 7V4.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1V7"/><path d="M7 11h10"/>',
  alarm: '<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 1.5"/><path d="M4 5.5 6.5 3M20 5.5 17.5 3M7 19.5l-1.5 1.5M17 19.5l1.5 1.5"/>',
  sketchbook: '<path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.5-1.3-1.8-1.3-3 0-1 .8-1.8 1.8-1.8h2.2a4 4 0 0 0 4-4C20.5 6.6 16.7 3.5 12 3.5z"/><path d="M7.5 11h.01M9.5 7.5h.01M14 7h.01M17 10h.01"/>',
  playlist: '<rect x="3" y="8" width="18" height="10.5" rx="1.5"/><circle cx="8.2" cy="13.2" r="2"/><circle cx="15.8" cy="13.2" r="2"/><path d="M10.2 13.2h3.6"/><path d="M9 4.5l6 1.8v3"/><circle cx="8.2" cy="13.2" r=".6"/><circle cx="15.8" cy="13.2" r=".6"/>',
  iou_book: '<rect x="6" y="3.5" width="13" height="17" rx="1.2"/><path d="M9 8h7M9 11.5h7M9 15h4.5"/><path d="M4.5 7h3.5M4.5 12h3.5M4.5 17h3.5"/>',
  midnight_pass: '<rect x="3.5" y="8" width="17" height="10" rx="1.2"/><path d="M8 8v10"/><path d="M15.8 11.4a2.5 2.5 0 1 1-2.2 3.6 2 2 0 0 0 2.2-3.6z"/><path d="M3.5 13h1.2M19.3 13h1.2"/>',
  pressed_flower: '<rect x="5" y="3.5" width="14" height="17" rx="1"/><circle cx="12" cy="11" r="2.1"/><circle cx="9.6" cy="9.8" r="1.6"/><circle cx="14.4" cy="9.8" r="1.6"/><circle cx="12" cy="8.2" r="1.6"/><path d="M12 13v5M10.5 16.5 12 15l1.5 1.5"/>',
  bus_ticket: '<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M8 6v12"/><path d="M11.5 9.5h6l1 3H11.5z"/><path d="M12.8 12.5v1.6M16.6 12.5v1.6"/><circle cx="13.2" cy="15.2" r=".8"/><circle cx="16.2" cy="15.2" r=".8"/><path d="M5.3 10h1.2M5.3 14h1.2"/>',
  bad_drawing: '<rect x="4" y="3.5" width="16" height="17" rx="1"/><circle cx="12.3" cy="11" r="3.6"/><path d="M10.2 10.2h.01M14.4 10.6h.01"/><path d="M10.3 13.2c.9.9 2.4.5 3.2-.3"/><path d="M6.5 5.5 8.5 7M17.2 6.2 15.5 8"/><path d="M8 18.5c1.5-1 3-.6 4 .4"/>',
  movie_night: '<rect x="3.5" y="5" width="17" height="11" rx="1.2"/><path d="M8 20h8M12 16v4"/><path d="M7.5 14.5 8.5 9h7l1 5.5z"/><path d="M9.2 9v5.5M12 9v5.5M14.8 9v5.5"/>',
  star_jar: '<path d="M8 8.5h8l-.9 11.2H8.9z"/><path d="M8 8.5c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M12 11.2l.55 1.15 1.25.18-1 .9.24 1.25L12 14.1l-1.04.58.24-1.25-1-.9 1.25-.18z"/><path d="M9.8 16.2l.35.7.75.1-.6.55.15.75-.65-.35-.65.35.15-.75-.6-.55.75-.1z"/>',
  neighborhood_map: '<path d="M4 6.5h16v12H4z"/><path d="M12 6.5v12M4 12h16"/><path d="M7 9h3M15 15h3"/><circle cx="16" cy="9.2" r="1.4"/><path d="M16 10.6v2.6M15.2 13.2 16 14.4l.8-1.2"/>',
  recipe_card: '<rect x="4.5" y="4" width="15" height="16.5" rx="1.2"/><path d="M7 8h10M7 11.2h10M7 14.4h6"/><path d="M16.2 15.2c1.2 0 2 .8 2 1.6 0 1.2-1.5 2.2-2 2.2s-2-1-2-2.2c0-.8.8-1.6 2-1.6z"/><path d="M16.2 15.2V13"/>',
  paper_crane: '<path d="M3 12.5 10.5 14 12.2 6.5 14 12.2 21 8.5 16.2 16.2 11.5 16.8 8.2 20.5"/><path d="M10.5 14 13 12.2M12.2 6.5 15 9.2"/>',
  ticket_stubs: '<path d="M3.5 5.5h12.5v7.5H3.5z"/><path d="M7.2 5.5v7.5"/><path d="M8 11.2h12.5v7.5H8z"/><path d="M12 11.2v7.5"/><path d="M5.2 9.2h.8M14.2 9.2h.8M10 15h.8M18.8 15h.8"/>'
};


const UI_ICONS = {
  gift: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v7.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V12M12 8v12.5"/><path d="M12 8C10.5 5 7 4.5 7 6.5S10 8 12 8zM12 8c1.5-3 5-3.5 5-1.5S14 8 12 8z"/>',
  box: '<path d="M3.5 8 12 4l8.5 4v8.5L12 20.5l-8.5-4z"/><path d="M3.5 8 12 12l8.5-4M12 12v8.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 18 5-5 3.5 3.5 2.5-2.5 5 4.5"/>',
  share: '<path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12v7a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-7"/>',
  download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5"/><path d="M5 19.5h14"/>',
  upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M5 19.5h14"/>',
  trash: '<path d="M4.5 7h15M10 4h4M6.5 7l1 13h9l1-13"/><path d="M10 10.5v6M14 10.5v6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  back: '<path d="M14.5 5 7.5 12l7 7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  soundOn: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  soundOff: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  install: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M12 7v7M9.5 11.5 12 14l2.5-2.5"/><path d="M10.5 18.5h3"/>'
};

const MOOD_ICONS = {
  ordinary: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
  care: UI_ICONS.heart,
  celebrate: '<path d="M4 20 8.5 8.5l7 7z"/><path d="M13 4.5c.5 1 .5 2-.5 3M17 8.5c1-.5 2-.5 3 0M15.5 3.5h.01M20.5 5.5h.01M19.5 12h.01"/>',
  date: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M12 18s-2.5-1.5-2.5-3a1.25 1.25 0 0 1 2.5-.4 1.25 1.25 0 0 1 2.5.4c0 1.5-2.5 3-2.5 3z"/>',
  encourage: '<path d="M12 20v-8"/><path d="M12 13c-4 0-6-2.5-6-6 3.5 0 6 2 6 6zM12 11c0-3.5 2-6 6-6 0 3.5-2.5 6-6 6z"/>',
  miss: '<path d="M15.5 3.5A8 8 0 1 0 20.5 15a6.5 6.5 0 0 1-5-11.5z"/>',
  surprise: UI_ICONS.sparkle
};

/** 生成 <svg> 字符串 */
function svgIcon(body, cls = "icon", label = "") {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${body}</svg>`;
}

function giftIconSvg(giftId, cls = "icon") {
  return svgIcon(GIFT_ICONS[giftId] || UI_ICONS.gift, cls);
}

/** 用于 Canvas：返回指定颜色的独立 SVG 文本 */
function giftIconStandalone(giftId, color, strokeWidth = 1.3) {
  const body = GIFT_ICONS[giftId] || UI_ICONS.gift;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="240" height="240" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
