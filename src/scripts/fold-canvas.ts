import {makeSheet,blendWeightedSheet,ease} from './fold-geometry';
import type {FoldRenderer} from './fold-renderer';

/** Shaded sampled surfaces preserve native scroll, even without a GPU. */
export function createFoldCanvas(host:HTMLElement):FoldRenderer|undefined{
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  canvas.setAttribute('aria-hidden','true');host.append(canvas);host.dataset.renderer='surface';
  const segments=120,rows=2;
  const sheets=[0,1,2].map(layer=>({layer,poses:Array.from({length:7},(_,pose)=>makeSheet(pose,layer,segments,rows)),positions:makeSheet(0,layer,segments,rows)}));
  let width=1,height=1,ratio=1;
  function resize(){const r=host.getBoundingClientRect();width=r.width;height=r.height;ratio=Math.min(devicePixelRatio,1.75);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;}
  resize();
  return{resize,dispose(){canvas.remove();},draw(frame){
    const start=performance.now();ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
    const aspect=width/height,span=aspect<1?18/aspect:10.6,scale=height/span,p=ease(frame.progress),rotation=frame.pointerX*.035;
    function project(a:Float32Array,i:number){const x=a[i],y=a[i+1],z=a[i+2],xr=x*Math.cos(rotation)+z*Math.sin(rotation),zr=z*Math.cos(rotation)-x*Math.sin(rotation);return{x:width/2+(xr-.2)*scale,y:height/2-((y-2.65+p*.9)*.985-zr*.17)*scale+(aspect<1?height*.18:0)};}
    ctx.save();ctx.translate(width*.58,height*.94);ctx.scale(1,.1);const shadow=ctx.createRadialGradient(0,0,0,0,0,width*.5);shadow.addColorStop(0,'rgba(150,118,131,.16)');shadow.addColorStop(1,'rgba(150,118,131,0)');ctx.fillStyle=shadow;ctx.fillRect(-width,-width,width*2,width*2);ctx.restore();
    // Whole contours avoid painter-sort cracks at overlapping transparent sheets.
    for(const layer of [1,2,0]){
      const sheet=sheets[layer];blendWeightedSheet(sheet.positions,sheet.poses,frame.progress,frame.weights);
      const upper=[],lower=[];
      for(let u=0;u<=segments;u++){upper.push(project(sheet.positions,(u*(rows+1)+rows)*3));lower.push(project(sheet.positions,u*(rows+1)*3));}
      const all=upper.concat(lower),minX=Math.min(...all.map(p=>p.x)),maxX=Math.max(...all.map(p=>p.x)),minY=Math.min(...all.map(p=>p.y)),maxY=Math.max(...all.map(p=>p.y));
      const path=new Path2D();upper.forEach((pt,i)=>i?path.lineTo(pt.x,pt.y):path.moveTo(pt.x,pt.y));lower.slice().reverse().forEach(pt=>path.lineTo(pt.x,pt.y));path.closePath();
      const gradient=ctx.createLinearGradient(minX,minY,maxX,maxY);
      const colors=layer===0?['#ffe1c8','#ffb58e','#f57c59','#e98973']:layer===1?['#eee9fb','#ccc2f1','#aea0e1','#d3c8ed']:['#fff8e9','#ede2cc','#fbf6ec','#e2d7c9'];
      colors.forEach((color,index)=>gradient.addColorStop(index/3,color));ctx.fillStyle=gradient;ctx.fill(path,'evenodd');
      ctx.save();ctx.clip(path,'evenodd');
      const light=ctx.createLinearGradient(minX,maxY,maxX,minY);light.addColorStop(0,'rgba(255,255,255,0)');light.addColorStop(.38,'rgba(255,255,255,.03)');light.addColorStop(.55,'rgba(255,255,255,.35)');light.addColorStop(.72,'rgba(255,255,255,.02)');light.addColorStop(1,'rgba(255,255,255,.12)');ctx.fillStyle=light;ctx.fillRect(minX,minY,maxX-minX,maxY-minY);
      ctx.restore();
      for(const [index,edge] of [upper,lower].entries()){ctx.strokeStyle=index===0?'rgba(255,255,255,.85)':layer===0?'rgba(206,78,45,.45)':layer===1?'rgba(129,104,199,.45)':'rgba(208,194,176,.5)';ctx.lineWidth=1.2;ctx.lineJoin='round';ctx.beginPath();edge.forEach((pt,i)=>i?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y));ctx.stroke();}
    }
    host.dataset.renderMs=(performance.now()-start).toFixed(1);host.dataset.renderedProgress=frame.progress.toFixed(4);
  }};
}
