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
const geometry = new THREE.TorusGeometry(10, 0.4, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const frostingGeometry = new THREE.TorusGeometry(10, 0.4, 16, 100);
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
