// Verify the deeper venture readings without starting a software WebGL renderer.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const sharp=require('sharp');
const {chromium}=require('playwright');
const base=(process.env.NRTH_TEST_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const out='artifacts/matterfield/venture-experiences';fs.mkdirSync(out,{recursive:true});
const ventures=['health','tms','telematics','logistics','systems','labs','chemicals','fleet','events'];
const lenses=['health','movement','materials','events'];
let browser,checks=0;const errors=[],evidence=[],artwork=new Set(),readings=new Set();
function check(value,message){assert.ok(value,message);checks++;}
function listen(context){context.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));}
async function visit(page,path){const response=await page.goto(base+path,{waitUntil:'networkidle'});check(response.status()===200,path+' is available.');}
async function fit(page,label){check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' fits without horizontal document overflow.');}
async function unobscured(control,label){
 await control.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));
 check(await control.evaluate(element=>{const bounds=element.getBoundingClientRect();return bounds.height>=44&&bounds.left>=0&&bounds.right<=innerWidth+1&&document.elementFromPoint(bounds.x+bounds.width/2,bounds.y+bounds.height/2)?.closest('button')===element;}),label+' has a reachable, unobscured 44px control.');
}
async function active(page,id,label){
 const panels=page.locator('[data-ve-panel]');
 check(await panels.count()===3,label+' retains three complete contexts.');
 check(await page.locator('[data-ve-panel]:visible').count()===1&&await page.locator('[data-ve-panel="'+id+'"]').isVisible(),label+' exposes only the selected context.');
 check(await page.locator('[data-ve-choice="'+id+'"]').getAttribute('aria-selected')==='true',label+' announces the active tab.');
 check(await panels.evaluateAll(elements=>elements.every(element=>element.inert===(element.getAttribute('aria-hidden')==='true'))),label+' removes inactive context links from keyboard navigation.');
}
async function imageSignature(page,image,label){
 const source=await image.evaluate(element=>element.currentSrc||element.src),response=await page.request.get(source);
 check(response.ok(),label+' serves its generated artwork.');
 const body=await response.body(),metadata=await sharp(body).metadata(),stats=await sharp(body).stats();
 check(metadata.width>=600&&metadata.height>=350&&stats.channels.some(channel=>channel.stdev>8),label+' contains a substantial nonblank image.');
 const pixels=await sharp(body).resize(64,64,{fit:'fill'}).removeAlpha().raw().toBuffer();
 return crypto.createHash('sha256').update(pixels).digest('hex');
}
async function noAnimation(root,label){check(await root.evaluate(element=>element.getAnimations({subtree:true}).every(animation=>animation.playState!=='running')),label+' has no running animations.');}
async function inspectVisual(page,label){
 const opener=page.locator('[data-ve-image-open]'),dialog=page.locator('[data-ve-image-dialog]');
 await opener.click();
 check(await dialog.evaluate(element=>element.open&&element.matches(':modal')),label+' opens its image in a modal visual reader.');
 check(await page.locator('[data-ve-image-close]').evaluate(element=>element===document.activeElement),label+' begins with an accessible close control.');
 await page.locator('[data-ve-image-zoom]').focus();await page.keyboard.press('End');
 check(await page.locator('[data-ve-image-zoom-value]').textContent()==='200%'&&await page.locator('[data-ve-image-zoom]').getAttribute('aria-valuetext')==='200 percent',label+' magnification works by keyboard and announces its value.');
 check(await page.locator('[data-ve-image-viewport]').evaluate(element=>element.scrollWidth>=element.clientWidth*1.9),label+' magnification enlarges the visible image rather than only its label.');
 // Native dialogs may visit browser chrome (document.body) between cycles.
 // Verify that no background page control receives focus, then reach Close.
 for(let step=0;step<3;step++){
  await page.keyboard.press('Tab');
  check(await dialog.evaluate(element=>document.activeElement===document.body||element.contains(document.activeElement)),label+' modal keyboard cycle keeps background page controls inaccessible.');
  if(await page.locator('[data-ve-image-close]').evaluate(element=>element===document.activeElement))break;
 }
 check(await page.locator('[data-ve-image-close]').evaluate(element=>element===document.activeElement),label+' modal keyboard cycle returns to its close control.');
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('[data-ve-image-dialog]').open&&document.querySelector('[data-ve-image-zoom]').value==='100');
 check(await opener.evaluate(element=>element===document.activeElement)&&await page.locator('[data-ve-image-zoom-value]').textContent()==='100%',label+' closes with Escape, restores focus and resets magnification.');
 check(await page.evaluate(()=>document.documentElement.style.overflow!=='hidden'),label+' restores document scrolling after inspection.');
}

(async()=>{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-webgl']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 listen(context);
 await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
 const page=await context.newPage();await page.route('**/api/inquiries',route=>route.abort());
 for(const venture of ventures){
  const slug='nrth-'+venture,route='/projects/'+slug;await visit(page,route);
  const root=page.locator('[data-venture-experience]'),tabs=root.locator('[data-ve-choice]');
  check(await root.count()===1,venture+' includes its deeper venture reading.');
  check(await tabs.count()===3,venture+' offers three work contexts.');
  check(await root.locator('.ve-feature-prose p').count()>=2,venture+' adds a substantial editorial introduction.');
  check(await root.locator('.ve-boundaries article').count()>=3,venture+' explains the constraints around its direction.');
  check(await root.locator('.ve-question-list details').count()>=3,venture+' adds practical deeper questions.');
  check(await root.locator('[data-ve-choices]').getAttribute('aria-orientation')==='horizontal',venture+' describes the desktop context arrangement.');
  artwork.add(await imageSignature(page,page.locator('.venture-heading-art img'),venture));
  await inspectVisual(page,venture+' desktop');
  const ids=await tabs.evaluateAll(elements=>elements.map(element=>element.dataset.veChoice));
  for(const id of ids){
   await root.locator('[data-ve-choice="'+id+'"]').click();await active(page,id,venture+'/'+id);
   const panel=root.locator('[data-ve-panel="'+id+'"]'),decision=(await panel.locator('.ve-work-decision p').textContent()).trim();
   check((await panel.locator('.ve-context-introduction>p').textContent()).trim().length>70,venture+'/'+id+' explains its actual situation.');
   check(await panel.locator('.ve-work-inputs li').count()>=3&&await panel.locator('.ve-work-flow>li').count()===3,venture+'/'+id+' explains inputs and three connected steps.');
   check(decision.length>35,venture+'/'+id+' ends with a useful next decision.');
   readings.add((await panel.locator('.ve-context-introduction').textContent()).trim()+decision);
   const href=await panel.locator('.ve-work-decision a').getAttribute('href'),url=new URL(href,base),topic=url.searchParams.get('topic');
   check(url.searchParams.get('project')===slug&&topic.toLowerCase().includes(decision.toLowerCase()),venture+'/'+id+' inquiry preserves its venture and full decision.');
   check(new URL(page.url()).searchParams.get('context')===id,venture+'/'+id+' remains shareable in the address bar.');
   await noAnimation(panel,venture+'/'+id+' with reduced motion');
   await visit(page,href);
   check(await page.locator('[name="project"]').inputValue()===slug&&(await page.locator('[name="message"]').inputValue()).toLowerCase().includes(decision.toLowerCase()),venture+'/'+id+' survives the real editable inquiry handoff.');
   await visit(page,route+'?context='+encodeURIComponent(id));await active(page,id,venture+'/'+id+' restored from URL');
  }
  const first=root.locator('[data-ve-choice]').first();await first.focus();await page.keyboard.press('ArrowRight');
  check(await tabs.nth(1).evaluate(element=>element===document.activeElement)&&await tabs.nth(1).getAttribute('aria-selected')==='true',venture+' advances selection and focus by keyboard.');
  await page.keyboard.press('End');check(await tabs.last().evaluate(element=>element===document.activeElement)&&await tabs.last().getAttribute('aria-selected')==='true',venture+' supports End.');
  await page.keyboard.press('Home');check(await tabs.first().evaluate(element=>element===document.activeElement)&&await tabs.first().getAttribute('aria-selected')==='true',venture+' supports Home.');
  await page.keyboard.press('ArrowLeft');check(await tabs.last().evaluate(element=>element===document.activeElement)&&await tabs.last().getAttribute('aria-selected')==='true',venture+' wraps backward with the arrow key.');
  await root.locator('[data-ve-share]').click();
  const shared=new URL(await page.evaluate(()=>navigator.clipboard.readText()));
  check(shared.pathname===route&&shared.searchParams.get('context')===ids[2]&&shared.hash==='#'+slug+'-context',venture+' copies a link to the selected context and correct section.');
  await root.locator('.ve-question-list summary').first().click();check(await root.locator('.ve-question-list details').first().evaluate(element=>element.open),venture+' deeper questions expand natively.');
  await fit(page,venture+' desktop');
 }
 check(artwork.size===9,'All nine ventures have visibly different generated image pixels.');
 check(readings.size===27,'All 27 work contexts have distinct substantive readings.');
 await visit(page,'/projects/nrth-health?context=unrecognized-context');
 check(await page.locator('[data-ve-choice]').first().getAttribute('aria-selected')==='true'&&await page.locator('[data-ve-panel]:visible').count()===1,'An unrecognized context URL recovers to a readable first context.');

 await visit(page,'/');
 check(await page.locator('.brand').first().locator('path').count()===4,'The approved opening retains the four canonical NRTH logo contours.');
 check(await page.locator('[data-matter-story]').count()===1&&await page.locator('.portfolio-section [data-index-row]').count()===9,'The original opening and nine-venture portfolio remain in the homepage.');
 const spotlight=page.locator('[data-venture-spotlight]'),spotTabs=spotlight.locator('[data-spotlight-tab]'),images=new Set(),copy=new Set();
 check(await spotTabs.count()===4,'Home provides four meaningful directions to explore.');
 for(const lens of lenses){
  await spotlight.locator('[data-spotlight-tab="'+lens+'"]').click();
  const panel=spotlight.locator('[data-spotlight-panel="'+lens+'"]');
  check(await spotlight.locator('[data-spotlight-panel]:visible').count()===1&&await panel.isVisible(),lens+' is the only visible home reading.');
  copy.add((await panel.locator('.spotlight-context>p').textContent()).trim());images.add(await imageSignature(page,panel.locator('img'),'Home '+lens));
  check((await panel.locator('.spotlight-context>p').textContent()).trim().length>150&&await panel.locator('.spotlight-venture-links a').count()===2,lens+' connects its situation to two relevant ventures.');
  const expected=lens==='movement'?'mobility':lens;
  check(await panel.locator('.spotlight-industry-link').getAttribute('href')==='/industries/'+expected,lens+' connects to the corresponding detailed industry guide.');
  check(new URL(page.url()).searchParams.get('lens')===lens,lens+' remains in the homepage address.');
  await noAnimation(spotlight,lens+' with reduced motion');
 }
 check(images.size===4&&copy.size===4,'All four home directions change both the artwork and the substantive reading.');
 await spotTabs.first().focus();await page.keyboard.press('ArrowRight');check(await spotTabs.nth(1).evaluate(element=>element===document.activeElement),'Home direction arrows move the active focus.');
 await page.keyboard.press('End');check(await spotTabs.last().evaluate(element=>element===document.activeElement),'Home direction End selects the last lens.');
 await spotlight.locator('[data-spotlight-copy]').click();
 const homeShare=new URL(await page.evaluate(()=>navigator.clipboard.readText()));check(homeShare.searchParams.get('lens')==='events'&&homeShare.hash==='#closer-to-the-work','Home copies the active direction and its section.');
 await page.reload({waitUntil:'networkidle'});check(await spotlight.locator('[data-spotlight-tab="events"]').getAttribute('aria-selected')==='true','The home direction restores after reload.');

 for(const width of [390,320]){
  await page.setViewportSize({width,height:width===390?844:700});
  for(const venture of ventures){
   await visit(page,'/projects/nrth-'+venture);await fit(page,venture+' at '+width+'px');
   const tabs=page.locator('[data-ve-choice]');
   for(let index=0;index<3;index++){const control=tabs.nth(index);await unobscured(control,venture+' context '+index+' at '+width+'px');await control.click();}
   await page.locator('.ve-question-list summary').last().click();await fit(page,venture+' expanded at '+width+'px');
  }
  await visit(page,'/');await fit(page,'Home at '+width+'px');
  for(const lens of lenses){const tab=page.locator('[data-spotlight-tab="'+lens+'"]');await unobscured(tab,'Home '+lens+' at '+width+'px');await tab.click();await fit(page,'Home '+lens+' reading at '+width+'px');}
  if(width===390)await page.screenshot({path:out+'/home-directions-390.png'});
  await visit(page,'/projects/nrth-tms');
  check(await page.locator('[data-ve-choices]').getAttribute('aria-orientation')==='vertical','Phone context navigation announces its vertical arrangement at '+width+'px.');
  await inspectVisual(page,'TMS at '+width+'px');
  await page.locator('[data-ve-choices]').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/venture-context-'+width+'.png'});
 }

 const denied=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 listen(denied);
 await denied.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Clipboard unavailable');}}}));
 const blocked=await denied.newPage();await visit(blocked,'/projects/nrth-health');
 const selected=await blocked.locator('[data-ve-choice]').last().getAttribute('data-ve-choice');await blocked.locator('[data-ve-choice]').last().click();await blocked.locator('[data-ve-share]').click();
 const fallback=blocked.locator('[data-ve-share-input]');await fallback.waitFor({state:'visible'});const fallbackUrl=new URL(await fallback.inputValue());
 check(fallbackUrl.searchParams.get('context')===selected&&fallbackUrl.hash==='#nrth-health-context','Clipboard failure exposes a complete copyable context link.');
 check(await fallback.evaluate(element=>element instanceof HTMLInputElement&&element===document.activeElement&&element.selectionStart===0&&element.selectionEnd===element.value.length),'The fallback link is selected and focused for manual copying.');
 await visit(blocked,'/');await blocked.locator('[data-spotlight-tab="materials"]').click();await blocked.locator('[data-spotlight-copy]').click();
 check(new URL(blocked.url()).searchParams.get('lens')==='materials'&&new URL(blocked.url()).hash==='#closer-to-the-work','Clipboard failure preserves the selected home direction in the address bar.');
 check((await blocked.locator('[data-spotlight-copy-feedback]').textContent()).includes('address bar'),'Home explains its available clipboard alternative.');await denied.close();

 const native=await browser.newContext({viewport:{width:320,height:700},javaScriptEnabled:false,reducedMotion:'reduce'});listen(native);const plain=await native.newPage();
 for(const venture of ventures){
  await visit(plain,'/projects/nrth-'+venture);
  check(await plain.locator('[data-ve-panel]:visible').count()===3,venture+' preserves all three complete work contexts without JavaScript.');
  check(await plain.locator('.ve-work-decision a').count()===3&&await plain.locator('.ve-work-flow>li').count()===9,venture+' native contexts keep their steps and inquiry paths.');
  const nativeImage=new URL(await plain.locator('[data-ve-image-link]').getAttribute('href'),base).href;
  check(await plain.locator('[data-ve-image-link]').isVisible()&&(await plain.request.get(nativeImage)).ok(),venture+' retains a working full-size image link without JavaScript.');
  await plain.locator('.ve-question-list summary').last().click();check(await plain.locator('.ve-question-list details').last().evaluate(element=>element.open),venture+' native deeper questions remain interactive.');await fit(plain,venture+' native at 320px');
 }
 await visit(plain,'/');check(await plain.locator('[data-spotlight-panel]:visible').count()===4,'Native home preserves every direction and its artwork.');await fit(plain,'Native home at 320px');await native.close();

 const motion=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});listen(motion);const moving=await motion.newPage();
 await visit(moving,'/projects/nrth-tms');await moving.locator('[data-ve-choice]').nth(1).click();
 check(await moving.locator('[data-ve-panel][aria-hidden="false"]').evaluate(element=>element.getAnimations().some(animation=>animation.playState==='running')),'Normal motion adds a transition to the actual context reading.');
 await moving.locator('[data-ve-choice]').last().click();await moving.waitForTimeout(500);
 check(await moving.locator('[data-ve-choice]').last().getAttribute('aria-selected')==='true'&&await moving.locator('[data-ve-panel]:visible').count()===1,'An interrupted context transition settles on the latest selection.');
 await moving.locator('footer [data-motion-toggle]').click();await moving.waitForFunction(()=>document.documentElement.classList.contains('motion-paused'));
 await moving.locator('[data-ve-choice]').first().click();await noAnimation(moving.locator('[data-ve-context]'),'The globally paused context reading');
 const image=moving.locator('[data-ve-image] img');await image.scrollIntoViewIfNeeded();
 check(await image.evaluate(element=>getComputedStyle(element).transform==='none'),'Global pause leaves the feature artwork still.');
 await visit(moving,'/');await moving.locator('[data-spotlight-tab="materials"]').click();await noAnimation(moving.locator('[data-venture-spotlight]'),'The globally paused home reading');
 check(await moving.locator('[data-spotlight-panel="materials"] [data-spotlight-image-motion]').evaluate(element=>getComputedStyle(element).transform==='none'),'Global pause keeps the selected home artwork still.');await motion.close();
 check(errors.length===0,'The deeper venture and home readings have no uncaught browser errors.');
 evidence.push('Artwork uniqueness checks use normalized rendered image pixels, not file names.','Every inquiry remains a reviewed draft; no messages were sent.','WebGL performance is covered by the separate existing browser/depth suites.');
 fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:true,errors,evidence},null,2));console.log(checks+' venture-experience checks passed.');await browser.close();
})().catch(async error=>{console.error(error);fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:false,error:String(error),errors,evidence},null,2));await browser?.close();process.exitCode=1;});
