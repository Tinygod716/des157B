import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
import SplitText from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(SplitText, ScrollTrigger);

// SplitText scroll animation
function splitText() {
  document.querySelectorAll('.textcontent__container p').forEach(p => {
    const split = new SplitText(p, { type: 'chars' });
    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: p,
        start: 'top 90%',
        end: 'bottom 20%',
        scrub: true,
      },
      opacity: 0,
      x: 80,
      ease: 'power3.out',
      duration: 0.8,
      stagger: 0.04,
    });
  });
}

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

// THREE.js Scene setup
const scene = new THREE.Scene();
const spaceTexture = new THREE.TextureLoader().load('images/background.png');
scene.background = spaceTexture;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraInitialPos = new THREE.Vector3(40, 5, 60);
const cameraTargetPos = new THREE.Vector3(60, 5, 10);
camera.position.copy(cameraInitialPos);

let isCameraAnimating = false;
let cancelCameraMove = false;
let baseCameraZ = camera.position.z;
let lastScrollY = window.scrollY;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableRotate = false;

window.addEventListener('scroll', () => {
  if (isCameraAnimating) return;
  cancelCameraMove = true;
  const scrollY = window.scrollY;
  const deltaScroll = scrollY - lastScrollY;
  lastScrollY = scrollY;
  baseCameraZ += deltaScroll * 0.1;
  camera.position.z = baseCameraZ;
  controls.update();
});

function moveCameraTo(targetPos, duration = 1000) {
  cancelCameraMove = false;
  isCameraAnimating = true;
  const start = performance.now();
  const from = camera.position.clone();
  const to = targetPos.clone();
  function animateMove(time) {
    if (cancelCameraMove) return;
    const t = Math.min((time - start) / duration, 1);
    camera.position.lerpVectors(from, to, t);
    if (t < 1) {
      requestAnimationFrame(animateMove);
    } else {
      isCameraAnimating = false;
      baseCameraZ = camera.position.z;
    }
  }
  requestAnimationFrame(animateMove);
}

// Objects
const torus = new THREE.Mesh(new THREE.TorusGeometry(12, 0.1, 16, 100), new THREE.MeshStandardMaterial({ color: 0xff6347 }));
scene.add(torus);

const frostingTorus = new THREE.Mesh(new THREE.TorusGeometry(10, 0.1, 16, 100), new THREE.MeshStandardMaterial({ color: 0xff77aa }));
frostingTorus.position.y = 0.6;
scene.add(frostingTorus);

const planet = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 64), new THREE.MeshStandardMaterial({ color: 0x8888ff }));
scene.add(planet);

Array(200).fill().forEach(() => {
  const star = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
});

scene.add(new THREE.PointLight(0xffffff, 1).position.set(20, 20, 20));
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.y += 0.003;
  frostingTorus.rotation.y += 0.008;
  controls.update();
  renderer.render(scene, camera);
}
animate();

const addedModels = {};
const Bigmap = document.querySelector('.bigmap');
document.querySelectorAll('.infopanel img').forEach(el => el.style.display = 'none');


// click on markers
document.querySelectorAll('.marker').forEach(marker => {
  marker.addEventListener('click', () => {
    const id = marker.dataset.location;
    const Content = document.querySelector(`.textcontent div[data-location="${id}"]`);
    const Mapp = document.querySelector(`.infopanel img[data-location="${id}"]`);

    document.querySelectorAll('.textcontent__container').forEach(c => {
      c.style.display = c.dataset.location === id ? 'block' : 'none';
      c.classList.add('slide-bottom-top');
    });

    moveCameraTo(cameraTargetPos, 1300);
    Mapp.style.display = 'block';
    Mapp.classList.add('slide-left');
    Bigmap.style.opacity = 0.5;

    setTimeout(() => {
      splitText();
      ScrollTrigger.refresh();
    }, 100);

    if (addedModels[id]) return;

    const newTorus = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.4, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0x44ccff })
    );
    newTorus.position.set(30, -5, 0);
    scene.add(newTorus);
    addedModels[id] = newTorus;

    function rise() {
      if (newTorus.position.y < 0) {
        newTorus.position.y += 0.05;
        requestAnimationFrame(rise);
      }
    }
    rise();
  });
});


// click go back button
document.querySelector('.back').addEventListener('click', () => {
  const id = document.querySelector('.textcontent__container[style*="block"]')?.dataset.location;
  const Mapp = document.querySelector(`.infopanel img[data-location="${id}"]`);
  const Content = document.querySelector(`.textcontent div[data-location="${id}"]`);

  window.scrollTo({ top: 0, behavior: 'smooth' });
  moveCameraTo(cameraInitialPos, 1200);
  Bigmap.style.opacity = 0.7;

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
        Content.style.display = 'none';

        Mapp.addEventListener('animationend', () => {
          Mapp.style.display = 'none';
          Mapp.classList.remove('slide-right');
        }, { once: true });
      }
    }
  }
  goBack();
});
