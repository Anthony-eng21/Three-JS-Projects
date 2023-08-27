import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

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
 * Lights
 *
 * The AmbientLight applies omnidirectional lighting on all geometries of the scene.
 * @params The first parameter is the color and the second parameter is the intensity
 * As for the materials, you can set the properties directly when instantiating or you can change them after:
 * - If all you have is an AmbientLight you'll have the same effect as for a MeshBasicMaterial because all faces of the geometries will be lit equally.
 * Ambient Light:
 * LIGHT BOUNCING is NOT supported in Three.js. use a dim AmbientLight to fake this light bounce.
 * @params The first parameter is the color and the second is the intensity. (default color hex)
 * @params The second parameter is the intensity of the "rays". (default float max 1)
 *
 * The Directional Light:
 * has a sun-like effect as if the sun rays were traveling in parallel.
 * @params The first parameter is the color.
 * @params The second parameter is the intensity:
 * By default, the light seems to come from above.
 * To change this, move the whole light by using the position
 * property like if it were a normal object.
 * The distance of the light doesn't matter for now.
 * The rays come from an infinite space and travel
 * in parallel to the infinite opposite.
 * - CODE:
 * const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
 * scene.add(directionalLight);
 * directionalLight.position.set(1, 0.25, 0);
 *
 * HemisphereLight
 * The HemisphereLight is similar to the AmbientLight but with a different
 * color from the sky than the color coming from the ground. Faces facing
 * the sky will be lit by one color while another color will lit faces facing the ground
 * @params The first parameter is the color corresponding to the sky color
 * @params the second parameter is the groundColor.
 * @params the third parameter is the intensity:
 */

//CODE:
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
plane.side = THREE.DoubleSide;

scene.add(sphere, cube, torus, plane);

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
camera.position.y = 1;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
