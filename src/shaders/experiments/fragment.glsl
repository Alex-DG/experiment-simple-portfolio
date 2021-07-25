uniform float uTime;
uniform sampler2D uTexture;

varying float vPulse;
varying vec2 vUv;
varying vec3 vNormal;

void main() 
{

    vec4 image = texture(uTexture, vUv + 0.01 * sin(vUv * 20.0 + uTime) );

    gl_FragColor = vec4(vPulse, 0.0, 0.0, 1.);

}