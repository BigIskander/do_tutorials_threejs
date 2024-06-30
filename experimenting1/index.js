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
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// lighting
const dirLight = new THREE.DirectionalLight('#526cff', 0.6);
dirLight.position.set(2, 2, 2);
const ambientLight = new THREE.AmbientLight('#4255ff', 0.5);
scene.add(dirLight, ambientLight);

const geometry = new THREE.IcosahedronGeometry(1, 100);
const numOfVertices = geometry.attributes.position.count;

geometry.addGroup(0, numOfVertices / 2, 0);
geometry.addGroup(0, numOfVertices, 1);

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});
const standardMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const materials = [shaderMaterial, standardMaterial];

shaderMaterial.uniforms.uTime = { value: 0 };

const ico = new THREE.Mesh(geometry, materials);
scene.add(ico);

function update(timestamp, timeDiff) {
    controls.update();
    renderer.render(scene, camera);
    const time = timestamp / 10000;
    shaderMaterial.uniforms.uTime.value = time;
}

renderer.setAnimationLoop(update);

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);