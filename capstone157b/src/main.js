import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

// canva background

const loader = new THREE.TextureLoader();
loader.load('images/background.png', (texture) => {
  scene.background = texture;
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cameraInitialPos = new THREE.Vector3(40, 5, 60);
const cameraTargetPos = new THREE.Vector3(40, 5, 20);
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
const frostingMaterial = new THREE.MeshStandardMaterial({ color: 0xff77aa }); // color for the object
const frostingTorus = new THREE.Mesh(frostingGeometry, frostingMaterial);
frostingTorus.position.y = 0.6; // a little higher to avoid overlap
scene.add(frostingTorus);

const planetGeo = new THREE.SphereGeometry(2, 64, 64);
const planetMat = new THREE.MeshStandardMaterial({ color: 0x8888ff });
const planet = new THREE.Mesh(planetGeo, planetMat);
scene.add(planet);

const bgGeo = new THREE.SphereGeometry(100, 64, 64);
const texture = new THREE.TextureLoader().load('textures/space.jpg'); // texture
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
const Bigmap = document.querySelector('.bigmap');
document.querySelectorAll('.infopanel img').forEach(el => el.style.display = 'none');

// click marker to show the 3d model
document.querySelectorAll('.marker').forEach(marker => {
  marker.addEventListener('click', () => {
    const id = marker.dataset.location;
    const Mapp = document.querySelector(`.infopanel img[data-location="${id}"]`);
     moveCameraTo(cameraTargetPos, 1200);
    Mapp.style.display = 'block';
    Mapp.classList.add('slide-left');
    Bigmap.style.opacity = 0.5;
    

    // if you have added no no need to repeat 
    if (addedModels[id]) return;

    // all 3d model goes here
    const geometry = new THREE.TorusGeometry(5, 0.4, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0x44ccff });
    const newTorus = new THREE.Mesh(geometry, material);
    newTorus.position.set(30, -5, 0); // initial position
    scene.add(newTorus);

    addedModels[id] = newTorus;

    // rise animation
    const targetY = 0;
    function rise() {
      if (newTorus.position.y < targetY) {
        newTorus.position.y += 0.05;
        requestAnimationFrame(rise);
      }
    }
    rise();
  });

  const group = new THREE.Group();
group.add(torus);
group.add(frostingTorus);
group.add(planet);
scene.add(group);
group.position.set(30, 0, 0);

  // click go back
  document.querySelector('.back').addEventListener('click', () => {
    const id = marker.dataset.location;
    const Mapp = document.querySelector(`.infopanel img[data-location="${id}"]`);
    Bigmap.style.opacity = 0.7;
    moveCameraTo(cameraInitialPos, 1200);
    function goBack() {
      if (addedModels[id]) {
        addedModels[id].position.y -= 0.05;
        if (addedModels[id].position.y > -5) {
          requestAnimationFrame(goBack);
        } else {
          scene.remove(addedModels[id]);
          delete addedModels[id];
          Mapp.classList.remove('slide-left');
          Mapp.classList.add('slide-right');
          
          Mapp.addEventListener('animationend', () => {
            Mapp.style.display = 'none';
            Mapp.classList.remove('slide-right'); // remove the class
          }, { once: true }); // only run once
        }
      }
    }
    goBack();
  });

  });
