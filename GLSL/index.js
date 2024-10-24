import * as THREE from 'three';

// shaders to play with
var fragmentShaders = [
    "./shaders/basic.frag",                 //0
    "./shaders/shape_functions.frag",       //1
    "./shaders/color_transition.frag",      //2
    "./shaders/color_mix.frag",             //3
    "./shaders/HSB.frag",                   //4
    "./shaders/HSB_polar.frag",             //5
    "./shaders/HSB_exp.frag",               //6
    "./shaders/HSB_shift.frag",             //7
    "./shaders/rectangle.frag",             //8
    "./shaders/circle.frag",                //9
    "./shaders/circle_dot_product.frag",    //10
    "./shaders/four_circle_shape.frag",     //11
    "./shaders/polar_shapes.frag",          //12
    "./shaders/triangle.frag",              //13
    "./shaders/move_space.frag",            //14
    "./shaders/rotate_space.frag",          //15
    "./shaders/scale_space.frag",           //16
    "./shaders/yuv.frag",                   //17
    "./shaders/9fract.frag",                //18
    "./shaders/9truchet_tiles.frag",        //19
    "./shaders/random/random.frag",         //20
    "./shaders/random/random_mosaic.frag",  //21
    "./shaders/random/random_maze.frag",    //22
    "./shaders/random/noise.frag",          //23
    "./shaders/random/simplex_noise.frag",  //24
    "./shaders/random/noise_celular.frag",  //25
    "./shaders/random/noise_celular_voronoi.frag",   //26
    "./shaders/random/cloud_like.frag"      //27
];
// the chosen shader
var nShader = 27;

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
      uniforms.u_mouse.value.y = window.innerHeight - e.pageY
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