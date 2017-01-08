var GRID_SIZE = .2

const geometry = new THREE.BoxBufferGeometry(GRID_SIZE, GRID_SIZE, GRID_SIZE)
const material = new THREE.MeshLambertMaterial({
  transparent: true,
  opacity: 0.4
})
const droppedMaterial = new THREE.MeshLambertMaterial({
  transparent: false,
  opacity: 1
})
var Voxel = function(controller, size) {
  this.cube = new THREE.Mesh(
    geometry,
    material
  )
  // this.mesh.castShadow = true

  this.controller = controller
  this.noRotation = new THREE.Matrix4()
  this.mesh = new THREE.Object3D()
  this.mesh.add(this.cube)
}

Voxel.prototype.update = function() {
  var forward = new THREE.Vector3(0, 0, -.3)
  forward.applyQuaternion(this.controller.quaternion)
  this.mesh.position.copy(this.controller.position)
  this.mesh.position.add(forward)
  this.mesh.position.x = this.snap(this.mesh.position.x)
  this.mesh.position.y = this.snap(this.mesh.position.y)
  this.mesh.position.z = this.snap(this.mesh.position.z)
}

Voxel.prototype.drop = function() {
  console.log("DROPPED")
  this.mesh.material = droppedMaterial
}

Voxel.prototype.snap = function(v) {
  return Math.round(v / GRID_SIZE) * GRID_SIZE
}
module.exports = Voxel
