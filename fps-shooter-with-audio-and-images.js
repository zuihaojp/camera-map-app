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

// プレイヤー画像
const playerImage = new Image();
playerImage.src = "images/player.png";

// 弾丸画像
const bulletImage = new Image();
bulletImage.src = "images/bullet.png";

// 敵画像
const enemyImage = new Image();
enemyImage.src = "images/enemy.png";

// マウス操作
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

// マウスクリックで射撃
canvas.addEventListener("mousedown", () => {
  shootBullet();
});

// 弾を発射
function shootBullet() {
  shootSound.currentTime = 0;
  shootSound.play();
  bullets.push({
    x: canvas.width / 2 - 5,
    y: canvas.height - 60,
    dx: (mouseX - canvas.width / 2) / 15,
    dy: (mouseY - canvas.height) / 15,
    radius: 5
  });
}

// 弾を移動
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;

    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(index, 1);
    }
  });
}

// 敵の生成
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 50),
    y: -50,
    speed: Math.random() * 2 + 1,
    width: 50,
    height: 50
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
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
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
  ctx.drawImage(playerImage, canvas.width / 2 - 25, canvas.height - 60, 50, 50);
}

// 弾を描画
function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, 10, 10);
  });
}

// 敵を描画
function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// ゲームの描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullets();
  drawEnemies();

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("ゲームオーバー", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// ゲームループ
function gameLoop() {
  if (!gameOver) {
    moveBullets();
    moveEnemies();
    checkCollisions();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// 敵の生成を一定間隔で実行
setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 1000);

// ゲーム開始
gameLoop();
