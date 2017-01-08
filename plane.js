var vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

var fragmentShader = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
  }
`;

module.exports = function(scene) {
  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10, 1, 1),
    new THREE.MeshPhongMaterial({
      color: 0xaeaeae
    })
  )
  plane.rotation.x = -Math.PI / 2
  plane.receiveShadow = true
  scene.add(plane)
  return plane
}
