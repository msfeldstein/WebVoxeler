THREE = require('three')
var canvas = require("@msfeldstein/full-screen-canvas")()
var ViveController = require('three-vive-controller')(THREE)
require('./THREE.VRControls')
require('./THREE.VREffect')
window.TWEEN = require('tween.js')
var VoxelGrid = require('./VoxelGrid')
var WEBVR = require('./WebVR')
var app = require('./renderer')(canvas)
var renderer = app.renderer
var canvas = app.canvas
scene = new THREE.Scene()
light = require("./lights")(scene)
camera = require("./camera")(scene)

plane = require('./plane')(scene)
plane.position.y = -2

controls = new THREE.VRControls(camera)
effect = new THREE.VREffect(renderer)
controller1 = new ViveController(0, controls)
controller2 = new ViveController(1, controls)
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


grid = new VoxelGrid({
  gridSize: .2,
  scene: scene,
  controllers: [controller1, controller2]
})

var animate = function(time) {
  time = Date.now()
  effect.requestAnimationFrame(animate)
  TWEEN.update()
  controls.update()
  grid.update()
  effect.render(scene, camera)

}
effect.requestAnimationFrame(animate)
