uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec2 uTextureSize;
uniform vec4 uCorners;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec2 vSize;


void main()
{
    vec4 defaultState = modelMatrix * vec4(position, 1.0);
    vec4 fullScreenState = vec4(position, 1.0);
    fullScreenState.x *= uResolution.x / uQuadSize.x;
    fullScreenState.y *= uResolution.y / uQuadSize.y;

    // Effect with corners
    float cornersProgress =mix(
        mix(uCorners.x, uCorners.y, uv.x),
        mix(uCorners.z, uCorners.w, uv.x),
        uv.y
    );

    vec4 finalState = mix(defaultState, fullScreenState, cornersProgress);

    vSize = mix(uQuadSize, uResolution, uProgress);

    gl_Position = projectionMatrix * viewMatrix * finalState;

    vUv = uv;
}