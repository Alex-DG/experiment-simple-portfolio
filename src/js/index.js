import '../styles/index.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import fragmentShader from '../shaders/experiments/fragment.glsl'
import vertexShader from '../shaders/experiments/vertex.glsl'

// import testTexture from '../../static/images/texture.jpg'

export default class Demo {
  constructor(options) {
    this.clock = new THREE.Clock()

    this.container = options.domElement
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    )
    this.camera.position.z = 1

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.addObjects()
    this.setupResize()
    this.render()
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this), false)
  }

  addObjects() {
    this.geometry = new THREE.SphereBufferGeometry(0.5, 160, 160)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      wireframe: false,
      uniforms: {
        uTime: { value: 1.0 },
        uResolution: { value: new THREE.Vector2() },
        uTexture: {
          value: new THREE.TextureLoader().load('/images/water.jpg'),
        },
      },
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  render() {
    this.time = this.clock.getElapsedTime()
    // this.mesh.rotation.x = this.time * 0.5
    // this.mesh.rotation.y = this.time * 0.5

    // Update material
    this.material.uniforms.uTime.value = this.time

    this.renderer.render(this.scene, this.camera)

    this.renderer.setAnimationLoop(this.render.bind(this))
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const demo = new Demo({
    domElement: document.getElementById('container'),
  })
  window.demo = demo
})
