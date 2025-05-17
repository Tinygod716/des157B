import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.setZ(30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// add OrbitControls，allow user to rotate the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// shape
const geometry = new THREE.TorusGeometry(10, 0.1, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const frostingGeometry = new THREE.TorusGeometry(10, 0.1, 16, 100);
const frostingMaterial = new THREE.MeshStandardMaterial({ color: 0xff77aa }); // 粉色糖霜
const frostingTorus = new THREE.Mesh(frostingGeometry, frostingMaterial);
frostingTorus.position.y = 0.6; // 稍微浮高一点，避免重叠
scene.add(frostingTorus);

// lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// animation
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  frostingTorus.rotation.x += 0.02;
  frostingTorus.rotation.y += 0.001;
  frostingTorus.rotation.z += 0.04;

  controls.update(); // rotate the camera
  renderer.render(scene, camera);
}
animate();




const addedModels = {};

// 点击 marker 后添加 3D 模型并升起
document.querySelectorAll('.marker').forEach(marker => {
  marker.addEventListener('click', () => {
    const id = marker.dataset.location;

    // 如果已经添加过，就不重复添加
    if (addedModels[id]) return;

    // 创建一个新的 torus 模型
    const geometry = new THREE.TorusGeometry(10, 0.4, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0x44ccff });
    const newTorus = new THREE.Mesh(geometry, material);
    newTorus.position.set(0, -5, 0); // 初始从地下开始
    scene.add(newTorus);

    addedModels[id] = newTorus;

    // 升起动画
    const targetY = 0;
    function rise() {
      if (newTorus.position.y < targetY) {
        newTorus.position.y += 0.05;
        requestAnimationFrame(rise);
      }
    }
    rise();
  });

  // 点击go back返回
  document.querySelector('.back').addEventListener('click', () => {
    const id = marker.dataset.location;
    function goBack() {
      if (addedModels[id]) {
        addedModels[id].position.y -= 0.05;
        if (addedModels[id].position.y > -5) {
          requestAnimationFrame(goBack);
        } else {
          scene.remove(addedModels[id]);
          delete addedModels[id];
        }
      }
    }
    goBack();
  });
});
