/**
 * SOLAR_OS // ROCKET SURVIVAL CORE
 * Файл: game.js
 */

(function() {
    // Елементи DOM
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const startScreen = document.getElementById('startScreen');
    const hud = document.getElementById('hud');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const livesDisplay = document.getElementById('livesDisplay');

    // Стан гри
    let gameRunning = false;
    let frame = 0;
    let speed = 4;
    let distance = 0;
    let lives = 3;
    let obstacles = [];
    let stars = [];

    // ГРАВЕЦЬ (Ракета)
    const player = {
        x: 100,
        y: 200,
        r: 15,
        targetY: 200,
        targetX: 100
    };

    // Налаштування розмірів
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initStars();
    }

    // Фоновий космос
    function initStars() {
        stars = [];
        for (let i = 0; i < 80; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                s: Math.random() * 2,
                spd: Math.random() * 2 + 0.5
            });
        }
    }

    // КЕРУВАННЯ
    const handleMove = (e) => {
        if (!gameRunning) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        player.targetX = clientX - rect.left;
        player.targetY = clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', (e) => {
        handleMove(e);
        e.preventDefault();
    }, { passive: false });

    // ЛОГІКА ОБ'ЄКТІВ
    function spawnObstacle() {
        if (frame % Math.max(15, Math.floor(50 - speed)) === 0) {
            obstacles.push({
                x: canvas.width + 100,
                y: Math.random() * canvas.height,
                r: 10 + Math.random() * 15,
                spd: speed + (Math.random() * 2)
            });
        }
    }

    function drawPlayer() {
        // Плавне слідування за курсором
        player.x += (player.targetX - player.x) * 0.1;
        player.y += (player.targetY - player.y) * 0.1;

        ctx.save();
        ctx.translate(player.x, player.y);
        
        // Вогонь
        const engineFire = 15 + Math.random() * 10;
        const grad = ctx.createLinearGradient(-10, 0, -10 - engineFire, 0);
        grad.addColorStop(0, '#00e5ff');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(-8, 0, engineFire, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Корпус
        ctx.fillStyle = '#22d3ee';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#22d3ee';
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-12, -10);
        ctx.lineTo(-12, 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawObstacles() {
        obstacles.forEach((o, i) => {
            o.x -= o.spd;
            
            // Малюємо комету з хвостом
            const tail = ctx.createLinearGradient(o.x, o.y, o.x + 40, o.y);
            tail.addColorStop(0, 'rgba(255, 68, 68, 0.8)');
            tail.addColorStop(1, 'transparent');
            ctx.fillStyle = tail;
            ctx.beginPath();
            ctx.moveTo(o.x, o.y - o.r);
            ctx.lineTo(o.x + 50, o.y);
            ctx.lineTo(o.x, o.y + o.r);
            ctx.fill();

            ctx.fillStyle = '#444';
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.fill();

            // Перевірка зіткнення
            const dx = player.x - o.x;
            const dy = player.y - o.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < player.r + o.r) {
                obstacles.splice(i, 1);
                hit();
            }
        });
        obstacles = obstacles.filter(o => o.x > -100);
    }

    function hit() {
        lives--;
        livesDisplay.textContent = '❤️'.repeat(Math.max(0, lives));
        canvas.style.borderColor = '#ff4444';
        setTimeout(() => canvas.style.borderColor = '#164e63', 200);
        
        if (lives <= 0) {
            gameOver();
        }
    }

    function gameOver() {
        gameRunning = false;
        alert(`МІСІЯ ЗАВЕРШЕНА! Дистанція: ${distance}м`);
        location.reload(); // Перезавантаження для нового старту
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Малюємо зорі
        ctx.fillStyle = '#fff';
        stars.forEach(s => {
            s.x -= s.spd;
            if (s.x < 0) s.x = canvas.width;
            ctx.fillRect(s.x, s.y, s.s, s.s);
        });

        if (gameRunning) {
            frame++;
            speed = 4 + (frame / 1000);
            distance = Math.floor(frame / 6);
            scoreDisplay.textContent = `DISTANCE: ${distance}m`;

            spawnObstacle();
            drawObstacles();
            drawPlayer();
        }

        requestAnimationFrame(update);
    }

    // ГОЛОВНА ФУНКЦІЯ ЗАПУСКУ
    function init() {
        resize();
        window.addEventListener('resize', resize);
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log("Initialization sequence started...");
                gameRunning = true;
                startScreen.style.display = 'none';
                hud.style.display = 'flex';
                
                // Встановлюємо початкову позицію гравця
                player.x = 100;
                player.y = canvas.height / 2;
                player.targetX = 100;
                player.targetY = canvas.height / 2;
            });
        }
        
        update();
    }

    // Запуск після завантаження вікна
    window.onload = init;

})();
