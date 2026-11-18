/**
 * 拆礼音效：全部由 WebAudio 实时合成，无外部音频文件。
 * 只在用户点击后播放（符合浏览器自动播放策略），可在页面右上角静音。
 */
const GiftSound = (function () {
  let ctx = null;
  let master = null;
  let enabled = true;

  function ensure() {
    if (!enabled) return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.32; // 整体音量：轻柔
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function noiseBuffer(c, seconds) {
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // 丝带滑开：带通滤波噪声扫频
  function rustle(t0) {
    const c = ctx;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 0.5);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(900, t0);
    bp.frequency.exponentialRampToValueAtTime(4200, t0 + 0.38);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.42);
    src.connect(bp).connect(g).connect(master);
    src.start(t0);
    src.stop(t0 + 0.5);
  }

  // 开盖：低频轻响
  function pop(t0) {
    const c = ctx;
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(220, t0);
    o.frequency.exponentialRampToValueAtTime(90, t0 + 0.18);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
    o.connect(g).connect(master);
    o.start(t0);
    o.stop(t0 + 0.25);
  }

  // 揭晓：柔和铃音琶音
  function bell(freq, t0, dur, vol) {
    const c = ctx;
    [1, 2.01, 3.02].forEach((mult, i) => {
      const o = c.createOscillator();
      o.type = i === 0 ? "triangle" : "sine";
      o.frequency.value = freq * mult;
      const g = c.createGain();
      const v = vol / (i * 2.2 + 1);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur / (i + 1));
      o.connect(g).connect(master);
      o.start(t0);
      o.stop(t0 + dur);
    });
  }

  function chime(t0) {
    const notes = [783.99, 987.77, 1174.66, 1567.98]; // G5 B5 D6 G6
    notes.forEach((f, i) => bell(f, t0 + i * 0.09, 1.6, 0.16));
  }

  return {
    setEnabled(v) { enabled = !!v; if (!enabled && ctx && ctx.state === "running") ctx.suspend(); },
    isEnabled() { return enabled; },
    /** 用户点击时先调用，解锁 iOS 音频 */
    unlock() { ensure(); },
    untie() { if (!ensure()) return; rustle(ctx.currentTime + 0.01); },
    open() { if (!ensure()) return; pop(ctx.currentTime + 0.01); },
    reveal() { if (!ensure()) return; chime(ctx.currentTime + 0.02); },
    tap() { if (!ensure()) return; bell(1318.5, ctx.currentTime + 0.01, 0.5, 0.06); }
  };
})();
