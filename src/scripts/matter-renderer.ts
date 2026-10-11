import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import type {MatterPose} from './matter-geometry';
import {smooth} from './matter-geometry';
export class MatterRenderer {
  renderer:THREE.WebGLRenderer;
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(39,1,.1,60);
  group=new THREE.Group();mesh:THREE.InstancedMesh;
  object=new THREE.Object3D();direction=new THREE.Vector3();up=new THREE.Vector3(0,1,0);
  env:THREE.WebGLRenderTarget;count:number;width=1;height=1;frames=0;slowFrames=0;centered:boolean;
  constructor(host:HTMLElement,centered=false){
    this.centered=centered;
    this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;
    const gl=this.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
    const software=ext&&/swiftshader|llvmpipe|software/i.test(String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)));
    this.count=innerWidth<768?108:software?132:192;
    if(software)this.renderer.setPixelRatio(.8);
    const room=new THREE.Scene();room.background=new THREE.Color('#08090c');
    const panels:[number,number,number,number,number,number,number,string,number][]=[
      [8,4,-1,5,10,0,-Math.PI/2,'#ffffff',5],[-8,1,2,4,9,0,Math.PI/2,'#cbd5ec',3],
      [0,8,0,12,3,Math.PI/2,0,'#ffffff',5],[3,-6,1,9,3,-Math.PI/2,0,'#ff692d',8],
      [0,1,8,7,1,0,Math.PI,'#ffffff',4],[-3,-1,-8,3,8,0,0,'#ff8b4b',3],
    ];
    panels.forEach(([x,y,z,w,h,rx,ry,color,intensity])=>{const mat=new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide});const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);plane.position.set(x,y,z);plane.rotation.set(rx,ry,0);room.add(plane);});
    const pmrem=new THREE.PMREMGenerator(this.renderer);this.env=pmrem.fromScene(room,.035);this.scene.environment=this.env.texture;pmrem.dispose();
    room.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(object.material as THREE.Material).dispose();}});
    const material=new THREE.MeshPhysicalMaterial({color:'#a9afb9',metalness:1,roughness:.13,clearcoat:.7,clearcoatRoughness:.12,envMapIntensity:1.25});
    this.mesh=new THREE.InstancedMesh(new RoundedBoxGeometry(1,1,1,3,.15),material,this.count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;
    this.group.add(this.mesh);this.scene.add(this.group);
    const key=new THREE.DirectionalLight('#ffffff',3);key.position.set(4,5,7);this.scene.add(key);
    const rim=new THREE.DirectionalLight('#ff743b',5);rim.position.set(-2,-3,3);this.scene.add(rim);
    this.camera.position.set(0,0,8.8);this.camera.lookAt(0,0,0);
    this.renderer.domElement.setAttribute('aria-hidden','true');host.append(this.renderer.domElement);this.resize(host);
  }
  resize(host:HTMLElement){this.width=host.clientWidth;this.height=host.clientHeight;this.renderer.setSize(this.width,this.height,false);this.camera.aspect=this.width/this.height;this.camera.updateProjectionMatrix();}
  draw(pose:MatterPose,progress:number,pointer:{x:number;y:number},light:number){
    const narrow=this.width<768,field=Math.max(0,Math.min(1,(progress-.3)/.25));
    const cloud=smooth(progress/.28)*(1-smooth((progress-.32)/.2));
    const mobileHeight=Math.min(1.15,this.height/844),scale=narrow?(.53-field*.25)*mobileHeight*(1-cloud*.45):1.24-field*.42;
    this.group.scale.setScalar(scale);
    this.group.position.set(narrow?.08:1.92+field*.17,narrow?.3+field*1.6+cloud*1.5*(1-field):.24,0);
    if(this.centered){this.group.position.set(0,0,0);this.group.scale.setScalar(narrow?.75:1.15);}
    this.group.rotation.set(.13+pointer.y*.12,progress*.48+pointer.x*.24,-.3*(1-progress));
    const targetX=pointer.x*3.5-(narrow?.3:1.92),targetY=pointer.y*2.5;
    for(let i=0;i<this.count;i++){
      const o=i*3,x=pose.position[o],y=pose.position[o+1],z=pose.position[o+2];
      const influence=Math.exp(-((x-targetX)**2+(y-targetY)**2)*.7)*.055;
      this.object.position.set(x+(x-targetX)*influence,y+(y-targetY)*influence,z+influence*.9);
      this.direction.set(pose.direction[o],pose.direction[o+1],pose.direction[o+2]);
      this.object.quaternion.setFromUnitVectors(this.up,this.direction);
      this.object.scale.set(pose.size[o],pose.size[o+1],pose.size[o+2]);this.object.updateMatrix();this.mesh.setMatrixAt(i,this.object.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate=true;
    this.scene.environmentIntensity=1-light*.28;
    this.renderer.render(this.scene,this.camera);this.frames++;
  }
  adapt(frameTime:number){if(frameTime>42)this.slowFrames++;else this.slowFrames=Math.max(0,this.slowFrames-1);if(this.slowFrames>12&&this.renderer.getPixelRatio()>.65){this.renderer.setPixelRatio(Math.max(.65,this.renderer.getPixelRatio()*.82));this.renderer.setSize(this.width,this.height,false);this.slowFrames=0;}}
  dispose(){this.mesh.geometry.dispose();(this.mesh.material as THREE.Material).dispose();this.env.dispose();this.renderer.dispose();this.renderer.domElement.remove();}
}
