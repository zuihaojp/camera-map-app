const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲームデータ
const player = { x: canvas.width / 2, y: canvas.height - 50, width: 50, height: 50, speed: 7, bullets: [], color: "blue", powerUp: false };
let enemies = [];
let boss = null;
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;

// キー操作
const keys = { ArrowLeft: false, ArrowRight: false, Space: false };
document.addEventListener("keydown", (e) => { if (e.key in keys) keys[e.key] = true; });
document.addEventListener("keyup", (e) => { if (e.key in keys) keys[e.key] = false; });

// プレイヤー移動
function movePlayer() {
  if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
  if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += player.speed;
}

// 弾の発射
function shootBullet() {
  if (keys.Space) {
    if (player.powerUp) {
      // パワーアップ中は3方向に発射
      player.bullets.push(
        { x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, color: "red" },
        { x: player.x + player.width / 2 - 20, y: player.y, width: 5, height: 10, color: "red" },
        { x: player.x + player.width / 2 + 15, y: player.y, width: 5, height: 10, color: "red" }
      );
    } else {
      // 通常発射
      player.bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, color: "red" });
    }
    keys.Space = false; // 連射を防ぐ
  }
}

// 弾の移動
function moveBullets() {
  player.bullets.forEach((bullet, index) => {
    bullet.y -= 10;
    if (bullet.y < 0) player.bullets.splice(index, 1);
  });
}

// 敵の生成
function spawnEnemies() {
  if (Math.random() < 0.05) { // 出現確率
    const x = Math.random() * (canvas.width - 40);
    enemies.push({ x: x, y: 0, width: 40, height: 40, speed: Math.random() * 2 + 1 + level / 2, color: "green" });
  }
}

// 敵の移動
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
      lives--; // 画面外に出たらライフ減少
    }
  });
}

// ボス生成
function spawnBoss() {
  boss = { x: canvas.width / 4, y: 50, width: 100, height: 100, speed: 2, color: "purple", hp: 30 * level };
}

// ボス移動
function moveBoss() {
  if (boss) {
    boss.x += boss.speed;
    if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
      boss.speed *= -1;
    }
  }
}

// 衝突判定
function checkCollisions() {
  player.bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // 弾と敵の衝突
        player.bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
      }
    });

    if (boss && bullet.x < boss.x + boss.width && bullet.x + bullet.width > boss.x && bullet.y < boss.y + boss.height && bullet.y + bullet.height > boss.y) {
      boss.hp--;
      player.bullets.splice(bulletIndex, 1);
      if (boss.hp <= 0) {
        score += 100;
        boss = null; // ボス撃破
        level++; // レベルアップ
      }
    }
  });

  enemies.forEach((enemy, index) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      // 敵とプレイヤーの衝突
      enemies.splice(index, 1);
      lives--;
    }
  });
}

// ゲームオーバー判定
function checkGameOver() {
  if (lives <= 0) {
    gameOver = true;
  }
}

// スコアとライフ、レベルの更新
function updateOverlay() {
  document.getElementById("score").textContent = `スコア: ${score}`;
  document.getElementById("lives").textContent = `ライフ: ${lives}`;
  document.getElementById("level").textContent = `レベル: ${level}`;
}

// パワーアップの取得
function getPowerUp() {
  if (Math.random() < 0.01) {
    player.powerUp = true;
    setTimeout(() => player.powerUp = false, 10000); // 10秒間有効
  }
}

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 弾
  player.bullets.forEach((bullet) => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // 敵
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // ボス
  if (boss) {
    ctx.fillStyle = boss.color;
    ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
  }

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("ゲームオーバー", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// ゲームループ
function gameLoop() {
  if (!gameOver) {
    movePlayer();
    shootBullet();
    moveBullets();
    spawnEnemies();
    moveEnemies();
    if (!boss && score >= level * 200) spawnBoss();
    moveBoss();
    checkCollisions();
    checkGameOver();
    getPowerUp();
    updateOverlay();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// ゲーム開始
gameLoop();
