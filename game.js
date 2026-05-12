// Повністю очисти game.js і встав це:

(function() {
    console.log("Game script loaded and running...");

    const setup = () => {
        const startBtn = document.getElementById('startBtn');
        const startScreen = document.getElementById('startScreen');
        const hud = document.getElementById('hud');
        const canvas = document.getElementById('gameCanvas');

        if (!startBtn) {
            console.error("Кнопку startBtn не знайдено в HTML!");
            return;
        }

        // Пряма прив'язка події (минаючи всі інші скрипти)
        startBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log("Кнопка натиснута! Запускаємо ініціалізацію...");
            
            if (startScreen) startScreen.style.setProperty('display', 'none', 'important');
            if (hud) hud.style.setProperty('display', 'flex', 'important');
            
            // Запуск циклу гри, якщо він ще не запущений
            if (!window.gameStarted) {
                window.gameStarted = true;
                startGameLogic(canvas);
            }
        };
    };

    // Спроба ініціалізації кожні 100мс, поки кнопка не з'явиться
    const checkExist = setInterval(() => {
        if (document.getElementById('startBtn')) {
            setup();
            clearInterval(checkExist);
        }
    }, 100);

    function startGameLogic(canvas) {
        const ctx = canvas.getContext('2d');
        let frame = 0;
        let player = { x: 100, y: canvas.height / 2, r: 15 };
        
        // Оновлення розмірів
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Малюємо просту ракету (блакитний трикутник)
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.moveTo(player.x + 20, player.y);
            ctx.lineTo(player.x - 10, player.y - 10);
            ctx.lineTo(player.x - 10, player.y + 10);
            ctx.fill();

            requestAnimationFrame(loop);
        }
        loop();
    }
})();
