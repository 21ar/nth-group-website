import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {makeSolidSheet,makeSolidIndices,blendWeightedSheet,sheetColors,ease} from './fold-geometry';
import type {FoldRenderer} from './fold-renderer';

export function createFoldWebGL(host: HTMLElement): FoldRenderer | undefined {
  let renderer: THREE.WebGLRenderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});} catch {return;}
  const gl=renderer.getContext(), debug=gl.getExtension('WEBGL_debug_renderer_info');
  if(debug && /swiftshader|llvmpipe|software/i.test(String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)))) {renderer.dispose();return;}
  let pixelRatio=Math.min(devicePixelRatio,1.4),lastDraw=0,slowFrames=0;
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.95;
  renderer.setClearColor(0xf6f6f2,0);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  const scene=new THREE.Scene(), camera=new THREE.OrthographicCamera(-10,10,6,-6,.1,70);
  const pmrem=new THREE.PMREMGenerator(renderer), room=new RoomEnvironment(), environment=pmrem.fromScene(room,.04);
  scene.environment=environment.texture; room.dispose();pmrem.dispose();
  scene.environmentIntensity=.65;scene.add(new THREE.HemisphereLight(0xffffff,0xb6a9aa,1.1));
  const light=new THREE.DirectionalLight(0xfff5eb,1.8);light.position.set(-4,8,9);scene.add(light);
  light.castShadow=true;light.shadow.mapSize.set(512,512);Object.assign(light.shadow.camera,{left:-13,right:13,top:12,bottom:-12,near:.5,far:40});light.shadow.bias=-.0005;light.shadow.normalBias=.04;light.shadow.radius=6;
  const rim=new THREE.DirectionalLight(0xd8d0ff,1.2);rim.position.set(5,4,-5);scene.add(rim);
  const group=new THREE.Group();scene.add(group);
  // A fine, repeatable frost catches the light without adding image or video downloads.
  const pixels=new Uint8Array(128*128*4);let seed=37;
  for(let i=0;i<pixels.length;i+=4){seed=(seed*1664525+1013904223)>>>0;pixels[i]=128+((seed>>>8)%9)-4;pixels[i+1]=128+((seed>>>16)%9)-4;pixels[i+2]=255;pixels[i+3]=255;}
  const frost=new THREE.DataTexture(pixels,128,128);frost.wrapS=frost.wrapT=THREE.RepeatWrapping;frost.repeat.set(18,6);frost.needsUpdate=true;
  const floorGeometry=new THREE.PlaneGeometry(50,40),floorMaterial=new THREE.ShadowMaterial({opacity:.045});const floor=new THREE.Mesh(floorGeometry,floorMaterial);floor.rotation.x=-Math.PI/2;floor.position.y=-1.9;floor.receiveShadow=true;scene.add(floor);
  const segments=100, rows=10;
  const sheets=sheetColors.map((color,layer)=>{
    const poses=Array.from({length:7},(_,pose)=>makeSolidSheet(pose,layer,segments,rows));
    const geometry=new THREE.BufferGeometry();geometry.setIndex(makeSolidIndices(segments,rows));geometry.setAttribute('position',new THREE.BufferAttribute(poses[0].slice(),3));geometry.computeVertexNormals();
    const uv=new Float32Array((segments+1)*(rows+1)*2*2);for(let face=0;face<2;face++)for(let u=0;u<=segments;u++)for(let v=0;v<=rows;v++){const i=(face*(segments+1)*(rows+1)+u*(rows+1)+v)*2;uv[i]=u/segments;uv[i+1]=v/rows;}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    const material=new THREE.MeshPhysicalMaterial({color,metalness:.03,roughness:.32,normalMap:frost,normalScale:new THREE.Vector2(.22,.22),transmission:layer===2?.04:.2,thickness:.09,ior:1.35,clearcoat:.75,clearcoatRoughness:.26,side:THREE.DoubleSide});
    const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
    // Both long edges are sampled from the very same surface.
    const edgeGeometry=new THREE.BufferGeometry();edgeGeometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(segments*4*3),3));
    const edgeMaterial=new THREE.LineBasicMaterial({color:layer===0?0xf45d39:layer===1?0x9b87d7:0xffffff,transparent:true,opacity:.55});
    const edges=new THREE.LineSegments(edgeGeometry,edgeMaterial);group.add(edges);
    return {poses,geometry,material,edgeGeometry,edgeMaterial};
  });
  const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');host.append(canvas);
  host.dataset.renderer='webgl';
  function resize(){const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height,false);const aspect=width/Math.max(height,1), span=aspect<1?18/aspect:10.6;camera.left=-span*aspect/2;camera.right=span*aspect/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();}
  resize();
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();host.dispatchEvent(new CustomEvent('nrth:renderer-lost'));});
  return {
    resize,
    draw(frame){
      const start=performance.now();
      const interval=start-lastDraw;lastDraw=start;if(interval>32&&interval<160)slowFrames++;else slowFrames=Math.max(0,slowFrames-1);
      if(slowFrames>18&&pixelRatio>.9){pixelRatio=Math.max(.9,pixelRatio-.2);renderer.setPixelRatio(pixelRatio);resize();slowFrames=0;host.dataset.quality='adaptive';}
      sheets.forEach(({poses,geometry,edgeGeometry})=>{
        const positions=geometry.attributes.position.array as Float32Array;
        blendWeightedSheet(positions,poses,frame.progress,frame.weights);
        geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();
        const edge=edgeGeometry.attributes.position.array as Float32Array;
        for(let u=0;u<segments;u++)for(const [side,v] of [0,rows].entries()){const a=(u*(rows+1)+v)*3,b=((u+1)*(rows+1)+v)*3;edge.set(positions.subarray(a,a+3),u*12+side*6);edge.set(positions.subarray(b,b+3),u*12+side*6+3);}
        edgeGeometry.attributes.position.needsUpdate=true;
      });
      group.rotation.y=frame.pointerX*.035;group.rotation.x=frame.pointerY*.018;
      const p=ease(frame.progress),aspect=host.clientWidth/host.clientHeight,mobileOffset=aspect<1?camera.top*.36:0;camera.position.set(-.7+frame.pointerX*.16,5.8+mobileOffset,18);camera.lookAt(.2,2.65-p*.9+mobileOffset,0);
      renderer.render(scene,camera);host.dataset.renderMs=(performance.now()-start).toFixed(1);host.dataset.renderedProgress=frame.progress.toFixed(4);
    },
    dispose(){sheets.forEach(s=>{s.geometry.dispose();s.material.dispose();s.edgeGeometry.dispose();s.edgeMaterial.dispose();});frost.dispose();floorGeometry.dispose();floorMaterial.dispose();light.shadow.map?.dispose();environment.dispose();renderer.dispose();canvas.remove();}
  };
}
