<style>
  /* Головний контейнер гри */
  #game-container {
    position: relative;
    width: 100%;
    height: 600px;
    background: #050a14;
    overflow: hidden;
    border: 1px solid #1a2a3a;
    border-radius: 20px;
    font-family: 'Orbitron', sans-serif;
    touch-action: none; /* Важливо для мобільного керування */
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* Екран старту */
  .game-screen {
    position: absolute;
    inset: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #050a14;
    transition: opacity 0.5s ease;
  }

  .game-screen.hidden { 
    opacity: 0;
    pointer-events: none;
  }

  .solar-title {
    font-size: clamp(40px, 8vw, 80px);
    font-weight: 900;
    color: #00e5ff;
    letter-spacing: 15px;
    text-shadow: 0 0 30px rgba(0, 229, 255, 0.6);
    margin-bottom: 5px;
    text-align: center;
  }

  .solar-subtitle {
    color: #00e5ff;
    font-size: 14px;
    letter-spacing: 5px;
    margin-bottom: 40px;
    opacity: 0.8;
  }

  .instruction-box {
    background: rgba(0, 20, 30, 0.4);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 15px;
    padding: 30px 40px;
    width: 90%;
    max-width: 450px;
    text-align: left;
    margin-bottom: 40px;
  }

  .instr-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #fff;
    margin-bottom: 25px;
    justify-content: center;
    text-transform: uppercase;
  }

  .instr-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
    color: #a0c0c5;
    font-size: 13px;
    font-family: sans-serif;
  }

  .init-button {
    background: #00bcd4;
    color: #000 !important;
    border: none;
    padding: 15px 60px;
    border-radius: 50px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    box-shadow: 0 0 40px rgba(0, 188, 212, 0.6);
    transition: 0.3s ease;
  }

  .init-button:hover {
    transform: scale(1.05);
    background: #00e5ff;
    box-shadow: 0 0 60px rgba(0, 229, 255, 0.8);
  }

  #hud {
    position: absolute;
    top: 20px;
    width: 100%;
    display: none;
    justify-content: space-between;
    padding: 0 40px;
    color: #00e5ff;
    z-index: 10;
    font-size: 14px;
    letter-spacing: 2px;
  }
</style>

<div id="game-container">
  <canvas id="starsCanvas"></canvas>
  <canvas id="gameCanvas"></canvas>

  <div class="game-screen" id="startScreen">
    <h1 class="solar-title">SOLAR_OS</h1>
    <p class="solar-subtitle">// ROCKET SURVIVAL v2.0 //</p>

    <div class="instruction-box">
      <div class="instr-header">🚀 Керуй ракетою</div>
      <div class="instr-item"><span>⌨️</span> <span>WASD / Стрілки — рух</span></div>
      <div class="instr-item"><span>📱</span> <span>Тач/Миша — ракета слідує за тобою</span></div>
      <div class="instr-item"><span>☄️</span> <span>Уникай комет та астероїдів</span></div>
      <div class="instr-item"><span>⚡</span> <span>Швидкість польоту зростає!</span></div>
      <div class="instr-item"><span>❤️</span> <span>3 життя — бережи систему!</span></div>
    </div>

    <button class="init-button" id="startBtn">Ініціалізувати</button>
  </div>

  <div id="hud">
    <div class="font-sci-fi">SYSTEM_ACTIVE</div>
    <div id="scoreDisplay">SCORE: 0</div>
    <div id="livesDisplay">❤️❤️❤️</div>
  </div>
</div>

<script>
(function() {
    const container = document.getElementById('game-container');
    const gCanvas = document.getElementById('gameCanvas');
    const sCanvas = document.getElementById('starsCanvas');
    const gCtx = gCanvas.getContext('2d');
    const sCtx = sCanvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const startScreen = document.getElementById('startScreen');
    const hud = document.getElementById('hud');

    let gameActive = false;
    let score = 0;
    let lives = 3;
    let frameCount = 0;
    
    let rocket = { x: 100, y: 300, w: 40, h: 25, speed: 7, targetY: 300 };
    let enemies = [];
    let stars = [];
    let keys = {};

    // Налаштування розмірів
    function resize() {
        const rect = container.getBoundingClientRect();
        gCanvas.width = sCanvas.width = rect.width;
        gCanvas.height = sCanvas.height = rect.height;
        initStars();
    }

    function initStars() {
        stars = [];
        for(let i=0; i<100; i++) {
            stars.push({ x: Math.random()*sCanvas.width, y: Math.random()*sCanvas.height, size: Math.random()*2, speed: Math.random()*0.5 + 0.1 });
        }
    }

    // Керування
    window.addEventListener('keydown', e => keys[e.code] = true);
    window.addEventListener('keyup', e => keys[e.code] = false);
    container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        rocket.targetY = e.clientY - rect.top;
    });
    container.addEventListener('touchmove', e => {
        const rect = container.getBoundingClientRect();
        rocket.targetY = e.touches[0].clientY - rect.top;
        e.preventDefault();
    }, {passive: false});

    function spawnEnemy() {
        const type = Math.random() > 0.8 ? 'ufo' : 'comet';
        enemies.push({
            x: gCanvas.width + 50,
            y: Math.random() * (gCanvas.height - 30),
            w: 30, h: 20,
            speed: (3 + Math.random() * 4) + (score / 100),
            type: type
        });
    }

    function update() {
        if(!gameActive) return;

        // Рух зірок
        stars.forEach(s => {
            s.x -= s.speed;
            if(s.x < 0) s.x = sCanvas.width;
        });

        // Рух ракети (клавіші)
        if(keys['ArrowUp'] || keys['KeyW']) rocket.targetY -= rocket.speed;
        if(keys['ArrowDown'] || keys['KeyS']) rocket.targetY += rocket.speed;
        
        // Плавне слідування за targetY
        let dy = rocket.targetY - (rocket.y + rocket.h/2);
        rocket.y += dy * 0.1;
        
        // Межі екрану
        if(rocket.y < 0) rocket.y = 0;
        if(rocket.y > gCanvas.height - rocket.h) rocket.y = gCanvas.height - rocket.h;

        // Вороги
        if(frameCount % Math.max(20, 60 - Math.floor(score/10)) === 0) spawnEnemy();

        enemies.forEach((en, i) => {
            en.x -= en.speed;
            
            // Колізія
            if(rocket.x < en.x + en.w && rocket.x + rocket.w > en.x &&
               rocket.y < en.y + en.h && rocket.y + rocket.h > en.y) {
                enemies.splice(i, 1);
                lives--;
                updateHUD();
                if(lives <= 0) endGame();
            }

            if(en.x < -50) {
                enemies.splice(i, 1);
                score += 10;
                updateHUD();
            }
        });

        frameCount++;
    }

    function draw() {
        // Фон (Зірки)
        sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
        sCtx.fillStyle = '#fff';
        stars.forEach(s => sCtx.fillRect(s.x, s.y, s.size, s.size));

        // Гра
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

        // Ракета (Cyan Glow)
        gCtx.shadowBlur = 15;
        gCtx.shadowColor = '#00e5ff';
        gCtx.fillStyle = '#00e5ff';
        gCtx.fillRect(rocket.x, rocket.y, rocket.w, rocket.h);
        // "Вогонь" ракети
        gCtx.fillStyle = '#ff8800';
        gCtx.fillRect(rocket.x - 10, rocket.y + 5, 10, rocket.h - 10);

        // Вороги
        enemies.forEach(en => {
            gCtx.shadowColor = en.type === 'ufo' ? '#ff00ff' : '#ff4400';
            gCtx.fillStyle = gCtx.shadowColor;
            if(en.type === 'ufo') {
                gCtx.fillRect(en.x, en.y, en.w, en.h);
            } else {
                gCtx.beginPath();
                gCtx.arc(en.x + en.w/2, en.y + en.h/2, en.w/2, 0, Math.PI*2);
                gCtx.fill();
            }
        });

        if(gameActive) requestAnimationFrame(() => { update(); draw(); });
    }

    function updateHUD() {
        document.getElementById('scoreDisplay').innerText = `SCORE: ${score}`;
        document.getElementById('livesDisplay').innerText = '❤️'.repeat(lives);
    }

    function endGame() {
        gameActive = false;
        alert(`GAME OVER! Ваш результат: ${score}`);
        location.reload();
    }

    startBtn.onclick = () => {
        startScreen.classList.add('hidden');
        hud.style.display = 'flex';
        gameActive = true;
        resize();
        draw();
    };

    window.addEventListener('resize', resize);
    resize();
})();
</script>
