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
const ambientLight = new THREE.AmbientLight(0x101010, 1.0); // color, intensity, distance, decay
ambientLight.position = camera.position; // Light follows camera
scene.add(ambientLight);

// Directional Light
const sunLight = new THREE.DirectionalLight(0xdddddd, 1.0); // color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

let geometry = new THREE.BoxGeometry(1, 1, 1); // BoxGeometry is the shape of the object
let material = new THREE.MeshBasicMaterial({color: 0xff0000}); // color of the object
let cube = new THREE.Mesh(geometry, material); // create cube with geometry and material
scene.add(cube); // add cube to scene

// Controls
// Event listener for when we press the keys
document.addEventListener("keydown", onKeyDown, false);

// Texture of the floor
const floorTexture = new THREE.TextureLoader().load("img/Floor.jpg");

// Create the floor plane.
const planeGeometry = new THREE.PlaneGeometry(50, 50); // BoxGeometry is the shape of the object
const planeMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
});

const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);

floorPlane.rotation.x = Math.PI / 2; // this is 90 degrees
floorPlane.position.y = -Math.PI; // this is 180 degrees

scene.add(floorPlane); // add the floor to the scene

// Create the walls
// const wallGroup = 

// function when a key is pressed, execute this function
function onKeyDown(event) {
    let kyecode = event.which;

    // right arrow key
    if(kyecode === 39) {
        camera.translateX(-0.05);
    }
    // left arrow key
    else if(kyecode === 37) {
        camera.translateX(0.05);
    }
    // up arrow key
    else if(kyecode === 38) {
        camera.translateY(-0.05);
    }
    // down arrow key
    else if(kyecode === 40) {
        camera.translateY(0.05);
    }
}

let render = function () {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // Renderer
    renderer.render(scene, camera); //renders the scene

    // requestAnimationFrame(render);
};

// render();
renderer.setAnimationLoop(render);