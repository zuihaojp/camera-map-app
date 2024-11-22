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

// 弾丸データ
const bullets = []; // 弾丸の配列
let lastBulletTime = 0; // 最後に弾丸を発射した時間

// 弾丸を発射する関数
function shootBullet() {
  const now = Date.now();
  if (now - lastBulletTime > 300) { // 300ms間隔で発射可能
    bullets.push({
      x: player.x + player.width / 2 - 2.5, // 弾丸の初期位置（プレイヤーの中心）
      y: player.y, // 弾丸の初期位置（プレイヤーの上）
      width: 5, // 弾丸の幅
      height: 10, // 弾丸の高さ
      speed: -7 // 弾丸の移動速度（上方向）
    });
    if (shootSound) {
      shootSound.currentTime = 0; // サウンドをリセット
      shootSound.play(); // 発射音を再生
    }
    lastBulletTime = now; // 最後に発射した時間を記録
  }
}

// 弾丸を移動する関数
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y += bullet.speed; // 弾丸を上方向に移動
    if (bullet.y < 0) {
      bullets.splice(index, 1); // 画面外に出た弾丸を削除
    }
  });
}

// 弾丸を描画する関数
function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.fillStyle = "yellow"; // 弾丸の色
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); // 弾丸を描画
  });
}


// 描画関数に弾丸描画を追加
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
  drawPlayer(); // プレイヤーを描画
  drawBullets(); // 弾丸を描画
  drawEnemies(); // 敵を描画

  // ゲームオーバー時の表示
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("ゲームオーバー", canvas.width / 2 - 100, canvas.height / 2);
  }
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

// ゲームループ内で弾丸関連の処理を呼び出す
function gameLoop() {
  if (!gameOver) {
    movePlayer(); // プレイヤーを移動
    if (keys.Space) shootBullet(); // スペースキーで弾丸を発射
    moveBullets(); // 弾丸を移動
    moveEnemies(); // 敵を移動
    checkCollisions(); // 衝突判定
    draw(); // 全てを描画
    requestAnimationFrame(gameLoop); // 次のフレームをリクエスト
  }
}


// 敵の生成を一定間隔で実行
setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 1000);

// ゲーム開始
gameLoop();

