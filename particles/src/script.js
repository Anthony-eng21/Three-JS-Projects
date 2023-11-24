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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

/**
 * first particles
 *
 */

const particlesGeometry = new THREE.BufferGeometry();
const count = 50000;

const positions = new Float32Array(count * 3); // * by 3 each position is composed of 3 values (x, y, z)

// we can have different colors for every particle we just need to add a new attriburte 'colors' similar to position
// so we use add random numbers to our rgb values thats why we multiply by three than mutate the color property attribute on our
// elements (particles) in our scene
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  colors[i] = Math.random();
}

// create the THREE.js BufferAttribure and spencify that
// information is composed of 3 values (x, y, z)
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3)); // three to update the x y and z vertices on this attribute

const particleMaterials = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
});

// particleMaterials.color = new THREE.Color("#ff88cc"); singular color

// this is how we change the values for our color buffer attrible on our individual materials to change the color of each individual mesh elelments
particleMaterials.vertexColors = true;

particleMaterials.transparent = true;
particleMaterials.alphaMap = particleTexture;
/**
 * alphaTest
 * The alphaTest is a value between 0 and 1 that enables the WebGL
 * to know when not to render the pixel according to that pixel's transparency. By default, the
 * value is 0 meaning that the pixel will be rendered anyway. If we use a small value such as 0.001,
 *  the pixel won't be rendered if the alpha is 0:
 */

// particleMaterials.alphaTest = 0.001;

/**
 *  depthTest property
 * When drawing, the WebGL tests if what's being drawn is closer than what's already drawn
 * can cause bugs when other objects are introduced into our scene
 */

// particleMaterials.depthTest = false;

/**
 * depthWrite
 * WebGL is testing if what's being drawn is closer than what's already drawn.
 * The depth of what's being drawn is stored in what we call a
 * depth buffer. Instead of not testing if the particle is closer than what's in this depth buffer,
 * tell webgl not to write particles in that depth buffer so we pretty much just disable that funcionality disabling
 * this property on this material. This solves our problem with the opacity of the edges of our texture .png file
 */

particleMaterials.depthWrite = false;

// Blending
// this increases the blending (contrast) between the colored
// pixels in our png file and our pixels without color.
particleMaterials.blending = THREE.AdditiveBlending;

const particles = new THREE.Points(particlesGeometry, particleMaterials);

scene.add(particles);

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
 * Animating each point separately instead of all them in the same way pretty dope way
 * of doing this. We pretty mukkch update the vertices of each point so for 1 their x y z verts
 * to do this we have to update the right part in the position attribute becasys akk tge verts are
 * stored in a sing one dimensional array where each verticle is stored like this [x, y, z, etc...]
 * for each vertex jof our point geometries
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // i3 variable inside that goes 3 by 3 simply by multiplying i by 3.
  // The easiest way to simulate waves movement is to use a simple sinus. First,
  // we are going to update all vertices to go up and down on the same frequency.
  // The y coordinate can be access in the array at the index i3 + 1:
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime); all for the i3 + 1 === y vertices
    const x = particlesGeometry.attributes.position.array[i3]; //x position prease 0 iondex is x becasue x => '0' etc...
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
