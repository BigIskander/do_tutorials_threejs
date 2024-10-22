import * as THREE from 'three';

// shaders to play with
var fragmentShaders = [
    "./shaders/basic.frag",
    "./shaders/shape_functions.frag",
    "./shaders/color_transition.frag",
    "./shaders/color_mix.frag",
    "./shaders/HSB.frag",
    "./shaders/HSB_polar.frag"
];
// the chosen shader
var nShader = 5;

var camera, scene, renderer, clock;
var uniforms;

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

var vertexShader = await load_shader("./shader.vert");
var fragmentShader = await load_shader(fragmentShaders[nShader]);

function init() {
    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    var geometry = new THREE.PlaneGeometry( 2, 2 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    var mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );

    document.body.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    document.onmousemove = function(e){
      uniforms.u_mouse.value.x = e.pageX
      uniforms.u_mouse.value.y = e.pageY
    }

    renderer.setAnimationLoop(render);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function render() {
    uniforms.u_time.value += clock.getDelta();
    renderer.render( scene, camera );
}

init();