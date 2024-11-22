// 初期ステータス
let playerHP = 100;
let enemyHP = 100;

// HTML要素を取得
const playerHpElement = document.getElementById("player-hp");
const enemyHpElement = document.getElementById("enemy-hp");
const messageElement = document.getElementById("message");
const attackBtn = document.getElementById("attack-btn");
const healBtn = document.getElementById("heal-btn");

// プレイヤーの攻撃
function attackEnemy() {
  const damage = Math.floor(Math.random() * 20) + 10; // 10〜30のランダムなダメージ
  enemyHP -= damage;
  if (enemyHP < 0) enemyHP = 0;
  enemyHpElement.textContent = `HP: ${enemyHP}`;
  messageElement.textContent = `プレイヤーは敵に${damage}のダメージを与えた！`;
  checkWin();
  enemyAttack();
}

// プレイヤーの回復
function healPlayer() {
  const healAmount = Math.floor(Math.random() * 15) + 10; // 10〜25のランダム回復
  playerHP += healAmount;
  if (playerHP > 100) playerHP = 100; // 最大HPは100
  playerHpElement.textContent = `HP: ${playerHP}`;
  messageElement.textContent = `プレイヤーは${healAmount}回復した！`;
  enemyAttack();
}

// 敵の攻撃
function enemyAttack() {
  setTimeout(() => {
    const damage = Math.floor(Math.random() * 20) + 5; // 5〜25のランダムダメージ
    playerHP -= damage;
    if (playerHP < 0) playerHP = 0;
    playerHpElement.textContent = `HP: ${playerHP}`;
    messageElement.textContent = `敵はプレイヤーに${damage}のダメージを与えた！`;
    checkWin();
  }, 1000); // 敵の攻撃は1秒後
}

// 勝敗判定
function checkWin() {
  if (enemyHP <= 0) {
    messageElement.textContent = "プレイヤーの勝利！";
    attackBtn.disabled = true;
    healBtn.disabled = true;
  } else if (playerHP <= 0) {
    messageElement.textContent = "敵の勝利…";
    attackBtn.disabled = true;
    healBtn.disabled = true;
  }
}

// ボタンイベント
attackBtn.addEventListener("click", attackEnemy);
healBtn.addEventListener("click", healPlayer);