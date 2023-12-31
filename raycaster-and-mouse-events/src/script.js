import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#cc99ff" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#cc99ff" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#cc99ff" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 * To change the position and direction where ray will be cast,
 * we can use the set(...) method. The first parameter is
 * the position and the second parameter is the direction.
 * Normalize from the docs: "Convert this vector to a unit vector - that is, sets it equal to a vector with the same direction as this one, but length 1."
 */

const raycaster = new THREE.Raycaster();

// BEFORE
// position somewhere to the left [-3, -2, 0, 2] our raycaster to the left on our x axis
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// shoots our ray to the right
// const rayDirection = new THREE.Vector3(1, 0, 0);
// console.log(rayDirection.length()) // 1

// normalizing: is when our vector3 length is = to 1
// but keeps the direction of the ray that we cast
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// To cast a ray and get the objects that intersect we can use two methods,
// intersectObject(...) (singular) and intersectObjects(...) (plural).
// intersectObject(...) will test one object and intersectObjects(...) will test an array of objects:

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect); // singular intersection arr

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects); // multiple intersections arr

/**
 * Result of an intersection
 * always an array of intersection objects (even within the same geometry)
 * - EACH item of that returned array contains a lot of good information
 * - distance: the distance between the origin of the ray and the collision point.
 * - face: what face of the geometry was hit by the ray
 * - faceIndex: the index of that ^ face
 * - oject: what object is concerned with the collision
 * - point: a Vector3 of the exact position in 3D space of the collison
 * - uv: the UV coordinates in that geometry
 * 📲 E.G.
 * 📲 If you want to test if there is a wall in front of the player, you can test the DISANCE.
 * 📲 If you're going to change the object's color, you can update the object's MATERIAL. If you want
 * 📲 to show an explosion on the impact POINT, you can create this explosion at the POINT position.
 */

/**
 * Test on each frame:
 * Currently, we only cast one ray at the start.
 * If we want to test things while they are moving,
 * we have to do the test on each frame. Let's animate the spheres
 * and turn them blue when the ray intersects with them.
 */

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
camera.position.z = 3;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Animate Objects

  //better wave
  const waveSpeed = 1; // Speed of the wave
  const waveAmplitude = 1.5; // Height of the wave
  const waveFrequency = 1; // Frequency of the wave
  const phaseOffset = 0.5; // Phase offset between each object to create the wave effect

  object1.position.y =
    Math.sin(elapsedTime * waveFrequency) * waveAmplitude * waveSpeed;
  object2.position.y =
    Math.sin(elapsedTime * waveFrequency - phaseOffset) *
    waveAmplitude *
    waveSpeed;
  object3.position.y =
    Math.sin(elapsedTime * waveFrequency - 2 * phaseOffset) *
    waveAmplitude *
    waveSpeed;

  // OLD WAVE
  //   object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  //   object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  //   object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

  /**
   * UPDATE RAYCASTER
   * update our raycaster like we did before but in the tick function:
   */

  const rayOrigin = new THREE.Vector3(-3, 0, 0); // to the left of the first ball
  const rayDirection = new THREE.Vector3(1, 0, 0); // shoots to the right
  rayDirection.normalize(); //already normalixed direction with 1 but this is a nice convention

  raycaster.set(rayOrigin, rayDirection);

  // put the array of objects to test in a variable objectsToTest. This will be handy later.
  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  console.log(intersects);

  // intersecting update of the color to our objects in our arr
  for (const object of objectsToTest) {
    object.material.color.set("#cc99ff");
  }

  //intersecting update of the color to our objects in our arr
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
