import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
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
 * Lights
 *
 * The AmbientLight applies omnidirectional lighting on all geometries of the scene.
 * @params The first parameter is the color and the second parameter is the intensity
 * As for the materials, you can set the properties directly when instantiating or you can change them after:
 * - If all you have is an AmbientLight you'll have the same effect as for a MeshBasicMaterial because all faces of the geometries will be lit equally.
 * Ambient Light:
 * LIGHT BOUNCING is NOT supported in Three.js. use a dim AmbientLight to fake this light bounce.
 * @params The first parameter is the color and the second is the intensity. (default color hex)
 * @params The second parameter is the intensity of the "rays". (default float max 1)
 *
 * The Directional Light:
 * has a sun-like effect as if the sun rays were traveling in parallel.
 * @params The first parameter is the color.
 * @params The second parameter is the intensity:
 * By default, the light seems to come from above.
 * To change this, move the whole light by using the position
 * property like if it were a normal object.
 * The distance of the light doesn't matter for now.
 * The rays come from an infinite space and travel
 * in parallel to the infinite opposite.
 * - CODE:
 *
 * HemisphereLight
 * The HemisphereLight is similar to the AmbientLight but with a different
 * color from the sky than the color coming from the ground. Faces facing
 * the sky will be lit by one color while another color will lit faces facing the ground
 * @params The first parameter is the color corresponding to the sky color
 * @params the second parameter is the groundColor.
 * @params the third parameter is the intensity:
 *
 * PointLight
 * The PointLight is almost like a lighter. The light source is infinitely
 * small, and the lightspreads uniformly in every direction.
 * @params The first parameter is the color.
 * @params the second parameter is the intensity.
 * By default, the light intensity doesn't fade. But you can control that fade distance
 * and how fast it is fading using the distance and decay properties. You can set those in the
 * parameters of the class as the third and fourth parameters, or in the properties of the instance:
 * @params the third parameter (distance) is the maximum range of the light. Default is 0 (no limit).
 * @params the fourth parameter (decay)The amount the light dims along the distance of the light. Expects a Float. Default 2
 *
 * RectAreaLight
 * this light works lik the big rectangle lights irl e.g. photo set. It's a mix between the directional and diffuse light.
 * The RectAreaLight only works with MeshStandardMaterial and MeshPhysicalMaterial.
 * You can then move the light and rotate it. To ease the rotation, use the lookAt(...) method:
 * @params the first parameter is the color naturally.
 * @params the second parameter is the intensity naturally.
 * @params the third is the width.
 * @params the fourth is the height
 *
 * SpotLight
 * works like a flashlight. It's a cone of light starting at a point and oriented in a direction. Here the list of its parameters:
 * Rotating our SpotLight is a little harder. The instance has a property named target, which is an Object3D. The SpotLight is always
 * looking at that target object. But if you try to change its position, the SpotLight won't budge:
 * adding the target (spotlight.target) to the scene will make it budge though.
 * @params Color: naturally.
 * @params intensity: strength of the emmitted light.
 * @params distance: the distancce at which the intensity drops to 0.
 * @params angle: how large is the beam.
 * @params penumbra: how diffused is the contour of the beam.
 * @params decay: how fast the light dims.
 *
 * Performance With Lighting
 * Lights are great and can be realistic if well used. The problem is that lights can cost a lot when it comes to performance.
 * The GPU will have to do many calculations like the distance from the face to the light, how much that face is facing the light,
 * if the face is in the spot light cone, etc. Try to add as few lights as possible and try to use the lights that cost less.
 *
 * Minimal Cost classes:
 * Ambient
 * Hemisphere
 *
 * Moderate Cost classes
 * Directional
 * PointLight
 *
 * High Cost classes
 * SpotLight
 * RectAreaLight
 *
 * Helpers
 * @params reference the light we want to correspond the light with
 * @params the second parameter allows us to change the size of the helper
 * To use them, simply instantiate those classes. Use the corresponding light as a parameter,
 * and add them to the scene. The second parameter enables you to change the helper's size:
 *
 * The RectAreaLightHelper is a little harder to use. Right now, the class isn't part of the THREE core variables.
 * You must import it from the examples dependencies as we did with OrbitControls:
 *
 * To assist us, we can use helpers. Only the following helpers are supported:
 * HemisphereLightHelper
 * DirectionalLightHelper
 * PointLightHelper
 * RectAreaLightHelper
 * SpotLightHelper
 *
 */

//CODE:
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);
directionalLight.position.set(1, 0.25, 0);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
//we can move the position of the light like any other object with the set method
/**@params instance.position.set(): x, y, z naturally */
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

//purple light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(rectAreaLight);

rectAreaLight.position.set(-1.5, 0, 1.5);

//A Vector3 without any parameter will have its x, y, and z to 0 (the center of the scene).
rectAreaLight.lookAt(new THREE.Vector3());

const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);

spotLight.target.position.x = -0.75;

scene.add(spotLight);
scene.add(spotLight.target); //refer to dedicated documents on this instance of the SpotLight class

spotLight.position.set(0, 2, 3);
scene.add(spotLight);
console.log(spotLight.position);

//Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//not a core THREE variable reference the dedicated documenting above.
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

//DEBUG UI
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
plane.side = THREE.DoubleSide;

scene.add(sphere, cube, torus, plane);

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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
