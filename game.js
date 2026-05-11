const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const starCanvas = document.getElementById('stars');
const starCtx = starCanvas.getContext('2d');

let W, H, player, obstacles, stars, score, lives, gameRunning, speed, invincible, startTime;
const keys = {};

// Налаштування кольорів Solar_OS
const COLORS = {
    cyan: '#00e5ff',
    orange: '#ffaa00',
    red: '#ff4444',
    bg: '#050a14'
};

function initStars() {
    stars = Array.from({length: 150}, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 2,
        speed: Math.random() * 3 + 1
    }));
}

function updateStars() {
    starCtx.clearRect(0, 0, W, H);
    starCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
    stars.forEach(s => {
        s.x -= s.speed * (speed / 3);
        if (s.x < 0) { s.x = W; s.y = Math.random() * H; }
        starCtx.fillRect(s.x, s.y, s.size, s.size);
    });
}

function resize() {
    W = canvas.width = starCanvas.width = window.innerWidth;
    H = canvas.height = starCanvas.height = window.innerHeight;
    initStars();
}
window.addEventListener('resize', resize);
resize();

// Керування
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function startGame() {
    player = { 
        x: 100, 
        y: H/2, 
        w: 50, 
        h: 30, 
        targetY: H/2,
        trail: [] 
    };
    obstacles = [];
    score = 0;
    lives = 3;
    speed = 5;
    startTime = Date.now();
    invincible = false;
    gameRunning = true;

    document.getElementById('hud').style.display = 'flex';
    document.getElementById('startScreen').classList.add('hidden');
    if(document.getElementById('gameOverScreen')) document.getElementById('gameOverScreen').classList.add('hidden');
    
    updateLivesUI();
    loop();
}

function updateLivesUI() {
    const livesDisp = document.getElementById('livesDisplay');
    livesDisp.innerHTML = '';
    for(let i=0; i<3; i++) {
        const heart = document.createElement('span');
        heart.textContent = i < lives ? '❤️' : '🖤';
        heart.style.opacity = i < lives ? '1' : '0.3';
        livesDisp.appendChild(heart);
    }
}

function spawnObstacle() {
    // Шанс появи збільшується зі швидкістю
    if (Math.random() < 0.03 + (speed / 500)) {
        const size = Math.random() * 30 + 20;
        obstacles.push({
            x: W + 100,
            y: Math.random() * (H - 100) + 50,
            w: size,
            h: size * 0.8,
            speed: (Math.random() * 2 + 3) + speed,
            color: Math.random() > 0.5 ? COLORS.cyan : COLORS.red,
            angle: 0,
            rotSpeed: (Math.random() - 0.5) * 0.2
        });
    }
}

function drawPlayer() {
    ctx.save();
    
    // Ефект миготіння при невразливості
    if (invincible && Math.floor(Date.now() / 100) % 2 === 0) ctx.globalAlpha = 0.3;

    // Шлейф (вогонь ракети)
    player.trail.unshift({x: player.x, y: player.y});
    if (player.trail.length > 20) player.trail.pop();
    
    player.trail.forEach((t, i) => {
        ctx.beginPath();
        ctx.fillStyle = i < 10 ? COLORS.cyan : COLORS.orange;
        ctx.globalAlpha = (1 - i / 20) * 0.5;
        ctx.arc(t.x - 20 - i * 3, t.y + player.h / 2, (player.h / 3) - i / 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Тіло ракети (Малюємо стильний прямокутник з градієнтом як на скриншоті)
    ctx.globalAlpha = 1.0;
    const grad = ctx.createLinearGradient(player.x, player.y, player.x + player.w, player.y);
    grad.addColorStop(0, COLORS.cyan);
    grad.addColorStop(1, '#0083ff');

    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.cyan;
    ctx.fillStyle = grad;
    
    // Малюємо форму ракети
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.w, player.h, 5);
    ctx.fill();

    // Кабіна
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x + player.w - 15, player.y + 5, 10, player.h - 10);
    
    ctx.restore();
}

function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, W, H);
    updateStars();
    spawnObstacle();

    // Таймер та пришвидшення
    const timePassed = Math.floor((Date.now() - startTime) / 1000);
    speed = 5 + (timePassed / 10); // Кожні 10 секунд швидкість зростає на 1
    
    // Оновлення HUD
    document.getElementById('scoreDisplay').innerHTML = `TIME: ${timePassed}s | SPEED: ${speed.toFixed(1)}x`;

    // Рух
    if (keys['ArrowUp'] || keys['w']) player.y -= 10;
    if (keys['ArrowDown'] || keys['s']) player.y += 10;
    
    player.y = Math.max(50, Math.min(H - 50, player.y));

    drawPlayer();

    // Обробка перешкод
    obstacles.forEach((o, index) => {
        o.x -= o.speed;
        o.angle += o.rotSpeed;

        ctx.save();
        ctx.translate(o.x, o.y);
        ctx.rotate(o.angle);
        
        // Малюємо астероїд (геометричний)
        ctx.shadowBlur = 10;
        ctx.shadowColor = o.color;
        ctx.strokeStyle = o.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-o.w/2, -o.h/2, o.w, o.h);
        
        ctx.restore();

        // Колізія
        if (!invincible && 
            player.x < o.x + o.w/2 && 
            player.x + player.w > o.x - o.w/2 &&
            player.y < o.y + o.h/2 && 
            player.y + player.h > o.y - o.h/2) {
            
            lives--;
            updateLivesUI();
            invincible = true;
            setTimeout(() => invincible = false, 2000);
            obstacles.splice(index, 1);
            
            if (lives <= 0) gameOver();
        }

        if (o.x < -100) obstacles.splice(index, 1);
    });

    requestAnimationFrame(loop);
}

function gameOver() {
    gameRunning = false;
    alert(`SYSTEM OVERLOAD! \nTime: ${Math.floor((Date.now() - startTime) / 1000)}s`);
    location.reload(); // Найпростіший спосіб рестарту
}

document.getElementById('startBtn').onclick = startGame;
