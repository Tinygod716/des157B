import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
import SplitText from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
gsap.registerPlugin(SplitText, ScrollTrigger);

// Global state for SplitText instances
let currentSplits = [];
function splitText() {
  currentSplits.forEach(split => split.revert());
  currentSplits = [];

  document.querySelectorAll('.textcontent__container p').forEach(el => {
    const split = new SplitText(el, { type: 'chars' });
    currentSplits.push(split);
    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: el,
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

// THREE.js setup
const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load('images/background.png');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraInitialPos = new THREE.Vector3(40, 5, 60);
const cameraTargetPos = new THREE.Vector3(60, 5, 10);
camera.position.copy(cameraInitialPos);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableRotate = false;

let isCameraAnimating = false;
let cancelCameraMove = false;
let baseCameraZ = camera.position.z;
let lastScrollY = window.scrollY;

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

// Scene objects
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

// Marker click logic
document.querySelectorAll('.marker').forEach(marker => {
  marker.addEventListener('click', () => {
    // 🔄 Clear existing content and triggers
    document.querySelectorAll('.textcontent__container').forEach(c => {
      c.style.display = 'none';
      c.classList.remove('slide-bottom-top');
    });
    ScrollTrigger.getAll().forEach(t => t.kill());

    const id = marker.dataset.location;
    const Mapp = document.querySelector(`.infopanel img[data-location="${id}"]`);

    // Show content for this marker
    document.querySelectorAll('.textcontent__container').forEach(c => {
      if (c.dataset.location === id) {
        c.style.display = 'block';
        c.classList.add('slide-bottom-top');
      }
    });

    moveCameraTo(cameraTargetPos, 1300);
    if (Mapp) {
      Mapp.style.display = 'block';
      Mapp.classList.add('slide-left');
    }
    Bigmap.style.opacity = 0.5;

    setTimeout(() => {
      splitText();
      ScrollTrigger.refresh();
    }, 300);

    if (addedModels[id]) return;

    if (id === 'shanghai') {
      loader.load('public/models/shanghai_gardens.glb', gltf => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5); // 根据需要调整
        model.position.set(30, -10, -10); // 初始位置在地面下
        scene.add(model);
        addedModels[id] = model;

    function rise() {
      if (model.position.y < -8) {
        model.position.y += 0.05;
        requestAnimationFrame(rise);
      }
    }
    rise();
  }, undefined, error => {
    console.error('加载模型失败:', error);
  });
} else {
  // 默认用 Torus 模型
  const newTorus = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.4, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0x44ccff })
  );
  newTorus.position.set(30, -5, 0);
  scene.add(newTorus);
  addedModels[id] = newTorus;

  function rise() {
    if (model.position.y < 0) {
      model.position.y += 0.05;
      requestAnimationFrame(rise);
    }
  }
  rise();
}
  });
});

// Go back button
const backBtn = document.querySelector('.back');
let splitChars = new SplitText(backBtn, { type: 'chars' });

backBtn.addEventListener('mouseenter', () => {
  gsap.to(splitChars.chars, {
    x: i => gsap.utils.random(-20, 20),
    y: i => gsap.utils.random(-20, 20),
    rotation: i => gsap.utils.random(-90, 90),
    opacity: 0.3,
    stagger: 0.02,
    duration: 0.5,
    ease: 'power2.out'
  });
});

backBtn.addEventListener('mouseleave', () => {
  gsap.to(splitChars.chars, {
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 1,
    stagger: 0.02,
    duration: 0.6,
    ease: 'power3.out'
  });
});

backBtn.addEventListener('click', () => {
  const id = document.querySelector('.textcontent__container[style*="block"]')?.dataset.location;
  const Mapp = document.querySelector(`.infopanel img[data-location="${id}"]`);
  const Content = document.querySelector(`.textcontent div[data-location="${id}"]`);

  // ✅ 清除文字和动画
  document.querySelectorAll('.textcontent__container').forEach(c => {
    c.style.display = 'none';
    c.classList.remove('slide-bottom-top');
  });
  ScrollTrigger.getAll().forEach(t => t.kill());

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
        if (Mapp) {
          Mapp.classList.remove('slide-left');
          Mapp.classList.add('slide-right');
          Mapp.addEventListener('animationend', () => {
            Mapp.style.display = 'none';
            Mapp.classList.remove('slide-right');
          }, { once: true });
        }
        if (Content) {
          Content.style.display = 'none';
        }
      }
    }
  }
  goBack();
});

// Start screen
const startText = document.querySelector('.starttext');
const startDiv = document.querySelector('.startdiv');
const startBtn = document.querySelector('.startbar');

camera.position.set(0, 100, 0);
camera.lookAt(0, 0, 0);
controls.enabled = false;
document.body.style.overflow = 'hidden';

startBtn.addEventListener('click', () => {
  const splitTextInst1 = new SplitText(startText, { type: 'chars' });
  const splitTextInst2 = new SplitText(startDiv, { type: 'chars' });

  gsap.to(splitTextInst1.chars, {
    opacity: 0,
    y: -30,
    stagger: 0.03,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => startText.remove()
  });

  gsap.to(splitTextInst2.chars, {
    opacity: 0,
    y: 30,
    stagger: 0.03,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => {
      startDiv.remove();
      gsap.to(camera.position, {
        x: cameraInitialPos.x,
        y: cameraInitialPos.y,
        z: cameraInitialPos.z,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0),
        onComplete: () => {
          controls.enabled = true;
          document.body.style.overflow = '';
          document.body.classList.add('entered');
          baseCameraZ = camera.position.z;
        }
      });
    }
  });
});
