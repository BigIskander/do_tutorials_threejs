// console.log("Three object here", THREE);
// Scene
const scene = new THREE.Scene(); // create the scene

// Camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1, // Near
    1000 // Far
);
scene.add(camera);
camera.position.z = 5; // move the camera back 5 units

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true}); // for smooth edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); // background color
document.body.appendChild(renderer.domElement); // add the renderer to our html

// Let there be Light!
// Ambient Light 
let ambientLight = new THREE.AmbientLight(0x101010, 1.0); // color, intensity, distance, decay
ambientLight.position = camera.position; // Light follows camera
scene.add(ambientLight);

// Directional Light
let sunLight = new THREE.DirectionalLight(0xdddddd, 1.0); // color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

let geometry = new THREE.BoxGeometry(1, 1, 1); // BoxGeometry is the shape of the object
let material = new THREE.MeshBasicMaterial({color: 0xff0000}); // color of the object
let cube = new THREE.Mesh(geometry, material); // create cube with geometry and material
scene.add(cube); // add cube to scene

// Renderer
renderer.render(scene, camera); //renders the scene