import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import ASScroll from '@ashthornton/asscroll'

import fragmentShader from '../../shaders/portfolio/fragment.glsl'
import vertexShader from '../../shaders/portfolio/vertex.glsl'

// Images
import texture from '../../assets/images/texture.jpg'

export default class Experience {
  constructor(options) {
    this.clock = new THREE.Clock()

    this.container = options.domElement

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight || window.innerHeight

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

    this.asscroll = new ASScroll()

    this.asscroll.enable({
      horizontalScroll: true,
    })

    this.time = 0

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
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100)
    this.material = new THREE.ShaderMaterial({
      // wireframe: false,
      uniforms: {
        uTime: { value: 1.0 },
        uProgress: { value: 0.0 },
        uTexture: {
          value: new THREE.TextureLoader().load(texture),
        },
        uTextureSize: {
          value: new THREE.Vector2(100, 100),
        },
        uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300) },
      },
      vertexShader,
      fragmentShader,
    })

    // Setup new timeline
    this.tl = gsap
      .timeline()
      .to(this.material.uniforms.uCorners.value, {
        x: 1,
        duration: 1,
      })
      .to(
        this.material.uniforms.uCorners.value,
        {
          y: 1,
          duration: 1,
        },
        0.2
      )
      .to(
        this.material.uniforms.uCorners.value,
        {
          z: 1,
          duration: 1,
        },
        0.4
      )
      .to(
        this.material.uniforms.uCorners.value,
        {
          w: 1,
          duration: 1,
        },
        0.6
      )

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.set(300, 300, 1)
    // this.scene.add(this.mesh)
    this.mesh.position.x = 300

    this.images = [...document.querySelectorAll('.js-image')]
    this.materials = []
    this.imageStore = this.images.map((img) => {
      let bounds = img.getBoundingClientRect()

      let m = this.material.clone()
      this.materials.push(m)

      let texture = new THREE.Texture(img)
      texture.needsUpdate = true

      m.uniforms.uTexture.value = texture

      let mesh = new THREE.Mesh(this.geometry, m)
      this.scene.add(mesh)
      mesh.scale.set(bounds.width, bounds.height, 1)

      return {
        img,
        mesh,
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left,
      }
    })
  }

  render() {
    this.time = this.clock.getElapsedTime()

    // Update material
    this.material.uniforms.uTime.value = this.time
    this.material.uniforms.uProgress.value = this.settings.progress

    // Update timeline
    // this.tl.progress(this.settings.progress)

    // Update mesh
    this.mesh.rotation.x = this.time / 2000
    this.mesh.rotation.y = this.time / 1000

    this.renderer.render(this.scene, this.camera)

    this.renderer.setAnimationLoop(this.render.bind(this))
  }
}
