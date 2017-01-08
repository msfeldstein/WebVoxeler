const glslify = require('glslify');
const path = require('path');

// This is the original source, we will copy + paste it for our own GLSL
// const vertexShader = THREE.ShaderChunk.meshphysical_vert;
// const fragmentShader = THREE.ShaderChunk.meshphysical_frag;

// Our custom shaders
const fragmentShader = glslify(path.resolve(__dirname, 'standard.frag'));
const vertexShader = glslify(path.resolve(__dirname, 'standard.vert'));

module.exports = MeshCustomMaterial;
function MeshCustomMaterial (parameters) {
  THREE.MeshStandardMaterial.call( this );
  this.uniforms = THREE.UniformsUtils.merge([
    THREE.ShaderLib.standard.uniforms,
    {
      // your custom uniforms or overrides to built-ins
    }
  ]);
  setFlags(this);
  this.setValues(parameters);
}

MeshCustomMaterial.prototype = Object.create( THREE.MeshStandardMaterial.prototype );
MeshCustomMaterial.prototype.constructor = MeshCustomMaterial;
MeshCustomMaterial.prototype.isMeshStandardMaterial = true;

MeshCustomMaterial.prototype.copy = function ( source ) {
  THREE.MeshStandardMaterial.prototype.copy.call( this, source );
  this.uniforms = THREE.UniformsUtils.clone(source.uniforms);
  setFlags(this);
  return this;
};

function setFlags (material) {
  material.vertexShader = vertexShader;
  material.fragmentShader = fragmentShader;
  material.type = 'MeshCustomMaterial';
}