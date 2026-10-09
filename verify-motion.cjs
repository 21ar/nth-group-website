const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.NRTH_TEST_URL||'http://127.0.0.1:4173',out='artifacts/living-fold';
const checks=[];function check(value,label){assert.ok(value,label);checks.push(label);}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('[data-hero-scene]').classList.contains('fold-ready'));
  const original=await page.locator('[data-hero-scene] canvas').elementHandle();
  async function scrub(p,name){await page.evaluate(p=>{const el=document.querySelector('[data-fold-story]');scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'});},p);await page.waitForTimeout(850);if(name)await page.screenshot({path:out+'/'+name+'.png'});}
  check(await page.locator('.site-header .brand svg path').count()===4,'The canonical NRTH logo includes all four letters.');
  check(await page.locator('.fold-intro h1').innerText()==='Progress\nunfolds.','The opening matches the selected direction.');
  check(await page.locator('.fold-intro button,.fold-intro .icon,.fold-intro .eyebrow').count()===0,'The opening has no stage caption, arrow action or competing CTA.');
  const states=[];
  for(const p of [0,.15,.3,.5,.75,1]){
   await scrub(p,'scroll-'+p);check(await page.locator('[data-hero-scene] canvas').evaluate((el,original)=>el===original,original),'The same canvas persists at '+p+'.');
   states.push(await page.locator('[data-hero-scene]').screenshot());
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Scroll '+p+' creates no horizontal overflow.');
  }
  check(states.slice(1).every((image,index)=>!image.equals(states[index])),'Intermediate scroll states visibly transform the shared surface.');
  check(await page.locator('[data-fold-content]').evaluate(el=>!el.inert&&Number(getComputedStyle(el).opacity)>.99),'The settled field content is readable and interactive.');
  const fields=['Mobility','Health','Systems','Materials','Events','Research'],fieldImages=[];
  for(let i=0;i<fields.length;i++){
   await page.locator('[data-fold-field="'+fields[i]+'"]').click();
   await page.waitForFunction(i=>Number(document.querySelector('[data-hero-scene]').dataset.weights.split(',')[i])>.999,i);
   check(await page.locator('[data-fold-panel]:not([hidden]) .field-name').innerText()===fields[i],fields[i]+' displays the matching field and venture links.');
   check(await page.locator('[data-fold-panel]:not([hidden]) a').count()===(i===0?4:1),fields[i]+' exposes the correct number of ventures.');
   fieldImages.push(await page.locator('[data-hero-scene]').screenshot());await page.screenshot({path:out+'/field-'+fields[i].toLowerCase()+'.png'});
  }
  check(fieldImages.slice(1).every((image,index)=>!image.equals(fieldImages[index])),'Every field has a distinct continuous surface pose.');
  await page.locator('[data-fold-field="Mobility"]').click();await page.waitForTimeout(250);
  const continuity=await page.evaluate(async()=>{
   const host=document.querySelector('[data-hero-scene]'),before=host.dataset.weights.split(',').map(Number);
   document.querySelector('[data-fold-field="Systems"]').click();
   await new Promise(resolve=>requestAnimationFrame(resolve));
   return{before,after:host.dataset.weights.split(',').map(Number)};
  });
  check(continuity.before.every((value,i)=>Math.abs(value-continuity.after[i])<.02),'An interrupted selection resumes from its current shape.');
  await page.waitForFunction(()=>Number(document.querySelector('[data-hero-scene]').dataset.weights.split(',')[2])>.999);
  await page.locator('[data-fold-field="Systems"]').focus();await page.keyboard.press('ArrowRight');
  check(await page.locator('[data-fold-field="Materials"]').getAttribute('aria-selected')==='true','Arrow keys select the adjacent field.');
  check(await page.locator('[data-fold-field="Materials"]').evaluate(el=>el===document.activeElement),'Field selection retains keyboard focus.');
  await scrub(0,'reverse-opening');check(await page.locator('[data-fold-intro]').evaluate(el=>!el.inert&&Number(getComputedStyle(el).opacity)>.99),'Reverse scrolling restores the readable opening.');
  const idle=await page.locator('[data-hero-scene]').getAttribute('data-frames');await page.waitForTimeout(300);
  check(await page.locator('[data-hero-scene]').getAttribute('data-frames')===idle,'The renderer stops when the scene settles.');
  await page.mouse.move(1200,600);await page.waitForTimeout(600);
  check(Number(await page.locator('[data-hero-scene]').getAttribute('data-frames'))>Number(idle),'Pointer perspective wakes the renderer.');
  await page.locator('#ecosystem').scrollIntoViewIfNeeded();await page.waitForTimeout(350);const outside=await page.locator('[data-hero-scene]').getAttribute('data-frames');await page.waitForTimeout(400);
  check(await page.locator('[data-hero-scene]').getAttribute('data-frames')===outside,'The renderer stops outside the viewport.');
  const explorer=page.locator('[data-explorer]');await explorer.getByRole('tab',{name:'TMS',exact:true}).click();await explorer.getByRole('tab',{name:'Fleet',exact:true}).click();await explorer.getByRole('tab',{name:'Health',exact:true}).click();await page.waitForTimeout(1000);
  check(await page.locator('.explorer-outgoing').count()===0&&await page.locator('[data-project-panel]:not([hidden])').count()===1,'Rapid portfolio choices leave one current venture and no stale layer.');
  await page.getByRole('button',{name:'Pause motion',exact:true}).click();
  check(await page.locator('[data-hero-scene] canvas').count()===0,'Pause removes the renderer.');
  check(await page.locator('.fold-viewport').evaluate(el=>getComputedStyle(el).position==='relative'),'Pause removes the pinned reading experience.');
  await page.getByRole('button',{name:'Enable motion',exact:true}).click();await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>document.querySelector('[data-hero-scene]').classList.contains('fold-ready'));
  check(await page.locator('[data-hero-scene] canvas').count()===1,'Enabling motion restores exactly one renderer.');
  await page.getByRole('button',{name:'Inside NRTH',exact:true}).click();
  check(await page.locator('.menu-ventures a').count()===9,'Every venture is two actions from the masthead.');
  check(await page.locator('main').evaluate(el=>el.inert),'The open navigation isolates page controls.');
  await page.keyboard.press('Escape');check(await page.getByRole('button',{name:'Inside NRTH',exact:true}).evaluate(el=>el===document.activeElement),'Closing the menu returns focus.');
  await context.close();
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));await mp.goto(base,{waitUntil:'networkidle'});await mp.waitForFunction(()=>document.querySelector('[data-hero-scene]').classList.contains('fold-ready'));
  await mp.screenshot({path:out+'/mobile-opening.png'});await mp.evaluate(()=>{const s=document.querySelector('[data-fold-story]');scrollTo(0,s.offsetHeight-innerHeight);});await mp.waitForTimeout(850);
  check(await mp.locator('[data-hero-scene] canvas').count()===1,'Touch retains one continuous surface.');
  await mp.locator('[data-fold-field="Materials"]').tap();await mp.waitForFunction(()=>Number(document.querySelector('[data-hero-scene]').dataset.weights.split(',')[3])>.999);
  check(await mp.locator('[data-fold-panel]:not([hidden]) a').getAttribute('href')==='/projects/nrth-chemicals','Touch Materials selection opens the correct venture path.');
  await mp.screenshot({path:out+'/mobile-materials.png'});await mobile.close();
  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),rp=await reduced.newPage();await rp.goto(base,{waitUntil:'networkidle'});
  check(await rp.locator('[data-hero-scene] canvas').count()===0,'Reduced motion creates no animated canvas.');check(await rp.locator('.fold-viewport').evaluate(el=>getComputedStyle(el).position==='relative'),'Reduced motion uses natural reading order.');await rp.locator('[data-fold-field="Health"]').click();check(await rp.locator('[data-fold-panel]:not([hidden]) a').isVisible(),'Reduced motion keeps field selection usable.');await rp.screenshot({path:out+'/reduced-mobile.png'});await reduced.close();
  const nojs=await browser.newContext({javaScriptEnabled:false}),np=await nojs.newPage();await np.goto(base);check(await np.locator('.fold-intro h1').isVisible(),'The opening is visible without JavaScript.');check(await np.locator('.footer-projects a').count()===9,'All nine ventures are reachable without JavaScript.');check(await np.locator('.header-words a[href="/projects"]').isVisible(),'No-JavaScript masthead exposes a direct portfolio link.');await nojs.close();
  const fallback=await browser.newContext(),fp=await fallback.newPage();await fp.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.includes('webgl'))return null;return get.call(this,type,...args);};});await fp.goto(base,{waitUntil:'networkidle'});await fp.waitForFunction(()=>document.querySelector('[data-hero-scene]').dataset.renderer==='surface');check(await fp.locator('[data-hero-scene] canvas').count()===1,'Unavailable WebGL uses one shared-geometry surface renderer.');await fallback.close();
  const staticContext=await browser.newContext(),sp=await staticContext.newPage();await sp.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=function(){return null;};});await sp.goto(base,{waitUntil:'networkidle'});await sp.waitForFunction(()=>document.querySelector('[data-fold-story]').classList.contains('fold-static'));check(await sp.locator('.fold-still').isVisible()&&await sp.locator('[data-fold-content]').evaluate(el=>!el.inert&&Number(getComputedStyle(el).opacity)>.99),'Complete graphics failure retains artwork, readable content and navigation.');await staticContext.close();
  check(errors.length===0,'The motion and interaction journeys have no runtime errors.');fs.writeFileSync(out+'/motion-results.json',JSON.stringify({checks,errors},null,2));console.log(checks.length+' Living Fold motion checks passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
