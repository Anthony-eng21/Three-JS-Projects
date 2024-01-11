import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
 * Model
 * GLTFLoader.proto.load 
 * @params file
 * @params cb function
 */

const gltfLoader = new GLTFLoader();

gltfLoader.load("./models/Duck/glTF-Binary/Duck.glb", () => {
  console.log("loaded");
});

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
 * - Hovering
 * First, let's handle hovering.
 * To begin with, we need the coordinates of the mouse. We cannot use the basic native JavaScript coordinates,
 * which are in pixels. We need a value that goes from -1 to +1 in both the horizontal and the vertical axis,
 * with the vertical coordinate being positive when moving the mouse upward. (WebGL Normalized Device Coordinates (NDC))
 * This is how WebGL works and it's related to things like clip space but we don't need to understand those complex concepts.
 * - Examples:
 * The mouse is on the top left of the page: -1 / 1
 * The mouse is on the bottom left of the page: -1 / - 1
 * The mouse is on the middle vertically and at right horizontally: 1 / 0
 * The mouse is in the center of the page: 0 / 0
 */

// save the current intersecting object (mouseenter & mouseleave)
//  Now that we have a variable containing the currently hovered object,
let currentIntersect = null;

// First, let's create a mouse variable with a Vector2, and update that variable when the mouse is moving:
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  // NDC (Normalized Device Coordinates)
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.width) * 2 + 1;

  // console.log(mouse);
});

window.addEventListener("click", () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        console.log("click on object1");
        break;
      case object2:
        console.log("click on object2");
        break;
      case object3:
        console.log("click on object3");
        break;
    }
  }
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

  //Better Wave Animation than what was provided
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

  /** MOUSEMOVE
   * RayCasting on MouseMove
   * Raycasting on 'mousemove' may exceed frame rate; it's handled in 'tick' for consistency.
   * 'setFromCamera()' orients the ray properly. Intersections change object colors accordingly.
   * Updates the ray with a new origin and direction.
   * setFromCamera() ARGS:
   * @param coords — 2D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1.
   * @param camera — camera from which the ray should originate
  
  // raycaster.setFromCamera(mouse, camera)

  // const objectsToTest = [object1, object2, object3]
  // const intersects = raycaster.intersectObjects(objectsToTest)

  // for(const intersect of intersects)
  // {
  //     intersect.object.material.color.set('#0000ff')
  // }

  // for(const object of objectsToTest)
  // {
  //     if(!intersects.find(intersect => intersect.object === object))
  //     {
  //         object.material.color.set('#ff0000')
  //     }
  // }
    
    */

  /** MOUSEENTER and MOUSELEAVE
   * To emulate 'mouseenter' and 'mouseleave', track the current object under the mouse. (currentIntersect)
   * Detect 'mouseenter' when an object is newly intersected, and 'mouseleave' when there are no intersections.
   */

  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  if (intersects.length) {
    if (!currentIntersect) {
      console.log("mouse enter");
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log("mouse leave");
    }
    currentIntersect = null;
  }

  /** OLD WAVE
   * 
  OLD WAVE
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5
  * */

  // UPDATE RAYCASTER (WAVE ANIMATION)
  // const rayOrigin = new THREE.Vector3(-3, 0, 0); // to the left of the first ball
  // const rayDirection = new THREE.Vector3(1, 0, 0); // shoots to the right
  // rayDirection.normalize(); //already normalixed direction with 1 but this is a nice convention

  // raycaster.set(rayOrigin, rayDirection);

  // // put the array of objects to test in a variable objectsToTest. This will be handy later.
  // const objectsToTest = [object1, object2, object3];
  // // Raycaster.prototype.intersectObjects(): Checks all intersection between the ray and the objects with or without the descendants
  // const intersects = raycaster.intersectObjects(objectsToTest);

  // console.log(intersects);

  // // initial update of the color to our objects in our arr for our fps
  // for (const object of objectsToTest) {
  //   object.material.color.set("#cc99ff");
  // }

  // //intersecting update frames of the color to our objects in our arr
  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");
  // }

  // Update controls

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
