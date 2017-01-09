const USE_VR = false

THREE = require('three')
var canvas = require("@msfeldstein/full-screen-canvas")()
var ViveController = require('three-vive-controller')(THREE)
require('./THREE.VRControls')
require('./THREE.VREffect')
window.TWEEN = require('tween.js')
var VoxelGrid = require('./VoxelGrid')
var WEBVR = require('./WebVR')
var OrbitControls = require('three-orbit-controls')(THREE)
var app = require('./renderer')(canvas)

var renderer = app.renderer
var canvas = app.canvas
scene = new THREE.Scene()
light = require("./lights")(scene)
camera = require("./camera")(scene)

var Palette = require("./palette")
new Palette(scene)

plane = require('./plane')(scene)
plane.position.y = -2


var controls = new THREE.VRControls(camera)
var effect = new THREE.VREffect(renderer)
var controller1 = new ViveController(0, controls)
var controller2 = new ViveController(1, controls)

scene.add(controller1, controller2)

if ( navigator.getVRDisplays ) {
  // navigator.getVRDisplays()
  //   .then( function ( displays ) {
  //     effect.setVRDisplay( displays[ 0 ] );
  //     controls.setVRDisplay( displays[ 0 ] );
  //   } )
  //   .catch( function () {} );
  document.body.appendChild( WEBVR.getButton( effect ) );
}

if (!USE_VR){
  camera.position.set(0, 1, -1)
  camera.lookAt(new THREE.Vector3())
  orbitControls = new OrbitControls(camera)
}


grid = new VoxelGrid({
  gridSize: .2,
  scene: scene,
  controllers: [controller1, controller2]
})

var animate = function(time) {
  time = Date.now()
  effect.requestAnimationFrame(animate)
  TWEEN.update()
  grid.update()

  if (USE_VR) {
    controls.update()
    effect.render(scene, camera)

  } else {
    // orbitControls.update()
    renderer.render(scene, camera)

  }


}
effect.requestAnimationFrame(animate)
