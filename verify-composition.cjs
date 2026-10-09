const {chromium}=require('@playwright/test'),assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.NRTH_TEST_URL||'http://127.0.0.1:4173',out='artifacts/living-fold',results=[];
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage();
  for(const [width,height] of [[360,640],[390,667],[390,844],[768,700],[1024,768],[1440,700],[1440,1000]]){
   await page.setViewportSize({width,height});await page.goto(base,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.querySelector('[data-hero-scene]').classList.contains('fold-ready'));
   for(const progress of [0,.5,1]){
    await page.evaluate(p=>{const s=document.querySelector('[data-fold-story]');scrollTo({top:s.offsetTop+(s.offsetHeight-innerHeight)*p,behavior:'instant'});},progress);await page.waitForTimeout(750);
    if(progress===1)for(const field of ['Mobility','Health','Systems','Materials','Events','Research']){
     await page.locator('[data-fold-field="'+field+'"]').click();await page.waitForTimeout(20);await inspect(field);
    }else await inspect('scroll-'+progress);
    async function inspect(state){
     const result=await page.evaluate(()=>{
      const visible=[...document.querySelectorAll('[data-fold-panel]:not([hidden]) .fold-field-copy,[data-fold-panel]:not([hidden]) .fold-ventures,.fold-fields')];
      const rects=visible.map(el=>el.getBoundingClientRect()),content=document.querySelector('[data-fold-content]'),active=Number(getComputedStyle(content).opacity)>.99;
      const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
      const collisions=active?rects.flatMap((a,i)=>rects.slice(i+1).flatMap((b,j)=>overlap(a,b)?[i+':'+(i+j+1)]:[])):[];
      return{overflow:document.documentElement.scrollWidth>innerWidth,clipped:active&&rects.some(r=>r.left<0||r.right>innerWidth+1||r.top<80||r.bottom>innerHeight+1),collisions,headerTop:document.querySelector('.site-header').getBoundingClientRect().top,canvas:document.querySelectorAll('[data-hero-scene] canvas').length};
     });
     results.push({width,height,progress,state,...result});assert.equal(result.overflow,false,`${width}×${height} ${state} overflow`);assert.equal(result.clipped,false,`${width}×${height} ${state} clipped controls`);assert.deepEqual(result.collisions,[],`${width}×${height} ${state} copy and controls collide`);assert.equal(result.headerTop,0);assert.equal(result.canvas,1);
     if(['scroll-0','Mobility','Materials'].includes(state))await page.screenshot({path:`${out}/composition-${width}-${height}-${state}.png`});
    }
   }
  }
  fs.writeFileSync(out+'/composition-results.json',JSON.stringify(results,null,2));console.log(results.length+' responsive compositions passed.');
 }finally{await browser.close();}
})().catch(error=>{fs.writeFileSync(out+'/composition-results.json',JSON.stringify(results,null,2));console.error(error);process.exit(1);});
