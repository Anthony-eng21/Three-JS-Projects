import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

THREE.ColorManagement.enabled = false; //added line

/**Textures
 * One TextureLoader can load multiple textures
 * we can add three additional cb functions to our load function after the path 1 load 2 progress 3 error
 * // when the image loads successfully
  // () => {
  //   console.log("load");
  // },
  // // when the loading is progressing
  // () => {
  //   console.log("progress");
  // },
  // error if something went wrong
  // () => {
  //   console.warn("error");
  // }
 */

/**  loading images with native js :
  const image = new Image(); // init an instance of the Image() class
  const texture = new THREE.Texture(image); //no mo problems with our scope if this is global 
  image.onload = () => { //cb
  texture.needsUpdate = true; // create the texture outside of the fn and update it once the image is loaded with needsUpdate = true
 };
 
 // image.src = "/textures/door/color.jpg";
 *  */

/**
 * We can use LoadingManager\
 * to mutualize the events. it's useful if we want to know the global loading progress or be informed when everything is loaded
 */
const loadingManager = new THREE.LoadingManager();

//alert us about loading events i.e loading progress and error
// loadingManager.onStart = () => {
//   console.log("onStart");
// };

// loadingManager.onLoad = () => {
//   console.log("onLoaded");
// };

// loadingManager.onProgress = () => {
//   console.log("onProgress");
// };

/**using the TextureLoader class */
const textureLoader = new THREE.TextureLoader(loadingManager);
// using the textureLoader load method to load our image based on it's path
// loading multiple textures to our load method that are onProgress textures added to our load method on our textureLoader class
const colorTexture = textureLoader.load("/textures/minecraft.png");
// const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const heightTexture = textureLoader.load("/textures/door/height.jpg");
// const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

//we can repeat the texture by using the repeat property it's a vector2 with a x and y property for the axes
//How much a single repetition of the texture is offset from the beginning, in each direction U and V.
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// This defines how the Texture is wrapped horizontally and corresponds to U in UV mapping.
// colorTexture.wrapS = THREE.MirroredRepeatWrapping //With MirroredRepeatWrapping the texture will repeats to infinity, mirroring on each repeat.
// This defines how the Texture is wrapped vertically and corresponds to V in UV mapping.
// colorTexture.wrapT = THREE.MirroredRepeatWrapping  //With MirroredRepeatWrapping the texture will repeats to infinity, mirroring on each repeat.

// /**Offset */
// colorTexture.offset.x = 0.5 //How much a single repetition of the texture is offset from the beginning, in each direction U and V
// colorTexture.offset.y = 0.5

/**Rotate
 * The point around which rotation occurs.
 */
// colorTexture.rotation = Math.PI * 0.25 //1/8th rotation on our texture
// //change the rotation pivot to the center of our geometry
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

/**Mipmapping (or "mip mapping" with a space)
 * is a technique that consists of creating half a smaller version of a texture again and again until you get a 1x1 texture.
 * All those texture variations are sent to the GPU, and the GPU will choose the most appropriate version of the texture.
 * Three.js and the GPU already handle all of this, and you can just set what filter algorithm to use.
 * There are two types of filter algorithms: the minification filter and the magnification filter.
 * */

// NearestFilter returns the value of the texture element that is nearest (in Manhattan distance) to the specified texture coordinates.

// LinearFilter returns the weighted average of the four texture elements that are closest to the specified texture coordinates, 
// and can include items wrapped or repeated from other parts of a texture, depending on the values of wrapS and wrapT, and on the exact mapping.

// minfilter: How the Texture is sampled when a texel covers less than one pixel. blends with other pixels
// magFilter: How the Texture is sampled when a texel covers more than one pixel.
//deactive the mipmaps generation here cause we do it manually adn is good for performance
colorTexture.generateMipmaps = false; //Whether to generate mipmaps, (if possible) for a texture.

/**Texture format and optimisation 
 * 3 things to keep in mind when preparing our textures
 * The weight : jpg or png (jpg is more lightweight)
 * The size (or the resolution) : Each pixel of the texture wil have to be stored on the gpu regardless of the image's weight but gpu has storage limitations
 * - mipmapping doent help when increasing the amount of pixels so the height and width need to be able to be divide by 2 / pow(2) and 2 over and over agin until we have 1 x 1 
 * - some safe dimensions 512x512 1024x1024 512x2048 for mipmapping
 * the data. like the image format png can change transparency normal textures are pngs 
 */
colorTexture.magFilter = THREE.NearestFilter;


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const geometry = new THREE.ConeGeometry(1, 1, 32);
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100);

/**UV Unwrapping
 * without the texture is being stretched or awueezed in different ways to cover the geometry
 * UV Unwrapping is like unwrapping an origami or a candy wrapper to make it flat
 * Each vertex will have a 2D coordinate on a flat plane (usually a square)
 */

const geometry = new THREE.BoxGeometry(1, 1, 1);
//float32BufferAttribute [0,1] for each two vals thats a vertex so it's a Vector2 and the coordinates help align the texture to the geometry and are generated by THREE.js
// console.log(geometry.attributes.uv);
//Add texture to the material

const material = new THREE.MeshBasicMaterial({
  map: colorTexture, //replace the color with mapping our texture
  // wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; //added line
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
