import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//reference for Transforming objects with threejs
// /**
//  * Objects
//  */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff99 });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// /**
//  * Moving Objects with the position property on its given axis (x,y,z)
//  * STANDARD (to put after we add the given mesh to the scene and NOT before mesh initialization)
//  * declaration of our mesh position can be declared/initialized anywhere in our code before we render the given scene
//  * Measurements
//  * arbitrary amount of depth of field for z think in 1 irl measurement(s) kilometers cm etc
//  * */

// // OLD WAY of adding coords for our axes. set() on our postion property is faster to initialize
// // mesh.position.x = 0.7;
// // mesh.position.y = -0.6;
// // mesh.position.z = 1;

// /**
//  * Moving Objects
//  * with the VECTOR3 class
//  * this class just doesn't have properties for the xyz axes
//  * it has many METHODS for manipulating our 3d object with a Three dimensional vector
//  * to manipulate our object in space (CHECK DOCS FOR MORE INFO)
//  *- METHODS =>
//  * - length() method
//  *   console.log(mesh.position.length()); //distance from the center position of our scene and our object's / vector's postion
//  * - distanceTo() method
//  *   console.log(mesh.position.distanceTo()); // distance of the camera from the object
//  *   it's helpful for some expanse mechanics to know how far and gage how far we need to be on expansion
//  * - normalize()
//  *   The normalize() method in Three.js scales a 3D vector to have a length of 1 while preserving its direction.
//  *   It is commonly used to convert vectors into unit vectors, which simplifies various calculations
//  *   involving direction and magnitude in 3D graphics, such as lighting and camera transformations.
//  * - set()
//  *   the set() method in three.js can update all three axis for our rendered 3d object to different values from initial vals
//  * */

// /**
//  * Scale
//  * The object's local scale.
//  * In Three.js, mesh.scale is a property that represents the scaling transformation applied to a 3D mesh along the X, Y, and Z axes.
//  * The ._ (underscore) is a convention used to indicate that this property is a Vector3, which means it holds three numeric values, one for each axis,
//  * to control the scale factor in each direction.By modifying mesh.scale._, you can resize the mesh
//  * along the X, Y, and Z axes, affecting its overall size and appearance in the 3D scene.
// */
// // mesh.scale.x = 2;
// // mesh.scale.y = 0.5;
// // mesh.scale.z = 0.5;
// mesh.scale.set(2, 0.5, 0.5); //faster initialization with the set() method on the scale property

// /**
//  * Rotation of Objects
//  * - rotation has x y z properties and it's also a Euler. when you change the x y z properties
//  *  you can imagine putting a stick through your objects center in the axis's
//  *  direction and then rotating that object on that Euler stick
//  *  PI is good # for making rotations and for full rotations will it's (PI * 2)
//  *  Math.PI => approximation of PI more accurate than double PI {3.14159};
//  *
//  * rotation.reorder() method
//  * In Three.js, the reorder() method is used to adjust the order of Euler rotations applied to an object's rotation property.
//  * When applying multiple rotations, the order in which they are applied can affect the final orientation of the object.
//  * The reorder() method ensures that the rotations are applied in the desired order, such as "XYZ," "YXZ," "ZXY," etc.,
//  * to achieve the desired orientation of the object in 3D space. reorder() before we change the axis properties.
//  *
//  * Quarternion also expresses a rotation, but in a more mathematical way (very complex) just remember when we change the rotation it also
//  * updates the Quartenion and vice versa for the Quaternion for the rotaion axis values
// */
// mesh.rotation.reorder('YXZ'); //y before x
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// // Changing Position refer to Moving Objects
// // better than initializing all the properties in our mesh.position x | y | z (args go as x y z axes)
// // doesn't matter when we set these values really unless when it does like above ^
// mesh.position.set(0.7, -0.6, 1);

/**
 * Groups
 * makes it easier for us to manipulate many joined objects under one big group object
 */
const group = new THREE.Group(); //group class
// group.position.y = 1;
group.scale.y = 3;
group.rotation.y = 1
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0xff00000,
  })
); //Mesh class

//add cube to the group object and not the scene itself

group.add(cube1);

//cube 2
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  })
); //Mesh class

cube2.position.set(-2, 0, 0); //move the overlapped cube2 with it's postion property
//add cube to the group object and not the scene itself
//cube 2
group.add(cube2);

//cube3
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: "goldenrod",
  })
); //Mesh class

cube3.position.set(2, 0, 0); //move the overlapped cube3 with it's postion property
//add cube to the group object and not the scene itself
//cube 2
group.add(cube3);

/**
 * AXES HELPER
 *   The AxesHelper in Three.js is a visual aid that displays three lines representing the three main axes (X, Y, and Z) in a 3D scene.
 *   Each axis is colored differently (X is red, Y is green, and Z is blue), making it easy to visualize the orientation
 *   and positioning of objects within the scene.
 *   The AxesHelper is useful for debugging, understanding spatial relationships, and aligning objects during the development of 3D applications.
 *   depending on the position of the camera some axes initially don't appear but we simply just aren't positioned on the camera to the see that axis line
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
 * lookAt() method will rotate an object to face a point in the world space / scene.
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// camera.lookAt(mesh.position); //look directly at this vector three Object mesh in our scene and target it with it's position property

// need to declare after initalization of the camera here for scope reasons
// console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
