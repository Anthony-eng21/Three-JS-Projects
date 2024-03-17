import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const gltfLoader = new GLTFLoader();

const dracoLoader = new DRACOLoader();

/** Draco Loading 
 * You can still load not compressed glTF file 
 * with the GLTFLoader and the Draco decoder
 * is only loaded when needed.
// 'separated' code (draco) we needed to copy it into
// our static folder to reference it but this
// is separated code from three.js and helps us
// with draco loading our binary models
*/
dracoLoader.setDecoderPath("/draco/");

gltfLoader.setDRACOLoader(dracoLoader);
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**load our gltfModel(s)

// other ways to load the model.

// gltfLoader.load(
//   '/models/Duck/glTF/Duck.gltf', // Default glTF

// // Or
// gltfLoader.load(
//   '/models/Duck/glTF-Binary/Duck.glb', // glTF-Binary

// // Or
// gltfLoader.load(
//   '/models/Duck/glTF-Embedded/Duck.gltf', // glTF-Embedded
*/

// Updates on our load callback function to get our 
// animation keyframes when we want to call
// the AnimationClip frames with our tick function
let mixer = null; 

/** Load Method
 * GLTFLoader.gltfLoader.load()
 * can add other callback here as arguments
 * after this first success function
 *
 */

gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
  console.log("success");
  console.log(gltf);

  /**Loading the Fox
   * Animations
   * - gltf.animations[AnimationClip] Object:
   * An AnimationClip is a reusable
   * set of keyframe tracks which represent an animation.
   * 😻😧 Not Easy to access we need two things
   * 1) THREE.AnimationMixer(): To play the animation, we must tell the mixer to update itself at each frame
   * AnimationMixer is like a player associated with an object
   * that can contain one or many AnimationClips. The idea is
   * to create one for each object that needs to be animated.
   * --
   * 2) AnimationMixer.mixer.clipAction()
   *  adds the AnimationClips to the mixer with the clipAction(...)
   *  method. Let's start with the first animation:
   *
   */
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);

  // We can now add the AnimationClips to the
  // mixer with the clipAction(...) method. Let's
  // start with the first animation:1
  const action = mixer.clipAction(gltf.animations[2]);

  // This method returns a AnimationAction, and we
  // can finally call the play() method on it:
  action.play();

  /**Loading the Duck
  // Adding the first child of the loaded model's scene to our scene
  // This approach assumes the first child is the desired object (e.g., the duck)
  // and ignores other elements like cameras or lights that might be in the model.
  // scene.add(gltf.scene.child[0]);
  */

  /* HELMET MODEL PROBLEM
   * this doesn't load all of the elements
   *  for (const child of gltf.scene.children) {
   *    scene.add(child);
   *  }
   */

  /** First Solution:
   * The first solution 
   * is to take the first
   * children of the loaded scene and add
   * it to our scene until there is none left:
   while (gltf.scene.children[0]) {
     scene.add(gltf.scene.children[0]);
    }
  */

  /* Second Solution:
   would be to duplicate the children array in 
   order to have an unaltered independent array. 
   To do that, we can use the spread operator ... and put the result in a brand new array []:
   CODE:
    const children = [...gltf.scene.children];
    for (const child of children) {
      scene.add(child);
    }
  */
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

  //UPDATE ANIMATION
  // To play the animation, we must tell the 
  // mixer to update itself at each frame.
  // update against our delta time fps
  // for our keyframes AnimationClips   
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
