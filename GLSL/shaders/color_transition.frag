#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

vec3 colorB = vec3(1.0, 0.0, 0.0); // red
vec3 colorA = vec3(0.0, 0.0, 0.0); // black

//https://easings.net/#easeInOutElastic
float easeInOutElastic(float x) {
    float c5 = (2.0 * PI) / 4.5;

    return x == 0.
        ? 0.
        : x == 1.
        ? 1.
        : x < 0.5
        ? -(pow(2., 20. * x - 10.) * sin((20. * x - 11.125) * c5)) / 2.
        : (pow(2., -20. * x + 10.) * sin((20. * x - 11.125) * c5)) / 2. + 1.;
}

//https://easings.net/#easeInOutBack
float easeInOutBack(float x) {
    float c1 = 1.70158;
    float c2 = c1 * 1.525;

    return x < 0.5
        ? (pow(2. * x, 2.) * ((c2 + 1.) * 2. * x - c2)) / 2.
        : (pow(2. * x - 2., 2.) * ((c2 + 1.) * (x * 2. - 2.) + c2) + 2.) / 2.;
}

float power = 3.5;

void main() {
    vec3 color = vec3(0.0);

    // change from [-1; 1] space to [0; 1]
    float x = (sin(u_time) + 1.0) / 2.0;

    // float pct = easeInOutElastic(x);
    float pct = easeInOutBack(x);

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
}