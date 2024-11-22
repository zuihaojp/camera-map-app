const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// サウンド
const shootSound = document.getElementById("shootSound");
const explosionSound = document.getElementById("explosionSound");
const powerUpSound = document.getElementById("powerUpSound");

// ゲームの基本データ
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
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 10,
  color: "blue",
  image: new Image()
};
player.image.src = "images/player.png";

// 弾丸情報
const bulletImage = new Image();
bulletImage.src = "images/bullet.png";

// 敵情報
const enemyImage = new Image();
enemyImage.src = "images/enemy.png";

// パワーアップアイテム情報
const powerUpImage = new Image();
powerUpImage.src = "images/powerup.png";

// マウス移動でエイム
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

// 弾の発射
function shootBullet() {
  shootSound.play();
  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    speed: 10,
    width: 10,
    height: 20
  });
}

// 弾の移動
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;

    // 弾が画面外に出たら削除
    if (bullet.y < 0) bullets.splice(index, 1);
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

// 敵の移動
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;

    // プレイヤーに接触するとライフを減らす
    if (
      enemy.y + enemy.height > player.y &&
      enemy.x < player.x + player.width &&
      enemy.x + enemy.width > player.x
    ) {
      explosionSound.play();
      enemies.splice(index, 1);
      lives--;
      updateHUD();
    }

    // 画面下に到達した敵を削除
    if (enemy.y > canvas.height) enemies.splice(index, 1);
  });
}

// パワーアップの生成
function spawnPowerUp() {
  powerUps.push({
    x: Math.random() * (canvas.width - 50),
    y: -50,
    speed: 2,
    width: 40,
    height: 40
  });
}

// パワーアップの移動
function movePowerUps() {
  powerUps.forEach((powerUp, index) => {
    powerUp.y += powerUp.speed;

    // プレイヤーがパワーアップを取得
    if (
      powerUp.y + powerUp.height > player.y &&
      powerUp.x < player.x + player.width &&
      powerUp.x + powerUp.width > player.x
    ) {
      powerUpSound.play();
      powerUps.splice(index, 1);
      isPoweredUp = true;
      setTimeout(() => (isPoweredUp = false), 10000); // 10秒間有効
    }

    // 画面外に出たパワーアップを削除
    if (powerUp.y > canvas.height) powerUps.splice(index, 1);
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
        explosionSound.play();
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
        if (score % 50 === 0) spawnPowerUp(); // スコアが50の倍数でパワーアップ出現
        updateHUD();
      }
    });
  });
}

// スコアとライフの更新
function updateHUD() {
  document.getElementById("score").textContent = `スコア: ${score}`;
  document.getElementById("lives").textContent = `ライフ: ${lives}`;
  if (lives <= 0) gameOver = true;
}

// プレイヤーを描画
function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

// 弾を描画
function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.drawImage(
      bulletImage,
      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height
    );
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
    ctx.drawImage(
      powerUpImage,
      powerUp.x,
      powerUp.y,
      powerUp.width,
      powerUp.height
    );
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
    moveBullets();
    moveEnemies();
    movePowerUps();
    checkCollisions();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// 敵生成ループ
setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 1000);

// ゲーム開始
gameLoop();
