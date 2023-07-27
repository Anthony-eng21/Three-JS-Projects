import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff99 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Moving Objects with the position property on its given axis (x,y,z)
 * STANDARD (to put after we add the given mesh to the scene and NOT before mesh initialization)
 * declaration of our mesh position can be declared/initialized anywhere in our code before we render the given scene
 * Measurements
 * arbitrary amount of depth of field for z think in 1 irl measurement(s) kilometers cm etc
 * */

// OLD WAY of adding coords for our axes. set() on our postion property is faster to initialize
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;

/**
 * Moving Objects
 * with the VECTOR3 class
 * this class just doesn't have properties for the xyz axes
 * it has many METHODS for manipulating our 3d object with a Three dimensional vector
 * to manipulate our object in space (CHECK DOCS FOR MORE INFO)
 *- METHODS =>
 * - length() method
 *   console.log(mesh.position.length()); //distance from the center position of our scene and our object's / vector's postion
 * - distanceTo() method
 *   console.log(mesh.position.distanceTo()); // distance of the camera from the object
 *   it's helpful for some expanse mechanics to know how far and gage how far we need to be on expansion
 * - normalize()
 *   The normalize() method in Three.js scales a 3D vector to have a length of 1 while preserving its direction.
 *   It is commonly used to convert vectors into unit vectors, which simplifies various calculations
 *   involving direction and magnitude in 3D graphics, such as lighting and camera transformations.
 * - set()
 *   the set() method in three.js can update all three axis for our rendered 3d object to different values from initial vals
 * */

// better than initializing all the properties in our mesh.position.x | y | z (args go as x y z axes)
mesh.position.set(0.7, -0.6, 1);

/**
 * Scale
 * In Three.js, mesh.scale is a property that represents the scaling transformation applied to a 3D mesh along the X, Y, and Z axes.
 * The ._ (underscore) is a convention used to indicate that this property is a Vector3, which means it holds three numeric values, one for each axis,
 * to control the scale factor in each direction.By modifying mesh.scale._, you can resize the mesh
 *  along the X, Y, and Z axes, affecting its overall size and appearance in the 3D scene.
 */
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
mesh.scale.set(2, 0.5, 0.5); //faster initialization with the set() method on the scale property

/**
 * Rotation of Objects
 * - Euler
 * 
 */
mesh.rotation

/**
 * AXES HELPER
 * The AxesHelper in Three.js is a visual aid that displays three lines representing the three main axes (X, Y, and Z) in a 3D scene.
 * Each axis is colored differently (X is red, Y is green, and Z is blue), making it easy to visualize the orientation
 * and positioning of objects within the scene.
 * The AxesHelper is useful for debugging, understanding spatial relationships, and aligning objects during the development of 3D applications.
 * depending on the position of the camera some axes seem null but we simply just aren't positioned on the camera to the see that axis line
 * */

const axesHelper = new THREE.AxesHelper(); //arg is the size of the helper default is one but we can scale it 2x 3x etc
scene.add(axesHelper); //ALWAYS add our objects to the given scene

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

scene.add(camera);

// need to declare after initalization of the camera here for scope reasons
console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
