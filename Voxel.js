var GRID_SIZE = .2

const geometry = new THREE.BoxBufferGeometry(GRID_SIZE, GRID_SIZE, GRID_SIZE)
const material = new THREE.MeshLambertMaterial({
  wireframe: true,
  opacity: 0.4
})
const droppedMaterial = new THREE.MeshLambertMaterial({
  wireframe: false,
  opacity: 1
})
var Voxel = function(controller, size) {
  this.cube = new THREE.Mesh(
    geometry,
    material
  )

  this.controller = controller
  this.noRotation = new THREE.Matrix4()
  this.object3D = new THREE.Object3D()
  this.object3D.add(this.cube)
}

Voxel.prototype.update = function() {
  var forward = new THREE.Vector3(0, 0, -.3)
  forward.applyQuaternion(this.controller.quaternion)
  this.object3D.position.copy(this.controller.position)
  this.object3D.position.add(forward)
  this.object3D.position.x = this.snap(this.object3D.position.x)
  this.object3D.position.y = this.snap(this.object3D.position.y)
  this.object3D.position.z = this.snap(this.object3D.position.z) - .2
}

Voxel.prototype.drop = function() {
  this.cube.material = droppedMaterial
}

Voxel.prototype.snap = function(v) {
  return Math.round(v / GRID_SIZE) * GRID_SIZE
}
module.exports = Voxel
