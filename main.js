import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {
  CSS3DObject, CSS3DRenderer,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath(
  'https://sbcode.net/img/').
  load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const camera = new THREE.PerspectiveCamera(75,
  window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;

const light = new THREE.PointLight(0xffffff, 250, 10);
light.position.set(0, 5, -5);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();
loader.load('/models/laptop.glb', function(gltf) {
  const computer = gltf.scene;

  const screenMesh = computer.getObjectByName('Ecran');

  const iframe = document.createElement('iframe');
  iframe.src = 'http://www.iut-lens.univ-artois.fr/';
  iframe.style.width = '1280px';
  iframe.style.height = '768px';
  iframe.style.border = '0';
  iframe.style.backfaceVisibility = 'hidden';
  iframe.style.overflowY = 'scroll';

  const cssObject = new CSS3DObject(iframe);

  cssObject.position.copy(screenMesh.position);
  cssObject.scale.copy(screenMesh.scale);
  cssObject.rotation.copy(screenMesh.rotation);

  computer.remove(screenMesh);
  computer.add(cssObject);

  scene.add(computer);
});

const tabletopGeometry = new THREE.BoxGeometry(20, 0.5, 10);
const tabletopMaterial = new THREE.MeshStandardMaterial(
  {color: 0x808080, roughness: 0.5, metalness: 0.1});
const tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
tabletop.position.set(0, 0, 0);
tabletop.receiveShadow = true;
scene.add(tabletop);

const legGeometry = new THREE.CylinderGeometry(0.5, 0.5, 12, 32);
const legMaterial = new THREE.MeshStandardMaterial(
  {color: 0x808080, roughness: 0.1, metalness: 0.8});

const legPositions = [
  {x: -9, z: -4, y: -6},
  {x: 9, z: -4, y: -6},
  {x: -9, z: 4, y: -6},
  {x: 9, z: 4, y: -6}];

for (const {x, z, y} of legPositions) {
  const leg = new THREE.Mesh(legGeometry, legMaterial);
  leg.position.set(x, y, z);
  scene.add(leg);
}

const lampGroup = new THREE.Group();

const baseGeometry = new THREE.BoxGeometry(2, 1, 2);
const baseMaterial = new THREE.MeshStandardMaterial(
  {color: 0x333333, roughness: 0.3, metalness: 0.65});
const base = new THREE.Mesh(baseGeometry, baseMaterial);
lampGroup.add(base);

const stemGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6.2, 32);
const stem = new THREE.Mesh(stemGeometry, baseMaterial);
stem.position.y = 3.6;
lampGroup.add(stem);

const coneGeometry = new THREE.CylinderGeometry(0.9, 1.3, 3, 32);
const cone = new THREE.Mesh(coneGeometry, baseMaterial);
cone.position.y = 6.7;
lampGroup.add(cone);

const bulbGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const bulb = new THREE.Mesh(bulbGeometry, baseMaterial);
const pointLight = new THREE.PointLight(0xffffAA, 100, 0, 2);
bulb.position.y = 7;
bulb.add(pointLight);
lampGroup.add(bulb);

scene.add(lampGroup);

lampGroup.position.set(8, 0, -2);

const fontLoader = new FontLoader();
fontLoader.load('fonts/HaarlemDeco.json', function(font) {
  const geometry = new TextGeometry('IUT Lens', {
    font: font,
    size: 1.0,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const geamat = new THREE.Mesh(geometry.scale(1, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0xFF77FF, roughness: 0.5,
    }));
  scene.add(geamat);

  geamat.position.set(lampGroup.position.x - 3, lampGroup.position.y + 0.25,
    lampGroup.position.z);
  geamat.rotation.y = -0.45;
  geamat.castShadow = true;
  geamat.receiveShadow = true;
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight1.position.set(3, 15, -5);
scene.add(directionalLight1);

bulb.castShadow = true;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight1.castShadow = true;

let frame = 0;
let stopAnimation = false;
document.getElementById('startAnimation').
  addEventListener('click', function() {
    stopAnimation = false;
    frame = 0;
    animate();
  });

function animate() {

  if (!stopAnimation) {

    document.getElementById('endAnimation').
      addEventListener('click', function() {
        frame = 499;
      });
    requestAnimationFrame(animate);

    let x, y, z;
    if (frame <= 250) {
      const angle = frame / 250 * Math.PI;
      x = 16 * Math.sin(angle);
      y = 3 + 3 * (frame / 250);
      z = -16 * Math.cos(angle);
    } else {
      x = 0;
      y = 6;
      z = 24 - 13.5 * ((frame - 250) / 250);
    }

    camera.position.set(x, y, z);

    camera.lookAt(new THREE.Vector3(0, 3, -4));

    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);

    frame = (frame + 1) % 501;
  }
  stopAnimation = frame === 500;
}

animate();