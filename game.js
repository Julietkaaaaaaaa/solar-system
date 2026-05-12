<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>SOLAR_OS // ROCKET</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
/* Базові налаштування адаптивності */
*{box-sizing:border-box;margin:0;padding:0; -webkit-touch-callout:none; -webkit-user-select:none;}
body{background:#03070f;font-family:'Orbitron',monospace;overflow:hidden;width:100vw;height:100vh; touch-action:none;}

#cv{
  position:fixed;top:0;left:0;
  width:100%;height:100%;
  display:block;
  pointer-events:none; 
  z-index:1;
}

/* Шар для керування - тепер він завжди активний, але не перекриває кнопки */
#touch-layer{
  position:fixed;inset:0;z-index:10;
  display:none; 
  touch-action:none;
}

/* Екрани */
#screen-start,#screen-over{
  position:fixed;inset:0;z-index:100; /* Підняли вище за все */
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:1em;
  background: radial-gradient(circle at center, rgba(0,20,40,0.4) 0%, #03070f 100%);
}
#screen-over{display:none;}

/* HUD адаптовий */
#hud{
  position:fixed;top:0;left:0;right:0;z-index:50;
  display:none;
  align-items:center;justify-content:space-between;
  padding:10px 15px;
  background:rgba(3,7,15,.8);
  border-bottom:1px solid rgba(0,229,255,.2);
  backdrop-filter:blur(5px);
}
.hud-logo{font-weight:900;font-size:12px;letter-spacing:.2em;color:#00e5ff;}
.hud-mid{display:flex;gap:15px;}
.hud-item .val{font-size:14px;font-weight:700;}
.lives{font-size:16px;}

/* Дизайн кнопок та карток */
.logo{font-size:clamp(1.8rem,10vw,4rem);font-weight:900;letter-spacing:.2em;color:#fff; text-align:center;}
.logo span{color:#00e5ff;}

.card{
  background:rgba(3,7,15,0.95);
  border:2px solid rgba(0,229,255,0.3);
  border-radius:15px;
  padding:20px;
  width:90%;
  max-width:400px;
  backdrop-filter:blur(10px);
  z-index:101;
}

.play-btn{
  display:block;width:100%;
  padding:15px;
  background:#00e5ff;color:#03070f;
  border:none;border-radius:10px;
  font-family:'Orbitron',monospace;font-weight:900;
  font-size:16px;letter-spacing:.1em;
  cursor:pointer;
  box-shadow:0 0 20px rgba(0,229,255,0.4);
  margin-top:20px;
}
.play-btn:active{transform:scale(0.95); background:#fff;}

/* Для маленьких екранів */
@media (max-height: 500px) {
  .logo { font-size: 1.5rem; }
  .sub { display: none; }
  .card h2 { font-size: 0.8rem; }
  .hint-row { font-size: 0.6rem; }
}

#flash{position:fixed;inset:0;z-index:200;background:rgba(255,100,0,0.3);pointer-events:none;opacity:0;}
#flash.on{opacity:1;}
</style>
</head>
<body>

<canvas id="cv"></canvas>
<div id="touch-layer"></div>
<div id="flash"></div>

<div id="hud">
  <div class="hud-logo">SOLAR_<b>OS</b></div>
  <div class="hud-mid">
    <div class="hud-item"><div class="val cy" id="h-dist">0м</div></div>
    <div class="hud-item"><div class="val ye" id="h-score">0</div></div>
  </div>
  <div class="lives" id="h-lives">❤️❤️❤️</div>
</div>

<div id="screen-start">
  <div class="logo">SOLAR_<span>OS</span></div>
  <div class="sub" style="color:rgba(0,229,255,0.5);margin-bottom:20px">// ROCKET SURVIVAL //</div>
  <div class="card">
    <h2 style="color:#fff;margin-bottom:15px;font-size:14px">🚀 МІСІЯ: ВИЖИТИ</h2>
    <div style="color:#aaa;font-size:12px;margin-bottom:10px">💻 Клавіші: WASD / Стрілки</div>
    <div style="color:#aaa;font-size:12px;margin-bottom:10px">📱 Телефон: Тягніть пальцем</div>
    <button class="play-btn" id="btn-start">РОЗПОЧАТИ ПОЛІТ</button>
  </div>
</div>

<div id="screen-over">
  <div class="card" style="text-align:center">
    <h2 style="color:#ff6b35;margin-bottom:10px">КІНЕЦЬ МІСІЇ</h2>
    <div style="font-size:30px;color:#ffd60a;margin-bottom:20px" id="go-score">0</div>
    <div style="color:#fff;margin-bottom:20px" id="go-dist">0м</div>
    <button class="play-btn" id="btn-restart">ПЕРЕЗАПУСК</button>
  </div>
</div>

<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const touchLayer = document.getElementById('touch-layer');
const $ = id => document.getElementById(id);

let W, H;
function resize() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
    initStars();
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));
resize();

// ── КЕРУВАННЯ ──
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

let tStart = null, tPos = {x:0, y:0};
touchLayer.addEventListener('touchstart', e => {
    tStart = {x: e.touches[0].clientX, y: e.touches[0].clientY};
}, {passive: false});

touchLayer.addEventListener('touchmove', e => {
    if (!tStart) return;
    const t = e.touches[0];
    tPos.x = (t.clientX - tStart.x) * 0.15; // Чутливість
    tPos.y = (t.clientY - tStart.y) * 0.15;
    e.preventDefault();
}, {passive: false});

touchLayer.addEventListener('touchend', () => { tStart = null; tPos = {x:0, y:0}; });

// ── ГРА ──
let stars = [], nebs = [], obs = [], coll = [], particles = [];
let gameRunning = false, player, score, dist, lives, frame, speed;

function initStars() {
    stars = Array.from({length: 100}, () => ({
        x: Math.random() * W, y: Math.random() * H,
        s: Math.random() * 2, spd: Math.random() * 3 + 1
    }));
}

function spawnObstacle() {
    if (Math.random() > 0.05) return;
    obs.push({
        x: W + 50, y: Math.random() * H,
        r: 15 + Math.random() * 20,
        spd: 3 + Math.random() * speed
    });
}

function update() {
    if (!gameRunning) return;
    frame++;
    speed = 2 + frame / 1000;
    dist = Math.floor(frame / 10);

    // Рух гравця
    if (keys['w'] || keys['ArrowUp']) player.y -= 5;
    if (keys['s'] || keys['ArrowDown']) player.y += 5;
    if (keys['a'] || keys['ArrowLeft']) player.x -= 5;
    if (keys['d'] || keys['ArrowRight']) player.x += 5;
    
    player.x += tPos.x; player.y += tPos.y;
    
    // Межі
    player.x = Math.max(20, Math.min(W-20, player.x));
    player.y = Math.max(50, Math.min(H-20, player.y));

    // Об'єкти
    obs.forEach((o, i) => {
        o.x -= o.spd;
        if (Math.hypot(player.x - o.x, player.y - o.y) < o.r + 10) {
            obs.splice(i, 1);
            hit();
        }
    });
    obs = obs.filter(o => o.x > -50);
    spawnObstacle();

    $('h-dist').textContent = dist + 'м';
    $('h-score').textContent = score;
}

function hit() {
    lives--;
    $('h-lives').textContent = '❤️'.repeat(lives);
    $('flash').classList.add('on');
    setTimeout(() => $('flash').classList.remove('on'), 100);
    if (lives <= 0) endGame();
}

function draw() {
    ctx.fillStyle = '#03070f';
    ctx.fillRect(0, 0, W, H);

    // Зірки
    ctx.fillStyle = '#fff';
    stars.forEach(s => {
        s.x -= s.spd;
        if (s.x < 0) s.x = W;
        ctx.fillRect(s.x, s.y, s.s, s.s);
    });

    if (gameRunning) {
        // Ракета (спрощена для прикладу, але твоя функція drawRocket теж підійде)
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(player.x, player.y, 15, 0, Math.PI*2);
        ctx.fill();

        // Перешкоди
        ctx.fillStyle = '#ff6b35';
        obs.forEach(o => {
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
            ctx.fill();
        });
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    player = {x: W * 0.2, y: H / 2};
    score = 0; dist = 0; lives = 3; frame = 0; speed = 3; obs = [];
    gameRunning = true;
    $('screen-start').style.display = 'none';
    $('screen-over').style.display = 'none';
    $('hud').style.display = 'flex';
    touchLayer.style.display = 'block';
}

function endGame() {
    gameRunning = false;
    $('screen-over').style.display = 'flex';
    $('hud').style.display = 'none';
    touchLayer.style.display = 'none';
    $('go-score').textContent = score;
    $('go-dist').textContent = dist + 'м';
}

$('btn-start').onclick = startGame;
$('btn-restart').onclick = startGame;

initStars();
gameLoop();
</script>
</body>
</html>
