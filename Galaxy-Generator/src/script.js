import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { randInt } from "three/src/math/MathUtils";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Each time we call the generateGalaxy function, we will remove the previous galaxy
// (if there is one)
// then create a new one. then call that function immediately

// Object to hold all the parameters for our galaxy
// add each parameter to our lil-gui
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.branches = 3;
parameters.spin = 1;

// Each star will be positioned accordingly to that radius.
// If the radius is 5, the stars will be positioned at a distance from 0 to 5
parameters.radius = 5;

//spin galaxies always seem to have 2 branches, but we can have more honestly

let geometry = null;
let material = null;
let points = null;

//GEN GAL fn
const generateGalaxy = () => {
  //destroy the old galaxy if there is one this helps with
  // performance and not mkaing galaxies on top of each other
  // when playing around with dat gui and the object parameters
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  //array to hold our vertices for our particle 'points' (rule of 3 vertices)
  const positions = new Float32Array(parameters.count * 3);

  // in out loop we create our particles for our geometry
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    // Then we can multiply the spinAngle by that spin parameter. To put it differently,
    // the further the particle is from the center, the more spin it'll endure:
    const spinAngle = radius * parameters.spin;

    // Position particles on branches using Math.cos(...) and Math.sin(...).
    // Calculate angle by taking modulo of index, dividing by branch count to get 0-1 range,
    // then multiply by 2 * Math.PI for full circle. Use this angle for x and z axis,
    // multiplied by radius.
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

    // positions[i3] = (Math.random() - 0.5) * 3; //x vertice Float32Array[0]
    // positions[i3 + 1] = (Math.random() - 0.5) * 3; // y vertice Float32Array[1]
    // positions[i3 + 2] = (Math.random() - 0.5) * 3; // x vertice Float32Array[2]
  }
  //add our mutated particles to our position attribute on our geometry
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  /**
   * Materials
   *
   */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
//end GEN GAL fn

//start params for Galaxy obj for lil gui
gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  // Pass a function to be called after this controller has been modified and loses focus.
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  // Pass a function to be called after this controller has been modified and loses focus.
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);
// end params for Galaxy obj for lil gui

generateGalaxy();

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
camera.position.x = 3;
camera.position.y = 3;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
