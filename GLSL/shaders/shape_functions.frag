#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float plot(vec2 st, float pct){
    if(st.y >= -0.005 && st.y <= 0.005) return 1.;
    if(st.x >= -0.005 && st.x <= 0.005) return 1.;
    return  
        smoothstep( pct-0.01, pct, st.y) -
        smoothstep( pct, pct+0.01, st.y);
}

int nFormula = 1;
float power = 2.5;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    // change from [0; 1] to [-1.2; 1.2] space
    st = vec2(st.x * 2.4 - 1.2, st.y * 2.4 - 1.2);
    float x = st.x;

    // functions
    float y = 0.0;
    if(nFormula == 0) {
        y = 1.0 - pow(abs(x), power);
    } else
    if (nFormula == 1) {
        y = pow(cos(PI * x / 2.0), power);
    } else
    if(nFormula == 2) {
        y = 1.0 - pow(abs(sin(PI * x / 2.0)), power);
    } else
    if(nFormula == 3) {
        y = pow(min(cos(PI * x / 2.0), 1.0 - abs(x)), power);
    } else
    if(nFormula == 4) {
        y = 1.0 - pow(max(0.0, abs(x) * 2.0 - 1.0), power);
    }

    vec3 color = vec3(1.0,1.0,1.0);
    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,0.0,0.0);

    gl_FragColor = vec4(color,1.0);
}