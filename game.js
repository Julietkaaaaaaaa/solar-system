// Огортаємо все в перевірку завантаження
window.onload = function() {
    console.log("Solar_OS: System Check...");

    // 1. ПРИМУСОВЕ ЧИЩЕННЯ ЕКРАНУ
    document.body.childNodes.forEach(node => {
        if (node.nodeType === 3 && node.textContent.includes('function')) {
            node.remove();
            console.log("Cleared leaked code text.");
        }
    });

    // 2. ПОШУК ЕЛЕМЕНТІВ
    const canvas = document.getElementById('gameCanvas');
    const starCanvas = document.getElementById('stars');
    const startBtn = document.getElementById('startBtn');
    const startScreen = document.getElementById('startScreen');
    const hud = document.getElementById('hud');

    // ПЕРЕВІРКА: чи все знайшов скрипт?
    if (!canvas || !startBtn) {
        console.error("ПОМИЛКА: Не знайдено canvas або кнопку! Перевір ID в HTML.");
        alert("Помилка ініціалізації: перевірте консоль (F12)");
        return;
    }

    const ctx = canvas.getContext('2d');
    const starCtx = starCanvas ? starCanvas.getContext('2d') : null;

    let W, H, player, obstacles, stars, gameRunning = false, speed, lives, invincible, startTime;
    const keys = {};

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
        stars = Array.from({length: 100}, () => ({
            x: Math.random() * W, y: Math.random() * H,
            size: Math.random() * 2, spd: Math.random() * 3 + 1
        }));
    }

    // КЕРУВАННЯ
    window.onkeydown = e => keys[e.key.toLowerCase()] = true;
    window.onkeyup = e => keys[e.key.toLowerCase()] = false;

    // ТАЧ ДЛЯ ТЕЛЕФОНУ
    canvas.addEventListener('touchmove', e => {
        if (!gameRunning) return;
        const touchY = e.touches[0].clientY;
        player.y += (touchY - (player.y + player.h/2)) * 0.5;
        e.preventDefault();
    }, {passive: false});

    function startGame() {
        console.log("Game Starting...");
        gameRunning = true;
        speed = 6;
        lives = 3;
        startTime = Date.now();
        obstacles = [];
        player = { x: 80, y: H/2, w: 60, h: 35, trail: [] };
        
        if (startScreen) startScreen.classList.add('hidden');
        if (hud) hud.style.display = 'flex';
        
        updateLivesUI();
        loop();
    }

    function updateLivesUI() {
        const ld = document.getElementById('livesDisplay');
        if (ld) ld.innerHTML = '❤️'.repeat(lives);
    }

    function loop() {
        if (!gameRunning) return;

        // Фон
        ctx.fillStyle = '#050a14';
        ctx.fillRect(0, 0, W, H);

        // Зірки
        if (starCtx) {
            starCtx.clearRect(0,0,W,H);
            starCtx.fillStyle = "white";
            stars.forEach(s => {
                s.x -= s.spd * (speed/4);
                if (s.x < 0) s.x = W;
                starCtx.fillRect(s.x, s.y, s.size, s.size);
            });
        }

        // Графіка ракети
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00e5ff';
        ctx.fillStyle = (invincible && Math.floor(Date.now()/100)%2) ? 'transparent' : '#00e5ff';
        ctx.beginPath();
        ctx.roundRect(player.x, player.y, player.w, player.h, 5);
        ctx.fill();

        // Перешкоди
        if (Math.random() < 0.04) {
            obstacles.push({x: W + 50, y: Math.random()*H, w: 40, h: 40, spd: speed + Math.random()*2});
        }

        obstacles.forEach((o, i) => {
            o.x -= o.spd;
            ctx.strokeStyle = '#ff4444';
            ctx.strokeRect(o.x, o.y, o.w, o.h);

            // Колізія
            if (!invincible && player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y) {
                lives--;
                updateLivesUI();
                if (lives <= 0) {
                    gameRunning = false;
                    alert("MISSION FAILED. DISTANCE: " + Math.floor((Date.now()-startTime)/100) + "m");
                    location.reload();
                } else {
                    invincible = true;
                    setTimeout(() => invincible = false, 2000);
                }
                obstacles.splice(i, 1);
            }
        });

        // Рух
        if (keys['w'] || keys['arrowup']) player.y -= 10;
        if (keys['s'] || keys['arrowdown']) player.y += 10;
        player.y = Math.max(0, Math.min(H - player.h, player.y));

        requestAnimationFrame(loop);
    }

    // ПРИВ'ЯЗКА КНОПКИ
    startBtn.onclick = startGame;
    window.onresize = resize;
    resize();
};
