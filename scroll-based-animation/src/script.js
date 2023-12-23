import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#c57282",
};

// listen to the change event on the already existing tweak and
// update the material accordingly without this it doesn't work
gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
scene.add(directionalLight);

//gradient texture

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * material
 * mesh toon only works with lighting else it looks black
 */

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

/**
 * Meshes
 */
// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

scene.add(mesh1, mesh2, mesh3);
// By default, in Three.js, the field of view is vertical. This means that if you put one object on the top part
// of the render and one object on the bottom part of the render and then you resize the window, you'll notice
// that the objects stay put at the top and at the bottom.
// mesh1.position.y = 2
// mesh1.scale.set(0.5, 0.5, 0.5)

// mesh2.visible = false

// mesh3.position.y = - 2
// mesh3.scale.set(0.5, 0.5, 0.5)

// makes sure that each object is far enough away from the other on the y axis
const objectDistance = 5; //for positoning our geometries
// The values must be negative so that the objects go down:
mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectDistance * 0.5 -
    Math.random() * objectDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height); // calculates our next section

  console.log(newSection);

  if (newSection != currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }

  // console.log(scrollY)
});

/**
 * Parallax
 *
 */

/**
 * Cursor
 */

const cursor = {};
cursor.x = 0;
cursor.y = 0;

//mousemove
// the camera will be able to go as much on the left as on the right
// instead of a value going from 0 to 1 it's better to have a value going from -0.5 to 0.5 for our view-port
// for a more centered experience because 1 is basically left 0 (css for reference)
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;

  // console.log(cursor);
});

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

//group

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // this makes our background of our page transparent
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // console.log(deltaTime);

  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  // //animate our camera
  const parallaxX = cursor.x * 0.5;
  // invert the y axis if positive then it feels kind of inverted and we want this to follow the cursor
  const parallaxY = -cursor.y * 0.5;
  // EASING
  // less clunky and more realistic for
  // On each frame, the camera will get a little closer to the destination. But, the closer it gets,
  // the slower it moves because it's always a 10th of the actual position toward the target position.
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  //permanent rotation

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
