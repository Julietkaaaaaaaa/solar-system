<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>SOLAR_OS // ROCKET</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #03070f;
  font-family: 'Orbitron', monospace;
  overflow: hidden;
  width: 100vw; height: 100vh;
  /* NO touch-action here — buttons must work! */
}

canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: block;
  /* canvas intercepts touch only via JS during gameplay */
}

/* ═══ SCREENS — sit above canvas ═══ */
#screen-start,
#screen-over {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
  /* fully transparent — canvas BG shows through */
  background: rgba(3,7,15,0.1);
}
#screen-over { background: rgba(3,7,15,0.92); display: none; }

.logo {
  font-size: clamp(1.8rem, 8vw, 4.5rem);
  font-weight: 900;
  letter-spacing: .22em;
  color: #fff;
  text-shadow: 0 0 30px #00e5ff, 0 0 60px rgba(0,229,255,.4);
  margin-bottom: .15em;
  animation: pulse 3s ease-in-out infinite;
}
.logo span { color: #00e5ff; }
@keyframes pulse {
  0%,100% { text-shadow: 0 0 30px #00e5ff, 0 0 60px rgba(0,229,255,.4); }
  50%      { text-shadow: 0 0 50px #00e5ff, 0 0 100px rgba(0,229,255,.6); }
}

.sub {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(.5rem, 2.5vw, .78rem);
  letter-spacing: .35em;
  color: rgba(0,229,255,.45);
  margin-bottom: clamp(1.2em, 4vw, 2em);
}

.card {
  background: rgba(3,7,15,.9);
  border: 1px solid rgba(0,229,255,.25);
  border-radius: 14px;
  padding: clamp(1.2em,4vw,2em) clamp(1.4em,5vw,2.5em);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 50px rgba(0,229,255,.08);
}

.card h2 {
  font-size: clamp(.7rem, 3vw, .95rem);
  letter-spacing: .15em;
  color: #fff;
  margin-bottom: 1em;
  font-weight: 700;
}

.hint-row {
  display: flex;
  gap: .6em;
  align-items: flex-start;
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(.58rem, 2.2vw, .72rem);
  color: rgba(255,255,255,.5);
  margin-bottom: .4em;
  line-height: 1.4;
}

.divider { height: 1px; background: rgba(0,229,255,.2); margin: 1em 0; }

.best-line {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(.58rem, 2vw, .7rem);
  color: rgba(0,229,255,.45);
  letter-spacing: .1em;
  text-align: center;
  margin-bottom: 1.2em;
}
.best-line b { color: #ffd60a; }

/* THE BUTTON — big, obvious, works on mobile */
.play-btn {
  display: block;
  width: 100%;
  padding: clamp(.85em, 3vw, 1em);
  background: #00e5ff;
  color: #03070f;
  border: none;
  border-radius: 8px;
  font-family: 'Orbitron', monospace;
  font-weight: 900;
  font-size: clamp(.75rem, 3vw, 1rem);
  letter-spacing: .2em;
  cursor: pointer;
  box-shadow: 0 0 25px rgba(0,229,255,.5);
  /* critical for mobile tapping */
  -webkit-tap-highlight-color: rgba(0,229,255,.3);
  touch-action: manipulation;
  -webkit-appearance: none;
  user-select: none;
  transition: transform .12s, box-shadow .12s;
}
.play-btn:active {
  transform: scale(.96);
  box-shadow: 0 0 40px rgba(0,229,255,.8);
}

/* ═══ HUD ═══ */
#hud {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: .5em 1em;
  background: rgba(3,7,15,.85);
  border-bottom: 1px solid rgba(0,229,255,.2);
  backdrop-filter: blur(10px);
}
.hud-logo {
  font-weight: 900;
  font-size: clamp(.5rem, 2.2vw, .78rem);
  letter-spacing: .22em;
  color: #00e5ff;
}
.hud-logo b { color: #fff; }
.hud-mid { display: flex; gap: 1.2em; }
.hud-item { text-align: center; }
.hud-item .lbl {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(.36rem, 1.4vw, .52rem);
  color: rgba(0,229,255,.4);
  letter-spacing: .12em;
}
.hud-item .val {
  font-size: clamp(.65rem, 2.5vw, .92rem);
  font-weight: 700;
}
.cy  { color: #00e5ff; }
.ye  { color: #ffd60a; }
.or  { color: #ff6b35; }
.lives { font-size: clamp(.8rem, 2.8vw, 1rem); }

/* ═══ GAME OVER STATS ═══ */
.score-num {
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: 900;
  color: #ffd60a;
  text-shadow: 0 0 25px rgba(255,214,10,.5);
  line-height: 1;
  margin: .15em 0;
}
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .6em;
  margin: 1em 0;
}
.stat-box {
  background: rgba(0,229,255,.05);
  border: 1px solid rgba(0,229,255,.12);
  border-radius: 8px;
  padding: .6em .4em;
  text-align: center;
}
.stat-box .sl {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(.42rem, 1.6vw, .56rem);
  color: rgba(0,229,255,.4);
  letter-spacing: .1em;
}
.stat-box .sv {
  font-size: clamp(.75rem, 3vw, 1rem);
  font-weight: 700;
  color: #fff;
  margin-top: .15em;
}
.new-rec {
  display: none;
  align-items: center;
  justify-content: center;
  gap: .4em;
  background: rgba(255,214,10,.1);
  border: 1px solid rgba(255,214,10,.3);
  border-radius: 20px;
  padding: .3em .9em;
  margin: .5em auto;
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(.52rem, 2vw, .68rem);
  color: #ffd60a;
}

/* ═══ FLASH ═══ */
#flash {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(255,107,53,.25);
  pointer-events: none;
  opacity: 0;
  transition: opacity .06s;
}
#flash.on { opacity: 1; }

/* ═══ LEVEL BANNER ═══ */
#lvl-banner {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  z-index: 80;
  pointer-events: none;
  text-align: center;
  opacity: 0;
  transition: opacity .35s;
}
#lvl-banner.show { opacity: 1; }
.lvl-num {
  font-size: clamp(2.5rem, 12vw, 6rem);
  font-weight: 900;
  background: linear-gradient(135deg, #00e5ff, #ffd60a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(0,229,255,.5));
}
.lvl-sub {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(.55rem, 2.5vw, .85rem);
  color: rgba(255,255,255,.55);
  letter-spacing: .35em;
}

/* ═══ COMBO POPUP ═══ */
#combo-pop {
  position: fixed;
  top: 42%; left: 50%;
  transform: translate(-50%,-50%) scale(0);
  z-index: 80;
  pointer-events: none;
  font-size: clamp(1.3rem, 6vw, 3rem);
  font-weight: 900;
  color: #ffd60a;
  text-shadow: 0 0 20px #ffd60a;
  opacity: 0;
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), opacity .3s;
}
#combo-pop.show {
  transform: translate(-50%,-70%) scale(1);
  opacity: 1;
}

/* scanlines */
#scan {
  position: fixed; inset: 0; z-index: 10; pointer-events: none;
  background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.07) 2px,rgba(0,0,0,.07) 4px);
  opacity: .3;
}
</style>
</head>
<body>

<canvas id="cv"></canvas>
<div id="scan"></div>
<div id="flash"></div>

<!-- HUD -->
<div id="hud">
  <div class="hud-logo">SOLAR_<b>OS</b></div>
  <div class="hud-mid">
    <div class="hud-item"><div class="lbl">ВІДСТАНЬ</div><div class="val cy" id="h-dist">0м</div></div>
    <div class="hud-item"><div class="lbl">РАХУНОК</div><div class="val ye" id="h-score">0</div></div>
    <div class="hud-item"><div class="lbl">COMBO</div><div class="val or" id="h-combo">x1</div></div>
  </div>
  <div class="lives" id="h-lives">❤️❤️❤️</div>
</div>

<!-- Level Banner -->
<div id="lvl-banner">
  <div class="lvl-num" id="lvl-num-text"></div>
  <div class="lvl-sub">НОВИЙ РІВЕНЬ</div>
</div>

<!-- Combo Popup -->
<div id="combo-pop"></div>

<!-- START SCREEN -->
<div id="screen-start">
  <div class="logo">SOLAR_<span>OS</span></div>
  <div class="sub">// ROCKET SURVIVAL //</div>
  <div class="card">
    <h2>🚀 МІСІЯ: ВИЖИТИ В КОСМОСІ</h2>
    <div class="hint-row"><span>⌨️</span><span>На комп'ютері — WASD або стрілки</span></div>
    <div class="hint-row"><span>👆</span><span>На телефоні — проведи пальцем куди летіти</span></div>
    <div class="hint-row"><span>☄️</span><span>Уникай комет, астероїдів, чорних дір</span></div>
    <div class="hint-row"><span>⭐</span><span>Збирай зірки — підвищуй COMBO та рахунок</span></div>
    <div class="hint-row"><span>🛡️</span><span>Синій щит захистить від одного удару</span></div>
    <div class="divider"></div>
    <div class="best-line">РЕКОРД: <b id="best-disp">0</b> м</div>
    <button class="play-btn" id="btn-start">▶ &nbsp;ЗАПУСТИТИ РАКЕТУ</button>
  </div>
</div>

<!-- GAME OVER SCREEN -->
<div id="screen-over">
  <div class="logo" style="font-size:clamp(1.2rem,5vw,2.5rem)">SOLAR_<span>OS</span></div>
  <div class="sub">// МІСІЯ ЗАВЕРШЕНА //</div>
  <div class="card">
    <h2 style="text-align:center">🚀 КІНЕЦЬ ПОЛЬОТУ</h2>
    <div style="text-align:center">
      <div style="font-family:'Share Tech Mono',monospace;font-size:clamp(.5rem,2vw,.65rem);color:rgba(0,229,255,.4);letter-spacing:.12em">РАХУНОК</div>
      <div class="score-num" id="go-score">0</div>
      <div class="new-rec" id="go-newrec">🏆 НОВИЙ РЕКОРД!</div>
    </div>
    <div class="stats-grid">
      <div class="stat-box"><div class="sl">ВІДСТАНЬ</div><div class="sv cy" id="go-dist">0м</div></div>
      <div class="stat-box"><div class="sl">РЕКОРД</div><div class="sv ye" id="go-best">0м</div></div>
      <div class="stat-box"><div class="sl">MAX COMBO</div><div class="sv or" id="go-combo">x1</div></div>
      <div class="stat-box"><div class="sl">РІВЕНЬ</div><div class="sv cy" id="go-level">1</div></div>
    </div>
    <button class="play-btn" id="btn-restart">↺ &nbsp;ЛЕТІТИ ЗНОВУ</button>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════
//  SOLAR_OS — ROCKET SURVIVAL
// ═══════════════════════════════════════════════
const cv  = document.getElementById('cv');
const ctx = cv.getContext('2d');
let W, H;

function resize() {
  W = cv.width  = window.innerWidth;
  H = cv.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ── helpers ──
const $ = id => document.getElementById(id);
let best = +localStorage.getItem('solar_best') || 0;
$('best-disp').textContent = best;
$('go-best').textContent   = best + 'м';

// ══════════════════════════════
//  INPUT
// ══════════════════════════════
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });

// Touch swipe — only active during game
let tStart = null, tDelta = { x: 0, y: 0 };

function handleTouchStart(e) {
  // let buttons handle their own touches
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
  if (!gameRunning) return;
  const t = e.changedTouches[0];
  tStart = { x: t.clientX, y: t.clientY };
  tDelta = { x: 0, y: 0 };
}
function handleTouchMove(e) {
  if (!gameRunning || !tStart) return;
  e.preventDefault();
  const t = e.changedTouches[0];
  tDelta = {
    x: (t.clientX - tStart.x) / 28,
    y: (t.clientY - tStart.y) / 28
  };
  tStart = { x: t.clientX, y: t.clientY };
}
function handleTouchEnd() {
  tStart = null;
  tDelta = { x: 0, y: 0 };
}

// attach to document with passive:false only for move (to allow preventDefault)
document.addEventListener('touchstart',  handleTouchStart, { passive: true });
document.addEventListener('touchmove',   handleTouchMove,  { passive: false });
document.addEventListener('touchend',    handleTouchEnd,   { passive: true });
document.addEventListener('touchcancel', handleTouchEnd,   { passive: true });

// ══════════════════════════════
//  STARS
// ══════════════════════════════
let stars = [];
function initStars() {
  stars = Array.from({ length: 240 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.6 + .15,
    a: Math.random() * .8 + .2,
    spd: Math.random() * 2.5 + .4,
    layer: Math.floor(Math.random() * 3)
  }));
}
function drawStars(sp) {
  stars.forEach(s => {
    const v = s.spd * sp * (s.layer === 0 ? .35 : s.layer === 1 ? .8 : 1.5);
    s.x -= v;
    if (s.x < -2) { s.x = W + 2; s.y = Math.random() * H; }
    if (s.layer === 2 && sp > 3) {
      const g = ctx.createLinearGradient(s.x + v * 4, s.y, s.x, s.y);
      g.addColorStop(0, 'rgba(180,210,255,0)');
      g.addColorStop(1, `rgba(180,210,255,${s.a * .6})`);
      ctx.fillStyle = g;
      ctx.fillRect(s.x, s.y - s.r * .4, v * 4, s.r * .8);
    }
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,220,255,${s.a})`; ctx.fill();
  });
}

// ══════════════════════════════
//  NEBULA
// ══════════════════════════════
let nebs = [];
function initNebs() {
  nebs = Array.from({ length: 5 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 200 + 100,
    hue: Math.random() * 360,
    a: Math.random() * .06 + .025,
    spd: .12 + Math.random() * .18
  }));
}
function drawNebs(sp) {
  nebs.forEach(n => {
    n.x -= n.spd * sp;
    if (n.x + n.r < 0) { n.x = W + n.r; n.y = Math.random() * H; }
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    g.addColorStop(0, `hsla(${n.hue},70%,35%,${n.a})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
  });
}

// ══════════════════════════════
//  DRAW ROCKET  (horizontal, nose→right)
// ══════════════════════════════
function drawRocket(x, y, ft) {
  ctx.save();
  ctx.translate(x, y);
  // rocket points right: body drawn vertically then rotated
  ctx.rotate(Math.PI / 2);

  const W2 = 20, H2 = 42;

  // fire
  const fl = 16 + Math.sin(ft * .5) * 5 + Math.random() * 4;
  let fg = ctx.createLinearGradient(0, H2 * .22, 0, H2 * .22 + fl);
  fg.addColorStop(0, 'rgba(255,210,60,.95)');
  fg.addColorStop(.45, 'rgba(255,100,20,.7)');
  fg.addColorStop(1, 'rgba(255,40,0,0)');
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.moveTo(-W2 * .35, H2 * .18);
  ctx.quadraticCurveTo(-W2 * .5, H2 * .22 + fl * .5, 0, H2 * .22 + fl);
  ctx.quadraticCurveTo( W2 * .5, H2 * .22 + fl * .5, W2 * .35, H2 * .18);
  ctx.fill();
  // inner flame
  let fi = ctx.createLinearGradient(0, H2 * .2, 0, H2 * .2 + fl * .6);
  fi.addColorStop(0, 'rgba(255,255,200,1)');
  fi.addColorStop(1, 'rgba(255,180,40,0)');
  ctx.fillStyle = fi;
  ctx.beginPath();
  ctx.moveTo(-W2 * .13, H2 * .2);
  ctx.quadraticCurveTo(-W2 * .18, H2 * .2 + fl * .3, 0, H2 * .2 + fl * .62);
  ctx.quadraticCurveTo( W2 * .18, H2 * .2 + fl * .3, W2 * .13, H2 * .2);
  ctx.fill();

  // body
  let bg2 = ctx.createLinearGradient(-W2 * .5, 0, W2 * .5, 0);
  bg2.addColorStop(0,  '#0d2a4a');
  bg2.addColorStop(.3, '#1976d2');
  bg2.addColorStop(.5, '#82cbf5');
  bg2.addColorStop(.7, '#1976d2');
  bg2.addColorStop(1,  '#0a1e38');
  ctx.fillStyle = bg2;
  ctx.beginPath();
  ctx.moveTo(0, -H2 * .5);
  ctx.quadraticCurveTo( W2 * .48, -H2 * .12,  W2 * .44,  H2 * .08);
  ctx.lineTo( W2 * .36,  H2 * .24);
  ctx.lineTo(-W2 * .36,  H2 * .24);
  ctx.lineTo(-W2 * .44,  H2 * .08);
  ctx.quadraticCurveTo(-W2 * .48, -H2 * .12, 0, -H2 * .5);
  ctx.fill();

  // nose glow
  let ng = ctx.createRadialGradient(0, -H2 * .38, 0, 0, -H2 * .28, W2 * .52);
  ng.addColorStop(0, 'rgba(0,229,255,.4)'); ng.addColorStop(1, 'rgba(0,229,255,0)');
  ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(0, -H2 * .32, W2 * .5, 0, Math.PI * 2); ctx.fill();

  // cockpit
  ctx.fillStyle = 'rgba(0,229,255,.12)';
  ctx.strokeStyle = 'rgba(0,229,255,.55)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(0, -H2 * .13, W2 * .2, H2 * .11, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.3)';
  ctx.beginPath(); ctx.ellipse(-W2 * .07, -H2 * .17, W2 * .08, H2 * .045, -.4, 0, Math.PI * 2); ctx.fill();

  // wings
  ctx.fillStyle = '#0d47a1';
  ctx.beginPath(); ctx.moveTo(-W2*.42,H2*.05); ctx.lineTo(-W2*1.1,H2*.27); ctx.lineTo(-W2*.62,H2*.28); ctx.lineTo(-W2*.36,H2*.21); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo( W2*.42,H2*.05); ctx.lineTo( W2*1.1,H2*.27); ctx.lineTo( W2*.62,H2*.28); ctx.lineTo( W2*.36,H2*.21); ctx.closePath(); ctx.fill();

  // nozzle
  ctx.fillStyle = '#060e1e'; ctx.strokeStyle = 'rgba(0,229,255,.35)'; ctx.lineWidth = .9;
  ctx.beginPath(); ctx.moveTo(-W2*.3,H2*.17); ctx.lineTo(-W2*.36,H2*.26); ctx.lineTo(W2*.36,H2*.26); ctx.lineTo(W2*.3,H2*.17); ctx.closePath(); ctx.fill(); ctx.stroke();

  // glow outline
  ctx.shadowColor = 'rgba(0,229,255,.5)'; ctx.shadowBlur = 10;
  ctx.strokeStyle = 'rgba(0,229,255,.22)'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -H2 * .5);
  ctx.quadraticCurveTo( W2 * .48, -H2 * .12,  W2 * .44,  H2 * .08);
  ctx.lineTo( W2 * .36,  H2 * .24); ctx.lineTo(-W2 * .36,  H2 * .24);
  ctx.lineTo(-W2 * .44,  H2 * .08);
  ctx.quadraticCurveTo(-W2 * .48, -H2 * .12, 0, -H2 * .5);
  ctx.shadowBlur = 0; ctx.stroke();

  ctx.restore();
}

// ══════════════════════════════
//  OBSTACLES — drawn on canvas
// ══════════════════════════════
function drawComet(x, y, r, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const tl = r * 3.2;
  let tg = ctx.createLinearGradient(r*.3, 0, r*.3 + tl, 0);
  tg.addColorStop(0, 'rgba(255,160,50,.75)'); tg.addColorStop(1, 'rgba(255,80,20,0)');
  ctx.fillStyle = tg;
  ctx.beginPath(); ctx.moveTo(r*.3,-r*.22); ctx.lineTo(r*.3+tl,0); ctx.lineTo(r*.3,r*.22); ctx.closePath(); ctx.fill();

  let cg = ctx.createRadialGradient(0,0,0,0,0,r*1.25);
  cg.addColorStop(0,'rgba(255,210,100,.45)'); cg.addColorStop(1,'rgba(255,100,30,0)');
  ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(0,0,r*1.25,0,Math.PI*2); ctx.fill();

  let kg = ctx.createRadialGradient(-r*.2,-r*.2,0,0,0,r);
  kg.addColorStop(0,'#fff8e0'); kg.addColorStop(.4,'#ffb020'); kg.addColorStop(1,'#c84000');
  ctx.fillStyle=kg; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();

  ctx.fillStyle='rgba(0,0,0,.22)';
  ctx.beginPath(); ctx.arc(-r*.28,r*.18,r*.24,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( r*.18,-r*.28,r*.17,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawAsteroid(x, y, r, rot, verts) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath();
  verts.forEach((v, i) => {
    const a = i / verts.length * Math.PI * 2, rr = v * r;
    i === 0 ? ctx.moveTo(Math.cos(a)*rr, Math.sin(a)*rr) : ctx.lineTo(Math.cos(a)*rr, Math.sin(a)*rr);
  });
  ctx.closePath();
  let ag = ctx.createRadialGradient(-r*.2,-r*.2,0,0,0,r);
  ag.addColorStop(0,'#8a7a68'); ag.addColorStop(.6,'#58503e'); ag.addColorStop(1,'#38302a');
  ctx.fillStyle=ag; ctx.fill();
  ctx.strokeStyle='rgba(200,180,150,.2)'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.28)';
  ctx.beginPath(); ctx.arc(r*.2,r*.1,r*.22,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(-r*.28,-r*.18,r*.14,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawBlackHole(x, y, r, t) {
  ctx.save(); ctx.translate(x, y);
  for (let i = 4; i >= 0; i--) {
    const dr = r * (1.7 + i*.5), alpha = (5-i)*.055;
    let dg = ctx.createRadialGradient(0,0,r*.85,0,0,dr);
    dg.addColorStop(0,`rgba(255,80,200,${alpha})`); dg.addColorStop(.5,`rgba(80,40,255,${alpha*.5})`); dg.addColorStop(1,'transparent');
    ctx.fillStyle=dg; ctx.beginPath(); ctx.ellipse(0,0,dr,dr*(.14+i*.03),t*.018,0,Math.PI*2); ctx.fill();
  }
  let hg = ctx.createRadialGradient(0,0,0,0,0,r);
  hg.addColorStop(0,'#000'); hg.addColorStop(.7,'#0e0320'); hg.addColorStop(1,'rgba(60,0,80,0)');
  ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
  let lg = ctx.createRadialGradient(0,0,r*.75,0,0,r*1.35);
  lg.addColorStop(0,'rgba(180,80,255,.45)'); lg.addColorStop(1,'transparent');
  ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(0,0,r*1.35,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawStar(x, y, r, t) {
  ctx.save(); ctx.translate(x, y);
  const sc = .82 + Math.sin(t*.09)*.18;
  ctx.scale(sc, sc);
  let gg = ctx.createRadialGradient(0,0,0,0,0,r*2.2);
  gg.addColorStop(0,'rgba(255,235,90,.5)'); gg.addColorStop(1,'transparent');
  ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(0,0,r*2.2,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ffe050';
  ctx.beginPath();
  for (let i=0;i<5;i++) {
    const a=i/5*Math.PI*2-Math.PI/2, ia=a+Math.PI/5;
    i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
    ctx.lineTo(Math.cos(ia)*r*.42,Math.sin(ia)*r*.42);
  }
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawShieldPU(x, y, r, t) {
  ctx.save(); ctx.translate(x, y);
  const p = .55 + Math.sin(t*.1)*.45;
  let gg = ctx.createRadialGradient(0,0,0,0,0,r*1.9);
  gg.addColorStop(0,`rgba(0,229,255,${p*.3})`); gg.addColorStop(1,'transparent');
  ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(0,0,r*1.9,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=`rgba(0,229,255,${p})`; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.stroke();
  // draw simple shield shape
  ctx.fillStyle=`rgba(0,229,255,${.7*p})`;
  ctx.beginPath();
  ctx.moveTo(0,-r*.7); ctx.lineTo(r*.55,-r*.35); ctx.lineTo(r*.55,r*.1);
  ctx.quadraticCurveTo(r*.3,r*.65,0,r*.8);
  ctx.quadraticCurveTo(-r*.3,r*.65,-r*.55,r*.1);
  ctx.lineTo(-r*.55,-r*.35); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ══════════════════════════════
//  PARTICLES
// ══════════════════════════════
let parts = [];
function spawnParts(x, y, color, n=12, sp=4) {
  for (let i=0;i<n;i++) {
    const a = Math.PI*2/n*i + Math.random()*.5, v = Math.random()*sp+1;
    parts.push({ x,y, vx:Math.cos(a)*v, vy:Math.sin(a)*v, life:1, decay:Math.random()*.035+.02, r:Math.random()*4+2, color });
  }
}
function burst(x, y) {
  ['#ffd60a','#ff6b35','#00e5ff','#ff2d78','#39ff14'].forEach((c,i) => setTimeout(()=>spawnParts(x,y,c,8,5+i), i*35));
}
function drawParts() {
  parts = parts.filter(p => p.life > 0);
  parts.forEach(p => {
    p.x+=p.vx; p.y+=p.vy; p.vx*=.93; p.vy*=.93; p.life-=p.decay;
    ctx.save(); ctx.globalAlpha=p.life;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    ctx.fillStyle=p.color; ctx.fill(); ctx.restore();
  });
}

// ══════════════════════════════
//  TEXT POPS
// ══════════════════════════════
let pops = [];
function popText(x, y, text, color='#ffd60a', size=20) {
  pops.push({ x, y, text, color, size, life:1, vy:-1.7 });
}
function drawPops() {
  pops = pops.filter(p => p.life > 0);
  pops.forEach(p => {
    p.y+=p.vy; p.life-=.018;
    ctx.save(); ctx.globalAlpha=p.life;
    ctx.font=`bold ${p.size}px Orbitron,monospace`;
    ctx.textAlign='center'; ctx.fillStyle=p.color;
    ctx.shadowColor=p.color; ctx.shadowBlur=10;
    ctx.fillText(p.text,p.x,p.y); ctx.restore();
  });
}

// ══════════════════════════════
//  TRAIL
// ══════════════════════════════
let trail = [];
function updateTrail(x, y) {
  trail.unshift({ x, y });
  if (trail.length > 20) trail.pop();
}
function drawTrail(shield) {
  trail.forEach((pt, i) => {
    const a = (1 - i/trail.length) * (shield ? .55 : .4);
    const r = (1 - i/trail.length) * 10 + 2;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI*2);
    ctx.fillStyle = shield ? `rgba(0,229,255,${a})` : `rgba(0,180,220,${a})`;
    ctx.fill();
  });
}

// ══════════════════════════════
//  GAME STATE
// ══════════════════════════════
let gameRunning = false;
let animId;
let P, obs, coll, score, lives, level, combo, maxCombo;
let speed, frame, inv, shieldOn, shieldTimer, dist;
let spawnT, collectT, scoreAcc, distAcc;

const HUD_H = 52;
const OBS_TYPES = [
  { kind:'comet',    r:15, pts:5,  spd:1.2 },
  { kind:'comet',    r:21, pts:8,  spd:.88 },
  { kind:'asteroid', r:19, pts:10, spd:.72 },
  { kind:'asteroid', r:27, pts:15, spd:.56 },
  { kind:'bhole',    r:17, pts:25, spd:.58 },
];
const COLL_TYPES = [
  { kind:'star',   r:13, pts:50,  spd:1.1 },
  { kind:'star',   r:17, pts:80,  spd:.9  },
  { kind:'shield', r:13, pts:0,   spd:.9  },
];

function makeVerts(n) { return Array.from({length:n}, ()=> Math.random()*.42+.62); }

function spawnObs() {
  const t = OBS_TYPES[Math.floor(Math.random()*OBS_TYPES.length)];
  const spd = t.spd * speed * (Math.random()*.5+.75);
  const edge = Math.floor(Math.random()*3);
  let x,y,vx,vy;
  if(edge===0){ x=W+80; y=60+Math.random()*(H-120); const a=Math.PI+(Math.random()-.5)*.65; vx=Math.cos(a)*spd; vy=Math.sin(a)*spd; }
  else if(edge===1){ x=W*.25+Math.random()*W*.75; y=-80; vx=-spd*.3; vy=spd; }
  else { x=W*.25+Math.random()*W*.75; y=H+80; vx=-spd*.3; vy=-spd; }
  obs.push({ ...t, x,y,vx,vy, rot:Math.random()*Math.PI*2, rs:(Math.random()-.5)*.055, verts:t.kind==='asteroid'?makeVerts(8):null, t:Math.random()*1000 });
}

function spawnColl() {
  const t = COLL_TYPES[Math.floor(Math.random()*COLL_TYPES.length)];
  const spd = speed*(Math.random()*.4+.85);
  coll.push({ ...t, x:W+55, y:65+Math.random()*(H-130), vx:-spd, vy:(Math.random()-.5)*spd*.3, rot:0, rs:(Math.random()-.5)*.05, t:0 });
}

function circHit(ax,ay,ar,bx,by,br) { return Math.hypot(ax-bx,ay-by) < ar*.68+br*.68; }

function flashHit() { const f=$('flash'); f.classList.add('on'); setTimeout(()=>f.classList.remove('on'),120); }

function setCombo(v) {
  combo = Math.min(v, 12);
  maxCombo = Math.max(maxCombo, combo);
  $('h-combo').textContent = 'x'+combo;
  if(combo >= 3) {
    const el = $('combo-pop');
    el.textContent = 'COMBO x'+combo+'!';
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(()=>el.classList.remove('show'), 850);
  }
}

function showLevelBanner() {
  $('lvl-num-text').textContent = 'РІВЕНЬ '+level;
  const el = $('lvl-banner');
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 1700);
  spawnParts(W*.5, H*.5, '#00e5ff', 18, 6);
  spawnParts(W*.5, H*.5, '#ffd60a', 18, 6);
}

// ══════════════════════════════
//  GAME LOOP
// ══════════════════════════════
let lastT = 0;

function loop(ts) {
  if (!gameRunning) return;
  const dt = Math.min((ts - lastT) / 16.67, 3);
  lastT = ts;
  frame++;
  speed = 2.8 + frame / 1350;

  // distance counter
  distAcc += speed * dt;
  if (distAcc >= 10) { dist += Math.floor(distAcc/10); distAcc %= 10; $('h-dist').textContent = dist+'м'; }

  // passive score
  scoreAcc += dt;
  if (scoreAcc >= 28) { scoreAcc=0; score+=combo; $('h-score').textContent=score; }

  // level up by distance
  const newLv = 1 + Math.floor(dist/450);
  if (newLv > level) { level=newLv; $('h-combo'); showLevelBanner(); }

  // spawning
  spawnT += dt;
  if (spawnT >= Math.max(14,62-speed*3.5-level*.4)) { spawnObs(); spawnT=0; }
  collectT += dt;
  if (collectT >= Math.max(72,165-level*5)) { spawnColl(); collectT=0; }

  // clear
  ctx.fillStyle = '#03070f'; ctx.fillRect(0,0,W,H);

  // bg
  drawNebs(speed); drawStars(speed);

  // move player
  const PSPD = 5.8;
  if(keys['ArrowUp']   ||keys['w']||keys['W']||keys['up'])    P.vy -= 1.1*dt;
  if(keys['ArrowDown'] ||keys['s']||keys['S']||keys['down'])  P.vy += 1.1*dt;
  if(keys['ArrowLeft'] ||keys['a']||keys['A']||keys['left'])  P.vx -= 1.1*dt;
  if(keys['ArrowRight']||keys['d']||keys['D']||keys['right']) P.vx += 1.1*dt;
  P.vx += tDelta.x * 1.6; P.vy += tDelta.y * 1.6;
  tDelta = { x:0, y:0 };
  P.vx = Math.max(-PSPD, Math.min(PSPD, P.vx)); P.vy = Math.max(-PSPD, Math.min(PSPD, P.vy));
  P.vx *= .82; P.vy *= .82;
  P.x = Math.max(P.r, Math.min(W-P.r, P.x+P.vx));
  P.y = Math.max(HUD_H+P.r, Math.min(H-P.r, P.y+P.vy));
  P.ft += dt;

  // shield
  if (shieldOn) { shieldTimer-=dt; if(shieldTimer<=0) shieldOn=false; }

  // move obs
  obs.forEach(o=>{ o.x+=o.vx*dt; o.y+=o.vy*dt; o.rot+=o.rs; o.t+=dt; });
  obs=obs.filter(o=>o.x>-160&&o.x<W+160&&o.y>-160&&o.y<H+160);
  coll.forEach(o=>{ o.x+=o.vx*dt; o.y+=o.vy*dt; o.t+=dt; });
  coll=coll.filter(o=>o.x>-100&&o.x<W+100&&o.y>-100&&o.y<H+100);

  // draw trail
  updateTrail(P.x, P.y); drawTrail(shieldOn);

  // draw collectibles
  coll.forEach(o => {
    if(o.kind==='star') drawStar(o.x,o.y,o.r,o.t);
    else drawShieldPU(o.x,o.y,o.r,o.t);
  });

  // draw obstacles
  obs.forEach(o => {
    if(o.kind==='comet') drawComet(o.x,o.y,o.r,o.rot);
    else if(o.kind==='asteroid') drawAsteroid(o.x,o.y,o.r,o.rot,o.verts);
    else drawBlackHole(o.x,o.y,o.r,o.t);
  });

  // shield ring around player
  if (shieldOn) {
    const pulse = .55 + Math.sin(frame*.15)*.45;
    ctx.save();
    ctx.strokeStyle=`rgba(0,229,255,${pulse})`; ctx.lineWidth=2;
    ctx.shadowColor='rgba(0,229,255,.55)'; ctx.shadowBlur=14;
    ctx.beginPath(); ctx.arc(P.x,P.y,P.r*1.8,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha=.07; ctx.fillStyle='#00e5ff';
    ctx.beginPath(); ctx.arc(P.x,P.y,P.r*1.8,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // draw rocket (blink when inv)
  if (!(inv && Math.floor(frame/5)%2===0)) {
    drawRocket(P.x, P.y, P.ft);
  }

  drawParts(); drawPops();

  // collision
  if (!inv) {
    for(let i=coll.length-1;i>=0;i--) {
      const o=coll[i];
      if(circHit(P.x,P.y,P.r*.85,o.x,o.y,o.r)) {
        coll.splice(i,1);
        if(o.kind==='shield') {
          shieldOn=true; shieldTimer=280;
          spawnParts(P.x,P.y,'#00e5ff',14,4);
          popText(P.x,P.y-35,'ЩІИТ!','#00e5ff',18);
        } else {
          const pts=o.pts*combo; score+=pts; $('h-score').textContent=score;
          setCombo(combo+1); burst(o.x,o.y);
          popText(o.x,o.y-22,'+'+pts, o.kind==='shield'?'#00e5ff':'#ffd60a');
        }
      }
    }
    for(let i=obs.length-1;i>=0;i--) {
      const o=obs[i];
      if(circHit(P.x,P.y,P.r*.78,o.x,o.y,o.r)) {
        if(shieldOn) {
          shieldOn=false; shieldTimer=0;
          spawnParts(o.x,o.y,'#00e5ff',16,5); obs.splice(i,1);
          popText(P.x,P.y-35,'ЗАХИСТ!','#00e5ff',18);
        } else {
          lives--;
          $('h-lives').textContent='❤️'.repeat(Math.max(0,lives));
          flashHit(); spawnParts(P.x,P.y,'#ff6b35',18,5);
          obs.splice(i,1); setCombo(1);
          inv=true; setTimeout(()=>inv=false,1800);
          if(lives<=0){ endGame(); return; }
        }
        break;
      }
    }
  }

  animId = requestAnimationFrame(loop);
}

// ══════════════════════════════
//  START / END
// ══════════════════════════════
function startGame() {
  P = { x:W*.1, y:H/2, vx:0, vy:0, r:22, ft:0 };
  obs=[]; coll=[]; parts=[]; pops=[]; trail=[];
  score=0; lives=3; level=1; combo=1; maxCombo=1;
  speed=2.8; frame=0; inv=false; shieldOn=false; shieldTimer=0;
  dist=0; spawnT=0; collectT=0; scoreAcc=0; distAcc=0;
  tStart=null; tDelta={x:0,y:0};
  lastT=performance.now(); gameRunning=true;

  $('h-dist').textContent='0м'; $('h-score').textContent='0'; $('h-combo').textContent='x1';
  $('h-lives').textContent='❤️❤️❤️';
  $('hud').style.display='flex';
  $('screen-start').style.display='none';
  $('screen-over').style.display='none';

  cancelAnimationFrame(animId);
  animId=requestAnimationFrame(loop);
}

function endGame() {
  gameRunning=false; cancelAnimationFrame(animId);
  $('hud').style.display='none';

  const isNew = dist > best;
  if(isNew){ best=dist; localStorage.setItem('solar_best',best); }

  $('go-score').textContent=score;
  $('go-dist').textContent=dist+'м';
  $('go-best').textContent=best+'м'; $('best-disp').textContent=best;
  $('go-combo').textContent='x'+maxCombo;
  $('go-level').textContent=level;
  const nr=$('go-newrec');
  nr.style.display=isNew?'flex':'none';

  burst(W/2, H*.4);
  setTimeout(()=>burst(W*.3,H*.5), 280);
  setTimeout(()=>burst(W*.7,H*.45), 520);

  $('screen-over').style.display='flex';
}

// ── button listeners ──
$('btn-start').addEventListener('click',   startGame);
$('btn-restart').addEventListener('click', startGame);

// ── idle bg loop (while on start/over screen) ──
initStars(); initNebs();
(function bgLoop() {
  if (!gameRunning) {
    ctx.fillStyle='#03070f'; ctx.fillRect(0,0,W,H);
    drawNebs(1.2); drawStars(1.2); drawParts();
  }
  requestAnimationFrame(bgLoop);
})();
</script>
</body>
</html>
