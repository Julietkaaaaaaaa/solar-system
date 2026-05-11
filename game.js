<style>
  /* Головний контейнер гри */
  #game-container {
    position: relative;
    width: 100%;
    height: 600px; /* Трохи вище для кращого вигляду */
    background: #050a14;
    overflow: hidden;
    border: 1px solid #1a2a3a;
    border-radius: 20px;
    font-family: 'Orbitron', sans-serif;
  }

  /* Екран старту як на скриншоті */
  .game-screen {
    position: absolute;
    inset: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #050a14;
  }

  .game-screen.hidden { display: none !important; }

  /* Заголовок SOLAR_OS */
  .solar-title {
    font-size: 80px;
    font-weight: 900;
    color: #00e5ff;
    letter-spacing: 15px;
    text-shadow: 0 0 30px rgba(0, 229, 255, 0.6);
    margin-bottom: 5px;
  }

  .solar-subtitle {
    color: #00e5ff;
    font-size: 14px;
    letter-spacing: 5px;
    margin-bottom: 40px;
    opacity: 0.8;
  }

  /* Блок з інструкцією (центрована картка) */
  .instruction-box {
    background: rgba(0, 20, 30, 0.4);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 15px;
    padding: 30px 40px;
    width: 380px;
    text-align: left;
    margin-bottom: 40px;
  }

  .instr-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #fff;
    margin-bottom: 25px;
    justify-content: center;
    text-transform: uppercase;
  }

  .instr-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
    color: #a0c0c5;
    font-size: 13px;
    font-family: sans-serif; /* Для чіткості тексту */
  }

  /* Кнопка ІНІЦІАЛІЗУВАТИ */
  .init-button {
    background: #00bcd4;
    color: #000;
    border: none;
    padding: 15px 60px;
    border-radius: 50px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    box-shadow: 0 0 40px rgba(0, 188, 212, 0.6);
    transition: 0.3s ease;
  }

  .init-button:hover {
    transform: scale(1.05);
    background: #00e5ff;
    box-shadow: 0 0 60px rgba(0, 229, 255, 0.8);
  }
</style>

<div id="game-container">
  <canvas id="stars"></canvas>
  <canvas id="gameCanvas"></canvas>

  <div class="game-screen" id="startScreen">
    <h1 class="solar-title">SOLAR_OS</h1>
    <p class="solar-subtitle">// ROCKET SURVIVAL v2.0 //</p>

    <div class="instruction-box">
      <div class="instr-header">🚀 Керуй ракетою</div>
      
      <div class="instr-item">
        <span>⌨️</span> <span>WASD / Стрілки — рух</span>
      </div>
      <div class="instr-item">
        <span>📱</span> <span>Води пальцем по екрану — ракета слідує за тобою</span>
      </div>
      <div class="instr-item">
        <span>☄️</span> <span>Уникай комет, астероїдів та НЛО</span>
      </div>
      <div class="instr-item">
        <span>⚡</span> <span>Швидкість польоту зростає!</span>
      </div>
      <div class="instr-item">
        <span>❤️</span> <span>3 життя — не розбий ракету!</span>
      </div>
    </div>

    <button class="init-button" id="startBtn">Ініціалізувати</button>
  </div>

  <div id="hud" style="display:none; position: absolute; top: 20px; width: 100%; justify-content: space-between; padding: 0 40px; color: #00e5ff; z-index: 10;">
    <div>ROCKET_OS</div>
    <div id="scoreDisplay">SCORE: 0</div>
    <div id="livesDisplay">❤️❤️❤️</div>
  </div>
</div>
