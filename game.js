(function() {
    console.log("SOLAR_OS: System ready.");

    const setup = () => {
        const startBtn = document.getElementById('startBtn');
        const startScreen = document.getElementById('startScreen');
        const hud = document.getElementById('hud');
        const canvas = document.getElementById('gameCanvas');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const livesDisplay = document.getElementById('livesDisplay');

        if (!startBtn || !canvas) return;

        // ПАРАМЕТРИ ГРИ
        let ctx = canvas.getContext('2d');
        let gameRunning = false;
        let frame = 0;
        let lives = 3;
        let distance = 0;
        let speed = 5;
        let obstacles = [];
        let player = { x: 50, y: 200, r: 15, targetY: 200 };

        // Налаштування розмірів
        const resize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // КЕРУВАННЯ
        const moveHandler = (e) => {
            if (!gameRunning) return;
            const rect = canvas.getBoundingClientRect();
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            player.targetY = clientY - rect.top;
        };

        canvas.addEventListener('mousemove', moveHandler);
        canvas.addEventListener('touchmove', (e) => {
            moveHandler(e);
            e.preventDefault();
        }, { passive: false });

        // ФУНКЦІЯ СТАРТУ
        startBtn.onclick = function(e) {
            e.preventDefault();
            console.log("Ignition confirmed.");
            
            gameRunning = true;
            lives = 3;
            distance = 0;
            frame = 0;
            obstacles = [];
            
            startScreen.style.setProperty('display', 'none', 'important');
            hud.style.setProperty('display', 'flex', 'important');
            livesDisplay.textContent = '❤️❤️❤️';
            
            gameLoop();
        };

        // ЦИКЛ ГРИ
        function gameLoop() {
            if (!gameRunning) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;
            distance = Math.floor(frame / 5);
            scoreDisplay.textContent = `DISTANCE: ${distance}m`;
            speed = 5 + (frame / 1000);

            // Плавний рух ракети за курсором
            player.y += (player.targetY - player.y) * 0.1;

            // Малюємо ракету
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00e5ff';
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.moveTo(player.x + 25, player.y);
            ctx.lineTo(player.x - 10, player.y - 12);
            ctx.lineTo(player.x - 10, player.y + 12);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            // Генерація перешкод
            if (frame % Math.max(20, Math.floor(60 - speed)) === 0) {
                obstacles.push({
                    x: canvas.width + 50,
                    y: Math.random() * canvas.height,
                    r: 10 + Math.random() * 15,
                    spd: speed + (Math.random() * 2)
                });
            }

            // Оновлення перешкод
            obstacles.forEach((o, i) => {
                o.x -= o.spd;
                
                // Малюємо комету
                ctx.fillStyle = '#ff4444';
                ctx.beginPath();
                ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
                ctx.fill();

                // Перевірка зіткнення
                const dx = player.x - o.x;
                const dy = player.y - o.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < player.r + o.r) {
                    obstacles.splice(i, 1);
                    lives--;
                    livesDisplay.textContent = '❤️'.repeat(Math.max(0, lives));
                    if (lives <= 0) {
                        gameRunning = false;
                        alert("МІСІЯ ПРОВАЛЕНА! Дистанція: " + distance + "м");
                        location.reload();
                    }
                }
            });

            obstacles = obstacles.filter(o => o.x > -100);
            requestAnimationFrame(gameLoop);
        }
    };

    // Чекаємо кнопку в DOM
    const checkExist = setInterval(() => {
        if (document.getElementById('startBtn')) {
            setup();
            clearInterval(checkExist);
        }
    }, 100);
})();
