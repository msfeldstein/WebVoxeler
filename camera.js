module.exports = function(scene) {
  var camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.001, 1000)
  scene.add(camera)
  camera.position.y = 80
  return camera
}