import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Cursor Coordinates
 * get the current coordinates of our cursor with events on our clientX axis
 * want to set an amplitude of 0 - 1 so we dont get annoyingly large values
 */

//helper config object for our easier amplitude logs
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5; // with this we have that better amplitude
  cursor.y = -(e.clientY / sizes.height - 0.5); // with this negation we allow inversion for the y axis as well as the x
  console.log(cursor.x, "x");
  console.log(cursor.y, "y");
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff })
);
scene.add(mesh);

/**CAMERAS:
 * PerspectiveCamera : ( These parameters determine how the camera perceives and captures the 3D scene.
 * - For a given scene and use case, choosing the right fov, aspectRatio, near, and far values is crucial to
 * - achieve the desired visual perspective and rendering performance )
 * #1 Field of view: how much you can see on a vertical angle. Good to have val be 45 - 75
 * #2 Aspect Ratio: Width of the render % by the Height of our render. set our habitable space for our render
 * #3 near: specifies the distance from the camera to the near clipping plane.
 * - Objects closer to the camera than this distance will not be rendered and will be clipped from the view.
 * - It is essential to set an appropriate near value to prevent objects from being cut off too close to the camera.
 * #4 far:  parameter specifies the distance from the camera to the far clipping plane.
 * - Objects farther away from the camera than this distance will not be rendered and will be clipped from the view.
 * - Setting an appropriate far value is crucial to optimize rendering performance and avoid rendering objects that are too far away from the camera.
 * ==================================================================================================================================================
 * OrthographicCamera: def (differs from PerspectiveCamera by it's lack of perspective.
 * Objects have the same size regardless of their distance to the camera)
 * parameters: instead of fov we provide how far the camera can see in each direction (left, right, top, bottom) then near and far
 * #1 left: The left parameter represents the coordinate of the left vertical clipping plane of the camera's view frustum.
 * #2 right: The right parameter represents the coordinate of the right vertical clipping plane of the camera's view frustum.
 * #3 top: The top parameter represents the coordinate of the top horizontal clipping plane of the camera's view frustum.
 * #4 bottom: The bottom parameter represents the coordinate of the bottom horizontal clipping plane of the camera's view frustum.
 * #5 near: The near parameter specifies the distance from the camera to the near clipping plane. Objects closer to the camera than
 * - this distance will not be rendered and will be clipped from the view.
 * #6 far: The far parameter specifies the distance from the camera to the far clipping plane. Objects farther away from the camera
 * - than this distance will not be rendered and will be clipped from the view.
 */

// PerspectiveCamera
const camera = new THREE.PerspectiveCamera(
  75, // 1
  sizes.width / sizes.height, // 2
  0.1, // 3
  100 // 4
);

/** //OrthographicCamera
// const aspectRatio = sizes.width / sizes.height;
// console.log(aspectRatio); //1.3333333333333333
// //the cube seems to be parallel and not so much a cube now it's compressed like a rectangular prism
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
 */
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
console.log(camera.position.length()); // 3.4641016151377544
camera.lookAt(mesh.position); // point at our mesh
scene.add(camera);

/**Controls
 * params:
 * #1 our camera to manipulare
 * #2 a dummy html object to center ourselves around for the controls
 * Target: controls.target.axes: The focus point of the controls, the .object orbits around this.
 * - It can be updated manually at any point to change the focus of the controls
 *
 * Update: Update the controls. Must be called after any manual changes to the camera's transform,
 * or in the update loop if .autoRotate or .enableDamping are set
 *
 * Damping: Set to true to enable damping (inertia), which can be used to give a sense of weight to the controls.
 * - Note that if this is enabled, you must call .update () in your animation loop (refer to our tick())
 * */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.target.y = 2
// controls.update();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime(); //Get the seconds passed since the clock started and sets .oldTime to the current time.

  // Update objects
  //   mesh.rotation.y = elapsedTime;

  // Update Camera
  //with this we hav full rotation with our max cursor val on whatever axess in this case our x axis
  // with sine and cosine we can achieve this also with the help of PI * 2 for our full rotation of our "circle"
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  //   camera.lookAt(mesh.position); //center our cam onto some mesh or vector based on our obj

  //   update controls

  controls.update(); //need to update our controls here for them to work honestly makes sense we do it here

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
