THREE = require('three')
var canvas = require("@msfeldstein/full-screen-canvas")()
var ViveController = require('three-vive-controller')(THREE)
require('./THREE.VRControls')

var app = require('./renderer')(canvas)
var renderer = app.renderer
var canvas = app.canvas
scene = new THREE.Scene()
light = require("./lights")(scene)
camera = require("./camera")(scene)
plane = require('./plane')(scene)

cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(20, 20, 20),
  new THREE.MeshLambertMaterial({})
)
scene.add(cube)
cube.castShadow = true

controls = new THREE.VRControls(camera)
controller = new ViveController(0, controls)
scene.add(controller)



var animate = function() {
  requestAnimationFrame(animate)
  camera.position.x = 120 * Math.cos(Date.now() / 2000)
  camera.position.z = 120 * Math.sin(Date.now() / 2000)
  cube.position.y = 21 + 10 * Math.sin(Date.now() / 1203)
  camera.lookAt(plane.position)
  controller.visible = true
  renderer.render(scene, camera)
}
animate()
