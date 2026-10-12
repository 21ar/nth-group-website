import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import type {MatterPose} from './matter-geometry';
import {smooth,atlasGroupFor} from './matter-geometry';
export type MatterContext={atlas?:number;selectedVenture?:number|null;surface?:number};
export class MatterRenderer {
  renderer:THREE.WebGLRenderer;
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(39,1,.1,60);
  group=new THREE.Group();mesh:THREE.InstancedMesh;
  ribbon:THREE.Mesh; ribbonPositions:Float32Array; ribbonColors:Float32Array;ribbonAcross=new THREE.Vector3();ribbonNormal=new THREE.Vector3();ribbonReference=new THREE.Vector3(0,0,1);
  object=new THREE.Object3D();direction=new THREE.Vector3();up=new THREE.Vector3(0,1,0);
  trace:THREE.LineSegments;tracePositions:Float32Array;traceColors:Float32Array;
  localCamera=new THREE.Vector3();surface=new THREE.Vector3();fragmentColor=new THREE.Color();traceColor=new THREE.Color();
  white=new THREE.Color('#ffffff');warm=new THREE.Color('#ffd1aa');dim=new THREE.Color('#777e89');seamColor=new THREE.Color('#ffb271');
  detailWeights=[0,0,0];detailFrom=[0,0,0];detailTarget:number|null=null;detailStart=0;detailMoving=false;
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
    const material=new THREE.MeshPhysicalMaterial({color:'#b6bcc5',metalness:.94,roughness:.19,clearcoat:.7,clearcoatRoughness:.18,envMapIntensity:1.3});
    this.mesh=new THREE.InstancedMesh(new RoundedBoxGeometry(1,1,1,3,.15),material,this.count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;
    for(let i=0;i<this.count;i++)this.mesh.setColorAt(i,this.white);
    this.mesh.instanceColor!.setUsage(THREE.DynamicDrawUsage);
    // Joined cross sections form a continuous surface from the same population.
    const sides=12;this.ribbonPositions=new Float32Array(this.count*sides*3);this.ribbonColors=new Float32Array(this.count*sides*3);
    const indices:number[]=[];
    for(let lane=0;lane<3;lane++){
      const members=Array.from({length:this.count},(_,i)=>i).filter(i=>i%3===lane);
      for(let slot=0;slot<members.length-1;slot++)for(let side=0;side<sides;side++){
        const a=members[slot]*sides+side,b=members[slot]*sides+(side+1)%sides,c=members[slot+1]*sides+side,d=members[slot+1]*sides+(side+1)%sides;
        indices.push(a,c,b,b,c,d);
      }
    }
    const ribbonGeometry=new THREE.BufferGeometry();ribbonGeometry.setIndex(indices);
    ribbonGeometry.setAttribute('position',new THREE.BufferAttribute(this.ribbonPositions,3).setUsage(THREE.DynamicDrawUsage));
    ribbonGeometry.setAttribute('color',new THREE.BufferAttribute(this.ribbonColors,3).setUsage(THREE.DynamicDrawUsage));
    this.ribbon=new THREE.Mesh(ribbonGeometry,new THREE.MeshPhysicalMaterial({color:'#bbc2cc',metalness:.94,roughness:.23,clearcoat:.65,envMapIntensity:1.25,vertexColors:true,side:THREE.DoubleSide,transparent:true,opacity:1}));
    this.ribbon.frustumCulled=false;this.group.add(this.ribbon);
    // Each guide follows one real fragment. Unrelated rods never acquire false connecting edges.
    this.tracePositions=new Float32Array(this.count*6);this.traceColors=new Float32Array(this.count*6);
    const traceGeometry=new THREE.BufferGeometry();
    traceGeometry.setAttribute('position',new THREE.BufferAttribute(this.tracePositions,3).setUsage(THREE.DynamicDrawUsage));
    traceGeometry.setAttribute('color',new THREE.BufferAttribute(this.traceColors,3).setUsage(THREE.DynamicDrawUsage));
    this.trace=new THREE.LineSegments(traceGeometry,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.16,depthWrite:false}));
    this.trace.frustumCulled=false;this.trace.visible=!centered;this.group.add(this.trace);
    this.group.add(this.mesh);this.scene.add(this.group);
    const key=new THREE.DirectionalLight('#ffffff',3);key.position.set(4,5,7);this.scene.add(key);
    const rim=new THREE.DirectionalLight('#ff743b',5);rim.position.set(-2,-3,3);this.scene.add(rim);
    this.scene.add(new THREE.HemisphereLight('#f2f0e9','#282635',.6));
    this.camera.position.set(0,0,8.8);this.camera.lookAt(0,0,0);
    this.renderer.domElement.setAttribute('aria-hidden','true');host.append(this.renderer.domElement);this.resize(host);
  }
  resize(host:HTMLElement){this.width=host.clientWidth;this.height=host.clientHeight;this.renderer.setSize(this.width,this.height,false);this.camera.aspect=this.width/this.height;this.camera.updateProjectionMatrix();}
  draw(pose:MatterPose,progress:number,pointer:{x:number;y:number},light:number,inspect:number|null=null,context:MatterContext={}){
    const now=performance.now();
    if(inspect!==this.detailTarget){this.detailFrom=[...this.detailWeights];this.detailTarget=inspect;this.detailStart=now;this.detailMoving=true;}
    if(this.detailMoving){
      const phase=Math.min(1,(now-this.detailStart)/780),mix=smooth(phase);
      this.detailWeights=this.detailFrom.map((value,i)=>value+(Number(i===this.detailTarget)-value)*mix);this.detailMoving=phase<1;
    }
    // The art reaches its reserved field area before the first industry copy appears.
    const narrow=this.width<768,field=smooth((progress-.28)/.14),atlas=Math.max(0,Math.min(1,context.atlas||0));
    const cloud=smooth(progress/.28)*(1-smooth((progress-.32)/.2));
    const mobileHeight=Math.min(1.15,this.height/844),scale=narrow?(.53-field*.25+atlas*.025)*mobileHeight*(1-cloud*.45):1.24-field*.42-atlas*.12;
    this.group.scale.setScalar(scale);
    this.group.position.set(narrow?.08:1.92+field*.17+atlas*.24+cloud*.65,narrow?.3+field*1.6+cloud*1.5*(1-field):.24,0);
    if(this.centered){this.group.position.set(0,0,0);this.group.scale.setScalar(narrow?.75:1.15);}
    this.group.rotation.set(.13+pointer.y*.12*(1-atlas*.5),progress*.48*(1-atlas*.75)+pointer.x*.24*(1-atlas*.5),-.3*(1-progress));
    this.group.updateWorldMatrix(true,false);this.localCamera.copy(this.camera.position);this.group.worldToLocal(this.localCamera);
    const targetX=pointer.x*3.5-(narrow?.3:1.92),targetY=pointer.y*2.5;
    const inspection=this.detailWeights.reduce((total,value)=>total+value,0),seamPhase=(progress*3.1+.16)%1;
    const surfaceAmount=Math.max(0,Math.min(1,context.surface??0));
    this.ribbon.visible=surfaceAmount>.005;
    (this.ribbon.material as THREE.MeshPhysicalMaterial).opacity=surfaceAmount;
    (this.mesh.material as THREE.MeshPhysicalMaterial).transparent=surfaceAmount>0;
    (this.mesh.material as THREE.MeshPhysicalMaterial).opacity=1-surfaceAmount;
    this.mesh.visible=surfaceAmount<.995;
    for(let i=0;i<this.count;i++){
      const o=i*3,x=pose.position[o],y=pose.position[o+1],z=pose.position[o+2];
      const influence=Math.exp(-((x-targetX)**2+(y-targetY)**2)*.7)*.055;
      this.object.position.set(x+(x-targetX)*influence,y+(y-targetY)*influence,z+influence*.9);
      this.direction.set(pose.direction[o],pose.direction[o+1],pose.direction[o+2]);
      this.object.quaternion.setFromUnitVectors(this.up,this.direction);
      this.object.rotateY(pose.twist?.[i]||0);
      const selected=this.detailWeights.reduce((total,weight,j)=>total+weight*(pose.inspection?.[o+j]||0),0);
      const phase=pose.seam?.[i]||0,rawDistance=Math.abs(phase-seamPhase),distance=Math.min(rawDistance,1-rawDistance),seam=Math.exp(-distance*distance/ .0035);
      const ventureSelected=atlas&&context.selectedVenture!==null&&context.selectedVenture!==undefined?Number(atlasGroupFor(i,this.count)===context.selectedVenture)*atlas:0;
      this.object.scale.set(pose.size[o]*(1+selected*.055),pose.size[o+1],pose.size[o+2]*(1+selected*.055));this.object.updateMatrix();this.mesh.setMatrixAt(i,this.object.matrix);
      this.fragmentColor.copy(this.white).lerp(this.dim,inspection*.65).lerp(this.warm,selected*.62).lerp(this.seamColor,seam*.13+ventureSelected*.28);this.mesh.setColorAt(i,this.fragmentColor);
      if(this.ribbon.visible){
        this.ribbonAcross.crossVectors(this.direction,this.ribbonReference);
        if(this.ribbonAcross.lengthSq()<.01)this.ribbonAcross.set(1,0,0);else this.ribbonAcross.normalize();
        this.ribbonNormal.crossVectors(this.ribbonAcross,this.direction).normalize();
        for(let side=0;side<12;side++){
          const angle=side/12*Math.PI*2+(pose.twist?.[i]||0),c=Math.cos(angle)*pose.size[o]*.5,s=Math.sin(angle)*pose.size[o+2]*.5,offset=(i*12+side)*3;
          this.ribbonPositions[offset]=this.object.position.x+this.ribbonAcross.x*c+this.ribbonNormal.x*s;
          this.ribbonPositions[offset+1]=this.object.position.y+this.ribbonAcross.y*c+this.ribbonNormal.y*s;
          this.ribbonPositions[offset+2]=this.object.position.z+this.ribbonAcross.z*c+this.ribbonNormal.z*s;
          this.fragmentColor.toArray(this.ribbonColors,offset);
        }
      }
      if(!this.centered){
        // The seam stays attached to each real surface through every arrangement.
        this.surface.copy(this.localCamera).sub(this.object.position);
        this.surface.addScaledVector(this.direction,-this.surface.dot(this.direction)).normalize().multiplyScalar(Math.max(pose.size[o],pose.size[o+2])*.52+.006);
        const halfLength=pose.size[o+1]*.5;
        for(let endpoint=0;endpoint<2;endpoint++){
          const sign=endpoint===0?-1:1,offset=i*6+endpoint*3;
          const surfaceX=this.object.position.x+this.surface.x+this.direction.x*halfLength*sign;
          const surfaceY=this.object.position.y+this.surface.y+this.direction.y*halfLength*sign;
          const surfaceZ=this.object.position.z+this.surface.z+this.direction.z*halfLength*sign;
          this.tracePositions[offset]=surfaceX;this.tracePositions[offset+1]=surfaceY;this.tracePositions[offset+2]=surfaceZ;
          this.traceColor.set('#8e9caa').lerp(this.seamColor,seam).lerp(this.warm,selected).multiplyScalar((.25+seam*1.7)*(1-inspection*.85)+selected*1.4).toArray(this.traceColors,offset);
        }
      }
    }
    this.mesh.instanceMatrix.needsUpdate=true;
    this.mesh.instanceColor!.needsUpdate=true;
    if(this.ribbon.visible){this.ribbon.geometry.attributes.position.needsUpdate=true;this.ribbon.geometry.attributes.color.needsUpdate=true;this.ribbon.geometry.computeVertexNormals();}
    if(!this.centered){
      this.trace.geometry.attributes.position.needsUpdate=true;this.trace.geometry.attributes.color.needsUpdate=true;
      (this.trace.material as THREE.LineBasicMaterial).opacity=(.44+inspection*.35)*(1-light*.55);
    }
    this.scene.environmentIntensity=1-light*.28;
    this.renderer.render(this.scene,this.camera);this.frames++;
  }
  adapt(frameTime:number){if(frameTime>42)this.slowFrames++;else this.slowFrames=Math.max(0,this.slowFrames-1);if(this.slowFrames>12&&this.renderer.getPixelRatio()>.65){this.renderer.setPixelRatio(Math.max(.65,this.renderer.getPixelRatio()*.82));this.renderer.setSize(this.width,this.height,false);this.slowFrames=0;}}
  dispose(){this.mesh.geometry.dispose();(this.mesh.material as THREE.Material).dispose();this.ribbon.geometry.dispose();(this.ribbon.material as THREE.Material).dispose();this.trace.geometry.dispose();(this.trace.material as THREE.Material).dispose();this.env.dispose();this.renderer.dispose();this.renderer.domElement.remove();}
}
