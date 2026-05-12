(function() {
    const cv = document.getElementById('cv');
    const ctx = cv.getContext('2d');
    const touchLayer = document.getElementById('touch-layer');
    
    let W, H, gameRunning = false, frame = 0, speed = 4;
    let player = { x: 0, y: 0, r: 18, ft: 0 };
    let stars = [], obstacles = [], lives = 3, distance = 0;
    let tStart = null, tDelta = { x: 0, y: 0 };
    const keys = {};

    // Налаштування кольорів
    const COLORS = {
        cyan: '#00e5ff',
        orange: '#ffaa00',
        red: '#ff4444',
        bg: '#03070f'
    };

    function resize() {
        W = cv.width = window.innerWidth;
        H = cv.height = window.innerHeight;
        initStars();
    }

    function initStars() {
        stars = Array.from({length: 120}, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            s: Math.random() * 2,
            spd: Math.random() * 3 + 1
        }));
    }

    // --- КЕРУВАННЯ ---
    window.onkeydown = e => keys[e.key.toLowerCase()] = true;
    window.onkeyup = e => keys[e.key.toLowerCase()] = false;

    touchLayer.addEventListener('touchstart', e => {
        const t = e.touches[0];
        tStart = { x: t.clientX, y: t.clientY };
    });

    touchLayer.addEventListener('touchmove', e => {
        if (!tStart) return;
        const t = e.touches[0];
        tDelta.x = (t.clientX - tStart.x) * 0.3;
        tDelta.y = (t.clientY - tStart.y) * 0.3;
        tStart = { x: t.clientX, y: t.clientY };
        e.preventDefault();
    }, { passive: false });

    // --- МАЛЮВАННЯ ОБ'ЄКТІВ ---
    function drawRocket(x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // Вогонь двигуна
        const fl = 15 + Math.sin(frame * 0.2) * 5 + Math.random() * 5;
        const grad = ctx.createLinearGradient(-20, 0, -20 - fl, 0);
        grad.addColorStop(0, COLORS.orange);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(-10, 0, fl, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Корпус ракети
        ctx.shadowBlur = 15;
        ctx.shadowColor = COLORS.cyan;
        ctx.fillStyle = COLORS.cyan;
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-10, -12);
        ctx.lineTo(-10, 12);
        ctx.closePath();
        ctx.fill();
        
        // Ілюмінатор
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(2, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    function drawComet(o) {
        ctx.save();
        // Хвіст
        const tailGrad = ctx.createLinearGradient(o.x, o.y, o.x + o.r * 4, o.y);
        tailGrad.addColorStop(0, COLORS.red);
        tailGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = tailGrad;
        ctx.beginPath();
        ctx.moveTo(o.x, o.y - o.r);
        ctx.lineTo(o.x + o.r * 4, o.y);
        ctx.lineTo(o.x, o.y + o.r);
        ctx.fill();

        // Ядро
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // --- ЛОГІКА ГРИ ---
    function startGame() {
        gameRunning = true;
        lives = 3;
        distance = 0;
        frame = 0;
        speed = 5;
        obstacles = [];
        player.x = W * 0.2;
        player.y = H / 2;

        document.getElementById('screen-start').style.display = 'none';
        document.getElementById('screen-over').style.display = 'none';
        document.getElementById('hud').style.display = 'flex';
        touchLayer.style.display = 'block';
        document.getElementById('h-lives').textContent = '❤️❤️❤️';
    }

    function endGame() {
        gameRunning = false;
        touchLayer.style.display = 'none';
        document.getElementById('hud').style.display = 'none';
        document.getElementById('screen-over').style.display = 'flex';
        document.getElementById('go-dist').textContent = distance + 'м';
    }

    function loop() {
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, W, H);

        // Зірки
        ctx.fillStyle = '#fff';
        stars.forEach(s => {
            s.x -= s.spd * (gameRunning ? speed/4 : 1);
            if (s.x < 0) s.x = W;
            ctx.fillRect(s.x, s.y, s.s, s.s);
        });

        if (gameRunning) {
            frame++;
            distance = Math.floor(frame / 5);
            // Пришвидшення кожні 500 кадрів
            speed = 5 + (frame / 800);
            document.getElementById('h-dist').textContent = distance;

            // Керування клавішами
            if (keys['w'] || keys['arrowup']) player.y -= 7;
            if (keys['s'] || keys['arrowdown']) player.y += 7;
            if (keys['a'] || keys['arrowleft']) player.x -= 7;
            if (keys['d'] || keys['arrowright']) player.x += 7;
            
            // Керування тачем
            player.x += tDelta.x * 2; 
            player.y += tDelta.y * 2;
            tDelta = { x: 0, y: 0 };

            // Межі екрану
            player.x = Math.max(20, Math.min(W - 20, player.x));
            player.y = Math.max(60, Math.min(H - 20, player.y));

            drawRocket(player.x, player.y);

            // Генерація перешкод (комети)
            if (frame % Math.max(10, Math.floor(40 - speed)) === 0) {
                obstacles.push({ 
                    x: W + 100, 
                    y: Math.random() * H, 
                    r: 10 + Math.random() * 15,
                    spd: speed + (Math.random() * 2)
                });
            }

            obstacles.forEach((o, i) => {
                o.x -= o.spd;
                drawComet(o);

                // Колізія
                const distToPlayer = Math.hypot(player.x - o.x, player.y - o.y);
                if (distToPlayer < player.r + o.r - 5) {
                    obstacles.splice(i, 1);
                    lives--;
                    document.getElementById('h-lives').textContent = '❤️'.repeat(Math.max(0, lives));
                    document.getElementById('flash').classList.add('on');
                    setTimeout(() => document.getElementById('flash').classList.remove('on'), 100);
                    if (lives <= 0) endGame();
                }
            });
            obstacles = obstacles.filter(o => o.x > -200);
        }

        requestAnimationFrame(loop);
    }

    // Прив'язка до кнопок після завантаження
    window.addEventListener('load', () => {
        resize();
        const sBtn = document.getElementById('startBtn');
        const rBtn = document.getElementById('restartBtn');

        if (sBtn) sBtn.addEventListener('click', startGame);
        if (rBtn) rBtn.addEventListener('click', startGame);
        
        loop();
    });

    window.addEventListener('resize', resize);
})();
