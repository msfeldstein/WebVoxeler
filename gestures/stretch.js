// Uses the three-vive-controller class to grab with the grips and stretch apart
const EventEmitter = require('eventemitter3');
const extend = require('./extend')
class StretchGesture {
  constructor(controllers) {
    extend(this, new EventEmitter)
    this._setupListeners(controllers[0])
    this._setupListeners(controllers[1])
    this.left = controllers[0]
    this.right = controllers[1]
    this.isStretching = false

    this.OnBegin = "BeginStretching"
    this.OnEnd = "EndStretching"
    this.OnChange = "ChangeStretching"

    this._stretchChanged = this._stretchChanged.bind(this)
    this.center = new THREE.Vector3()
  }

  _setupListeners(controller) {
    controller.on(controller.Gripped, this._gripped.bind(this, controller))
    controller.on(controller.Ungripped, this._ungripped.bind(this, controller))
  }

  _gripped(controller) {
    if (!this.isStretching && this.left.gripped && this.right.gripped) {
      this._beginStretching()
    }
  }

  _ungripped(controller) {
    if (this.isStretching) {
      this._endStretching()
    }
  }

  _beginStretching() {
    this.isStretching = true
    this._initialDistance = this._distance()
    this._updateCenter()
    this.pivot = this.center.clone()
    this.emit(this.OnBegin, {
      pivot: this.pivot,
      center: this.center
    })
    this._stretchChanged()
  }

  _stretchChanged() {
    if (!this.isStretching) return
    this._updateCenter()
    var currentDistance = this._distance()
    var delta = currentDistance - this._previousDistance
    this._previousDistance = currentDistance
    this.emit(this.OnChange, {
      pivot: this.pivot,
      center: this.center,
      delta: delta,
      percent: currentDistance / this._initialDistance
    })
    requestAnimationFrame(this._stretchChanged)
  }

  _updateCenter() {
    var leftP = this.left.position
    var rightP = this.right.position
    this.center.x = (leftP.x + rightP.x) / 2
    this.center.y = (leftP.y + rightP.y) / 2
    this.center.z = (leftP.z + rightP.z) / 2
    return this.center
  }

  _endStretching() {
    this.isStretching = false
    this.emit(this.OnEnd)
  }

  _distance() {
    return this.left.position.distanceTo(this.right.position)
  }
}

module.exports = StretchGesture
