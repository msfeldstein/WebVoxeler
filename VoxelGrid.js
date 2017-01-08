const Voxel = require('./Voxel')
const StretchGesture = require('./gestures/stretch')
class VoxelGrid {
  constructor(params) {
    this.object3D = new THREE.Object3D()
    params.scene.add(this.object3D)
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
    return controller
  }

  _clicked(controller) {
    console.log("Clicked ", controller)
    this._newVoxel(controller)
  }

  _newVoxel(controller) {
    if (controller.voxel) {
      controller.voxel.drop()
    }
    var voxel = new Voxel(controller, this.gridSize)
    this.voxels.push(voxel)
    this.object3D.add(voxel.object3D)
    controller.voxel = voxel
  }

  update() {
    this._updateController(this.leftController)
    this._updateController(this.rightController)
  }

  _updateController(controller) {
    controller.voxel.update()
  }

  _startStretching() {
    console.log("Yea i'll start")
  }

  _stretchChanged(e) {
    console.log("change", e)
  }

  _endStretching() {
    console.log("Ok i'll end")
  }

  snap(v) {
    return Math.round(v / this.gridSize) * this.gridSize
  }
}

module.exports = VoxelGrid
