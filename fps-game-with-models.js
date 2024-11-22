// 基本設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ライト
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// 地面
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// プレイヤー（3Dモデル）
let player;
const loader = new THREE.GLTFLoader();
loader.load('models/player.glb', (gltf) => {
  player = gltf.scene;
  player.scale.set(0.5, 0.5, 0.5);
  player.position.set(0, 1.6, 0);
  scene.add(player);
});

// 銃弾
const bullets = [];
function shootBullet() {
  if (player) {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(player.position);
    bullet.position.z -= 0.5;
    scene.add(bullet);
    bullets.push(bullet);
  }
}

// 敵（3Dモデル）
const enemies = [];
function spawnEnemy() {
  loader.load('models/enemy.glb', (gltf) => {
    const enemy = gltf.scene;
    enemy.scale.set(0.3, 0.3, 0.3);
    enemy.position.set((Math.random() - 0.5) * 20, 0, -20);
    scene.add(enemy);
    enemies.push(enemy);
  });
}

// 銃弾の移動
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.position.z -= 0.5;
    if (bullet.position.z < -50) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    }
  });
}

// 敵の移動
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.position.z += 0.1;
    if (enemy.position.z > 10) {
      scene.remove(enemy);
      enemies.splice(index, 1);
      lives--;
      updateHUD();
    }
  });
}

// スコアとライフ
let score = 0;
let lives = 3;
function updateHUD() {
  document.getElementById('score').textContent = `スコア: ${score}`;
  document.getElementById('lives').textContent = `ライフ: ${lives}`;
}

// 衝突判定
function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (bullet.position.distanceTo(enemy.position) < 1) {
        // 衝突処理
        scene.remove(bullet);
        scene.remove(enemy);
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
        updateHUD();
      }
    });
  });
}

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  moveBullets();
  moveEnemies();
  checkCollisions();

  renderer.render(scene, camera);
}

// 敵の生成ループ
setInterval(() => {
  spawnEnemy();
}, 2000);

// 銃弾発射
document.addEventListener('click', () => {
  shootBullet();
});

// ゲーム開始
animate();
