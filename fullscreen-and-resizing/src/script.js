// Import necessary modules from Three.js library
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Get the canvas element from the DOM
const canvas = document.querySelector("canvas.webgl");

// Create a Three.js scene
const scene = new THREE.Scene();

// Create a simple cube mesh and add it to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Object to store the window dimensions
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Function to handle resizing of the window
const handleResize = () => {
  // Update the sizes object with the new window dimensions
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update the camera's aspect ratio and projection matrix
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update the renderer with the new window dimensions
  renderer.setSize(sizes.width, sizes.height);

  // Limit the pixel ratio to prevent performance issues on high-density displays
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// Add event listener for window resizing
window.addEventListener("resize", handleResize);

// Function to handle entering/exiting fullscreen on double-click
const handleFullscreen = () => {
  if (!document.fullscreenElement) {
    // Enter fullscreen mode on double-click if not already in fullscreen
    canvas.requestFullscreen();
    console.log("enter");
  } else {
    // Exit fullscreen mode on double-click if already in fullscreen
    document.exitFullscreen();
  }
};

// Add event listener for double-click to toggle fullscreen mode
window.addEventListener("dblclick", handleFullscreen);

// Create a perspective camera with given field of view, aspect ratio, and near/far planes
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Create orbit controls to enable camera interaction (pan, zoom, rotate)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Create the WebGL renderer and attach it to the canvas
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create a clock to measure the time elapsed between frames
const clock = new THREE.Clock();

// Animation loop function
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update camera controls for interactive camera movement
  controls.update();

  // Render the scene with the camera's view
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

// Start the animation loop
tick();
