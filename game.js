<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>SOLAR_OS // ROCKET SURVIVAL</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --c:#00e5ff;--orange:#ff6b35;--yellow:#ffd60a;--pink:#ff2d78;
  --green:#39ff14;--bg:#03070f;--border:rgba(0,229,255,.22);
}
html,body{width:100%;height:100%;background:var(--bg);overflow:hidden;font-family:'Orbitron',monospace;}
#cv{position:fixed;inset:0;display:block;width:100%;height:100%;touch-action:none;}
/* screens sit above canvas and need normal touch */
.scr{touch-action:auto;}
.btn{touch-action:manipulation;-webkit-tap-highlight-color:rgba(0,229,255,.2);}

/* ── HUD ── */
#hud{
  position:fixed;top:0;left:0;right:0;z-index:5;
  display:none;align-items:center;justify-content:space-between;
  padding:.5em 1.2em;
  background:rgba(3,7,15,.82);border-bottom:1px solid var(--border);
  backdrop-filter:blur(12px);
}
.hud-logo{font-weight:900;font-size:clamp(.55rem,2.2vw,.82rem);letter-spacing:.25em;
  color:var(--c);text-shadow:0 0 10px var(--c);}
.hud-logo b{color:#fff;}
.hud-mid{display:flex;gap:1.6em;}
.hud-s{text-align:center;}
.hud-s .l{font-family:'Share Tech Mono',monospace;font-size:clamp(.38rem,1.4vw,.55rem);
  color:rgba(0,229,255,.4);letter-spacing:.14em;}
.hud-s .v{font-family:'Orbitron',monospace;font-weight:700;
  font-size:clamp(.7rem,2.5vw,.95rem);}
.v.cy{color:var(--c);}
.v.ye{color:var(--yellow);}
.lives{font-size:clamp(.85rem,2.8vw,1.05rem);}

/* ── SCREENS ── */
.scr{position:fixed;inset:0;z-index:10;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  touch-action:auto;pointer-events:all;}
.scr.off{display:none;pointer-events:none;}

/* START */
#ss{background:rgba(3,7,15,.0);}
.logo-big{font-weight:900;font-size:clamp(2rem,7vw,5rem);letter-spacing:.25em;color:#fff;
  text-shadow:0 0 40px var(--c),0 0 80px rgba(0,229,255,.35);
  animation:lp 3s ease-in-out infinite;}
.logo-big em{color:var(--c);font-style:normal;}
@keyframes lp{0%,100%{text-shadow:0 0 40px var(--c),0 0 80px rgba(0,229,255,.35);}
  50%{text-shadow:0 0 60px var(--c),0 0 120px rgba(0,229,255,.6);}}
.logo-sub{font-family:'Share Tech Mono',monospace;font-size:clamp(.5rem,2vw,.78rem);
  letter-spacing:.38em;color:rgba(0,229,255,.45);margin:.35em 0 2.2em;
  animation:fu .8s .3s both;}
@keyframes fu{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
.panel{background:rgba(3,7,15,.88);border:1px solid var(--border);border-radius:14px;
  padding:2em 2.6em;max-width:440px;width:90%;backdrop-filter:blur(20px);
  box-shadow:0 0 60px rgba(0,229,255,.09),inset 0 0 30px rgba(0,229,255,.03);
  animation:fu .8s .5s both;}
.panel h2{font-size:clamp(.72rem,2.8vw,.95rem);letter-spacing:.18em;color:#fff;
  margin-bottom:1.3em;font-weight:600;}
.hint{display:grid;grid-template-columns:1.8em 1fr;gap:.3em .6em;align-items:start;
  font-family:'Share Tech Mono',monospace;font-size:clamp(.58rem,2vw,.72rem);
  color:rgba(255,255,255,.5);margin-bottom:.3em;}
.hr{height:1px;background:var(--border);margin:1.1em 0;}
.best-r{font-family:'Share Tech Mono',monospace;font-size:clamp(.58rem,2vw,.7rem);
  color:rgba(0,229,255,.45);letter-spacing:.1em;text-align:center;margin-bottom:1.3em;}
.best-r span{color:var(--yellow);}
.btn{width:100%;padding:.82em;font-family:'Orbitron',monospace;font-weight:700;
  font-size:clamp(.68rem,2.6vw,.9rem);letter-spacing:.22em;color:var(--bg);
  background:var(--c);border:none;border-radius:7px;cursor:pointer;
  box-shadow:0 0 28px rgba(0,229,255,.45);transition:transform .15s,box-shadow .15s;
  position:relative;overflow:hidden;}
.btn::after{content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);
  transform:translateX(-100%);transition:transform .45s;}
.btn:hover::after{transform:translateX(100%);}
.btn:hover{transform:scale(1.03);box-shadow:0 0 48px rgba(0,229,255,.75);}
.btn:active{transform:scale(.97);}

/* GAME OVER */
#go{background:rgba(3,7,15,.94);backdrop-filter:blur(18px);}
.go-logo{font-weight:900;font-size:clamp(.9rem,3.5vw,1.5rem);letter-spacing:.3em;
  color:var(--c);text-shadow:0 0 18px var(--c);margin-bottom:.2em;}
.go-logo b{color:#fff;}
.go-sub{font-family:'Share Tech Mono',monospace;font-size:clamp(.5rem,1.8vw,.68rem);
  color:rgba(0,229,255,.38);letter-spacing:.32em;margin-bottom:1.8em;}
.score-big{font-weight:900;font-size:clamp(2.2rem,9vw,4rem);color:var(--yellow);
  text-shadow:0 0 28px rgba(255,214,10,.55);line-height:1;margin:.1em 0;}
.gs{display:grid;grid-template-columns:1fr 1fr;gap:.7em;margin:1.1em 0;}
.gc{background:rgba(0,229,255,.05);border:1px solid rgba(0,229,255,.12);
  border-radius:8px;padding:.65em .5em;text-align:center;}
.gc .gl{font-family:'Share Tech Mono',monospace;font-size:clamp(.44rem,1.6vw,.58rem);
  color:rgba(0,229,255,.4);letter-spacing:.1em;}
.gc .gv{font-size:clamp(.75rem,2.8vw,1rem);color:#fff;font-weight:700;margin-top:.2em;}
.nr{display:inline-flex;align-items:center;gap:.4em;
  background:rgba(255,214,10,.1);border:1px solid rgba(255,214,10,.28);
  border-radius:20px;padding:.28em .9em;margin:.5em 0;
  font-family:'Share Tech Mono',monospace;font-size:clamp(.5rem,1.8vw,.66rem);
  color:var(--yellow);letter-spacing:.08em;}

/* FLASH */
#fl{position:fixed;inset:0;z-index:20;pointer-events:none;opacity:0;
  background:rgba(255,107,53,.2);transition:opacity .07s;}
#fl.on{opacity:1;}

/* LEVEL BANNER */
#lb{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
  z-index:12;pointer-events:none;text-align:center;opacity:0;transition:opacity .4s;}
#lb.show{opacity:1;}
.lb-n{font-weight:900;font-size:clamp(2.5rem,10vw,6rem);
  background:linear-gradient(135deg,var(--c),var(--yellow));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  filter:drop-shadow(0 0 25px rgba(0,229,255,.5));}
.lb-t{font-family:'Share Tech Mono',monospace;font-size:clamp(.55rem,2vw,.82rem);
  color:rgba(255,255,255,.55);letter-spacing:.35em;}

/* COMBO POPUP */
#cp{position:fixed;top:45%;left:50%;transform:translate(-50%,-50%) scale(0);
  z-index:13;pointer-events:none;font-weight:900;
  font-size:clamp(1.3rem,5.5vw,3rem);color:var(--yellow);
  text-shadow:0 0 25px var(--yellow);opacity:0;transition:transform .18s cubic-bezier(.34,1.56,.64,1),opacity .3s;}
#cp.show{transform:translate(-50%,-70%) scale(1);opacity:1;}

/* SCANLINES */
#sl{position:fixed;inset:0;z-index:4;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.07) 2px,rgba(0,0,0,.07) 4px);
  opacity:.35;}
</style>
</head>
<body>
<canvas id="cv"></canvas>
<div id="sl"></div>
<div id="fl"></div>
<div id="hud">
  <div class="hud-logo">SOLAR_<b>OS</b></div>
  <div class="hud-mid">
    <div class="hud-s"><div class="l">ВІДСТАНЬ</div><div class="v cy" id="hDist">0m</div></div>
    <div class="hud-s"><div class="l">РАХУНОК</div><div class="v ye" id="hScore">0</div></div>
    <div class="hud-s"><div class="l">COMBO</div><div class="v" style="color:var(--orange)" id="hCombo">x1</div></div>
  </div>
  <div class="lives" id="hLives">❤️❤️❤️</div>
</div>
<div id="lb"><div class="lb-n" id="lbN"></div><div class="lb-t">НОВИЙ РІВЕНЬ</div></div>
<div id="cp"></div>

<!-- START -->
<div class="scr" id="ss">
  <div class="logo-big">SOLAR_<em>OS</em></div>
  <div class="logo-sub">// ROCKET SURVIVAL //</div>
  <div class="panel">
    <h2>🚀 КЕРУЙ РАКЕТОЮ</h2>
    <div class="hint"><span>⌨️</span><span>WASD / стрілки — рух ракети</span></div>
    <div class="hint"><span>👆</span><span>На телефоні — тягни пальцем у будь-який бік</span></div>
    <div class="hint"><span>☄️</span><span>Уникай комет, астероїдів і чорних дір</span></div>
    <div class="hint"><span>⭐</span><span>Збирай зірки — підвищуй рахунок та COMBO</span></div>
    <div class="hint"><span>🛡️</span><span>Синій щит захистить від одного удару</span></div>
    <div class="hint"><span>⚡</span><span>Швидкість зростає — ти летиш крізь галактику!</span></div>
    <div class="hr"></div>
    <div class="best-r">РЕКОРД: <span id="bDisp">0</span> м</div>
    <button class="btn" id="startBtn">▶ &nbsp;ЗАПУСТИТИ РАКЕТУ</button>
  </div>
</div>

<!-- GAME OVER -->
<div class="scr off" id="go">
  <div class="go-logo">SOLAR_<b>OS</b></div>
  <div class="go-sub">// МІСІЯ ЗАВЕРШЕНА //</div>
  <div class="panel">
    <h2>🚀 КІНЕЦЬ ПОЛЬОТУ</h2>
    <div class="score-big" id="goScore">0</div>
    <div id="goNR" class="nr" style="display:none">🏆 НОВИЙ РЕКОРД!</div>
    <div class="gs">
      <div class="gc"><div class="gl">ВІДСТАНЬ</div><div class="gv cy" id="goDist">0м</div></div>
      <div class="gc"><div class="gl">РЕКОРД</div><div class="gv" style="color:var(--yellow)" id="goBest">0м</div></div>
      <div class="gc"><div class="gl">MAX COMBO</div><div class="gv" style="color:var(--orange)" id="goCombo">x1</div></div>
      <div class="gc"><div class="gl">РІВЕНЬ</div><div class="gv cy" id="goLevel">1</div></div>
    </div>
    <button class="btn" id="restBtn">↺ &nbsp;ЛЕТІТИ ЗНОВУ</button>
  </div>
</div>

<script>
// ═══════════════════════════════════════════
//  SOLAR_OS — ROCKET SURVIVAL
//  All visuals drawn on Canvas (no emoji images)
// ═══════════════════════════════════════════
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
let W, H;
function resize(){ W=cv.width=window.innerWidth; H=cv.height=window.innerHeight; }
window.addEventListener('resize', resize); resize();

const $ = id => document.getElementById(id);

// ─── PERSIST ───
let best = parseInt(localStorage.getItem('sr_best')||'0');
$('bDisp').textContent = best; $('goBest').textContent = best+'м';

// ─── KEYS ───
const keys = {};
document.addEventListener('keydown', e => { keys[e.key]=true; ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)&&e.preventDefault(); });
document.addEventListener('keyup',   e => keys[e.key]=false);

// ─── SWIPE TOUCH CONTROL ───
let touchStart = null, touchDelta = {x:0, y:0};

function onTouchStart(e) {
  if(e.target.closest('.btn')) return; // let buttons work normally
  if(!running) return;
  e.preventDefault();
  const t = e.touches[0];
  touchStart = {x:t.clientX, y:t.clientY};
  touchDelta = {x:0,y:0};
}
function onTouchMove(e) {
  if(!running || !touchStart) return;
  e.preventDefault();
  const t = e.touches[0];
  touchDelta = { x:(t.clientX-touchStart.x)/30, y:(t.clientY-touchStart.y)/30 };
  touchStart = {x:t.clientX, y:t.clientY};
}
function onTouchEnd(e) {
  touchStart=null; touchDelta={x:0,y:0};
}
document.addEventListener('touchstart', onTouchStart, {passive:false});
document.addEventListener('touchmove',  onTouchMove,  {passive:false});
document.addEventListener('touchend',   onTouchEnd,   false);

// ════════════════════════════════
//  STAR FIELD  (scrolling right→left = flying forward)
// ════════════════════════════════
let stars = [];
function initStars(){
  stars = Array.from({length:260}, ()=>({
    x: Math.random()*W, y: Math.random()*H,
    r: Math.random()*1.8+.1,
    a: Math.random()*.8+.2,
    speed: Math.random()*3+.5,   // parallax layers
    layer: Math.floor(Math.random()*3) // 0=far,1=mid,2=near
  }));
}
function drawStars(gameSpeed){
  stars.forEach(s=>{
    const spd = s.speed * (gameSpeed||1) * (s.layer===0?.4:s.layer===1?.85:1.5);
    s.x -= spd;
    if(s.x < -2) { s.x=W+2; s.y=Math.random()*H; }
    // near stars have motion blur trail
    if(s.layer===2 && gameSpeed>3){
      const trailLen = spd*4;
      const g = ctx.createLinearGradient(s.x+trailLen,s.y,s.x,s.y);
      g.addColorStop(0,'rgba(180,220,255,0)');
      g.addColorStop(1,`rgba(180,220,255,${s.a*.7})`);
      ctx.fillStyle=g;
      ctx.fillRect(s.x,s.y-s.r*.5,trailLen,s.r);
    }
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(200,220,255,${s.a})`; ctx.fill();
  });
}

// ════════════════════════════════
//  NEBULA CLOUDS  (parallax bg)
// ════════════════════════════════
let nebs = [];
function initNebs(){
  nebs = Array.from({length:6},()=>({
    x:Math.random()*W, y:Math.random()*H,
    r:Math.random()*220+120,
    hue:Math.random()*360, a:Math.random()*.07+.03,
    speed:.15+Math.random()*.2
  }));
}
function drawNebs(gameSpeed){
  nebs.forEach(n=>{
    n.x -= n.speed*(gameSpeed||1);
    if(n.x+n.r < 0) { n.x=W+n.r; n.y=Math.random()*H; }
    const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
    g.addColorStop(0,`hsla(${n.hue},75%,38%,${n.a})`);
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
  });
}

// ════════════════════════════════
//  DRAW ROCKET
// ════════════════════════════════
function drawRocket(x, y, scale=1, fireT=0){
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const w=22, h=44;

  // — ENGINE FIRE —
  const fireLen = 18 + Math.sin(fireT*0.4)*6 + Math.random()*4;
  // outer flame
  let fg = ctx.createLinearGradient(0,h*.25,0,h*.25+fireLen);
  fg.addColorStop(0,'rgba(255,200,50,.9)');
  fg.addColorStop(.4,'rgba(255,100,20,.7)');
  fg.addColorStop(1,'rgba(255,50,0,0)');
  ctx.fillStyle=fg;
  ctx.beginPath();
  ctx.moveTo(-w*.38, h*.2);
  ctx.quadraticCurveTo(-w*.55, h*.25+fireLen*.5, 0, h*.25+fireLen);
  ctx.quadraticCurveTo(w*.55, h*.25+fireLen*.5, w*.38, h*.2);
  ctx.fill();

  // inner core flame
  let fg2 = ctx.createLinearGradient(0,h*.22,0,h*.22+fireLen*.65);
  fg2.addColorStop(0,'rgba(255,255,200,1)');
  fg2.addColorStop(1,'rgba(255,180,50,0)');
  ctx.fillStyle=fg2;
  ctx.beginPath();
  ctx.moveTo(-w*.15, h*.2);
  ctx.quadraticCurveTo(-w*.2, h*.22+fireLen*.3, 0, h*.22+fireLen*.65);
  ctx.quadraticCurveTo(w*.2, h*.22+fireLen*.3, w*.15, h*.2);
  ctx.fill();

  // — BODY —
  const bodyGrad = ctx.createLinearGradient(-w*.5,0,w*.5,0);
  bodyGrad.addColorStop(0,'#1a3a5c');
  bodyGrad.addColorStop(.35,'#2196f3');
  bodyGrad.addColorStop(.5,'#90caf9');
  bodyGrad.addColorStop(.65,'#2196f3');
  bodyGrad.addColorStop(1,'#0d2540');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  // nose
  ctx.moveTo(0,-h*.5);
  ctx.quadraticCurveTo(w*.5,-h*.15, w*.45, h*.1);
  // body right
  ctx.lineTo(w*.42, h*.2);
  // bottom right
  ctx.lineTo(w*.38, h*.25);
  // bottom left
  ctx.lineTo(-w*.38, h*.25);
  ctx.lineTo(-w*.42, h*.2);
  ctx.lineTo(-w*.45, h*.1);
  ctx.quadraticCurveTo(-w*.5,-h*.15, 0,-h*.5);
  ctx.fill();

  // — NOSE CONE GLOW —
  const noseG = ctx.createRadialGradient(0,-h*.4,0,0,-h*.3,w*.5);
  noseG.addColorStop(0,'rgba(0,229,255,.45)');
  noseG.addColorStop(1,'rgba(0,229,255,0)');
  ctx.fillStyle=noseG; ctx.beginPath(); ctx.arc(0,-h*.35,w*.5,0,Math.PI*2); ctx.fill();

  // — COCKPIT WINDOW —
  ctx.fillStyle='rgba(0,229,255,.15)';
  ctx.strokeStyle='rgba(0,229,255,.6)'; ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.ellipse(0,-h*.15, w*.22, h*.12, 0,0,Math.PI*2);
  ctx.fill(); ctx.stroke();
  // window shine
  ctx.fillStyle='rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.ellipse(-w*.07,-h*.18, w*.09, h*.05, -0.4,0,Math.PI*2); ctx.fill();

  // — LEFT WING —
  ctx.fillStyle='#1565c0';
  ctx.beginPath();
  ctx.moveTo(-w*.42, h*.05);
  ctx.lineTo(-w*1.1, h*.28);
  ctx.lineTo(-w*.65, h*.3);
  ctx.lineTo(-w*.38, h*.22);
  ctx.closePath(); ctx.fill();
  // wing detail
  ctx.strokeStyle='rgba(0,229,255,.35)'; ctx.lineWidth=.8;
  ctx.beginPath(); ctx.moveTo(-w*.42,h*.1); ctx.lineTo(-w*.95,h*.27); ctx.stroke();

  // — RIGHT WING —
  ctx.fillStyle='#1565c0';
  ctx.beginPath();
  ctx.moveTo(w*.42, h*.05);
  ctx.lineTo(w*1.1, h*.28);
  ctx.lineTo(w*.65, h*.3);
  ctx.lineTo(w*.38, h*.22);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(w*.42,h*.1); ctx.lineTo(w*.95,h*.27); ctx.stroke();

  // — EXHAUST NOZZLE —
  ctx.fillStyle='#0a1929';
  ctx.strokeStyle='rgba(0,229,255,.4)'; ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(-w*.3, h*.18);
  ctx.lineTo(-w*.38, h*.27);
  ctx.lineTo(w*.38, h*.27);
  ctx.lineTo(w*.3, h*.18);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // — BODY STRIPE —
  ctx.strokeStyle='rgba(0,229,255,.3)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(-w*.44,h*.0); ctx.lineTo(w*.44,h*.0); ctx.stroke();

  // — CYAN GLOW OUTLINE —
  ctx.shadowColor='rgba(0,229,255,.6)'; ctx.shadowBlur=10;
  ctx.strokeStyle='rgba(0,229,255,.25)'; ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(0,-h*.5);
  ctx.quadraticCurveTo(w*.5,-h*.15, w*.45, h*.1);
  ctx.lineTo(w*.38, h*.25); ctx.lineTo(-w*.38, h*.25);
  ctx.lineTo(-w*.45, h*.1);
  ctx.quadraticCurveTo(-w*.5,-h*.15, 0,-h*.5);
  ctx.shadowBlur=0;
  ctx.stroke();

  ctx.restore();
}

// ════════════════════════════════
//  DRAW OBSTACLES
// ════════════════════════════════
function drawComet(ctx, x, y, r, rot, t){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
  // tail
  const tailLen = r*3.5;
  const tg = ctx.createLinearGradient(r*.3,0,r*.3+tailLen,0);
  tg.addColorStop(0,'rgba(255,150,50,.7)');
  tg.addColorStop(.5,'rgba(255,100,30,.3)');
  tg.addColorStop(1,'rgba(255,80,20,0)');
  ctx.fillStyle=tg;
  ctx.beginPath();
  ctx.moveTo(r*.3, -r*.25);
  ctx.lineTo(r*.3+tailLen, 0);
  ctx.lineTo(r*.3, r*.25);
  ctx.closePath(); ctx.fill();

  // glow
  const cg=ctx.createRadialGradient(0,0,0,0,0,r*1.3);
  cg.addColorStop(0,'rgba(255,200,100,.5)');
  cg.addColorStop(1,'rgba(255,100,30,0)');
  ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(0,0,r*1.3,0,Math.PI*2); ctx.fill();

  // core
  const kg=ctx.createRadialGradient(-r*.2,-r*.2,0,0,0,r);
  kg.addColorStop(0,'#fff9e6'); kg.addColorStop(.4,'#ffb830'); kg.addColorStop(1,'#c84a00');
  ctx.fillStyle=kg; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();

  // craters
  ctx.fillStyle='rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.arc(-r*.3,r*.2,r*.25,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(r*.2,-r*.3,r*.18,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawAsteroid(ctx, x, y, r, rot, verts){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
  ctx.beginPath();
  verts.forEach((v,i)=>{
    const a=i/verts.length*Math.PI*2; const rr=v*r;
    i===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
  });
  ctx.closePath();
  const ag=ctx.createRadialGradient(-r*.2,-r*.2,0,0,0,r);
  ag.addColorStop(0,'#8a7a6a'); ag.addColorStop(.6,'#5a4e42'); ag.addColorStop(1,'#3a322a');
  ctx.fillStyle=ag; ctx.fill();
  ctx.strokeStyle='rgba(200,180,150,.25)'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.3)';
  ctx.beginPath(); ctx.arc(r*.2,r*.1,r*.22,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(-r*.3,-r*.2,r*.15,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawBlackHole(ctx, x, y, r, rot, t){
  ctx.save(); ctx.translate(x,y);
  // accretion disk
  for(let i=5;i>=0;i--){
    const diskR = r*(1.8+i*.5);
    const g=ctx.createRadialGradient(0,0,r*.9,0,0,diskR);
    const alpha = (6-i)*.06;
    g.addColorStop(0,`rgba(255,100,200,${alpha})`);
    g.addColorStop(.5,`rgba(100,50,255,${alpha*.5})`);
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath();
    ctx.ellipse(0,0,diskR,diskR*(.15+i*.03),rot+t*.02,0,Math.PI*2);
    ctx.fill();
  }
  // event horizon
  const hg=ctx.createRadialGradient(0,0,0,0,0,r);
  hg.addColorStop(0,'#000'); hg.addColorStop(.7,'#100520'); hg.addColorStop(1,'rgba(80,0,100,0)');
  ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
  // gravitational lensing glow
  const lg=ctx.createRadialGradient(0,0,r*.8,0,0,r*1.4);
  lg.addColorStop(0,'rgba(200,100,255,.5)'); lg.addColorStop(1,'transparent');
  ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(0,0,r*1.4,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawStar(ctx, x, y, r, t){
  ctx.save(); ctx.translate(x,y);
  const sc=.85+Math.sin(t*.08)*.15;
  ctx.scale(sc,sc);
  // glow
  const gg=ctx.createRadialGradient(0,0,0,0,0,r*2.2);
  gg.addColorStop(0,'rgba(255,240,100,.5)'); gg.addColorStop(1,'transparent');
  ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(0,0,r*2.2,0,Math.PI*2); ctx.fill();
  // star shape
  ctx.fillStyle='#ffe066';
  ctx.beginPath();
  for(let i=0;i<5;i++){
    const a=i/5*Math.PI*2-Math.PI/2;
    const ia=a+Math.PI/5;
    i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
    ctx.lineTo(Math.cos(ia)*r*.45,Math.sin(ia)*r*.45);
  }
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawShield(ctx, x, y, r, t){
  ctx.save(); ctx.translate(x,y);
  const g=ctx.createRadialGradient(0,0,0,0,0,r*1.8);
  g.addColorStop(0,'rgba(0,229,255,.35)'); g.addColorStop(1,'transparent');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,r*1.8,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=`rgba(0,229,255,${.5+Math.sin(t*.1)*.3})`; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.stroke();
  // shield icon
  ctx.fillStyle='rgba(0,229,255,.8)'; ctx.font=`bold ${r}px serif`;
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('🛡',0,1);
  ctx.restore();
}

// ════════════════════════════════
//  PARTICLES
// ════════════════════════════════
let particles=[];
function spawnP(x,y,color,n=12,sp=4){
  for(let i=0;i<n;i++){
    const a=Math.PI*2/n*i+Math.random()*.5, v=Math.random()*sp+1;
    particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,
      life:1,decay:Math.random()*.035+.02,r:Math.random()*4+2,color});
  }
}
function spawnBurst(x,y){
  ['#ffd60a','#ff6b35','#00e5ff','#ff2d78','#39ff14'].forEach((c,i)=>setTimeout(()=>spawnP(x,y,c,8,5+i),i*35));
}
function drawP(){
  particles=particles.filter(p=>p.life>0);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vx*=.94; p.vy*=.94; p.life-=p.decay;
    ctx.save(); ctx.globalAlpha=p.life;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    ctx.fillStyle=p.color; ctx.fill(); ctx.restore();
  });
}

// ════════════════════════════════
//  TEXT POPS
// ════════════════════════════════
let pops=[];
function popT(x,y,text,color='#ffd60a',size=20){
  pops.push({x,y,text,color,size,life:1,vy:-1.8});
}
function drawPops(){
  pops=pops.filter(p=>p.life>0);
  pops.forEach(p=>{
    p.y+=p.vy; p.life-=.018;
    ctx.save(); ctx.globalAlpha=p.life;
    ctx.font=`bold ${p.size}px Orbitron,monospace`;
    ctx.textAlign='center'; ctx.fillStyle=p.color;
    ctx.shadowColor=p.color; ctx.shadowBlur=10;
    ctx.fillText(p.text,p.x,p.y); ctx.restore();
  });
}

// ════════════════════════════════
//  OBSTACLE TYPES
// ════════════════════════════════
const OBS_TYPES = [
  {type:'comet',   r:16, pts:5,  spd:1.2, col:'#ff6b35'},
  {type:'comet',   r:22, pts:8,  spd:.85, col:'#ff8c00'},
  {type:'asteroid',r:20, pts:10, spd:.7,  col:'#8a7a6a'},
  {type:'asteroid',r:28, pts:15, spd:.55, col:'#6a5a4a'},
  {type:'blackhole',r:18,pts:25, spd:.6,  col:'#aa44ff'},
];
const COLLECT_TYPES = [
  {type:'star',   r:14, pts:50,  spd:1.1},
  {type:'star',   r:18, pts:80,  spd:.9},
  {type:'shield', r:14, pts:0,   spd:.9},
];

// ════════════════════════════════
//  GAME STATE
// ════════════════════════════════
let P, obs, coll, score, lives, level, combo, maxCombo, speed,
    frame, running, inv, shield, shieldT,
    dist, animId, spawnTimer, collectTimer, maxLevel;

function makePlayer(){
  return {x:W*.1, y:H/2, vx:0, vy:0, w:22, h:44, trail:[], fireT:0};
}

function makeVerts(n){
  return Array.from({length:n},()=>Math.random()*.4+.65);
}

function spawnObs(){
  const t=OBS_TYPES[Math.floor(Math.random()*OBS_TYPES.length)];
  const spd=t.spd*speed*(Math.random()*.5+.75);
  const edge=Math.floor(Math.random()*3); // 0=right,1=top,2=bot
  let x,y,vx,vy;
  if(edge===0){x=W+80;y=60+Math.random()*(H-120);const a=Math.PI+(Math.random()-.5)*.6;vx=Math.cos(a)*spd;vy=Math.sin(a)*spd;}
  else if(edge===1){x=W*.3+Math.random()*W*.7;y=-80;vx=-(spd*.3);vy=spd;}
  else{x=W*.3+Math.random()*W*.7;y=H+80;vx=-(spd*.3);vy=-spd;}
  obs.push({...t, x,y,vx,vy, rot:Math.random()*Math.PI*2, rs:(Math.random()-.5)*.05,
    verts:t.type==='asteroid'?makeVerts(8):null, t:Math.random()*1000});
}
function spawnColl(){
  const t=COLLECT_TYPES[Math.floor(Math.random()*COLLECT_TYPES.length)];
  const spd=speed*(Math.random()*.4+.8);
  coll.push({...t, x:W+50, y:60+Math.random()*(H-120), vx:-spd, vy:(Math.random()-.5)*spd*.3,
    rot:0, rs:(Math.random()-.5)*.04, t:0});
}

// ─── TRAIL ───
function updateTrail(){
  P.trail.unshift({x:P.x,y:P.y});
  if(P.trail.length>20) P.trail.pop();
}
function drawTrail(){
  P.trail.forEach((pt,i)=>{
    const a=(1-i/P.trail.length)*.45;
    const r=(1-i/P.trail.length)*10+2;
    ctx.beginPath(); ctx.arc(pt.x,pt.y,r,0,Math.PI*2);
    ctx.fillStyle=`rgba(0,229,255,${a})`; ctx.fill();
  });
}

// ─── SHIELD RING ───
function drawShieldRing(){
  if(!shield) return;
  const pulse=.6+Math.sin(frame*.15)*.4;
  ctx.save();
  ctx.strokeStyle=`rgba(0,229,255,${pulse})`; ctx.lineWidth=2;
  ctx.shadowColor='rgba(0,229,255,.6)'; ctx.shadowBlur=15;
  ctx.beginPath(); ctx.arc(P.x,P.y,P.h*.85,0,Math.PI*2); ctx.stroke();
  ctx.globalAlpha=.08; ctx.fillStyle='#00e5ff';
  ctx.beginPath(); ctx.arc(P.x,P.y,P.h*.85,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

// ─── HIT FLASH ───
function flashHit(){ const f=$('fl'); f.classList.add('on'); setTimeout(()=>f.classList.remove('on'),120); }

// ─── COMBO ───
function addCombo(){
  combo=Math.min(combo+1,10); maxCombo=Math.max(maxCombo,combo);
  $('hCombo').textContent='x'+combo;
  if(combo>=3){
    const cp=$('cp'); cp.textContent='COMBO x'+combo+'!'; cp.classList.add('show');
    clearTimeout(cp._t); cp._t=setTimeout(()=>cp.classList.remove('show'),900);
  }
}
function resetCombo(){ combo=1; $('hCombo').textContent='x1'; }

// ─── LEVEL UP ───
function levelUp(){
  level++; maxLevel=Math.max(maxLevel,level);
  $('lb .lb-n',$('lb').querySelector('.lb-n')).textContent='РІВЕНЬ '+level;
  document.querySelector('.lb-n').textContent='РІВЕНЬ '+level;
  const lb=$('lb'); lb.classList.add('show'); setTimeout(()=>lb.classList.remove('show'),1800);
  spawnP(W*.5,H*.5,'#00e5ff',18,6); spawnP(W*.5,H*.5,'#ffd60a',18,6);
}

// ─── COLLISION ───
function circHit(ax,ay,ar,bx,by,br){ const d=Math.hypot(ax-bx,ay-by); return d<ar*.7+br*.7; }

// ─── SPEED UI ───
function speedUI(){
  // reflected in dist counter
}

// ════════════════════════════════
//  GAME LOOP
// ════════════════════════════════
let lastT=0, scoreAcc=0, distAcc=0;
const HUDH=52;

function loop(ts){
  if(!running) return;
  const dt=Math.min((ts-lastT)/16.67,3); lastT=ts;
  frame++;

  // Speed ramp
  speed = 2.8 + frame/1300;

  // Distance
  distAcc+=speed*dt;
  if(distAcc>=10){ dist+=Math.floor(distAcc/10); distAcc%=10; $('hDist').textContent=dist+'м'; }

  // Passive score
  scoreAcc+=dt;
  if(scoreAcc>=28){ scoreAcc=0; score+=combo; $('hScore').textContent=score; }

  // Level by distance
  const newLv=1+Math.floor(dist/400);
  if(newLv>level) levelUp();

  // Spawn
  spawnTimer+= dt;
  const si=Math.max(14,62-speed*3.5-level*.4);
  if(spawnTimer>=si){ spawnObs(); spawnTimer=0; }
  collectTimer+=dt;
  if(collectTimer>=Math.max(75,170-level*5)){ spawnColl(); collectTimer=0; }

  // ── CLEAR ──
  ctx.fillStyle='#03070f'; ctx.fillRect(0,0,W,H);

  // ── BACKGROUND ──
  drawNebs(speed);
  drawStars(speed);

  // ── PLAYER MOVE ──
  const SP=5.8;
  if(keys['ArrowUp']||keys['w']||keys['W'])    P.vy-=1.15*dt;
  if(keys['ArrowDown']||keys['s']||keys['S'])   P.vy+=1.15*dt;
  if(keys['ArrowLeft']||keys['a']||keys['A'])   P.vx-=1.15*dt;
  if(keys['ArrowRight']||keys['d']||keys['D'])  P.vx+=1.15*dt;
  if(keys['up'])    P.vy-=1.15*dt;
  if(keys['down'])  P.vy+=1.15*dt;
  if(keys['left'])  P.vx-=1.15*dt;
  if(keys['right']) P.vx+=1.15*dt;
  // touch swipe
  P.vx+=touchDelta.x*1.5; P.vy+=touchDelta.y*1.5;
  touchDelta={x:0,y:0};

  P.vx=Math.max(-SP,Math.min(SP,P.vx)); P.vy=Math.max(-SP,Math.min(SP,P.vy));
  P.vx*=.83; P.vy*=.83;
  P.x=Math.max(P.w,Math.min(W-P.w,P.x+P.vx));
  P.y=Math.max(HUDH+P.h*.6,Math.min(H-P.h*.6,P.y+P.vy));
  P.fireT+=dt;

  if(shield){ shieldT-=dt; if(shieldT<=0){shield=false;} }

  // ── OBS MOVE ──
  obs.forEach(o=>{ o.x+=o.vx*dt; o.y+=o.vy*dt; o.rot+=o.rs; o.t+=dt; });
  obs=obs.filter(o=>o.x>-160&&o.x<W+160&&o.y>-160&&o.y<H+160);
  coll.forEach(o=>{ o.x+=o.vx*dt; o.y+=o.vy*dt; o.rot+=o.rs; o.t+=dt; });
  coll=coll.filter(o=>o.x>-100&&o.x<W+100&&o.y>-100&&o.y<H+100);

  // ── DRAW TRAIL ──
  updateTrail(); drawTrail();

  // ── DRAW COLLECTIBLES ──
  coll.forEach(o=>{
    if(o.type==='star') drawStar(ctx,o.x,o.y,o.r,o.t);
    else drawShield(ctx,o.x,o.y,o.r,o.t);
  });

  // ── DRAW OBSTACLES ──
  obs.forEach(o=>{
    if(o.type==='comet') drawComet(ctx,o.x,o.y,o.r,o.rot,o.t);
    else if(o.type==='asteroid') drawAsteroid(ctx,o.x,o.y,o.r,o.rot,o.verts);
    else drawBlackHole(ctx,o.x,o.y,o.r,o.rot,o.t);
  });

  // ── DRAW SHIELD RING ──
  drawShieldRing();

  // ── DRAW ROCKET ──
  const blink = inv && Math.floor(frame/5)%2===0;
  if(!blink){
    // rocket is rotated 90° to fly rightward; body goes from top to bottom so we rotate
    ctx.save(); ctx.translate(P.x,P.y); ctx.rotate(Math.PI/2);
    drawRocket(0,0,1,P.fireT);
    ctx.restore();
  }

  // ── PARTICLES & POPS ──
  drawP(); drawPops();

  // ── COLLISION ──
  if(!inv){
    // collectibles
    for(let i=coll.length-1;i>=0;i--){
      const o=coll[i];
      if(circHit(P.x,P.y,P.w*.8,o.x,o.y,o.r)){
        coll.splice(i,1);
        if(o.type==='shield'){ shield=true; shieldT=300; spawnP(P.x,P.y,'#00e5ff',14,4); popT(P.x,P.y-30,'ЩІИТ!','#00e5ff',18); }
        else{ const pts=o.pts*combo; score+=pts; $('hScore').textContent=score; addCombo(); spawnBurst(o.x,o.y); popT(o.x,o.y-20,'+'+pts,'#ffd60a'); }
      }
    }
    // obstacles
    for(let i=obs.length-1;i>=0;i--){
      const o=obs[i];
      if(circHit(P.x,P.y,P.w*.75,o.x,o.y,o.r)){
        if(shield){ shield=false; shieldT=0; spawnP(o.x,o.y,'#00e5ff',16,5); obs.splice(i,1); popT(P.x,P.y-30,'ЗАХИСТ!','#00e5ff',18); }
        else{
          lives--; $('hLives').textContent='❤️'.repeat(Math.max(0,lives));
          flashHit(); spawnP(P.x,P.y,'#ff6b35',18,5); obs.splice(i,1);
          resetCombo(); inv=true; setTimeout(()=>inv=false,1800);
          if(lives<=0){endGame();return;}
        }
        break;
      }
    }
  }

  animId=requestAnimationFrame(loop);
}

// ════════════════════════════════
//  START / END
// ════════════════════════════════
function startGame(){
  P=makePlayer(); obs=[]; coll=[]; particles=[]; pops=[];
  score=0; lives=3; level=1; combo=1; maxCombo=1; speed=2.8; frame=0;
  inv=false; shield=false; shieldT=0; dist=0; running=true;
  spawnTimer=0; collectTimer=0; maxLevel=1;
  lastT=performance.now(); scoreAcc=0; distAcc=0;

  $('hDist').textContent='0м'; $('hScore').textContent='0'; $('hCombo').textContent='x1';
  $('hLives').textContent='❤️❤️❤️';
  $('hud').style.display='flex';
  $('ss').classList.add('off'); $('go').classList.add('off');

  cancelAnimationFrame(animId);
  animId=requestAnimationFrame(loop);
}

function endGame(){
  running=false; cancelAnimationFrame(animId);
  $('hud').style.display='none';

  const isNew=dist>best;
  if(isNew){best=dist;localStorage.setItem('sr_best',best);}
  $('goScore').textContent=score;
  $('goDist').textContent=dist+'м'; $('goBest').textContent=best+'м'; $('bDisp').textContent=best;
  $('goCombo').textContent='x'+maxCombo; $('goLevel').textContent=level;
  $('goNR').style.display=isNew?'flex':'none';

  spawnBurst(W/2,H*.4);
  setTimeout(()=>spawnBurst(W*.3,H*.5),300);
  setTimeout(()=>spawnBurst(W*.7,H*.45),550);

  $('go').classList.remove('off');
}

$('startBtn').addEventListener('click', startGame);
$('restBtn').addEventListener('click', startGame);

// ── IDLE BG ANIMATION ──
initStars(); initNebs();
(function idleLoop(){
  if(!running){
    ctx.fillStyle='#03070f'; ctx.fillRect(0,0,W,H);
    drawNebs(1.2); drawStars(1.2); drawP();
  }
  requestAnimationFrame(idleLoop);
})();
</script>
</body>
</html>
