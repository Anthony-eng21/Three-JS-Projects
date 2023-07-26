// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene Important
const scene = new THREE.Scene();

// Object(s) Important 
// Red cube
// arguments for BoxGeometry (widthSegments , heightSegments, depthSegments ) optional and default to 1
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1); //access box geometry from the Three variable
const cubeMaterial = new THREE.MeshBasicMaterial({
  //pass a configuration object to MeshBasicMaterial. It can hold a lot of different values for making
  //our material for our object our color, texture etc
  color: "#ff0000", //red
});
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial); //Mesh expects some geometry and some Mesh Material in this instance MeshBasicMaterial({}) 
scene.add(cubeMesh); //Meshes need to be added to the scene with the scene.add() method

// Camera(s) Important 
// our camera is not a model but a point of view 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer Important
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
