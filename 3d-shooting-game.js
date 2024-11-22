// Three.js 基本設定
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// シーンとカメラ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 宇宙の背景 (CubeTextureLoader)
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  'textures/space_right.jpg',  // 右
  'textures/space_left.jpg',   // 左
  'textures/space_top.jpg',    // 上
  'textures/space_bottom.jpg', // 下
  'textures/space_front.jpg',  // 前
  'textures/space_back.jpg'    // 後
]);
scene.background = texture;

// ライト
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// プレイヤー (宇宙船)
const playerGeometry = new THREE.BoxGeometry(1, 1, 2);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.z = 4;
scene.add(player);

// ゲームデータ
let enemies = [];
let bullets = [];
let score = 0;
let lives = 3;
let gameOver = false;
let lastBulletTime = 0;

// キー操作
const keys = { ArrowLeft: false, ArrowRight: false, Space: false };
document.addEventListener('keydown', (e) => {
  if (e.key in keys) keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key in keys) keys[e.key] = false;
});

// プレイヤー移動 (操作範囲制限)
function movePlayer() {
  if (keys.ArrowLeft && player.position.x > -5) player.position.x -= 0.15;
  if (keys.ArrowRight && player.position.x < 5) player.position.x += 0.15;
}

// 弾の発射
function shootBullet() {
  const currentTime = Date.now();
  if (keys.Space && currentTime - lastBulletTime > 300) {
    const bulletGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.set(player.position.x, player.position.y, player.position.z - 1);
    scene.add(bullet);
    bullets.push(bullet);
    lastBulletTime = currentTime;
  }
}

// 弾の移動
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.position.z -= 0.2;
    if (bullet.position.z < -10) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    }
  });
}

// 敵の生成
function spawnEnemy() {
  const enemyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
  enemy.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, -10);
  scene.add(enemy);
  enemies.push(enemy);
}

// 敵の移動
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.position.z += 0.05;
    if (enemy.position.z > 5) {
      scene.remove(enemy);
      enemies.splice(index, 1);
      lives--;
      document.getElementById('lives').textContent = `ライフ: ${lives}`;
    }
  });
}

// 衝突判定
function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      const dist = bullet.position.distanceTo(enemy.position);
      if (dist < 0.5) {
        scene.remove(bullet);
        scene.remove(enemy);
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
        document.getElementById('score').textContent = `スコア: ${score}`;
      }
    });
  });
}

// ゲームオーバー判定
function checkGameOver() {
  if (lives <= 0) {
    gameOver = true;
    document.getElementById('score').textContent = 'ゲームオーバー';
  }
}

// レンダリング
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

// 敵の生成を一定間隔で実行
setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 1000);

// ゲーム開始
animate();