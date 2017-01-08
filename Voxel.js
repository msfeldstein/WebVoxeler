const ghostMaterial = new THREE.MeshLambertMaterial({
  transparent: true,
  opacity: 0.4
})
const flatMaterial = new THREE.MeshLambertMaterial({
  wireframe: false,
  opacity: 1
})

class Voxel {
  constructor(size, isGhost) {
    this.cube = new THREE.Mesh(
      Voxel.geometryForSize(size),
      isGhost ? ghostMaterial.clone() : flatMaterial
    )

    this.object3D = new THREE.Object3D()
    this.object3D.add(this.cube)
    this.fade = new TWEEN.Tween(this.cube.material)
  }

  setPosition(p) {
    this.object3D.position.copy(p)
  }

  disappear() {
    if (this.fade) this.fade.stop()
    this.fade.to({opacity: 0}, 200)
    this.fade.start()
  }

  appear() {
    if (this.fade) this.fade.stop()
    this.cube.material.opacity = 0.4
  }
}

Voxel.geometryCache = {}

Voxel.geometryForSize = function(size) {
  if (Voxel.geometryCache[size]) return Voxel.geometryCache[size]
  Voxel.geometryCache[size] = new THREE.BoxBufferGeometry(size, size, size)
  return Voxel.geometryCache[size]
}

module.exports = Voxel
