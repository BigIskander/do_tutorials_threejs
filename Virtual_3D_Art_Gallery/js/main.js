import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

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
ambientLight.position.set(camera.position.x, camera.position.y, camera.position.z); // Light follows camera
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
// document.addEventListener("keydown", onKeyDown, false);

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
const wallGroup = new THREE.Group(); // create a group to hold the walls
scene.add(wallGroup);

// Front Wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshBasicMaterial({color: "green"})
);

frontWall.position.z = -20;

// Left Wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshBasicMaterial({
        color: "red"
    })
);

leftWall.rotation.y = Math.PI / 2; // this is 90 degrees
leftWall.position.x = -20;

// Right Wall
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshBasicMaterial({
        color: "yellow"
    })
);

rightWall.rotation.y = Math.PI / 2; // this is 90 degrees
rightWall.position.x = 20;

wallGroup.add(frontWall, leftWall, rightWall);

// Leep through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
    wallGroup.children[i].BBox = new THREE.Box3();
    wallGroup.children[i].BBox.setFromObject(wallGroup.children[i]);
}

// check if the player intersects the wall
function checkCollision() {
    const playerBoundingBox = new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPosition);
    playerBoundingBox.setFromCenterAndSize(
        cameraWorldPosition,
        new THREE.Vector3(1, 1, 1)
    );

    for (let i = 0; i < wallGroup.children.length; i++) {
        const wall = wallGroup.children[i];
        if (playerBoundingBox.intersectsBox(wall.BBox)) {
            return true;      
        }
    }

    return false;
}

// Create the ceiling
const ceilingGeometry = new THREE.PlaneGeometry(50, 50); // BexGeometry is the shape of the object
const ceilingMaterial = new THREE.MeshBasicMaterial({
    color: "blue"
});
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

ceilingPlane.rotation.x = Math.PI / 2; // this is 90 degrees
ceilingPlane.position.y = 12;

scene.add(ceilingPlane);

function createPainting(imageURL, width, height, position) {
    const textureLoader = new THREE.TextureLoader();
    const paintingTexture = textureLoader.load(imageURL);
    const paintingMaterial = new THREE.MeshBasicMaterial({
        map: paintingTexture,
    });
    const paintingGeometry = new THREE.PlaneGeometry(width, height);
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
    painting.position.set(position.x, position.y, position.z);
    return painting;
}

const painting1 = createPainting("artworks/0.jpg", 10, 5, new THREE.Vector3(-10, 5, -19.99));
// scene.add(painting1);

const painting2 = createPainting("artworks/1.jpg", 10, 5, new THREE.Vector3(10, 5, -19.99));
scene.add(painting1, painting2);

// Controls
const controls = new PointerLockControls(camera, document.body);

// Lock the pointer (controls are activated) and hide the menu when the experience starts
function startExperience() {
    // Lock the pointer
    controls.lock();
    // Hide the menu
    hideMenu();
}

const playButton = document.getElementById("play_button");
playButton.addEventListener("click", startExperience);

// Hide menu
function hideMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = 'none';
}

// Show menu
function showMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = 'block';
}

controls.addEventListener('unlock', showMenu);

// object to hold the keys pressed
const keyPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
};

// Event Listener for when we press the keys
document.addEventListener(
    'keydown',
    (event) => {
        if (event.key in keyPressed) {
            keyPressed[event.key] = true;
        }
    },
    false
);

// Event Listener for when we release the keys
document.addEventListener(
    'keyup',
    (event) => {
        if (event.key in keyPressed) {
            keyPressed[event.key] = false;
        }
    },
    false
);

const clock = new THREE.Clock();

function updateMovement(delta) {
    const moveSpeed = 5 * delta;
    const preveousPosition = camera.position.clone();

    if(keyPressed.ArrowRight || keyPressed.d) {
        controls.moveRight(moveSpeed);
    }
    if(keyPressed.ArrowLeft || keyPressed.a) {
        controls.moveRight(-moveSpeed);
    }
    if(keyPressed.ArrowUp || keyPressed.w) {
        controls.moveForward(moveSpeed);
    }
    if(keyPressed.ArrowDown  || keyPressed.s) {
        controls.moveForward(-moveSpeed);
    }

    if(checkCollision()) {
        camera.position.set(preveousPosition.x, preveousPosition.y, preveousPosition.z);
    }
}

// // function when a key is pressed, execute this function
// function onKeyDown(event) {
//     let kyecode = event.which;

//     // right arrow key
//     if(kyecode === 39 || kyecode === 68) {
//         controls.moveRight(0.08);
//     }
//     // left arrow key
//     else if(kyecode === 37 || kyecode === 65) {
//         controls.moveRight(-0.08);
//     }
//     // up arrow key
//     else if(kyecode === 38 || kyecode === 87) {
//         controls.moveForward(0.08);
//     }
//     // down arrow key
//     else if(kyecode === 40 || kyecode === 83) {
//         controls.moveForward(-0.08);
//     }
// }

let render = function () {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // Renderer
    const delta = clock.getDelta();
    updateMovement(delta);
    renderer.render(scene, camera); //renders the scene

    // requestAnimationFrame(render);
};

// render();
renderer.setAnimationLoop(render);