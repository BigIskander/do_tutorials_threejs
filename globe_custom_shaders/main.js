import * as THREE from 'three';

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

const atmosphereVertexShader = await load_shader("./shaders/atmosphereVertex.glsl");
const atmosphereFragmentShader = await load_shader("./shaders/atmosphereFragment.glsl");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// create a sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50), 
    new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load("./01-3.jpg")
            }
        }
    })
);

scene.add(sphere);

// create atmosphere
const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50), 
    new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    })
);

atmosphere.scale.setScalar(1.1);

scene.add(atmosphere);

camera.position.z = 15;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // sphere.rotation.y += 0.001;
}
animate();