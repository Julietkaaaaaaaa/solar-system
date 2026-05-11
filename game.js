<style>
  /* Локальні стилі для контейнера гри */
  #game-container {
    position: relative;
    width: 100%;
    height: 500px;
    background: #050a14;
    overflow: hidden;
    touch-action: none;
    border: 2px solid rgba(0,229,255,0.3);
    border-radius: 15px;
  }

  #game-container canvas { position: absolute; inset: 0; display: block; }
  #stars { z-index: 0; }
  #gameCanvas { z-index: 1; }

  .game-screen {
    position: absolute; inset: 0; z-index: 10;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: rgba(5,10,20,0.85);
    backdrop-filter: blur(8px);
    transition: opacity .4s;
    color: #00e5ff;
    font-family: 'Orbitron', sans-serif;
  }
  .game-screen.hidden { display: none !important; }

  .game-hud {
    position: absolute; top: 0; left: 0; right: 0; z-index: 5;
    display: flex; justify-content: space-between; padding: 15px 25px;
    font-family: 'Share Tech Mono', monospace;
    color: #00e5ff;
    pointer-events: none;
  }

  .game-btn {
    margin-top: 20px; padding: 12px 30px;
    background: #00e5ff; color: #050a14;
    border: none; border-radius: 50px; font-weight: 900;
    cursor: pointer; box-shadow: 0 0 20px rgba(0,229,255,0.5);
    text-transform: uppercase; letter-spacing: 2px;
    transition: 0.3s;
  }
  .game-btn:hover { transform: scale(1.05); background: #fff; }

  #flash-effect { position: absolute; inset: 0; z-index: 20; background: rgba(255,0,0,0.3); opacity: 0; pointer-events: none; }
  #flash-effect.active { opacity: 1; }
</style>

<div id="game-container">
  <canvas id="stars"></canvas>
  <canvas id="gameCanvas"></canvas>
  <div id="flash-effect"></div>

  <div id="hud" class="game-hud" style="display:none">
    <div style="letter-spacing:2px">ROCKET_OS</div>
    <div id="scoreDisplay">SCORE: 0</div>
    <div id="livesDisplay">❤️❤️❤️</div>
  </div>

  <div class="game-screen" id="startScreen">
    <h2 style="font-size: 2.5rem; margin-bottom: 10px; font-weight: 900;">SOLAR_OS</h2>
    <p style="color: #fff; margin-bottom: 20px; font-size: 0.8rem; letter-spacing: 3px;">// MISSION: SURVIVAL //</p>
    <div style="text-align: left; font-family: 'Share Tech Mono'; font-size: 0.9rem; line-height: 1.6; opacity: 0.8;">
      ⌨️ WASD / Стрілки — рух<br>
      📱 Тягни пальцем — керування<br>
      ☄️ Уникай перешкод
    </div>
    <button class="game-btn" id="startBtn">ЗАПУСТИТИ ДВИГУНИ</button>
  </div>

  <div class="game-screen hidden" id="gameOverScreen">
    <h2 style="color: #ff4444; font-size: 2rem;">ЗВ'ЯЗОК ВТРАЧЕНО</h2>
    <div style="font-size: 3rem; color: #ffd60a; margin: 15px 0;" id="finalScore">0</div>
    <p style="margin-bottom: 20px;">Ваш фінальний результат</p>
    <button class="game-btn" id="restartBtn">ПЕРЕЗАПУСТИТИ</button>
  </div>
</div>

<script>
(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const starCanvas = document.getElementById('stars');
  const starCtx = starCanvas.getContext('2d');
  const container = document.getElementById('game-container');

  let W, H, player, obstacles, stars, score, lives, gameRunning, speed, invincible;
  let touchX = null, touchY = null; // ДОДАНО: оголошення змінних
  const keys = {};

  function initStars() {
    stars = Array.from({length: 80}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 1.5 + 0.2
    }));
  }

  function resize() {
    W = canvas.width = starCanvas.width = container.offsetWidth;
    H = canvas.height = starCanvas.height = container.offsetHeight;
    initStars();
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  // Керування тачем
  container.addEventListener('touchstart', e => {
    const rect = container.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
    touchY = e.touches[0].clientY - rect.top;
  });
  container.addEventListener('touchmove', e => {
    const rect = container.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
    touchY = e.touches[0].clientY - rect.top;
    e.preventDefault();
  }, {passive: false});
  container.addEventListener('touchend', () => { touchX = null; touchY = null; });

  function startGame() {
    player = { x: 80, y: H/2, w: 50, h: 50, trail: [] };
    obstacles = [];
    score = 0;
    lives = 3;
    speed = 3;
    invincible = false;
    gameRunning = true;
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    updateLivesUI();
    loop();
  }

  function updateLivesUI() {
    document.getElementById('livesDisplay').textContent = '❤️'.repeat(lives);
  }

  function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, W, H);
    
    // Зорі
    starCtx.clearRect(0, 0, W, H);
    starCtx.fillStyle = "#ffffff";
    stars.forEach(s => {
      s.x -= s.speed * (speed / 2);
      if (s.x < 0) { s.x = W; s.y = Math.random() * H; }
      starCtx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Спавн перешкод
    if (Math.random() < 0.03) {
      const emojis = ['☄️', '🪨', '🛸', '👾'];
      obstacles.push({
        x: W + 50,
        y: Math.random() * (H - 60) + 30,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        speed: (Math.random() * 2 + 2) + speed
      });
    }

    // Керування клавіатурою
    if (keys['ArrowUp'] || keys['w']) player.y -= 7;
    if (keys['ArrowDown'] || keys['s']) player.y += 7;
    if (keys['ArrowLeft'] || keys['a']) player.x -= 7;
    if (keys['ArrowRight'] || keys['d']) player.x += 7;

    // Керування тачем
    if (touchX !== null) {
      player.x += (touchX - player.x) * 0.1;
      player.y += (touchY - player.y) * 0.1;
    }

    // Межі
    player.x = Math.max(40, Math.min(W * 0.5, player.x));
    player.y = Math.max(40, Math.min(H - 40, player.y));

    // Шлейф
    player.trail.unshift({x: player.x, y: player.y});
    if (player.trail.length > 12) player.trail.pop();
    player.trail.forEach((t, i) => {
      ctx.globalAlpha = (1 - i/12) * 0.6;
      ctx.fillStyle = "#ffaa00";
      ctx.beginPath();
      ctx.arc(t.x - 30, t.y, 10 - i, 0, Math.PI*2);
      ctx.fill();
    });

    // Ракета
    ctx.globalAlpha = 1.0;
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (!invincible || Math.floor(Date.now()/150) % 2) {
      ctx.fillText("🚀", player.x, player.y);
    }

    // Перешкоди
    obstacles.forEach((o, index) => {
      o.x -= o.speed;
      ctx.fillText(o.emoji, o.x, o.y);

      let dx = player.x - o.x;
      let dy = player.y - o.y;
      if (Math.sqrt(dx*dx + dy*dy) < 40 && !invincible) {
        lives--;
        updateLivesUI();
        document.getElementById('flash-effect').classList.add('active');
        setTimeout(() => document.getElementById('flash-effect').classList.remove('active'), 150);
        obstacles.splice(index, 1);
        if (lives <= 0) {
          gameRunning = false;
          document.getElementById('gameOverScreen').classList.remove('hidden');
          document.getElementById('finalScore').textContent = Math.floor(score/10);
        } else {
          invincible = true;
          setTimeout(() => invincible = false, 2000);
        }
      }
      if (o.x < -100) obstacles.splice(index, 1);
    });

    score++;
    document.getElementById('scoreDisplay').textContent = `SCORE: ${Math.floor(score/10)}`;
    speed += 0.0003;
    requestAnimationFrame(loop);
  }

  document.getElementById('startBtn').onclick = startGame;
  document.getElementById('restartBtn').onclick = startGame;
})();
</script>
