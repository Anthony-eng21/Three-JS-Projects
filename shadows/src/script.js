import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Shadows
 * First we activate our Shadows with enabling shadowmap on our renderer / webgl renderer
 * Activate on our objects e.g. sphere, and or plane.
 * Then, we need to go through each object of the scene and decide if the object can cast a shadow
 * with the @property castShadow property, and if the object can receive shadow with the @property receiveShadow property.
 *
 * Shadow supported Lights
 * Finally, activate the shadows on the light with the castShadow property.Only the following types of lights support shadows:
 * PointLight
 * DirectionalLight
 * SpotLight
 *
 * Limitation
 * Sadly, at this point the shadow looks terrible. Let's try to improve it.
 *
 * Optimization
 * Three.js is doing renders called shadow maps for each light. You can access this shadow map
 * (and many other things)
 * using the shadow property on the light:
 * As for our render, we need to specify a size. By default, the shadow map size is only 512x512 for performance reasons.
 * We can improve it but keep in mind that you need a power of 2 value for the mipmapping:
 *
 * Near and far
 * Three.js is using cameras to do the shadow maps renders. Those cameras have the same properties as the cameras we already used.
 * This means that we must define a near and a far. It won't really improve the shadow's quality, but it might fix bugs where you can't see
 * the shadow or where the shadow appears suddenly cropped.
 * To help us debug the camera and preview the near and far, we can use a CameraHelper with the camera used for the shadow map located in the
 * directionalLight.shadow.camera property:
 * preview the near and far, we can use a CameraHelper class with the camera used for the shadow map located in the directionalLight.shadow.camera property:
 *
 * Amplitude
 * With the camera helper we just added, we can see that the camera's amplitude is too large.
 * Because we are using a DirectionalLight, Three.js is using an OrthographicCamera. If you remember
 * from the Cameras lesson, we can control how far on each side the camera can see with the top, right,
 * bottom, and left properties. Let's reduce those properties:
 */

/**
 * Shadow map algorithms
 * THREE.BasicShadowMap: Very performant but lousy quality
 * THREE.PCFShadowMap: Less performant but smoother edges
 * THREE.PCFSoftShadowMap: Less performant but even softer edges
 * THREE.VSMShadowMap: Less performant, more constraints, can have unexpected results
 */

/**
 * Baking Shadows
 * Three.js shadows can be very useful if the scene is simple, but it might otherwise become messy.
 * A good alternative is baked shadows. We talk about baked lights in the previous lesson and it is exactly
 * the same thing. Shadows are integrated into textures that we apply on materials. Instead of commenting all the
 * shadows related lines of code, we can simply deactivate them in the renderer and on each light:
 */

/**
 * Baking Shadow alternative for a more dynamic experience
 */

const textureLoadeer = new THREE.TextureLoader();
const simpleShadow = textureLoadeer.load("/textures/simpleShadow.jpg");

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

//Finally, activate the shadows on the light with the castShadow property.
scene.add(directionalLight);
directionalLight.castShadow = true; //our light can cast a shadow.
//A DirectionalLightShadow used to calculate shadows for this light
console.log(directionalLight.shadow);

// keep in mind that you need a power of 2 value for the mipmapping: this will make the shadow look nicer
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

//camera frustrum planes camera visibility
//The smaller the values, the more precise the
//shadow will be. But if it's too small, the shadows will just be cropped.
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

const directionalLightHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);

//visually see the near and far of the camera. Try to find a value that fits the scene:
scene.add(directionalLightHelper);

directionalLightHelper.visible = false; //hide our helper

//BLUR the shadow with its' radius property
directionalLight.shadow.radius = 10;

/**
 * spotlight
 * improve the shadow quality using the same techniques that we used for the directional light Change the shadow.mapSize:
 * Because we are now using a SpotLight, internally, Three.js is using a PerspectiveCamera. That means that instead of the
 * top, right, bottom, and left properties, we must change the fov property. Try to find an angle as small as possible without having
 * the shadows cropped:
 */
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

spotLightCameraHelper.visible = false;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.fov = 30;

spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 5;

/**
 * PoinLight
 */

const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 6;
const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightHelper.visible = false;
scene.add(pointLightHelper);

//
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
console.log(material);
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
//Try to activate these on as few objects as possible:
sphere.castShadow = true; //shadow caster

//Plane Mesh
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
//Try to activate these on as few objects as possible:
plane.receiveShadow = true; //shadow receiver

//Alternative to baked shadow 
//not so realistic but very performant shadow.
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow
  })
)
sphereShadow.rotation.x = - Math.PI * 0.5; //shadows' radius
sphereShadow.position.y = plane.position.y + 0.01; //set the shadow just above ouor plane 

scene.add(sphere, sphereShadow, plane);

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
camera.position.z = 2;
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//First, we need to activate the shadow maps on the renderer:
renderer.shadowMap.enabled = true;

// to use one of the shaddow algos we update the enabled property to type
//radius doesn't work with this algorithm
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Baked shadows now biotch
directionalLight.castShadow = false;
// ...
spotLight.castShadow = false;
// ...
pointLight.castShadow = false;
// ...
renderer.shadowMap.enabled = false;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //updating the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  //update the shadow 
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
