const { chromium }=require('playwright');
const fs=require('fs');
const path=require('path');
const base=(process.env.NRTH_TEST_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const artifacts=path.join(process.cwd(),'artifacts','editorial-review');
fs.mkdirSync(artifacts,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const entries=[['clarity-is-a-design-decision','attention'],['connecting-the-parts-of-movement','movement'],['making-room-for-experimentation','experiment'],['freshness-is-part-of-the-signal','provenance'],['specification-begins-with-the-conditions','specification'],['design-the-transitions-between-people','production'],['recovery-is-a-design-decision','recovery'],['motion-should-explain-the-change','motion']];
 const results=[];const errors=[];let checks=0;
 for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:960},reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const [slug,diagram] of entries){
 const r=await page.goto(base+'/insights/'+slug,{waitUntil:'networkidle'});
 if(r.status()!==200)throw Error(slug+' status '+r.status());checks++;
 const model=page.locator('.journal-diagram-'+diagram);
 if(await model.count()!==1)throw Error('model '+slug);checks++;
 if(await model.locator('input[type=radio]').count()!==3)throw Error('controls '+slug);checks++;
 for(const key of ['purpose','context','continuation']){
 await model.locator('input[value='+key+']').check();
 const visible=await model.locator('[data-diagram-reading]').evaluateAll(els=>els.filter(el=>getComputedStyle(el).display!=='none').map(el=>el.dataset.diagramReading));
 if(visible.length!==1||visible[0]!==key)throw Error('reading '+slug+key);checks++;
 }
 if(diagram==='motion'){
 await model.locator('input[value=purpose]').check();const a=await model.locator('.journal-motion-pieces rect').first().boundingBox();
 await model.locator('input[value=continuation]').check();const b=await model.locator('.journal-motion-pieces rect').first().boundingBox();
 if(Math.abs(a.x-b.x)+Math.abs(a.y-b.y)<10)throw Error('motion does not reorganize');checks++;
 }
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('overflow '+width+slug);checks++;
 if(width===390&&['specification','motion'].includes(diagram)){await model.screenshot({path:path.join(artifacts,diagram+'-phone.png')});}
 results.push({width,slug,diagram});
 }
 for(const route of ['/about','/investors','/approach','/partnerships','/press']){
 const r=await page.goto(base+route,{waitUntil:'networkidle'});if(r.status()!==200)throw Error(route+' '+r.status());checks++;
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('overflow '+width+route);checks++;
 if(route==='/approach'||route==='/partnerships'){
 const model=page.locator('.editorial-study');await model.locator('[data-study-step=source] summary').click();
 if(await model.locator('[data-study-step=source]').getAttribute('open')===null)throw Error('native study');checks++;
 const opacity=await model.locator('[data-study-layer=source]').evaluate(el=>getComputedStyle(el).opacity);if(opacity!=='1')throw Error('native active source '+opacity);checks++;
 }
 if(width===390&&route==='/press')await page.locator('.editorial-description-lengths').screenshot({path:path.join(artifacts,'press-phone.png')});
 if(width===1440&&route==='/approach')await page.locator('.editorial-study').screenshot({path:path.join(artifacts,'approach-desktop.png')});
 }
 for(const route of ['/preview/approach','/preview/partnerships','/preview/press']){
 const r=await page.request.get(base+route,{maxRedirects:0});if(r.status()!==302)throw Error('private route '+route+' '+r.status());checks++;
 }
 await context.close();
 }
 const native=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false,reducedMotion:'reduce'});const page=await native.newPage();
 await page.goto(base+'/insights/freshness-is-part-of-the-signal',{waitUntil:'networkidle'});await page.locator('input[value=continuation]').check();if(!(await page.locator('[data-diagram-reading=continuation]').isVisible()))throw Error('no JS reading');checks++;
 await page.goto(base+'/approach',{waitUntil:'networkidle'});await page.locator('[data-study-step=decision] summary').click();if(await page.locator('[data-study-step=decision]').getAttribute('open')===null)throw Error('noJS example');checks++;
 if(errors.length)throw Error(errors.join('\n'));checks++;
 const report={checks,results,errors};fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks,articles:entries.length,widths:[1440,390],errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
