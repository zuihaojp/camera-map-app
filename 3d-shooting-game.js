// シーン、カメラ、レンダラーを作成
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ライト設定
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// プレイヤー（宇宙船）を作成
const playerGeometry = new THREE.BoxGeometry(1, 1, 2);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);
player.position.z = 5;

// 弾丸配列
const bullets = [];

// 敵配列
const enemies = [];

// スコアとライフ
let score = 0;
let lives = 3;
let gameOver = false;

// キー操作
const keys = { ArrowLeft: false, ArrowRight: false, Space: false };
document.addEventListener("keydown", (e) => { if (e.key in keys) keys[e.key] = true; });
document.addEventListener("keyup", (e) => { if (e.key in keys) keys[e.key] = false; });

// 敵を作成
function spawnEnemy() {
  const enemyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
  enemy.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, -10);
  scene.add(enemy);
  enemies.push(enemy);
}

// ゲームオーバー処理
function checkGameOver() {
  if (lives <= 0) {
    gameOver = true;
    document.getElementById("score").textContent = "ゲームオーバー";
  }
}

// 衝突判定
function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      const dist = bullet.position.distanceTo(enemy.position);
      if (dist < 0.5) {
        // 衝突時に敵と弾を削除
        scene.remove(enemy);
        scene.remove(bullet);
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
        document.getElementById("score").textContent = `スコア: ${score}`;
      }
    });
  });

  enemies.forEach((enemy, enemyIndex) => {
    if (enemy.position.z > 5) {
      // 敵がプレイヤーに到達
      scene.remove(enemy);
      enemies.splice(enemyIndex, 1);
      lives--;
      document.getElementById("lives").textContent = `ライフ: ${lives}`;
    }
  });
}

// プレイヤーの移動
function movePlayer() {
  if (keys.ArrowLeft && player.position.x > -5) player.position.x -= 0.1;
  if (keys.ArrowRight && player.position.x < 5) player.position.x += 0.1;
}

// 弾丸を発射
function shootBullet() {
  if (keys.Space) {
    const bulletGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.set(player.position.x, player.position.y, player.position.z - 1);
    scene.add(bullet);
    bullets.push(bullet);
    keys.Space = false;
  }
}

// 弾丸の移動
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.position.z -= 0.2;
    if (bullet.position.z < -20) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    }
  });
}

// 敵の移動
function moveEnemies() {
  enemies.forEach((enemy) => {
    enemy.position.z += 0.05;
  });
}

// レンダリングループ
function animate() {
  if (gameOver) return;

  requestAnimationFrame(animate);

  movePlayer();
  shootBullet();
  moveBullets();
  moveEnemies();
  checkCollisions();
  checkGameOver();

  renderer.render(scene, camera);
}

// ゲーム開始
setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 1000);

animate();
