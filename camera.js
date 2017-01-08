module.exports = function(scene) {
  var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 700);
  scene.add(camera)
  return camera
}
