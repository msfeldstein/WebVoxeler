THREE = require('three')
var canvas = require("@msfeldstein/full-screen-canvas")()
var ViveController = require('three-vive-controller')(THREE)
require('./THREE.VRControls')
require('./THREE.VREffect')
var Voxel = require('./Voxel')
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
controller = new ViveController(0, controls)
if ( navigator.getVRDisplays ) {

  // navigator.getVRDisplays()
  //   .then( function ( displays ) {
  //     effect.setVRDisplay( displays[ 0 ] );
  //     controls.setVRDisplay( displays[ 0 ] );
  //   } )
  //   .catch( function () {} );
  document.body.appendChild( WEBVR.getButton( effect ) );
}
scene.add(controller)


function newVoxel() {
  voxel = new Voxel(controller, .4)
  scene.add(voxel.mesh)
}
newVoxel()

controller.on(controller.TriggerClicked, () => {
  voxel.drop(),
  newVoxel()
})

var animate = function() {
  effect.requestAnimationFrame(animate)
  controls.update()
  voxel.update()
  effect.render(scene, camera)

}
animate()
