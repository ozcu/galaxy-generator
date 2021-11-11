import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import Stats from 'three/examples/jsm/libs/stats.module.js'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.x = 20
camera.position.y = 20
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Helpers
/* const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper) */

//Stats
const stats = Stats()
document.body.appendChild(stats.dom)


//Galaxy Parameters
const parameters = {

    starCount:10000,
    size:0.01,
    radius:3,
    branches:6,
    spin:1.6,
    randomness:0.63,
    randPower:3,
    inColor:'#ff6030',
    outColor:'#1b3984',
    numberOfGalaxies:20,
    generationDistance:20,
   /*  randomizeColor:() =>{
        const randomInColor = "#"+ Math.floor(Math.random()*16777215).toString(16)
        const randomOutColor ="#"+ Math.floor(Math.random()*16777215).toString(16)
      
        inColor =randomInColor
        outColor = randomOutColor
        console.log(inColor,outColor)
        return {inColor,outColor}
    } */
   
}

//Clear memory
let geometry = null
let material = null
let galaxy = null  




//Galaxy Geometry
geometry = new THREE.BufferGeometry()
const positions = new Float32Array(parameters.starCount * 3)
const colors = new Float32Array(parameters.starCount * 3)


let inColor = new THREE.Color(parameters.inColor)
let outColor = new THREE.Color(parameters.outColor)



//Galaxy
const generateGalaxy = () => {

    
    //Clear old instantiations
      if(galaxy !== null)
    {
        geometry.dispose()
        material.dispose()
        
        for(let i=0;i<=100;i++){
            scene.remove(galaxy[i])
        }
    }  

    //Point instantiation
   
    for(let i=0;i<parameters.starCount;i++){
        const i3 = i*3
        const radius = Math.random()* parameters.radius
        const spinAngle = radius*parameters.spin
        const branchAngle = (i%parameters.branches)/parameters.branches*Math.PI*2

        const randomX = Math.pow(Math.random(), parameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius



        positions[i3] = Math.cos(branchAngle+spinAngle)*radius +randomX
        positions[i3+1] = randomY
        positions[i3+2] = Math.sin(branchAngle+spinAngle)*radius+randomZ


        //Colors
        const mixedColor = inColor.clone()
        mixedColor.lerp(outColor,radius/parameters.radius)
        colors[i3]=mixedColor.r
        colors[i3+1]=mixedColor.g
        colors[i3+2]=mixedColor.b
    }

    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
    geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))

    //Material of points in galaxy
    material = new THREE.PointsMaterial()
    material.size = parameters.size
    material.sizeAttenuation= true
    material.depthWrite=false
    material.blending=THREE.AdditiveBlending,
    material.vertexColors=true

    //Generate Galaxy
    galaxy = new THREE.Points(geometry,material)
    for(let i=1;i<=parameters.numberOfGalaxies;i++){
        
        galaxy[i] = new THREE.Points(geometry,material)
        galaxy[i].position.set((Math.random()-0.5)*parameters.generationDistance,(Math.random()-0.5)*parameters.generationDistance,(Math.random()-0.5)*parameters.generationDistance)
        galaxy[i].rotation.set((Math.random()),(Math.random()),(Math.random()))
        scene.add(galaxy[i])
     //   console.log(galaxy[i].position.distanceTo(camera.position))
    }
   
}
generateGalaxy()


//GUI Parameters
gui.add(parameters,'starCount').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'branches').min(3).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'spin').min(0).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'randPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'numberOfGalaxies').min(1).max(100).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'generationDistance').min(20).max(200).step(5).onFinishChange(generateGalaxy)
//gui.add(parameters,'randomizeColor').onFinishChange(generateGalaxy)

gui.addColor(parameters, 'inColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outColor').onFinishChange(generateGalaxy)

console.log(outColor)



/**
 * Animate
 */
const clock = new THREE.Clock()

const animateScene = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    for(let i = 1;i<=parameters.numberOfGalaxies;i++){
        galaxy[i].rotateY(Math.abs(Math.random())*0.0005*i)
    }
  
   //stats
   stats.update()

    // Render
    renderer.render(scene, camera)

    // Call animateScene again on the next frame
    window.requestAnimationFrame(animateScene)
}

animateScene()