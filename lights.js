module.exports = function(scene) {
  var ambient = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( ambient );
  var directional = new THREE.DirectionalLight( 0xffffff, 1 );
  directional.position.set( 200, 200, 200 );
  scene.add( directional );
  
  directional.castShadow = true
  directional.shadow.mapSize.width = 2048
  directional.shadow.mapSize.height = 1024
  directional.shadow.bias = 0.0039
  directional.shadow.camera.left = -100
  directional.shadow.camera.right = 100
  directional.shadow.camera.top = 100
  directional.shadow.camera.bottom = -100
  
  
  // scene.add(new THREE.CameraHelper( directional.shadow.camera ))
  return directional
  
}