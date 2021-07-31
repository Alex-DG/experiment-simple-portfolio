uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec2 uTextureSize;
uniform vec4 uCorners;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec2 vSize;

float PI = 3.1445926;

void main()
{
    // Effect with waves
    float sine = sin(PI * uProgress);
    float waves = sine * 0.1 * sin(5.0 * length(uv) + (15.0 * uProgress));

    vec4 defaultState = modelMatrix * vec4(position, 1.0);
    vec4 fullScreenState = vec4(position, 1.0);
    fullScreenState.x *= uResolution.x;
    fullScreenState.y *= uResolution.y;

    // Effect with corners
    float cornersProgress =mix(
        mix(uCorners.x, uCorners.y, uv.x),
        mix(uCorners.z, uCorners.w, uv.x),
        uv.y
    );

    vec4 finalState = mix(defaultState, fullScreenState, (uProgress + waves));

    gl_Position = projectionMatrix * viewMatrix * finalState;

    // Varyings
    vSize = mix(uQuadSize, uResolution, cornersProgress);
    vUv = uv;
}