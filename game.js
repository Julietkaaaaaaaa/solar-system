(function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const starCanvas = document.getElementById('stars');
    const starCtx = starCanvas ? starCanvas.getContext('2d') : null;

    let W, H, player, obstacles, stars, gameRunning = false, speed, lives, invincible, startTime;
    const keys = {};

    const COLORS = {
        cyan: '#00e5ff',
        orange: '#ffaa00',
        red: '#ff4444',
        bg: '#050a14'
    };

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        if (starCanvas) {
            starCanvas.width = W;
            starCanvas.height = H;
        }
        initStars();
    }

    function initStars() {
        stars = Array.from({length: 150}, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            size: Math.random() * 2,
            spd: Math.random() * 3 + 1
        }));
    }

    // --- КЕРУВАННЯ ---
    window.onkeydown = e => keys[e.key.toLowerCase()] = true;
    window.onkeyup = e => keys[e.key.toLowerCase()] = false;

    // Керування пальцем (Touch)
    canvas.addEventListener('touchmove', e => {
        if (!gameRunning) return;
        const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        // Ракета плавно слідує за пальцем
        player.y += (touchY - (player.y + player.h/2)) * 0.2;
        e.preventDefault();
    }, {passive: false});

    function drawRocket() {
        ctx.save();
        // Ефект невразливості
        if (invincible && Math.floor(Date.now() / 150) % 2 === 0) ctx.globalAlpha = 0.3;

        // Вогонь двигуна
        const flameLength = 15 + Math.random() * 10;
        ctx.fillStyle = COLORS.orange;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y + 10);
        ctx.lineTo(player.x - flameLength, player.y + player.h/2);
        ctx.lineTo(player.x, player.y + player.h - 10);
        ctx.fill();

        // Корпус ракети (Cyan неоновий)
        ctx.shadowBlur = 15;
        ctx.shadowColor = COLORS.cyan;
        ctx.fillStyle = COLORS.cyan;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + player.w - 15, player.y);
        ctx.lineTo(player.x + player.w, player.y + player.h/2);
        ctx.lineTo(player.x + player.w - 15, player.y + player.h);
        ctx.lineTo(player.x, player.y + player.h);
        ctx.closePath();
        ctx.fill();

        // Ілюмінатор
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(player.x + player.w - 20, player.y + player.h/2, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }

    function spawnComet() {
        // Шанс появи зростає зі швидкістю
        if (Math.random() < 0.03 + (speed / 500)) {
            const size = Math.random() * 30 + 20;
            obstacles.push({
                x: W + 100,
                y: Math.random() * H,
                w: size,
                h: size * 0.6,
                spd: (Math.random() * 4 + 3) + speed,
                angle: (Math.random() - 0.5) * 0.2
            });
        }
    }

    function loop() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, W, H);
        
        // Малюємо зорі (рух назустріч)
        if (starCtx) {
            starCtx.clearRect(0, 0, W, H);
            starCtx.fillStyle = "white";
            stars.forEach(s => {
                s.x -= s.spd * (speed / 3);
                if (s.x < 0) s.x = W;
                starCtx.fillRect(s.x, s.y, s.size, s.size);
            });
        }

        // Динамічна складність
        const timePassed = Math.floor((Date.now() - startTime) / 1000);
        speed = 6 + (timePassed / 10); // Кожні 10 сек швидкість росте

        // HUD оновлення
        document.getElementById('scoreDisplay').innerHTML = `DISTANCE: ${timePassed * 10}m | SPEED: ${speed.toFixed(1)}x`;

        drawRocket();
        spawnComet();

        // Перешкоди (Комети)
        obstacles.forEach((o, i) => {
            o.x -= o.spd;
            
            // Малюємо комету
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = COLORS.red;
            ctx.fillStyle = '#555'; // Ядро комети
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.w/2, 0, Math.PI*2);
            ctx.fill();
            
            // Хвіст комети
            const grad = ctx.createLinearGradient(o.x, o.y, o.x + 40, o.y);
            grad.addColorStop(0, COLORS.red);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(o.x, o.y - o.w/4, 50, o.w/2);
            ctx.restore();

            // Колізія (Зіткнення)
            let dx = (player.x + player.w/2) - o.x;
            let dy = (player.y + player.h/2) - o.y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 35 && !invincible) {
                lives--;
                document.getElementById('livesDisplay').innerHTML = '❤️'.repeat(lives) + '🖤'.repeat(3-lives);
                if (lives <= 0) {
                    gameRunning = false;
                    alert("MISSION FAILED! DISTANCE: " + timePassed * 10 + "m");
                    location.reload();
                } else {
                    invincible = true;
                    setTimeout(() => invincible = false, 2000);
                }
                obstacles.splice(i, 1);
            }
            if (o.x < -100) obstacles.splice(i, 1);
        });

        // Рух клавішами
        if (keys['w'] || keys['arrowup']) player.y -= 10;
        if (keys['s'] || keys['arrowdown']) player.y += 10;
        player.y = Math.max(20, Math.min(H - 50, player.y));

        requestAnimationFrame(loop);
    }

    function startGame() {
        player = { x: 80, y: H/2, w: 60, h: 30, trail: [] };
        obstacles = [];
        lives = 3;
        speed = 6;
        startTime = Date.now();
        invincible = false;
        gameRunning = true;

        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('hud').style.display = 'flex';
        document.getElementById('livesDisplay').innerHTML = '❤️❤️❤️';
        loop();
    }

    document.getElementById('startBtn').onclick = startGame;
    window.addEventListener('resize', resize);
    resize();
})();
