// Functional graphics checks deliberately exercise Three.js in SwiftShader.
// Mask only the software-driver label so production's smooth-renderer policy
// does not skip that branch. This provides no hardware performance evidence.
function exerciseWebGL() {
  for (const type of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!type) continue;
    const original = type.prototype.getParameter;
    type.prototype.getParameter = function (parameter) {
      return parameter === 0x9246 ? 'NRTH functional WebGL test' : original.call(this, parameter);
    };
  }
}
module.exports = {exerciseWebGL};
