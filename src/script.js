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

//Stats
const stats = Stats()
document.body.appendChild(stats.dom)


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
camera.position.x = 40
camera.position.y = 40
camera.position.z = 40
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

//medGalaxyParameters
const medGalaxyParameters = {

    starCount:5000,
    numberOfGalaxies:1,
    size:0.01,
    radius:3,
    branches:6,
    spin:1,
    randomness:0.5,
    randPower:3,
    medGalaxyInColor:'#ff6030',
    medGalaxyOutColor:'#1b3984',
    
    generationDistance:20,
   
}
//smGalaxyParameters
const smGalaxyParameters = {
    starCount:5000,
    size:0.01,
    radius:0.5,
    branches:8,
    spin:1.6,
    randomness:0.93,
    randPower:3,
    smGalaxyInColor:'#00fffb',
    smGalaxyOutColor:'#f609c3',
    numberOfGalaxies:1,
    generationDistance:40,

}

const randomizeGalaxyParameters = () =>{
    
    const randomGalaxyParameters = {

        size:0.01,
        radius:0.5+3*Math.random(),
        branches:4+8*Math.random(),
        spin:1+2*Math.random(),
        randomness:Math.random(),
        randPower:2+2*Math.random(),
        galaxyInColor:new THREE.Color(Math.random(),Math.random(),Math.random()),
        galaxyOutColor:new THREE.Color(Math.random(),Math.random(),Math.random()),
        generationDistance:60,
    }
    return randomGalaxyParameters
}

const randomGalaxyParameters={
    startCount:5000,
    numberOfGalaxies:1,
}


//Clear memory
let medGalaxyGeometry = null
let medGalaxyMaterial = null
let medGalaxy = null  

let smGalaxyGeometry = null
let smGalaxyMaterial = null
let smGalaxy= null


let randomGalaxyGeometry = null
let randomGalaxyMaterial = null
let randomGalaxy= null

//Galaxy Geometry 
medGalaxyGeometry = new THREE.BufferGeometry()
const medPositions = new Float32Array(medGalaxyParameters.starCount * 3)
const medColors = new Float32Array(medGalaxyParameters.starCount * 3)

smGalaxyGeometry = new THREE.BufferGeometry()
const smPositions = new Float32Array(smGalaxyParameters.starCount * 3)
const smColors = new Float32Array(smGalaxyParameters.starCount * 3)

//Galaxy Color
const medGalaxyInColor = new THREE.Color(medGalaxyParameters.medGalaxyInColor)
const medGalaxyOutColor = new THREE.Color(medGalaxyParameters.medGalaxyOutColor)

const smGalaxyInColor = new THREE.Color(smGalaxyParameters.smGalaxyInColor)
const smGalaxyOutColor = new THREE.Color(smGalaxyParameters.smGalaxyOutColor)

const generateRandomGalaxy = ()=>{

      //Point instantiation
      randomGalaxyGeometry =new THREE.BufferGeometry()
    //clear old instantiations
     if(randomGalaxy !==null){
        for(let i=0;i<=500;i++){
            
        randomGalaxyGeometry[i].dispose()
        randomGalaxyMaterial[i].dispose()
        scene.remove(randomGalaxy[i])
        console.log(randomGalaxy[i])
        }
    } 
    //setMaterials
    const {size} = randomizeGalaxyParameters()
    
    //smGalaxyMaterial of points in smGalaxy
    randomGalaxyMaterial = new THREE.PointsMaterial()
    randomGalaxyMaterial.size = size
    randomGalaxyMaterial.sizeAttenuation= true
    randomGalaxyMaterial.depthWrite=false
    randomGalaxyMaterial.blending=THREE.AdditiveBlending,
    randomGalaxyMaterial.vertexColors=true
 
    
    
    for(let i = 0 ;i<100;i++){
        randomGalaxyGeometry[i] = new THREE.BufferGeometry()
        const randomPositions = new Float32Array(1000 * 3)
        const randomColors = new Float32Array(1000 * 3)
   
        const {radius,spin,branches,randPower,randomness,galaxyInColor,galaxyOutColor} = randomizeGalaxyParameters()
                      
        for(let i=0;i<3000;i++){ 
            
        const i3 = i*3
        const randomRadius = Math.random()*radius
        const spinAngle = randomRadius*spin 
        const branchAngle = (i%branches)/branches*Math.PI*2


        const randomX =Math.pow(Math.random(), randPower) * (Math.random() < 0.5 ? 1 : - 1) * randomness * randomRadius
        const randomY = Math.pow(Math.random(), randPower) * (Math.random() < 0.5 ? 1 : - 1) * randomness * randomRadius
        const randomZ = Math.pow(Math.random(), randPower) * (Math.random() < 0.5 ? 1 : - 1) * randomness * randomRadius
    
        randomPositions[i3] = Math.cos(branchAngle+spinAngle) *randomRadius+randomX
        randomPositions[i3+1] = randomY
        randomPositions[i3+2]= Math.sin(branchAngle+spinAngle) *randomRadius+randomZ

        //pointColors
   
        const mixedColor = galaxyInColor.clone()
        mixedColor.lerp(galaxyOutColor,randomRadius/radius)
       
        
        randomColors[i3]=mixedColor.r
        randomColors[i3+1]=mixedColor.g
        randomColors[i3+2]=mixedColor.b
                       
        }
        
        randomGalaxyGeometry[i].setAttribute('position',new THREE.BufferAttribute(randomPositions,3))
        randomGalaxyGeometry[i].setAttribute('color',new THREE.BufferAttribute(randomColors,3))
    
        //Generate randomGalaxy
        randomGalaxy = new THREE.Points(randomGalaxyGeometry[i],randomGalaxyMaterial[i])
        const {generationDistance} = randomizeGalaxyParameters()
        randomGalaxy[i] = new THREE.Points(randomGalaxyGeometry[i],randomGalaxyMaterial)
        randomGalaxy[i].position.set((Math.random()-0.5)*generationDistance,(Math.random()-0.5)*generationDistance,(Math.random()-0.5)*generationDistance)
        randomGalaxy[i].rotation.set((Math.random()),(Math.random()),(Math.random()))
        scene.add(randomGalaxy[i])
        
    
    }     
}
generateRandomGalaxy() 

const generateSmGalaxy = ()=> {

  //Clear old instantiations
  if(smGalaxy !== null)
  {
    smGalaxyGeometry.dispose()
    smGalaxyMaterial.dispose()
      
      for(let i=0;i<=100;i++){

          scene.remove(smGalaxy[i])
      }
  }  

  //Point instantiation
  for(let i=0;i<smGalaxyParameters.starCount;i++){
    const i3 = i*3
    const radius = Math.random()* smGalaxyParameters.radius
    const spinAngle = radius*smGalaxyParameters.spin
    const branchAngle = (i%smGalaxyParameters.branches)/smGalaxyParameters.branches*Math.PI*2

    const randomX = Math.pow(Math.random(), smGalaxyParameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * smGalaxyParameters.randomness * radius
    const randomY = Math.pow(Math.random(), smGalaxyParameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * smGalaxyParameters.randomness * radius
    const randomZ = Math.pow(Math.random(), smGalaxyParameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * smGalaxyParameters.randomness * radius

    //smPositions
    smPositions[i3] = Math.cos(branchAngle+spinAngle)*radius +randomX
    smPositions[i3+1] = randomY
    smPositions[i3+2] = Math.sin(branchAngle+spinAngle)*radius+randomZ

    //smColors
    const mixedColor = smGalaxyInColor.clone()
    mixedColor.lerp(smGalaxyOutColor,radius/smGalaxyParameters.radius)
    smColors[i3]=mixedColor.r
    smColors[i3+1]=mixedColor.g
    smColors[i3+2]=mixedColor.b
    }

    smGalaxyGeometry.setAttribute('position',new THREE.BufferAttribute(smPositions,3))
    smGalaxyGeometry.setAttribute('color',new THREE.BufferAttribute(smColors,3))

    //smGalaxyMaterial of points in smGalaxy
    smGalaxyMaterial = new THREE.PointsMaterial()
    smGalaxyMaterial.size = smGalaxyParameters.size
    smGalaxyMaterial.sizeAttenuation= true
    smGalaxyMaterial.depthWrite=false
    smGalaxyMaterial.blending=THREE.AdditiveBlending,
    smGalaxyMaterial.vertexColors=true


      //Generate smGalaxy
      smGalaxy = new THREE.Points(smGalaxyGeometry,smGalaxyMaterial)
      for(let i=1;i<=smGalaxyParameters.numberOfGalaxies;i++){
          
          smGalaxy[i] = new THREE.Points(smGalaxyGeometry,smGalaxyMaterial)
          smGalaxy[i].position.set((Math.random()-0.5)*smGalaxyParameters.generationDistance,(Math.random()-0.5)*smGalaxyParameters.generationDistance,(Math.random()-0.5)*smGalaxyParameters.generationDistance)
          smGalaxy[i].rotation.set((Math.random()),(Math.random()),(Math.random()))
          scene.add(smGalaxy[i])
       
      }

}
generateSmGalaxy()

//medGalaxy
const generateMedGalaxy = () => {

    
    //Clear old instantiations
      if(medGalaxy !== null)
        {
            medGalaxyGeometry.dispose()
            medGalaxyMaterial.dispose()
            
            for(let i=0;i<=100;i++){
                scene.remove(medGalaxy[i])
            }
        }  

    //Point instantiation
   
    for(let i=0;i<medGalaxyParameters.starCount;i++){
        const i3 = i*3
        const radius = Math.random()* medGalaxyParameters.radius
        const spinAngle = radius*medGalaxyParameters.spin
        const branchAngle = (i%medGalaxyParameters.branches)/medGalaxyParameters.branches*Math.PI*2

        
        const randomX =Math.pow(Math.random(), medGalaxyParameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * medGalaxyParameters.randomness * radius
        const randomY =Math.pow(Math.random(), medGalaxyParameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * medGalaxyParameters.randomness * radius
        const randomZ =Math.pow(Math.random(), medGalaxyParameters.randPower) * (Math.random() < 0.5 ? 1 : - 1) * medGalaxyParameters.randomness * radius


      
        medPositions[i3] = Math.cos(branchAngle+spinAngle)*radius +randomX
        medPositions[i3+1] = randomY
        medPositions[i3+2] = Math.sin(branchAngle+spinAngle)*radius+randomZ


        //medColors

        const mixedColor = medGalaxyInColor.clone()
        mixedColor.lerp(medGalaxyOutColor,radius/medGalaxyParameters.radius)
        
        
      
        medColors[i3]=mixedColor.r
        medColors[i3+1]=mixedColor.g
        medColors[i3+2]=mixedColor.b

    }

    medGalaxyGeometry.setAttribute('position',new THREE.BufferAttribute(medPositions,3))
    medGalaxyGeometry.setAttribute('color',new THREE.BufferAttribute(medColors,3))

    //medGalaxyMaterial of points in medGalaxy
    medGalaxyMaterial = new THREE.PointsMaterial()
    medGalaxyMaterial.size = medGalaxyParameters.size
    medGalaxyMaterial.sizeAttenuation= true
    medGalaxyMaterial.depthWrite=false
    medGalaxyMaterial.blending=THREE.AdditiveBlending,
    medGalaxyMaterial.vertexColors=true

    //Generate medGalaxy
    medGalaxy = new THREE.Points(medGalaxyGeometry,medGalaxyMaterial)
    for(let i=1;i<=medGalaxyParameters.numberOfGalaxies;i++){
        
        medGalaxy[i] = new THREE.Points(medGalaxyGeometry,medGalaxyMaterial)
        medGalaxy[i].position.set((Math.random()-0.5)*medGalaxyParameters.generationDistance,(Math.random()-0.5)*medGalaxyParameters.generationDistance,(Math.random()-0.5)*medGalaxyParameters.generationDistance)
        medGalaxy[i].rotation.set((Math.random()),(Math.random()),(Math.random()))
        scene.add(medGalaxy[i])
        
   
    }
    
}
generateMedGalaxy()

// medGalaxyParameters
const medGalaxyFolder = gui.addFolder ('medGalaxies')
medGalaxyFolder.add(medGalaxyParameters,'starCount').min(100).max(100000).step(100).onFinishChange(generateMedGalaxy)
medGalaxyFolder.add(medGalaxyParameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateMedGalaxy)
medGalaxyFolder.add(medGalaxyParameters,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateMedGalaxy)
medGalaxyFolder.add(medGalaxyParameters,'branches').min(3).max(20).step(1).onFinishChange(generateMedGalaxy)
medGalaxyFolder.add(medGalaxyParameters,'spin').min(0).max(5).step(0.001).onFinishChange(generateMedGalaxy)
medGalaxyFolder.add(medGalaxyParameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateMedGalaxy)
medGalaxyFolder.add(medGalaxyParameters,'randPower').min(1).max(10).step(0.001).onFinishChange(generateMedGalaxy)
medGalaxyFolder.add(medGalaxyParameters,'numberOfGalaxies').min(1).max(100).step(1).onFinishChange(generateMedGalaxy)
medGalaxyFolder.add(medGalaxyParameters,'generationDistance').min(20).max(200).step(5).onFinishChange(generateMedGalaxy)
medGalaxyFolder.addColor(medGalaxyParameters, 'medGalaxyInColor').onFinishChange(generateMedGalaxy)
medGalaxyFolder.addColor(medGalaxyParameters, 'medGalaxyOutColor').onFinishChange(generateMedGalaxy)

//smGalaxyParameters
 const smGalaxyFolder = gui.addFolder('smGalaxies')
smGalaxyFolder.add(smGalaxyParameters,'starCount').min(100).max(100000).step(100).onFinishChange(generateSmGalaxy)
smGalaxyFolder.add(smGalaxyParameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateSmGalaxy)
smGalaxyFolder.add(smGalaxyParameters,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateSmGalaxy)
smGalaxyFolder.add(smGalaxyParameters,'branches').min(3).max(20).step(1).onFinishChange(generateSmGalaxy)
smGalaxyFolder.add(smGalaxyParameters,'spin').min(0).max(5).step(0.001).onFinishChange(generateSmGalaxy)
smGalaxyFolder.add(smGalaxyParameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateSmGalaxy)
smGalaxyFolder.add(smGalaxyParameters,'randPower').min(1).max(10).step(0.001).onFinishChange(generateSmGalaxy)
smGalaxyFolder.add(smGalaxyParameters,'numberOfGalaxies').min(1).max(100).step(1).onFinishChange(generateSmGalaxy)
smGalaxyFolder.add(smGalaxyParameters,'generationDistance').min(20).max(200).step(5).onFinishChange(generateSmGalaxy)
smGalaxyFolder.addColor(smGalaxyParameters, 'smGalaxyInColor').onFinishChange(generateSmGalaxy)
smGalaxyFolder.addColor(smGalaxyParameters, 'smGalaxyOutColor').onFinishChange(generateSmGalaxy) 

const randomGalaxyFolder = gui.addFolder('randomGalaxies')
//randomGalaxyFolder.add(randomGalaxyParameters,'numberOfGalaxies').min(1).max(100).step(1).onFinishChange(generateRandomGalaxy)



/**
 * Animate
 */
const clock = new THREE.Clock()

const animateScene = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    for(let i = 1;i<=medGalaxyParameters.numberOfGalaxies;i++){
        medGalaxy[i].rotateY(Math.abs(Math.random())*0.0005*i)
        
    }
  
    for(let i = 1;i<=smGalaxyParameters.numberOfGalaxies;i++){
        smGalaxy[i].rotateY(Math.abs(Math.random())*0.0005*i)
 
    }
    
   /*     for(let i = 1;i<=50;i++){
        randomGalaxy[i].rotateY(Math.abs(Math.random())*0.0005*i)
        console.log(randomGalaxy[i])
    }    */
  
   //stats
   stats.update()

    // Render
    renderer.render(scene, camera)

    // Call animateScene again on the next frame
    window.requestAnimationFrame(animateScene)
}

animateScene()