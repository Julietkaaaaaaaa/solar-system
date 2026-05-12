(function() {
    // 1. ПРИБИРАЄМО ТЕКСТ З ЕКРАНУ (якщо він виліз через помилку копіювання)
    const cleanUp = () => {
        document.body.childNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent.includes('function')) node.remove();
        });
    };
    cleanUp();

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const starCanvas = document.getElementById('stars');
    const starCtx = starCanvas.getContext('2d');

    let W, H, player, obstacles, stars, score, lives, gameRunning, speed, invincible, startTime;
    const keys = {};

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
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 5 + 2 
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

    window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

    // ТАЧ-КЕРУВАННЯ (ДЛЯ ТЕЛЕФОНУ)
    canvas.addEventListener('touchmove', (e) => {
        if (!gameRunning) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchY = touch.clientY - rect.top;
        player.y += (touchY - (player.y + player.h/2)) * 0.3; // Ракета слідує за пальцем
        e.preventDefault();
    }, { passive: false });

    function updateLivesUI() {
        const livesDisp = document.getElementById('livesDisplay');
        if (livesDisp) {
            livesDisp.innerHTML = '';
            for(let i=0; i<3; i++) {
                const s = document.createElement('span');
                s.textContent = i < lives ? '❤️' : '🖤';
                s.style.marginRight = "5px";
                livesDisp.appendChild(s);
            }
        }
    }

    function drawPlayer() {
        ctx.save();
        
        // Ефект невразливості (миготіння)
        if (invincible && Math.floor(Date.now() / 150) % 2 === 0) {
            ctx.globalAlpha = 0.2;
        } else {
            ctx.globalAlpha = 1.0; 
        }

        // НЕОНОВИЙ ШЛЕЙФ (ДВИГУН)
        player.trail.unshift({x: player.x, y: player.y + player.h/2});
        if (player.trail.length > 25) player.trail.pop();
        
        player.trail.forEach((t, i) => {
            ctx.beginPath();
            ctx.fillStyle = i < 10 ? COLORS.cyan : COLORS.orange;
            ctx.globalAlpha = (1 - i / 25) * 0.6;
            ctx.arc(t.x - 5 - i * 2, t.y, (player.h / 4) - i / 8, 0, Math.PI * 2);
            ctx.fill();
        });

        // МАЛЮЄМО РАКЕТУ (ЧІТКА, ЗЛІВА)
        ctx.shadowBlur = 20;
        ctx.shadowColor = COLORS.cyan;
        ctx.fillStyle = COLORS.cyan;
        
        // Форма ракети
        ctx.beginPath();
        ctx.moveTo(player.x + player.w, player.y + player.h/2);
        ctx.lineTo(player.x + player.w - 15, player.y);
        ctx.lineTo(player.x, player.y);
        ctx.lineTo(player.x, player.y + player.h);
        ctx.lineTo(player.x + player.w - 15, player.y + player.h);
        ctx.closePath();
        ctx.fill();

        // Ілюмінатор
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(player.x + player.w - 20, player.y + player.h/2, 5, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    }

    function spawnObstacle() {
        if (Math.random() < 0.04 + (speed / 1000)) {
            const size = Math.random() * 40 + 30;
            obstacles.push({
                x: W + 100,
                y: Math.random() * (H - 100) + 50,
                w: size,
                h: size,
                speed: (Math.random() * 3 + 2) + speed,
                angle: 0,
                rotSpeed: (Math.random() - 0.5) * 0.1,
                type: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }
    }

    function loop() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, W, H);
        updateStars();
        spawnObstacle();

        const timePassed = Math.floor((Date.now() - startTime) / 1000);
        speed = 6 + (timePassed / 8); 
        
        if (document.getElementById('scoreDisplay')) {
            document.getElementById('scoreDisplay').innerHTML = `DISTANCE: ${timePassed * 10}m | SPEED: ${speed.toFixed(1)}x`;
        }

        if (keys['arrowup'] || keys['w']) player.y -= 10;
        if (keys['arrowdown'] || keys['s']) player.y += 10;
        
        player.y = Math.max(50, Math.min(H - 50, player.y));

        drawPlayer();

        obstacles.forEach((o, i) => {
            o.x -= o.speed;
            o.angle += o.rotSpeed;

            ctx.save();
            ctx.translate(o.x, o.y);
            ctx.rotate(o.angle);
            ctx.strokeStyle = COLORS.red;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = COLORS.red;
            
            if (o.type === 'rect') ctx.strokeRect(-o.w/2, -o.h/2, o.w, o.h);
            else {
                ctx.beginPath();
                ctx.arc(0, 0, o.w/2, 0, Math.PI*2);
                ctx.stroke();
            }
            ctx.restore();

            let dx = (player.x + player.w/2) - o.x;
            let dy = (player.y + player.h/2) - o.y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < 40 && !invincible) {
                lives--;
                updateLivesUI();
                if (lives <= 0) {
                    gameRunning = false;
                    alert("SYSTEM FAILURE! DISTANCE: " + timePassed * 10 + "m");
                    location.reload();
                } else {
                    invincible = true;
                    setTimeout(() => invincible = false, 2000);
                }
                obstacles.splice(i, 1);
            }
            if (o.x < -100) obstacles.splice(i, 1);
        });

        requestAnimationFrame(loop);
    }

    function startGame() {
        player = { x: 80, y: H/2, w: 55, h: 30, trail: [] };
        obstacles = [];
        score = 0;
        lives = 3;
        speed = 6;
        startTime = Date.now();
        invincible = false;
        gameRunning = true;

        document.getElementById('hud').style.display = 'flex';
        document.getElementById('startScreen').classList.add('hidden');
        updateLivesUI();
        loop();
    }

    document.getElementById('startBtn').onclick = startGame;
})();
