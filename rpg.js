const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲームデータ
const player = { x: 400, y: 300, width: 30, height: 30, color: "blue", hp: 100 };
const enemies = [];
const foods = [];
let gameOver = false;

// 敵と食べ物をランダム生成
for (let i = 0; i < 5; i++) {
  enemies.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, width: 30, height: 30, color: "red" });
  foods.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, width: 20, height: 20, color: "green" });
}

// キー入力
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// 衝突判定
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// プレイヤーの移動
function movePlayer() {
  if (keys.ArrowUp && player.y > 0) player.y -= 5;
  if (keys.ArrowDown && player.y + player.height < canvas.height) player.y += 5;
  if (keys.ArrowLeft && player.x > 0) player.x -= 5;
  if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += 5;
}

// 敵の動き
function moveEnemies() {
  enemies.forEach((enemy) => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      enemy.x += (dx / dist) * 2; // プレイヤーに向かって移動
      enemy.y += (dy / dist) * 2;
    }
  });
}

// ゲームの更新
function updateGame() {
  if (gameOver) return;

  // プレイヤーと敵の衝突チェック
  enemies.forEach((enemy, index) => {
    if (isColliding(player, enemy)) {
      player.hp -= 10;
      enemies.splice(index, 1); // 敵を削除
    }
  });

  // プレイヤーと食べ物の衝突チェック
  foods.forEach((food, index) => {
    if (isColliding(player, food)) {
      player.hp = Math.min(player.hp + 20, 100); // HPを最大100まで回復
      foods.splice(index, 1); // 食べ物を削除
    }
  });

  // HPが0以下でゲームオーバー
  if (player.hp <= 0) {
    player.hp = 0;
    gameOver = true;
  }
}

// ゲームの描画
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤーを描画
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 敵を描画
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // 食べ物を描画
  foods.forEach((food) => {
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, food.width, food.height);
  });

  // HPを表示
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`HP: ${player.hp}`, 10, 30);

  // ゲームオーバー表示
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("ゲームオーバー", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// ゲームループ
function gameLoop() {
  movePlayer();
  moveEnemies();
  updateGame();
  drawGame();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

gameLoop();