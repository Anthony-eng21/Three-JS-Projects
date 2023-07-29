import * as THREE from "three";
import { gsap } from "gsap";

//GSAP
//npm install --save gsap@3.5.1

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "magenta" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/** Animations
 *
 */

/** Using Time Stamps
 * window.requestAnimationFrame();
 * window.requestAnimationFrame(tick) not called but passed the local function but mimics
 * recursive functionality but uses the mechanisms of the requestAnimationFrame to call upon itself to
 *
 * Adapt Animation speed to any Frame Rate GREAT FOR PERFORMANCE using deltaTime and prevTime
 * We need to know how much time it's been since the last tick so we use Date.now() to get a current time stamp
 * Subtract the previous time stamp from the current timestamp (now) to get the deltaTime and use that interval for our frames in the "animation"
 * The line time = currentTime; is used to update the time variable with the current timestamp at the end of each animation frame. This step is crucial
 * for correctly calculating the time difference (deltaTime) between the current frame and the previous frame in subsequent iterations of the tick function.
 */

// CODE
// let time = Date.now(); //Previous time stamp

// const tick = () => {
//   // Time
//   const currentTime = Date.now();

//   //difference of the time stamps
//   const deltaTime = currentTime - time;

//   time = currentTime; //update the time to the current tick to keep it running

//   console.log(deltaTime);

//   // Update Objects position moving the mmothafucka

//   mesh.rotation.y += 0.001 * deltaTime; //this cube now runs the same speed irregardless of the frame rate 🤯🤑
//   // mesh.rotation.x += 0.01;

//   // Render in our Animation frame honestly this works like a loop
//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };

// tick();

/** Using Clock
 * used to measure the time elapsed since the Clock object was created
 * or since the last time the getElapsedTime() method was called. in this instance in our animation frame
 */

//Clock class instanciatiation

// const clock = new THREE.Clock();

// Code
// const tick = () => {
//   //Clock
//   // const elapsedTime = clock.getElapsedTime(); // seconds that have passed since the elapsed time
//   // Update Objects position moving the mmothafucka

//   // updating our rotation with our elapsedTime value and not giving a hard value
//   // mesh.rotation.y = elapsedTime * Math.PI * 2; // makes one full rotation for every system elapsed second

//   //Makes our object(s) including our camera move in circles
//   //switch values around from this to make it move clock-wise
//   // mesh.position.y = Math.sin(elapsedTime); //drops at first and fluctuates
//   // mesh.position.x = Math.cos(elapsedTime); //starts at 0? and fluctuates
//   // mesh.lookAt(mesh.position)

//   // Render in our Animation frame honestly this works like a loop
//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };

// tick();

/** Using gsap
 * GSAP internally has it's own tick which is super nice but not too bad to make from scratch
 * so we don't need to tell the user's system how to handle the animations frame rate
 */
// First param is the position of the object we want to animate not just the obj
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

const tick = () => {
  // Render in our Animation frame honestly this works like a loop
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
