import {smooth} from './matter-geometry';
for(const root of document.querySelectorAll<HTMLElement>('[data-framework-surface]')){
 const pieces=[...root.querySelectorAll<SVGGElement>('[data-framework-module]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let visible=false,raf=0,paused=document.documentElement.classList.contains('motion-paused');
 function draw(){
  raf=0;if(!visible||document.hidden)return;
  const box=root.getBoundingClientRect();
  const p=paused||reduced.matches?1:smooth((innerHeight*.82-box.top)/(innerHeight*.8+box.height*.3));
  root.style.setProperty('--framework-progress',String(p));
  pieces.forEach((piece,i)=>{
   const col=i%3,row=Math.floor(i/3);
   const x=210+col*240+(450+(col-1)*110-(210+col*240))*p;
   const y=160+row*255+(250+row*170+(col-1)*47-(160+row*255))*p;
   piece.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${1-p*.16})`);
  });
 }
 function wake(){if(visible&&!document.hidden&&!raf)raf=requestAnimationFrame(draw);}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'100px'}).observe(root);
 window.addEventListener('scroll',wake,{passive:true});window.addEventListener('resize',wake);document.addEventListener('visibilitychange',wake);reduced.addEventListener('change',wake);
 window.addEventListener('nrth:motion',event=>{paused=Boolean((event as CustomEvent).detail.paused);wake();});
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;});
}
