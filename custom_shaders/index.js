import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

function load_shader(file_url) {
    return new Promise((resolve, reject) => {
        try {
            fetch(file_url).then(
                (response) => response.text()).then((data) => { resolve(data); }
            );
        } catch(error) {
            reject(error);
        }
    });
}

const vertexShader = await load_shader("./shaders/vertex.glsl");
const fragmentShader = await load_shader("./shaders/fragment.glsl");

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.3);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// meshes 
const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

const ico = new THREE.Mesh(geometry, material);
scene.add(ico);

function update() {
    renderer.render(scene, camera);
    controls.update();
}

renderer.setAnimationLoop(update);

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);