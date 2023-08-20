import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//loading the font le wrongish way
// import typeFaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**Fonts
 *
 */
const fontLoader = new FontLoader();

fontLoader.load(
  "/fonts/helvetiker_regular.typeface.json",
  //success fn() kinda like a promise lol
  (font) => {
    //instanciate the TextGeometry class from THREE
    /**
     *@param text — The text that needs to be shown.
      @param parameters — Object that can contain the following parameters.
     */
    const textGeometry = new TextGeometry("McLovin", {
      font: font, // an instance of THREE.Font
      size: 0.5, // Float. Size of the text. Default is 100.
      height: 0.2, // Float. Thickness to extrude text. Default is 50.
      curveSegments: 12, // Integer. Number of points on the curves. Default is 12
      bevelEnabled: true, // Boolean. Turn on bevel. Default is False.
      bevelThickness: 0.03, // bevelThickness — Float. How deep into text bevel goes. Default is 10
      bevelSize: 0.02, // Float. How far from text outline is bevel. Default is 8.
      bevelOffset: 0, //  Float. How far from text outline bevel starts. Default is 0.
      bevelSegments: 5, //  Integer. Number of bevel segments. Default is 3.
    });

    const textMaterial = new THREE.MeshNormalMaterial();
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
  }
);

/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

// cube.position.x = -2
// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
