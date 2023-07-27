// Canvas
// console.log(THREE);

import * as THREE from "three"; //Thank god for npm

// Global Sizes for our view port (canvas) => size config object for our render and it's aspect ratio ratio formula later on 
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
    color: 0xff009, //red
  });
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial); //Mesh expects some geometry and some Mesh Material in this instance MeshBasicMaterial({})
  scene.add(cubeMesh); //Meshes need to be added to the scene with the scene.add() method
  
  // Camera(s) Important
  // our camera is not a model but a point of view
  // PerspectiveCamera first param is the value for the vertical field of view
  // small value amplitude is close up but the bigger the value the further away meaured in
  // second is the std aspect ratio formula width / height
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  
  //moves the camera backward into postion from the objects added. 
  // if we dont have this our camera and our objects are in the same position and everything is black and scary 
  // now we have lifted it on the z axis and this is just our camera position and how we can view our faces of our 3D cube
  camera.position.z = 3; // just with this position we see a face of our cube and it looks like a square
//   camera.position.x = 1; 
//   camera.position.y = 1; 
  scene.add(camera); 
  
  //Canvas
  //need our canvas here to configure our renderer
  const canvas = document.querySelector(".webgl");
  console.log(canvas);
  
  // Renderer Important
  // multiple renderes no just this one
  //draws triangles with THREE and WebGL triangles into our canvas for our geometry
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  //set the actual height of our render here not just our aspect ratio like before
  renderer.setSize(sizes.width, sizes.height); //height and width for our object in our viewport / our render
  renderer.render(scene, camera); //.render() really renders our elements and our camera  