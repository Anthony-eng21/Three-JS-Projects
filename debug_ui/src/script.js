import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "lil-gui"; //import like this so it can match the course code but it's lil-gui (drop-in replacement)

/**
 * Debug UI
- There are different types of elements you can add to that panel:
 * Range —for numbers with minimum and maximum value
 * Color —for colors with various formats
 * Text —for simple texts
 * Checkbox —for booleans (true or false)
 * Select —for a choice from a list of values
 * Button —to trigger functions
 * Folder —to organize your panel if you have too many elements
 * 
 * Colors: 
 * Handling colors is a little harder.
 * First, we need to use addColor(...) instead of add(...). 
 * This is due to Dat.GUI not being able to know if you want to tweak a text, 
 * a number or a color just by the type of the property.
 */

/**Colors extended
 * Secondly, you'll have to create an intermediate object with the color in its properties
 * and use that property in your material. That is due to the Three.js material not having
 * a clean and accessible value like #ff0000.
 * Actually, because we are using lil-gui instead of Dat.GUI, we can use addColor(...) directly on the material.
 * But since the technique we are going to see can be used in other cases, we are going to see it anyway.
 *
 * ---------------------------------------------------------------------------
 * Then, after instantiating your gui variable, add the following tweak:
 * gui.addColor(parameters, 'color')
 * ---------------------------------------------------------------------------
 * Added Functions
 * To trigger a function, like the color value, we must add that function to an object.
 * We can use the parameters object we created earlier to add a spin property containing
 * the function that will animate the cube:
 */

const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 }); //full rotation on y axis using GSAP
  },
};

const gui = new dat.GUI(); //adds empty panel

// Added color tweak
/**
 * You should see a color picker in your panel. The problem is that changing this color doesn't affect the material.
 * It does change the color property of the parameter variable,
 * but we don't even use that variable in our material.
 * To fix that, we need lil.GUI to alert us when the value changed. We can do that by chaining the onChange(...)
 * method and updating the material color using material.color.set(...).
 * This method is very useful because of how many formats you can use like '#ff0000', '#f00', 0xff0000 or even 'red':
 */
gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});


// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
*/
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: parameters.color, //changing this to our default params object val
  // wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/** Debug added tweaks
 * gui.add() Adds a controller to the GUI, 
 * inferring controller type using the typeof operator.
 * --------------------------------------------------------
 * -Added slider range.
 * A range should appears in the panel.
 * Try to change it and watch the cube moving accordingly.
 * To specify the minimum value,
 * the maximum value and the precision/step,
 * you can set them in the parameters:
 * referenced mesh obj (position property), axes position, min, max, and step
 * gui.add(mesh.position, "y", -3, 3, 0.1);
 * ----------------------------------------------
 * Using and Chaining Methods
 * gui.add(mesh.position, "y").min(-3).max(3).step(0.01)
 * To change the label, use the the name(...) method
 * -----------------------------------------------
 * visibility
 * lil.GUI will automatically detect what kind of property
 * you want to tweak and use the corresponding element.
 * A good example is the visible property of Object3D.
 * It is a boolean that, if false, will hide the object
 * gui.add(mesh, "visible");
 * As you can see, lil.GUI chose a checkbox
 * because the visible property is a boolean.
 * ----------------------------------------------
 * We can do the same with the wireframe property of the material:
 * gui.add(material, "wireframe"); added to our material NOT OUR MESH
 * */

//we can also chain methods directly after the gui.add() method like so
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");

gui.add(mesh, "visible");
gui.add(material, "wireframe");
/**
 * To trigger a function, like the color value, we must add that function to an object.
 * We can use the parameters object we created earlier to add a spin property containing
 * the function that will animate the cube: */
gui.add(parameters, "spin");

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
