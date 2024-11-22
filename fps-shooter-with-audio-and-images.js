const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// サウンド
const shootSound = document.getElementById("shootSound");
const explosionSound = document.getElementById("explosionSound");
const gameOverSound = document.getElementById("gameOverSound");

// ゲームデータ
let score = 0;
let lives = 3;
let gameOver = false;
const bullets = [];
const enemies = [];
const powerUps = [];
let isPoweredUp = false;

// プレイヤー情報
const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  image: new Image()
};
player.image.src = "images/player.png";

// 弾丸画像
const bulletImage = new Image();
bulletImage.src = "images/bullet.png";

// 敵画像
const enemyImage = new Image();
enemyImage.src = "images/enemy.png";

// パワーアップ画像
const powerUpImage = new Image();
powerUpImage.src = "images/powerup.png";

// キーボード入力
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false
};

document.addEventListener("keydown", (e) => {
  if (e.key in keys) keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

// プレイヤーの移動
function movePlayer() {
  if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
  if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += player.speed;
  if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
  if (keys.ArrowDown && player.y + player.height < canvas.height) player.y += player.speed;
}

// 弾を発射
function shootBullet() {
  shootSound.currentTime = 0;
  shootSound.play();
  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    dx: 0,
    dy: -5,
    radius: isPoweredUp ? 10 : 5, // パワーアップ中は弾丸サイズが大きくなる
    speed: isPoweredUp ? -7 : -5
  });
}

// 弾を移動
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y += bullet.dy;

    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// 敵の生成
function spawnEnemy() {
  const type = Math.random() > 0.7 ? "fast" : "normal"; // 30%の確率で速い敵
  enemies.push({
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    speed: type === "fast" ? 4 : 2,
    type: type,
    health: type === "fast" ? 1 : 2 // 普通の敵は耐久値2
  });
}

// 敵を移動
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;

    if (enemy.y + enemy.height > canvas.height) {
      enemies.splice(index, 1);
      lives--;
      updateHUD();
      if (lives <= 0) {
        gameOverSound.play();
        gameOver = true;
      }
    }
  });
}

// パワーアップの生成
function spawnPowerUp() {
  powerUps.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    speed: 2
  });
}

// パワーアップを移動
function movePowerUps() {
  powerUps.forEach((powerUp, index) => {
    powerUp.y += powerUp.speed;

    if (
      powerUp.y + powerUp.height > player.y &&
      powerUp.x < player.x + player.width &&
      powerUp.x + powerUp.width > player.x
    ) {
      powerUps.splice(index, 1);
      isPoweredUp = true;
      setTimeout(() => (isPoweredUp = false), 10000); // パワーアップは10秒間持続
    }

    if (powerUp.y > canvas.height) {
      powerUps.splice(index, 1);
    }
  });
}

// 衝突判定
function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x > enemy.x &&
        bullet.x < enemy.x + enemy.width &&
        bullet.y > enemy.y &&
        bullet.y < enemy.y + enemy.height
      ) {
        explosionSound.currentTime = 0;
        explosionSound.play();
        enemy.health--;
        if (enemy.health <= 0) enemies.splice(enemyIndex, 1);
        bullets.splice(bulletIndex, 1);
        score += 10;
        updateHUD();
      }
    });
  });
}

// スコアとライフを更新
function updateHUD() {
  document.getElementById("score").textContent = `スコア: ${score}`;
  document.getElementById("lives").textContent = `ライフ: ${lives}`;
}

// プレイヤーを描画
function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

// 弾を描画
function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.radius * 2, bullet.radius * 2);
  });
}

// 敵を描画
function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// パワーアップを描画
function drawPowerUps() {
  powerUps.forEach((powerUp) => {
    ctx.drawImage(powerUpImage, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  });
}

// ゲームの描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullets();
  drawEnemies();
  drawPowerUps();

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("ゲームオーバー", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// ゲームループ
function gameLoop() {
  if (!gameOver) {
    movePlayer();
    moveBullets();
    moveEnemies();
    movePowerUps();
    checkCollisions();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// 敵とパワーアップの生成ループ
setInterval(() => {
  if (!gameOver) {
    spawnEnemy();
    if (Math.random() < 0.2) spawnPowerUp(); // 20%の確率でパワーアップ生成
  }
}, 1000);

// ゲーム開始
gameLoop();
