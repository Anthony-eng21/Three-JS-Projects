import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import CANNON from "cannon";

/**
 * CANNON.JS PHYSICS WORLD
 * we need to create a two 'worlds' one is our threejs
 * experience then our physics is a second world and bridge the two.
 * gravity class sets up some gravity for our world @params world.set(vec1, vec2, vec3)
 * Y: -9.82 is the constant of the earth we can change this later but this is a good value to know
 */
//our 'physics world'
const world = new CANNON.World();

world.gravity.set(0, -9.82, 0);

/**
 * CANNON Materials
 * You can give it a name and associate it with a Body.
 * The idea is to create a Material for each
 * type of material you have in your scene.
 */

const defaultMaterial = new CANNON.Material("default");
/**
 * CANNON CONTACTMATERIALS
 * @params the materials to use to interact with eachother
 * @params object with two @properties friction & restitution default
 *
 */
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

world.addContactMaterial(defaultContactMaterial);

/**
 * CANNON Object
 * we need to make one of these because we have
 * a sphere in our threejs code but we need one here as well
 * Sphere is a primitive type in the CANNON library some others would be Box, Cylinder, Plane, etc. (Sphere is used here)
 * @param SphereClass raius of the sphere / same radius as our threejs sphere.
 */
// const sphereShape = new CANNON.Sphere(0.5);

// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   material: defaultMaterial,
// });

// applyLocalForce(...) to apply a small impulse on our sphereBody at the start:

/**
 * applied force to our sphere's body
 */
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );

// world.addBody(sphereBody);

world.defaultContactMaterial = defaultContactMaterial;

/** ----------------------
 * Floor CANNON OBJECT shape + body
 * if we want our object to be static we want
 * to make the mass 0 so that the floor doesn't
 * succumb to the world's gravity we set -9.82
 * -- Quaternion:
 * Quaternions are preferred in 3D computations for rotations because 
 * they don't suffer from gimbal lock and provide smooth interpolations. 
 * In your case, using quaternions ensures the rotation 
 * of the plane is stable and consistent.
 * -------------
 * Use CASE: 
 * We set the axis like if it was a spike going through 
 * the Body on the negative x axis (to the left relatively to the camera)
 * and we set the Angle to Math.PI * 0.5 (a quarter of a circle).
 * Rotating the Plane: To correct the orientation, 
 * you rotate the plane. You use a quaternion to define this rotation. 
 * By setting the rotation around the x-axis by 90 degrees (Math.PI * 0.5),
 * you effectively tilt the plane from facing the camera
 * to lying flat, like a floor.
 ---------------------- */

//another way to add these properties ig lol
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.material = defaultMaterial;
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Test sphere
// const sphere = new THREE.Mesh(
  //   new THREE.SphereGeometry(0.5, 32, 32),
  //   new THREE.MeshStandardMaterial({
    //     metalness: 0.3,
    //     roughness: 0.4,
    //     envMap: environmentMapTexture,
    //     envMapIntensity: 0.5,
    //   })
    // );
    // sphere.castShadow = true;
    // sphere.position.y = 0.5;
    // scene.add(sphere);
    */

// Convention to Automate with functions like this so we can just call this over and over again
/**
 * Cannon.js Body position to apply it to the Three.js Mesh position.
 * create an array of all objects that need to be updated.
 * Then we'll add the newly created Mesh
 * and Body inside an object to that array:
 */
// array to populate with objects containing the positions
const objectsToUpdate = []; // type: js array of js objects lel

/**
 * Optimize
 * ------------------ Short Explanation ------------------
 * The optimization involves creating a single instance
 * of THREE.SphereGeometry and THREE.MeshStandardMaterial
 * and reusing them for every sphere:
 * ------------------ Long Explanation -------------------
 * the geometry and the material of the Three.js Mesh are the same,
 * we should get them out of the createSphere function. The problem is
 * that we are using the radius to create our geometry. An easy
 * solution would be to fix the radius of
 * the SphereGeometry to 1 and then scale the Mesh:
 */
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const createSphere = (radius, position) => {
  //THREE MESH
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.scale.set(radius, radius, radius);
  mesh.position.copy(position);
  scene.add(mesh);

  // CANNON Physics object

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });

  body.position.copy(position);
  world.addBody(body);

  objectsToUpdate.push({ mesh, body });
  // We can now loop on that array inside the tick() function
  // (right after updating the world) and copy each
  // body.position to the mesh.position: (see tick function)
};

// initial call (removed because they render in the same spot as the box)
// createSphere(0.5, { x: 0, y: 3, z: 0 });

// ADDITION to LIL GUI

const debugObject = {};
debugObject.createSphere = () => {
  // createSphere(0.5, { x: 0, y: 3, z: 0 }); (isn't random and STACKS)
  //random radius and postioning
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};

gui.add(debugObject, "createSphere");

/**
 * Boxes
 * To create a box, we must use a BoxGeometry and a
 * Box shape. Be careful; the
 * parameters aren't the same. A BoxGeometry
 * needs a width, a height, and a depth.
 * In the meantime, a Box shape needs a
 * halfExtents. It is represented by a Vec3
 * corresponding to a segment that starts at the
 * center of the box and joining one of that box's corners:
 */

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const createBox = (width, height, depth, position) => {
  // THREE.JS OBJECT
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  //CANNON.JS OBJECT
  //shape
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  world.addBody(body);

  // Save in objects
  objectsToUpdate.push({ mesh, body });
};

createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 });

debugObject.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};

gui.add(debugObject, "createBox");

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  //Update Physics world

  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
  /**
   * step @params
   * delay,
   * dt,
   * iterations
   */
  world.step(1 / 60, deltaTime, 3);
  // console.log(sphereBody.position.y);

  // We can now loop on that array then copy each body.position to the mesh.position:
  // update the positions of the Three.js meshes based on the physics simulation:
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position); // Sync position
    
    /**
     * SYNC ROTATION
     * Update loop: Synchronizes Three.js Meshes with Cannon.js Bodies 
     * Fixes issue where boxes appeared to go through the floor due to lack of rotation in Meshes. 
     * Now, both position and rotation (quaternion) of the Bodies are copied to the Meshes, 
     * ensuring visual and physical consistency, especially noticeable with non-spherical objects.
     */
    object.mesh.quaternion.copy(object.body.quaternion); // Sync rotation
  }

  //update our three.js sphere's vectors by using our physics body object
  // sphere.position.copy(sphereBody.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
