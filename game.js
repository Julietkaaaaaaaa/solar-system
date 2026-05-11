(function() {
    // Функція ініціалізації пошуку елементів
    function initLauncher() {
        // Шукаємо контейнер гри
        const gameSection = document.querySelector('#game-view .relative') || document.querySelector('.neon-border');
        
        if (!gameSection) {
            console.error("Контейнер гри не знайдено!");
            return;
        }

        // Шукаємо кнопку всередині цього контейнера
        // Спробуємо знайти за текстом, якщо id немає
        const buttons = gameSection.querySelectorAll('button');
        let initBtn = null;
        
        buttons.forEach(btn => {
            if (btn.textContent.includes('ІНІЦІАЛІЗУВАТИ')) {
                initBtn = btn;
            }
        });

        if (!initBtn) {
            console.error("Кнопку ініціалізації не знайдено!");
            return;
        }

        const placeholderContent = gameSection.innerHTML;
        let gameActive = false;
        let score = 0;
        let lives = 3;
        let frameCount = 0;
        
        let rocket = { x: 50, y: 150, w: 40, h: 25, speed: 6 };
        let enemies = [];
        let keys = {};

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        function initCanvas() {
            canvas.width = gameSection.clientWidth;
            canvas.height = 400;
            canvas.style.display = 'block';
            canvas.style.cursor = 'none'; // Ховаємо курсор у грі
        }

        window.addEventListener('keydown', e => keys[e.code] = true);
        window.addEventListener('keyup', e => keys[e.code] = false);

        function spawnEnemy() {
            const size = 20 + Math.random() * 20;
            enemies.push({
                x: canvas.width + 50,
                y: Math.random() * (canvas.height - 40),
                w: size, h: size,
                speed: 3 + (score / 100) + Math.random() * 2,
                rot: 0,
                rotSpeed: Math.random() * 0.1
            });
        }

        function update() {
            if (!gameActive) return;
            if ((keys['ArrowUp'] || keys['KeyW']) && rocket.y > 0) rocket.y -= rocket.speed;
            if ((keys['ArrowDown'] || keys['KeyS']) && rocket.y < canvas.height - rocket.h) rocket.y += rocket.speed;

            if (frameCount % 60 === 0) spawnEnemy();

            enemies.forEach((en, i) => {
                en.x -= en.speed;
                en.rot += en.rotSpeed;

                if (rocket.x < en.x + en.w - 5 && rocket.x + rocket.w > en.x + 5 &&
                    rocket.y < en.y + en.h - 5 && rocket.y + rocket.h > en.y + 5) {
                    enemies.splice(i, 1);
                    lives--;
                    if (lives <= 0) gameOver();
                }
                if (en.x < -50) {
                    enemies.splice(i, 1);
                    score += 10;
                }
            });
            frameCount++;
        }

        function draw() {
            if (!gameActive) return;
            ctx.fillStyle = '#050a14';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Зірки
            ctx.fillStyle = '#fff';
            for(let i=0; i<30; i++) {
                ctx.fillRect((Math.sin(frameCount/100 + i)*1000 + 1000) % canvas.width, (i*25) % canvas.height, 1, 1);
            }

            // Ракета
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00e5ff';
            ctx.fillStyle = '#00e5ff';
            ctx.fillRect(rocket.x, rocket.y, rocket.w, rocket.h);
            
            // Вогонь
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff4400';
            ctx.fillStyle = '#ff4400';
            ctx.fillRect(rocket.x - 12, rocket.y + 5, 12, rocket.h - 10);

            // Вороги
            enemies.forEach(en => {
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#ff3300';
                ctx.save();
                ctx.translate(en.x + en.w/2, en.y + en.h/2);
                ctx.rotate(en.rot);
                ctx.fillStyle = '#444';
                ctx.fillRect(-en.w/2, -en.h/2, en.w, en.h);
                ctx.restore();
            });

            // HUD
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#00e5ff';
            ctx.font = 'bold 16px Orbitron';
            ctx.fillText(`SCORE: ${score}`, 20, 35);
            ctx.fillText(`LIVES: ${'❤️'.repeat(lives)}`, canvas.width - 150, 35);

            requestAnimationFrame(() => {
                update();
                draw();
            });
        }

        function gameOver() {
            gameActive = false;
            alert(`ROCKET DESTROYED! \nSCORE: ${score}`);
            gameSection.innerHTML = placeholderContent;
            setTimeout(initLauncher, 100); // Перезапускаємо пошук кнопки
        }

        function startGame() {
            gameActive = true;
            initCanvas();
            gameSection.innerHTML = '';
            gameSection.appendChild(canvas);
            draw();
        }

        initBtn.onclick = startGame;
    }

    // Запускаємо пошук кнопки після завантаження сторінки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLauncher);
    } else {
        initLauncher();
    }
})();
