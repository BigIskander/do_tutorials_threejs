import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

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

// const vertexShader = await load_shader("./shaders/vertex.glsl");
// const fragmentShader = await load_shader("./shaders/fragment.glsl");
const vertexPars = await load_shader("./shaders/vertex_parse.glsl");
const vertexMain = await load_shader("./shaders/vertex_main.glsl");
const fragmentPars = await load_shader("./shaders/fragment_parse.glsl");
const fragmentMain = await load_shader("./shaders/fragment_main.glsl");

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
// scene.fog = new THREE.FogExp2(0x000000, 0.3);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

let composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// lighting
const dirLight = new THREE.DirectionalLight('#526cff', 0.6);
dirLight.position.set(2, 2, 2);

const ambientLight = new THREE.AmbientLight('#4255ff', 0.5);
scene.add(dirLight, ambientLight);

// meshes 
const geometry = new THREE.IcosahedronGeometry(1, 100);
const material = new THREE.MeshStandardMaterial({
    onBeforeCompile: (shader) => {
        // storing a reference to the shader object
        material.userData.shader = shader;
        // uniforms
        shader.uniforms.uTime = { value: 0 };
        // shader code injection
        const parseVertex = /* glsl */ `#include <displacementmap_pars_vertex>`;
        shader.vertexShader = shader.vertexShader.replace(parseVertex, 
            parseVertex + '\r\n' + vertexPars
        );
        const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`;
        shader.vertexShader = shader.vertexShader.replace(mainVertexString,
            mainVertexString + '\r\n' + vertexMain
        );
        const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`;
        const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`;
        shader.fragmentShader = shader.fragmentShader.replace(parsFragmentString,
            parsFragmentString + '\r\n' + fragmentPars
        );
        shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString,
            mainFragmentString + '\r\n' + fragmentMain
        );
        // console.log(shader.fragmentShader);
    }
});

const ico = new THREE.Mesh(geometry, material);
scene.add(ico);

// postprocessing
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 2.5;
bloomPass.radius = 0;
composer.addPass(bloomPass);

function update(timestamp, timeDiff) {
    controls.update();
    composer.render();
    const time = timestamp / 10000;
    material.userData.shader.uniforms.uTime.value = time;
}

renderer.setAnimationLoop(update);

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);