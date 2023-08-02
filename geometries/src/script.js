import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Built in Geometries
 * all the following geometries inherit from the BufferGeometry class
 * this class has many built in methods like translate() rotateX|Y|Z() normalize and more...
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// boxgeo params #4 widthSegments #5 heightSegments #6 depthSegments
// const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);

/** own Geometry
 * Float32Array: One dimension arr where the first 3 valurs are the axes (x,y,z)
 * coordinates of the first vertex and the next three are the second and so on.
 * we can then convert Float32Array into a BufferAttribute
 * we can add this BufferAttribute to our BufferGeometry with setAttribute(...)
 *  position is the name that will be used for our shaders
*/

const geometry = new THREE.BufferGeometry(); //intitalize an empty buffergeo

/** Buncha triangles
 * 
 */

const count = 500; //500 triangles
const positionsArray = new Float32Array(count * 3 * 3) // each triangle is composed of three verteces and each vertex is composed of three values (triangle verteces, value of each vertex per triangle )

// Fill the positionsArray with random values for the triangles
for(let i = 0; i < count * 3 * 3; i++)
{
  // Assign random values to each vertex's position in the positionsArray[i]
  positionsArray[i] = (Math.random() - 0.5) * 4; // Random positions between -0.5 and 0.5 (centered at 0)
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); //how many values for one vertex so 3

geometry.setAttribute('position', positionsAttribute)

/** setting an attribute to our geometry
 * triangle setting an attribute to our geometry
const positionsArray = new Float32Array();
// provide the float array and an integer for the second param that coresponds
// with the values that compose one vertex so three vertices for this example 
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);


// added attribute containing the position to our Geometry obj
// need to name it position for the name and the second param is the value ('name' => val) 
// this name is recognized when we add shaders
geometry.setAttribute('position', positionsAttribute); 
 * 
 */

const material = new THREE.MeshBasicMaterial({
  color: "purple",
  wireframe: true, //adds the triangles (shows the segments on our material)
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
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

// Camera
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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
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
