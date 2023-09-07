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
 * Shadows
 * First we activate our Shadows with enabling shadowmap on our renderer / webgl renderer
 * Activate on our objects e.g. sphere, and or plane.
 * Then, we need to go through each object of the scene and decide if the object can cast a shadow
 * with the @property castShadow property, and if the object can receive shadow with the @property receiveShadow property.
 *
 * Shadow supported Lights
 * Finally, activate the shadows on the light with the castShadow property.Only the following types of lights support shadows:
 * PointLight
 * DirectionalLight
 * SpotLight
 *
 * Limitation
 * Sadly, at this point the shadow looks terrible. Let's try to improve it.
 *
 * Optimization
 * Three.js is doing renders called shadow maps for each light. You can access this shadow map
 * (and many other things)
 * using the shadow property on the light:
 * As for our render, we need to specify a size. By default, the shadow map size is only 512x512 for performance reasons.
 * We can improve it but keep in mind that you need a power of 2 value for the mipmapping:
 *
 * Near and far
 * Three.js is using cameras to do the shadow maps renders. Those cameras have the same properties as the cameras we already used.
 * This means that we must define a near and a far. It won't really improve the shadow's quality, but it might fix bugs where you can't see
 * the shadow or where the shadow appears suddenly cropped.
 * To help us debug the camera and preview the near and far, we can use a CameraHelper with the camera used for the shadow map located in the
 * directionalLight.shadow.camera property:
 * preview the near and far, we can use a CameraHelper class with the camera used for the shadow map located in the directionalLight.shadow.camera property:
 * 
 * Amplitude 
 * With the camera helper we just added, we can see that the camera's amplitude is too large.
 * Because we are using a DirectionalLight, Three.js is using an OrthographicCamera. If you remember
 * from the Cameras lesson, we can control how far on each side the camera can see with the top, right,
 * bottom, and left properties. Let's reduce those properties:
 */

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

//Finally, activate the shadows on the light with the castShadow property.
scene.add(directionalLight);
directionalLight.castShadow = true; //our light can cast a shadow.
//A DirectionalLightShadow used to calculate shadows for this light
console.log(directionalLight.shadow);

// keep in mind that you need a power of 2 value for the mipmapping: this will make the shadow look nicer
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

//camera frustrum places camera visibility
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

const directionalLightHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);

//visually see the near and far of the camera. Try to find a value that fits the scene:
scene.add(directionalLightHelper);

//
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
console.log(material);
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
//Try to activate these on as few objects as possible:
sphere.castShadow = true; //shadow caster

//Plane Mesh
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
//Try to activate these on as few objects as possible:
plane.receiveShadow = true; //shadow receiver

scene.add(sphere, plane);

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
//First, we need to activate the shadow maps on the renderer:
renderer.shadowMap.enabled = true;

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
