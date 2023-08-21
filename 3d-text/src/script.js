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
// Debug GUI
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
//loading our material for our textGeo
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
const matcapNormalTexture = textureLoader.load("/textures/matcaps/8.png");
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

//instanciate donuts arrray to push objects into
const donuts = [];
/**Fonts
 *
 */
const fontLoader = new FontLoader();

fontLoader.load(
  "/fonts/helvetiker_regular.typeface.json",
  //success fn() when this ajax call is fulfilled
  (font) => {
    //instanciate the TextGeometry class from THREE
    /**
     *@param text — The text that needs to be shown.
      @param parameters — Object that can contain the following parameters.
     */
    const textGeometry = new TextGeometry("PartyOn", {
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

    const text = new THREE.Mesh(textGeometry, textMaterial);

    /**Centering the textgeometry with boundingbox
     * we use this bounding to know the size of the geometry and recenter it
     * we can ask Three.js to calculate this box bounding by calling computeBoundingBox() on the geometry:
     * the translate method on our textGeometry is how we can repositon our object sorta like css with it's translate property
     * or we can use the center method on our textgeo instance and center this geometry a lot more easily
     * point of doing it ourselves was to learn about boundings and frustum culling.
     */

    textGeometry.computeBoundingBox();

    textGeometry.translate - (2, 0, 0);
    /**textGeometry.translate(
      -textGeometry.boundingBox.max.x * 0.05,
      -textGeometry.boundingBox.max.y * 0.05,
      -textGeometry.boundingBox.max.z * 0.05
    );

    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    text.position.x = -textWidth / 2; // Move the text to the left by half of its width
    */

    textGeometry.center();
    //donut loop
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 10, 22);
    const donutMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapNormalTexture,
    });
    for (let i = 0; i <= 200; i++) {
      const donut = new THREE.Mesh(donutGeometry, donutMaterial);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;

      // Add randomness to the rotation. No need to rotate all 3 axes, and because the donut is symmetric, half of a revolution is enough:
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI * 2;
      // The donuts should have rotate in all directions. Finally, we can add randomness to the scale. Be careful, though; we need to use the same value for all 3 axes (x, y, z):
      const scale = Math.random();
      donut.scale.set(scale, scale, scale); //all 3 axes (x, y, z)
      donuts.push(donut); //keeping reference to each object we want to animate below on our tick()
      scene.add(donut);
    }
    //
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
camera.position.x = 2;
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

  // Move the camera horizontally
  const radius = 5; // Radius of the circular path
  const angle = elapsedTime * 0.2; // Adjust the speed of rotation
  camera.position.x = radius * Math.cos(angle);
  camera.position.z = radius * Math.sin(angle);

  donuts.forEach((donut) => {
    donut.rotation.x = elapsedTime * Math.PI;
  });

  // Look at the center of the scene
  camera.lookAt(scene.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
