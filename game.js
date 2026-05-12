(function() {
    console.log("SOLAR_OS: Advanced Ignition Sequence Started.");

    const setup = () => {
        const startBtn = document.getElementById('startBtn');
        const startScreen = document.getElementById('startScreen');
        const hud = document.getElementById('hud');
        const canvas = document.getElementById('gameCanvas');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const livesDisplay = document.getElementById('livesDisplay');

        if (!startBtn || !canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Стан гри
        let gameRunning = false;
        let frame = 0;
        let lives = 3;
        let distance = 0;
        let speed = 5;
        let obstacles = [];
        let player = { x: 80, y: 0, r: 15, targetY: 0 };

        // Адаптивність: підлаштовуємо розмір Canvas
        const resize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            player.y = canvas.height / 2;
            player.targetY = canvas.height / 2;
        };
        window.addEventListener('resize', resize);
        resize();

        // Керування (Миша та Тач)
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

        // Малювання РАКЕТИ
        function drawRocket(x, y) {
            ctx.save();
            ctx.translate(x, y);

            // Анімований вогонь
            const fireSize = 15 + Math.random() * 15;
            const fireGrad = ctx.createLinearGradient(-10, 0, -10 - fireSize, 0);
            fireGrad.addColorStop(0, '#ffaa00');
            fireGrad.addColorStop(1, 'transparent');
            
            ctx.fillStyle = fireGrad;
            ctx.beginPath();
            ctx.moveTo(-10, -7);
            ctx.lineTo(-10 - fireSize, 0);
            ctx.lineTo(-10, 7);
            ctx.fill();

            // Корпус ракети
            ctx.fillStyle = '#00e5ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00e5ff';
            
            // Тіло
            ctx.beginPath();
            ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Ніс (трикутник попереду)
            ctx.beginPath();
            ctx.moveTo(15, -10);
            ctx.lineTo(28, 0);
            ctx.lineTo(15, 10);
            ctx.fill();

            // Крила (плавники)
            ctx.fillStyle = '#008b9b';
            ctx.beginPath();
            ctx.moveTo(-5, -10);
            ctx.lineTo(-15, -15);
            ctx.lineTo(-10, -5);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-5, 10);
            ctx.lineTo(-15, 15);
            ctx.lineTo(-10, 5);
            ctx.fill();

            // Ілюмінатор
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(7, 0, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Малювання КОМЕТИ
        function drawComet(o) {
            ctx.save();
            
            // Хвіст комети (градієнт)
            const tailLen = o.r * 4;
            const grad = ctx.createLinearGradient(o.x, o.y, o.x + tailLen, o.y);
            grad.addColorStop(0, 'rgba(255, 68, 68, 0.6)');
            grad.addColorStop(1, 'transparent');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(o.x, o.y - o.r);
            ctx.lineTo(o.x + tailLen, o.y);
            ctx.lineTo(o.x, o.y + o.r);
            ctx.fill();

            // Ядро комети
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.fill();
            
            // Кратери на кометі
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(o.x - o.r/3, o.y - o.r/3, o.r/4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Запуск гри при натисканні кнопки
        startBtn.onclick = function(e) {
            e.preventDefault();
            console.log("Game Start Triggered");
            
            gameRunning = true;
            lives = 3;
            distance = 0;
            frame = 0;
            speed = 5;
            obstacles = [];
            
            startScreen.style.setProperty('display', 'none', 'important');
            hud.style.setProperty('display', 'flex', 'important');
            livesDisplay.textContent = '❤️❤️❤️';
            
            gameLoop();
        };

        // Головний ігровий цикл
        function gameLoop() {
            if (!gameRunning) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            frame++;
            distance = Math.floor(frame / 5);
            scoreDisplay.textContent = `DISTANCE: ${distance}m`;
            
            // СКЛАДНІСТЬ: плавне пришвидшення гри
            speed = 5 + (frame / 1000);

            // Плавний рух за курсором
            player.y += (player.targetY - player.y) * 0.12;

            drawRocket(player.x, player.y);

            // Генерація комет (частота залежить від швидкості)
            if (frame % Math.max(15, Math.floor(50 - speed)) === 0) {
                obstacles.push({
                    x: canvas.width + 100,
                    y: Math.random() * canvas.height,
                    r: 10 + Math.random() * 20,
                    spd: speed + (Math.random() * 3)
                });
            }

            // Оновлення комет
            for (let i = obstacles.length - 1; i >= 0; i--) {
                let o = obstacles[i];
                o.x -= o.spd;
                
                drawComet(o);

                // Колізія (зіткнення)
                const dx = player.x - o.x;
                const dy = player.y - o.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < player.r + o.r) {
                    obstacles.splice(i, 1);
                    lives--;
                    livesDisplay.textContent = '❤️'.repeat(Math.max(0, lives));
                    
                    // Ефект струсу при ударі
                    canvas.classList.add('animate-pulse');
                    setTimeout(() => canvas.classList.remove('animate-pulse'), 200);
if (lives <= 0) {
    gameRunning = false;
    
    // Знаходимо наше нове вікно
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalDistanceText = document.getElementById('finalDistance');
    
    // Показуємо результат
    finalDistanceText.textContent = `ДИСТАНЦІЯ: ${distance}m`;
    gameOverScreen.classList.remove('hidden'); // Показуємо вікно
}
                }

                // Видалення об'єктів за межами екрана
                if (o.x < -100) obstacles.splice(i, 1);
            }

            requestAnimationFrame(gameLoop);
        }
    };

    // Перевірка наявності кнопки перед ініціалізацією
    const checkBtn = setInterval(() => {
        if (document.getElementById('startBtn')) {
            setup();
            clearInterval(checkBtn);
        }
    }, 100);
})();
