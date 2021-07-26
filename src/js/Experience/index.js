// import '../styles/index.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// import fragmentShader from '../../shaders/experiments/fragment.glsl'
// import vertexShader from '../../shaders/experiments/vertex.glsl'
import fragmentShader from '../../shaders/portfolio/fragment.glsl'
import vertexShader from '../../shaders/portfolio/vertex.glsl'

export default class Experience {
  constructor(options) {
    this.clock = new THREE.Clock()

    this.container = options.domElement

    console.log({
      clientWidth: this.container.clientWidth,
      clienHeight: this.container.clientHeight,
      container: this.container,
      offsetWidth: this.container.offsetWidth,
      offsetHeight: this.container.offsetHeight,
      innerHeight: window.innerHeight,
      display: this.container.display,
      visibility: this.container.visibility,
    })
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight || window.innerHeight

    console.log({ width: this.width, height: this.height })

    const cameraDistance = 600
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      10,
      1000
    )
    this.camera.position.z = cameraDistance

    // Update camera fov to be able to input values in the geometry which match the actual screen size
    this.camera.fov =
      2 * Math.atan(this.height / 2 / cameraDistance) * (180 / Math.PI) //  (180 / Math.PI) => transform angle in degres

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.setupSettings()
    this.resize()
    this.addObjects()
    this.render()

    this.setupResize()
  }

  setupSettings() {
    this.settings = {
      progress: 0,
    }
    this.gui = new dat.GUI()
    this.gui.add(this.settings, 'progress').min(0).max(1).step(0.001)
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    // Update camera
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(this.width, this.height)
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  addObjects() {
    const gWidth = 300
    const gHeight = 300

    this.geometry = new THREE.PlaneBufferGeometry(gWidth, gHeight, 100, 100)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      wireframe: false,
      uniforms: {
        uTime: { value: 1.0 },
        uProgress: { value: 1.0 },
        uTexture: {
          value: new THREE.TextureLoader().load('/images/texture.jpg'),
        },
        uTextureSize: {
          value: new THREE.Vector2(100, 100),
        },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(gWidth, gHeight) },
      },
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)

    this.mesh.position.x = 300
    this.mesh.rotation.z = 0.5
    // this.mesh.scale.set(2.0, 1, 1)
  }

  render() {
    this.time = this.clock.getElapsedTime()

    // Update mesh
    // this.mesh.rotation.x = this.time * 0.5
    // this.mesh.rotation.y = this.time * 0.5

    // Update material
    this.material.uniforms.uTime.value = this.time
    this.material.uniforms.uProgress.value = this.settings.progress

    this.renderer.render(this.scene, this.camera)

    this.renderer.setAnimationLoop(this.render.bind(this))
  }
}

// window.addEventListener('DOMContentLoaded', () => {
//   const container = document.getElementById('container')
//   new Demo({
//     domElement: container,
//   })
// })
