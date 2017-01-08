module.exports = function(canvas) {
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMapBias = 0.0039;
  renderer.shadowMapDarkness = 0.5;
  renderer.shadowMapWidth = 1024;
  renderer.shadowMapHeight = 1024;
  
  return {
    renderer,
    canvas
  }
}