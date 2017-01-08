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
    // this._newVoxel(controller)
    controller.on(controller.TriggerClicked, this._clicked.bind(this, controller))
    controller.cursor = new THREE.Mesh(
      new THREE.SphereBufferGeometry(.01, 4, 4),
      new THREE.MeshBasicMaterial({color: 0xff0000})
    )
    controller.add(controller.cursor)
    controller.cursor.position.z = -0.2
    controller.selectedPosition = new THREE.Vector3()
    controller.previousSelectedPosition = new THREE.Vector3()

    // Have a few ghost voxels so that we can have fading trails as you move around
    controller.ghostQueue = [
      new Voxel(this.gridSize, true),
      new Voxel(this.gridSize, true),
      new Voxel(this.gridSize, true),
      new Voxel(this.gridSize, true),
      new Voxel(this.gridSize, true),
      new Voxel(this.gridSize, true),
      new Voxel(this.gridSize, true),
    ]
    controller.ghostQueue.forEach((ghost) => this.container.add(ghost.object3D))
    controller.ghostQueueIndex = 0

    return controller
  }

  _clicked(controller) {
    this._newVoxel(controller)
  }

  _newVoxel(controller) {
    var voxel = new Voxel(this.gridSize, false)
    this.voxels.push(voxel)
    voxel.setPosition(controller.selectedPosition)
    this.container.add(voxel.object3D)
  }

  update() {
    this._updateController(this.leftController)
    this._updateController(this.rightController)
  }

  _updateController(controller) {
    controller.previousSelectedPosition.copy(controller.selectedPosition)
    this.snapVec(controller.selectedPosition.setFromMatrixPosition(controller.cursor.matrixWorld))
    if (!controller.previousSelectedPosition.equals(controller.selectedPosition)) {
      this._newSpot(controller)
    }
    // controller.voxel.update(controller.selectedPosition)
  }

  _newSpot(controller) {
    controller.ghostQueue.forEach((ghost) => ghost.disappear())
    var nextGhost = controller.ghostQueue[controller.ghostQueueIndex++ % controller.ghostQueue.length]
    nextGhost.setPosition(controller.selectedPosition)
    nextGhost.appear()
    if (controller.triggerClicked) {
      this._newVoxel(controller)
    }
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
  }

  snap(v) {
    return Math.round(v / this.gridSize) * this.gridSize
  }

  snapVec(vector) {
    vector.x = this.snap(vector.x)
    vector.y = this.snap(vector.y)
    vector.z = this.snap(vector.z)
  }
}

module.exports = VoxelGrid
