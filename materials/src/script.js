import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

THREE.ColorManagement.enabled = false;
const gui = new dat.GUI();

/**
 * Textures
 */

//Class for loading a texture. Unlike other loaders, this one emits events instead of using predefined callbacks. So if you're interested in getting notified when things happen, you need to add listeners to the object i.e load()
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
//matcaps
// const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
// const matcapTexture = textureLoader.load('/textures/matcaps/2.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/4.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/6.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
//gradients
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**INST.BASICMATERIAL
const material = new THREE.MeshBasicMaterial(/*{ map: doorColorTexture }**\);

//ADDITIONAL mutable properties of the MeshBasicMaterial class (AS material)

//MAP property applys a texture on the surface of the geometry
// material.map = doorColorTexture

//WIREFRAME property how the triangles that compose your geometry with a thin line
//of 1px regardless of the distance of the camera
// material.wireframe = true; //we know this one lol

//Color
// The color property will apply a uniform color on the surface of the geometry.
// always instanciate this THREE Color class
// material.color = new THREE.Color("grey");
// Combining color and map: (texture) will tint the texture with the color

//Opacity
// set the transparent property to true to inform
// Three.js that this material now supports transparency
// material.transparent = true;
// material.opacity = 0.5;

//AlphaMap 
// Now that the transparency is working, we can use the 
// alphaMap property to control the transparency with a texture
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

//Side
// The side property lets you decide which side of a face is visible.
// By default, the front side is visible (THREE.FrontSide), 
// but you can show the backside instead (THREE.BackSide) or both (THREE.DoubleSide):
// material.side = THREE.DoubleSide

//objects with a SHARED MATERIAL
*/

/**INST. MeshNormalMaterial
 * 
//The MeshNormalMaterial displays a nice purple, blueish, greenish color
// that looks like the normal texture we saw in the Textures lessons.
// That is no coincidence because both are related to what we call normals
// Normals are information encoded in each vertex that contains the direction of the outside of the face.
// If you displayed those normals as arrows, you would get straight lines coming out of each vertex that composes your geometry.

const material = new THREE.MeshNormalMaterial();
material.side = THREE.DoubleSide;
//flatShading will flatten the faces, meaning that the normals won't be interpolated between the vertices.
// Laymans:(shader wont combine pretty much on the verteces)
material.flatShading = true;
*/

/**INST. MeshMatcapMaterial
 * 
// MeshMatcapMaterial is a fantastic material because of how great it can look while being very performant.
// For it to work, the MeshMatcapMaterial needs a reference texture that looks like a sphere.
const material = new THREE.MeshMatcapMaterial();
material.side = THREE.DoubleSide;
material.flatShading = true;

//matcap: The material will then pick colors on the texture according to the normal orientation relative to the camera.
// To set that reference matcap texture, use the matcap property:
// The meshes will appear illuminated, but it's just a texture that looks like it.
// The only problem is that the illusion is the same regardless of the camera orientation.
// Also, you cannot update the lights because there are none.
material.matcap = matcapTexture;
*/

/**Inst. MeshDepthMaterial
 *
//The MeshDepthMaterial will simply color the geometry in white if it's close to the camera's near value
// and in black if it's close to the far value of the camera:
// You can use this material for special effects where you need to know how far the pixel is from the camera.
const material = new THREE.MeshBasicMaterial();
material.side = THREE.DoubleSide;
*/

/**inst MeshLambertMaterial
 * MeshLambertMaterial supports the same properties as the MeshBasicMaterial
 * but also some properties related to lights.
 * most performant material that uses lights
 * Unfortunately, the parameters aren't convenient,
 * and you can see strange patterns
const material = new THREE.MeshLambertMaterial();
material.side = THREE.DoubleSide;
*/

/**Inst MeshPhongMaterial 
 * 
//The MeshPhongMaterial is very similar to the
// MeshLambertMaterial, but the strange patterns are less visible,
// and you can also see the light reflection on the surface of the geometry:
const material = new THREE.MeshPhongMaterial();
//You can control the light reflection with the shininess property.
// The higher the value, the shinier the surface.
// You can also change the color of the reflection by using the specular property
// The light reflection will have a blue-ish color.
material.shininess = 100;
material.specular = new THREE.Color(0x1188ff);
*/

/**Inst MeshToonMaterial 
 * 
//The MeshToonMaterial is similar to the MeshLambertMaterial
// in terms of properties but with a cartoonish style:
// By default, you only get a two parts coloration (one for the shadow and one for the light).
const material = new THREE.MeshToonMaterial();
material.side = THREE.DoubleSide
//to add more steps to the coloration, you can use
// the gradientMap property and use the gradientTexture
material.gradientMap = gradientTexture; //this alone does nothing due to mpmapping and the textures pixel size
//added code to make this work
gradientTexture.minFilter = THREE.NearestFilter; //How the Texture is sampled when a texel covers less than one pixel.
gradientTexture.magFilter = THREE.NearestFilter; //How the Texture is sampled when a texel covers more than one pixel.
//Using THREE.NearestFilter means that we are not using the mip mapping, we can deactivate it with gradientTexture.generateMipmaps = false
gradientTexture.generateMipmaps = false;
*/

/**Inst MeshStandardMaterial
 *
//A standard physically based material, using Metallic-Roughness workflow.
const material = new THREE.MeshStandardMaterial();
material.side = THREE.DoubleSide;
// material.metalness = 0.65;
// material.roughness = 0.45;

// material.flatShading = true;

//The map property allows you to apply a simple texture.
material.map = doorColorTexture;

//The aoMap property (literally "ambient occlusion map") will add shadows where the texture is dark.
// Add the aoMap using the doorAmbientOcclusionTexture texture and control the intensity using the aoMapIntensity property
// The crevices should look darker, which creates contrast and adds dimension.
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;

//The displacementMap property will move the vertices to create true relief:
// Long explanation: The displacement map affects the position of the mesh's vertices. Unlike other maps which only affect the
// light and shade of the material the displaced vertices can cast shadows, block other objects, and otherwise act as real geometry.
// The displacement texture is an image where the value of each pixel (white being the highest) is mapped against, and repositions, the vertices of the mesh.
material.displacementMap = doorHeightTexture;
//insider: It should look terrible. That is due to the lack of vertices on our geometries (we need more subdivisions) and the displacement being way too strong:
// displacementScale: How much the displacement map affects the mesh (where black is no displacement, and white is maximum displacement). Without a displacement map set, this value is not applied. Default is 1.
material.displacementScale = 0.05;

//Instead of specifying uniform metalness and roughness for the whole geometry, we can use metalnessMap and roughnessMap:
material.roughnessMap = doorRoughnessTexture; //The green channel of this texture is used to alter the roughness of the material.
material.metalnessMap = doorMetalnessTexture; //The blue channel of this texture is used to alter the metalness of the material.

//The normalMap will fake the normal orientation and add details on the surface regardless of the subdivision:
material.normalMap = doorNormalTexture;

//You can change the normal intensity with the normalScale property. Be careful, it's a Vector2:
material.normalScale.set(0.5, 0.5);

material.transparent = true;
material.alphaMap = doorAlphaTexture;
*/

// Instantiate the CubeTextureLoader before instantiating the material
const cubeTextureLoader = new THREE.CubeTextureLoader()

// Cube environment maps are 6 images with each one corresponding to a side of the environment.
// To load a cube texture, you must use the CubeTextureLoader instead of the TextureLoader.
// call its load(...) method but use an array of paths instead of one path:
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
])

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.side = THREE.DoubleSide
//To add the environment map to our material, we must use the envMap property. Three.js only supports cube environment maps.
//You can now use the environmentMapTexture in the envMap property of your material:
material.envMap = environmentMapTexture;


/**
 * debug ui
 */
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

/**
 * 3D Objects
 */

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5; //moved her

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5; //moved her

scene.add(sphere, plane, torus); //add multiple 3d objects like this

/**
 * lights
 */
//Inst AmbientLight class
// The following materials need lights to be seen. Let's add two simple lights to our scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); //args: color of the light and the intensity of the light
scene.add(ambientLight);

//inst PointLight class
// Creates a new PointLight.
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 2;
pointLight.position.z = 4;

scene.add(pointLight);

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
  //how many seconds spent since last refresh (how we can keep track of our animations)
  const elapsedTime = clock.getElapsedTime();

  //Update objects

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
