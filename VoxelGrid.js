const Voxel = require('./Voxel')
const StretchGesture = require('./gestures/stretch')
class VoxelGrid {
  constructor(params) {
    this.pivot = new THREE.Object3D()
    this.container = new THREE.Object3D()
    this.pivot.add(this.container)
    this.scene = params.scene
    this.scene.add(this.pivot)
    this.gridSize = params.gridSize
    this.voxels = []
    this.controllers = params.controllers
    this.leftController = this._setupController(params.controllers[0])
    this.rightController = this._setupController(params.controllers[1])

    this.stretchGesture = new StretchGesture(params.controllers)
    this.stretchGesture.on(
      this.stretchGesture.OnBegin, this._startStretching.bind(this)
    )

    this.stretchGesture.on(
      this.stretchGesture.OnChange, this._stretchChanged.bind(this)
    )

    this.stretchGesture.on(
      this.stretchGesture.OnEnd, this._endStretching.bind(this)
    )
  }

  _setupController(controller) {
    this._newVoxel(controller)
    controller.on(controller.TriggerClicked, this._clicked.bind(this, controller))
    controller.cursor = new THREE.Mesh(
      new THREE.SphereBufferGeometry(.01, 5, 5),
      new THREE.MeshPhongMaterial({color: 0xff0000})
    )
    controller.add(controller.cursor)
    controller.cursor.position.z = -0.2
    return controller
  }

  _clicked(controller) {
    this._newVoxel(controller)
  }

  _newVoxel(controller) {
    if (controller.voxel) {
      controller.voxel.drop()
    }
    var voxel = new Voxel(controller, this.gridSize)
    this.voxels.push(voxel)
    this.container.add(voxel.object3D)
    controller.voxel = voxel
  }

  update() {
    this._updateController(this.leftController)
    this._updateController(this.rightController)
  }

  _updateController(controller) {
    controller.voxel.update()
  }

  _startStretching(e) {
    this._initialScale = this.pivot.scale.x

    // We need to pivot from the center, but we need to keep the same world
    // position of the container after moving the pivot.
    THREE.SceneUtils.detach(this.container, this.pivot, this.scene)
    this.pivot.position.copy(e.center)
    this.pivot.updateMatrixWorld()
    THREE.SceneUtils.attach(this.container, this.scene, this.pivot)
  }

  _stretchChanged(e) {
    var newScale = this._initialScale * e.percent
    this.pivot.scale.set(newScale, newScale, newScale)
  }

  _endStretching() {
    console.log("Ok i'll end")
  }

  snap(v) {
    return Math.round(v / this.gridSize) * this.gridSize
  }
}

module.exports = VoxelGrid
