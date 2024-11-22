const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// サウンド
const shootSound = document.getElementById("shootSound");
const explosionSound = document.getElementById("explosionSound");
const levelUpSound = document.getElementById("levelUpSound");

// ゲームデータ
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;
const bullets = [];
const enemies = [];
let lastBulletTime = 0;

// プレイヤー情報
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  image: new Image()
};
player.image.src = "images/player.png";

// 敵画像
const enemyImage = new Image();
enemyImage.src = "images/enemy.png";

// 弾丸画像
const bulletImage = new Image();
bulletImage.src = "images/bullet.png";

// キーボード入力状態
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  Space: false
};

// キーボード入力イベント
document.addEventListener("keydown", (e) => {
  if (e.key in keys) keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

// プレイヤーを移動
function movePlayer() {
  if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
  if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += player.speed;
  if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
  if (keys.ArrowDown && player.y + player.height < canvas.height) player.y += player.speed;
}

// 弾丸を発射
function shootBullet() {
  const now = Date.now();
  if (now - lastBulletTime > 300) {
    bullets.push({
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 10,
      height: 20,
      speed: -7
    });
    shootSound.currentTime = 0;
    shootSound.play();
    lastBulletTime = now;
  }
}

// 弾丸を移動
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;
    if (bullet.y < 0) bullets.splice(index, 1);
  });
}

// 弾丸を描画
function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// 敵を生成
function spawnEnemy() {
  const size = Math.random() * 30 + 20;
  enemies.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    width: size,
    height: size,
    speed: Math.random() * 2 + 1 + level * 0.5
  });
}

// 敵を移動
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
      lives--;
      updateHUD();
      if (lives <= 0) gameOver = true;
    }
  });
}

// 敵を描画
function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// 衝突判定
function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
        updateHUD();
        if (score % 100 === 0) levelUp(); // レベルアップ条件
      }
    });
  });
}

// レベルアップ処理
function levelUp() {
  level++;
  levelUpSound.play();
  updateHUD();
}

// スコアとライフを更新
function updateHUD() {
  document.getElementById("score").textContent = `スコア: ${score}`;
  document.getElementById("lives").textContent = `ライフ: ${lives}`;
  document.getElementById("level").textContent = `レベル: ${level}`;
}

// プレイヤーを描画
function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
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
    movePlayer();
    if (keys.Space) shootBullet();
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
