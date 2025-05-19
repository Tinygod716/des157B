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

const cameraInitialPos = new THREE.Vector3(0, 0, 60);
const cameraTargetPos = new THREE.Vector3(0, 0, 20);
camera.position.copy(cameraInitialPos);


function moveCameraTo(targetPos, duration = 1000) {
  const start = performance.now();
  const from = camera.position.clone();
  const to = targetPos.clone();

  function animateMove(time) {
    const t = Math.min((time - start) / duration, 1);
    camera.position.lerpVectors(from, to, t);
    if (t < 1) requestAnimationFrame(animateMove);
  }
  requestAnimationFrame(animateMove);
}


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// add OrbitControls，allow user to rotate the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// shape
const geometry = new THREE.TorusGeometry(12, 0.1, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const frostingGeometry = new THREE.TorusGeometry(10, 0.1, 16, 100);
const frostingMaterial = new THREE.MeshStandardMaterial({ color: 0xff77aa }); // 粉色糖霜
const frostingTorus = new THREE.Mesh(frostingGeometry, frostingMaterial);
frostingTorus.position.y = 0.6; // 稍微浮高一点，避免重叠
scene.add(frostingTorus);

const planetGeo = new THREE.SphereGeometry(2, 64, 64);
const planetMat = new THREE.MeshStandardMaterial({ color: 0x8888ff });
const planet = new THREE.Mesh(planetGeo, planetMat);
scene.add(planet);

const bgGeo = new THREE.SphereGeometry(100, 64, 64);
const texture = new THREE.TextureLoader().load('textures/space.jpg'); // 星空图
const bgMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
const backgroundSphere = new THREE.Mesh(bgGeo, bgMat);
scene.add(backgroundSphere);


// lights
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// animation
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.001;
  torus.rotation.y += 0.003;
  torus.rotation.z += 0.001;

  frostingTorus.rotation.x += 0.002;
  frostingTorus.rotation.y += 0.008;
  frostingTorus.rotation.z += 0.004;

  controls.update(); // rotate the camera
  renderer.render(scene, camera);
}
animate();




const addedModels = {};
const Textbox =  document.querySelector(`.infopanel img`);

// 点击 marker 后添加 3D 模型并升起
document.querySelectorAll('.marker').forEach(marker => {
  marker.addEventListener('click', () => {
    const id = marker.dataset.location;
     moveCameraTo(cameraTargetPos, 1200);
    Textbox.style.display = 'block';
    Textbox.classList.add('slide-left');

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
    moveCameraTo(cameraInitialPos, 1200);
    function goBack() {
      if (addedModels[id]) {
        addedModels[id].position.y -= 0.05;
        if (addedModels[id].position.y > -5) {
          requestAnimationFrame(goBack);
        } else {
          scene.remove(addedModels[id]);
          delete addedModels[id];
          Textbox.style.display = 'none';
        }
      }
    }
    goBack();

  });
});
