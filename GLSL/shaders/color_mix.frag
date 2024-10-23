#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    float r = .8 - st.x;
    pct.r = 1.0 - pow(abs(sin(PI * r / 2.0)), (sin(u_time) + 1.) / 2.);
    // pct.r = pow(cos(PI * r / 2.0), 2. + (sin(u_time) + 1.) / 2.);
    // float g = st.x * 0.1;
    // pct.g = 1.0 - pow(abs(sin(PI * g / 2.0)), 1.5);
    float b = st.x * 2.5 + 0.1;
    pct.b = 1.0 - pow(abs(sin(PI * b / 2.0)), 1.5);

    color = mix(colorA, colorB, pct);

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
}