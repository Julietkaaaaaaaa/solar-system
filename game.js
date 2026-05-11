(function() {
    // 1. Пошук елементів з твого HTML
    const gameSection = document.querySelector('#game-view .relative');
    const initBtn = gameSection.querySelector('button');
    const placeholderContent = gameSection.innerHTML; // Зберігаємо заглушку

    let gameActive = false;
    let score = 0;
    let lives = 3;
    let frameCount = 0;
    
    // Налаштування об'єктів
    let rocket = { x: 50, y: 150, w: 40, h: 25, speed: 6 };
    let enemies = [];
    let particles = [];
    let keys = {};

    // Створення Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    function initCanvas() {
        canvas.width = gameSection.clientWidth;
        canvas.height = 400; // Фіксована висота як у твоєму HTML
        canvas.style.display = 'block';
    }

    // Слухачі клавіш
    window.addEventListener('keydown', e => keys[e.code] = true);
    window.addEventListener('keyup', e => keys[e.code] = false);

    function spawnEnemy() {
        const size = 20 + Math.random() * 20;
        enemies.push({
            x: canvas.width + 50,
            y: Math.random() * (canvas.height - 40),
            w: size,
            h: size,
            speed: 3 + (score / 100) + Math.random() * 2,
            rot: 0,
            rotSpeed: Math.random() * 0.1
        });
    }

    function update() {
        if (!gameActive) return;

        // Керування (WASD / Стрілки)
        if ((keys['ArrowUp'] || keys['KeyW']) && rocket.y > 0) rocket.y -= rocket.speed;
        if ((keys['ArrowDown'] || keys['KeyS']) && rocket.y < canvas.height - rocket.h) rocket.y += rocket.speed;

        // Поява ворогів (комети/астероїди)
        if (frameCount % 60 === 0) spawnEnemy();

        enemies.forEach((en, i) => {
            en.x -= en.speed;
            en.rot += en.rotSpeed;

            // Перевірка колізії
            if (rocket.x < en.x + en.w - 5 && rocket.x + rocket.w > en.x + 5 &&
                rocket.y < en.y + en.h - 5 && rocket.y + rocket.h > en.y + 5) {
                enemies.splice(i, 1);
                lives--;
                if (lives <= 0) gameOver();
            }

            // Вихід за межі
            if (en.x < -50) {
                enemies.splice(i, 1);
                score += 10;
            }
        });

        frameCount++;
    }

    function draw() {
        if (!gameActive) return;

        // Очищення фону
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Малювання зірок на фоні
        ctx.fillStyle = '#fff';
        for(let i=0; i<20; i++) {
            ctx.fillRect((Math.sin(frameCount/50 + i)*500 + 500) % canvas.width, (i*30) % canvas.height, 2, 2);
        }

        // Малювання ракети (Стиль Cyan як у Solar_OS)
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00e5ff';
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(rocket.x, rocket.y, rocket.w, rocket.h);
        
        // Малювання вогню
        ctx.fillStyle = '#ff4400';
        ctx.fillRect(rocket.x - 10, rocket.y + 5, 10, rocket.h - 10);

        // Малювання ворогів
        ctx.shadowColor = '#ff3300';
        enemies.forEach(en => {
            ctx.save();
            ctx.translate(en.x + en.w/2, en.y + en.h/2);
            ctx.rotate(en.rot);
            ctx.fillStyle = '#555';
            ctx.fillRect(-en.w/2, -en.h/2, en.w, en.h);
            ctx.restore();
        });

        // Інтерфейс (HUD)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#00e5ff';
        ctx.font = '14px Orbitron';
        ctx.fillText(`SCORE: ${score}`, 20, 30);
        ctx.fillText(`LIVES: ${'❤️'.repeat(lives)}`, canvas.width - 120, 30);

        requestAnimationFrame(() => {
            update();
            draw();
        });
    }

    function gameOver() {
        gameActive = false;
        alert(`СИСТЕМНА ПОМИЛКА: Ракета знищена! \nВаш рахунок: ${score}`);
        // Повертаємо початковий стан
        gameSection.innerHTML = placeholderContent;
        // Переприв'язуємо подію до нової кнопки, що з'явилася
        const newBtn = gameSection.querySelector('button');
        newBtn.onclick = startGame;
        // Скидаємо змінні
        score = 0;
        lives = 3;
        enemies = [];
    }

    function startGame() {
        gameActive = true;
        initCanvas();
        gameSection.innerHTML = ''; // Видаляємо текст і іконки
        gameSection.appendChild(canvas);
        draw();
    }

    // Прив'язка кнопки
    if (initBtn) {
        initBtn.onclick = startGame;
    }

    // Оновлення розміру при зміні вікна
    window.addEventListener('resize', () => {
        if (gameActive) initCanvas();
    });

})();
