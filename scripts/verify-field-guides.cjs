// Exercise the new field readings and work stages through public user controls.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
const base=(process.env.NRTH_TEST_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const out='artifacts/matterfield/field-guides';fs.mkdirSync(out,{recursive:true});
const ventures=['health','tms','telematics','logistics','systems','labs','chemicals','fleet','events'];
let browser,checks=0;const errors=[],evidence=[];
function check(value,label){assert.ok(value,label);checks++;}
function listen(context){context.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));}
async function visit(page,path){
 const destination=new URL(path,base),response=await page.goto(destination.href,{waitUntil:'networkidle'});
 // Playwright returns no HTTP response for a same-document fragment change.
 check(response?response.status()===200:Boolean(destination.hash)&&page.url()===destination.href,path+' is available.');
}
async function fit(page,label){check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' has no horizontal document overflow.');}
async function noAnimation(root,label){check(await root.evaluate(element=>element.getAnimations({subtree:true}).every(animation=>animation.playState!=='running')),label+' has no running animations.');}
async function reachable(control,label){
 await control.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));
 check(await control.evaluate(element=>{const bounds=element.getBoundingClientRect(),hit=document.elementFromPoint(bounds.x+bounds.width/2,bounds.y+bounds.height/2);return bounds.height>=44&&bounds.left>=0&&bounds.right<=innerWidth+1&&(hit===element||element.contains(hit));}),label+' is unobscured and has a 44px target.');
}
async function selectedStage(panel,step,label){
 check(await panel.locator('[data-ve-step-panel]:visible').count()===1&&await panel.locator('[data-ve-step-panel="'+step+'"]').isVisible(),label+' exposes one matching stage reading.');
 check(await panel.locator('[data-ve-step="'+step+'"]').getAttribute('aria-selected')==='true',label+' announces its selected stage.');
 check(await panel.locator('[data-ve-step-panel]').evaluateAll(elements=>elements.every(element=>element.inert===(element.getAttribute('aria-hidden')==='true'))),label+' keeps inactive readings out of keyboard navigation.');
}

(async()=>{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-webgl']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});listen(context);
 await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
 const page=await context.newPage();await page.route('**/api/inquiries',route=>route.abort());
 for(const venture of ventures){
  const slug='nrth-'+venture,route='/projects/'+slug;await visit(page,route);
  const contexts=await page.locator('[data-ve-choice]').evaluateAll(elements=>elements.map(element=>element.dataset.veChoice));
  check(contexts.length===3,venture+' retains all three work contexts.');
  for(const id of contexts){
   await page.locator('[data-ve-choice="'+id+'"]').click();const panel=page.locator('[data-ve-panel="'+id+'"]');
   await selectedStage(panel,'1',venture+'/'+id+' initial stage');
   check(await panel.locator('[data-ve-step]').count()===3,venture+'/'+id+' offers three stages to inspect.');
   const readings=new Set();
   for(const step of ['1','2','3']){
    await panel.locator('[data-ve-step="'+step+'"]').click();await selectedStage(panel,step,venture+'/'+id+'/'+step);
    const reading=panel.locator('[data-ve-step-panel="'+step+'"]'),record=(await reading.locator('.ve-step-record p').textContent()).trim(),checkpoint=(await reading.locator('.ve-step-checkpoint>p').textContent()).trim();
    check(record.length>40&&checkpoint.length>30,venture+'/'+id+'/'+step+' explains a useful working record and checkpoint.');readings.add(record+checkpoint);
    const continuation=(await reading.locator('.ve-step-next p').textContent()).trim(),decision=(await panel.locator('.ve-work-decision p').textContent()).trim();
    check(continuation===(step==='3'?decision:(await panel.locator('[data-ve-step="'+(Number(step)+1)+'"]').textContent()).trim()),venture+'/'+id+'/'+step+' connects to the next stage or full decision.');
    const url=new URL(page.url());check(url.searchParams.get('context')===id&&url.searchParams.get('step')===step,venture+'/'+id+'/'+step+' is reflected in the shared address.');
    const inquiry=new URL(await panel.locator('[data-ve-inquiry]').getAttribute('href'),base),topic=inquiry.searchParams.get('topic');
    check(inquiry.searchParams.get('project')===slug&&topic.includes('step '+step)&&topic.toLowerCase().includes(decision.toLowerCase())&&topic.length<180,venture+'/'+id+'/'+step+' preserves its selected stage and full decision in a usable inquiry.');
    await noAnimation(reading,venture+'/'+id+'/'+step+' reduced-motion reading');
   }
   check(readings.size===3,venture+'/'+id+' adds three different substantive stage readings.');
   await page.locator('[data-ve-choice="'+id+'"]').click();await selectedStage(panel,'3',venture+'/'+id+' unchanged context');
   await panel.locator('[data-ve-step]').first().focus();await page.keyboard.press('ArrowDown');
   check(await panel.locator('[data-ve-step="2"]').evaluate(element=>element===document.activeElement),venture+'/'+id+' stage arrows move selection with focus.');
   await selectedStage(panel,'2',venture+'/'+id+' keyboard stage');await page.keyboard.press('End');
   check(await panel.locator('[data-ve-step="3"]').evaluate(element=>element===document.activeElement),venture+'/'+id+' stage End selects the final step.');
   await page.keyboard.press('Home');check(await panel.locator('[data-ve-step="1"]').evaluate(element=>element===document.activeElement),venture+'/'+id+' stage Home selects the beginning.');
   await page.keyboard.press('ArrowUp');check(await panel.locator('[data-ve-step="3"]').evaluate(element=>element===document.activeElement),venture+'/'+id+' stage arrows wrap backward.');
  }
  const selected=contexts[2];await page.locator('[data-ve-share]').click();const workShare=new URL(await page.evaluate(()=>navigator.clipboard.readText()));
  check(workShare.searchParams.get('context')===selected&&workShare.searchParams.get('step')==='3'&&workShare.hash==='#'+slug+'-context',venture+' shares the context and selected final stage.');
  const decision=(await page.locator('[data-ve-panel="'+selected+'"] .ve-work-decision p').textContent()).trim(),href=await page.locator('[data-ve-panel="'+selected+'"] [data-ve-inquiry]').getAttribute('href');
  await visit(page,href);check(await page.locator('[name="project"]').inputValue()===slug&&(await page.locator('[name="message"]').inputValue()).includes('step 3')&&(await page.locator('[name="message"]').inputValue()).toLowerCase().includes(decision.toLowerCase()),venture+' final-stage inquiry survives the actual editable form handoff.');
  await visit(page,route+'?context='+encodeURIComponent(selected)+'&step=2');await selectedStage(page.locator('[data-ve-panel="'+selected+'"]'),'2',venture+' restored stage');

  const guide=page.locator('[data-venture-field-guide]'),areas=guide.locator('[data-vfg-area]');
  check(await guide.count()===1&&await areas.count()===4,venture+' has four detailed native field areas.');
  const areaIds=await areas.evaluateAll(elements=>elements.map(element=>element.dataset.vfgArea));
  await visit(page,route+'?context='+encodeURIComponent(selected)+'&step=2&guide='+encodeURIComponent(areaIds[0]));
  for(const id of areaIds){
   const area=guide.locator('[data-vfg-area="'+id+'"]'),summary=area.locator('summary');
   await summary.focus();if(!await area.evaluate(element=>element.open))await page.keyboard.press('Enter');
   check(await area.evaluate(element=>element.open)&&await summary.evaluate(element=>element===document.activeElement),venture+'/'+id+' opens as a native disclosure and retains its focused summary.');
   const content=area.locator('[data-vfg-content]');
   check((await content.textContent()).trim().length>400&&await content.locator('h3,h4').count()>=3,venture+'/'+id+' contains structured, substantive field explanations.');
   check(await content.locator('li').count()>=3&&await content.locator('a[href^="/projects/"]').count()>=1,venture+'/'+id+' offers practical questions and a connected venture.');
   await page.waitForFunction(id=>new URL(location.href).searchParams.get('guide')===id,id);
   const current=new URL(page.url());check(current.searchParams.get('guide')===id&&current.searchParams.get('context')===selected&&current.searchParams.get('step')==='2',venture+'/'+id+' retains the work context and stage while opening its field reading.');
   await area.locator('[data-vfg-share]').click();const shared=new URL(await page.evaluate(()=>navigator.clipboard.readText()));
   check(shared.searchParams.get('guide')===id&&shared.searchParams.get('context')===selected&&shared.searchParams.get('step')==='2'&&shared.hash==='#'+await area.getAttribute('id'),venture+'/'+id+' copies its field anchor without losing the selected work.');
  }
  await visit(page,route+'?context='+encodeURIComponent(selected)+'&step=2&guide='+encodeURIComponent(areaIds[2]));
  check(await areas.evaluateAll(elements=>elements.filter(element=>element.open).length)===1&&await guide.locator('[data-vfg-area="'+areaIds[2]+'"]').evaluate(element=>element.open),venture+' query URL restores exactly the requested field reading.');
  await visit(page,route+'#'+slug+'-guide-'+areaIds[3]);
  check(await guide.locator('[data-vfg-area="'+areaIds[3]+'"]').evaluate(element=>element.open),venture+' native field anchor restores its named disclosure.');
  const artChoices=guide.locator('[data-vfg-art-choice]'),image=guide.locator('[data-vfg-image]'),crops=new Set(),artReadings=new Set();
  check(await artChoices.count()===3&&await image.count()===1,venture+' offers three readings of its actual generated image.');
  for(let index=0;index<3;index++){
   const choice=artChoices.nth(index),id=await choice.getAttribute('data-vfg-art-choice');await choice.click();
   check(await guide.locator('[data-vfg-art-panel]:visible').count()===1&&await guide.locator('[data-vfg-art-panel="'+id+'"]').isVisible(),venture+' artwork selection '+index+' exposes its matching explanation.');
   artReadings.add((await guide.locator('[data-vfg-art-panel="'+id+'"]').textContent()).trim());crops.add(await image.evaluate(element=>getComputedStyle(element).transform));
   await noAnimation(guide,venture+' reduced-motion artwork selection '+index);
  }
  check(crops.size===3&&artReadings.size===3,venture+' artwork choices change both the visible crop and meaning.');
  await guide.locator('[data-vfg-full-view]').click();
  check(await guide.locator('[data-vfg-full-view]').getAttribute('aria-pressed')==='true'&&await image.evaluate(element=>{const matrix=new DOMMatrixReadOnly(getComputedStyle(element).transform);return matrix.a===1&&matrix.d===1&&matrix.m41===0&&matrix.m42===0;}),venture+' can return to its whole artwork without crop or magnification.');
  await guide.locator('[data-vfg-full-view]').click();
  check(await guide.locator('[data-vfg-full-view]').getAttribute('aria-pressed')==='false'&&await image.evaluate(element=>new DOMMatrixReadOnly(getComputedStyle(element).transform).a>1),venture+' returns to its selected artwork detail.');
  await artChoices.first().focus();await page.keyboard.press('End');check(await artChoices.last().evaluate(element=>element===document.activeElement),venture+' artwork End moves the selected focus.');
  await page.keyboard.press('Home');check(await artChoices.first().evaluate(element=>element===document.activeElement),venture+' artwork Home returns to the first reading.');
  await page.keyboard.press('ArrowLeft');check(await artChoices.last().evaluate(element=>element===document.activeElement),venture+' artwork arrows wrap backward.');await fit(page,venture+' field guide desktop');
 }
 await visit(page,'/projects/nrth-health?context=unknown&step=200');await selectedStage(page.locator('[data-ve-panel]:visible'),'1','An invalid context/stage URL');

 await page.setViewportSize({width:320,height:700});
 for(const venture of ventures){
  await visit(page,'/projects/nrth-'+venture);await fit(page,venture+' at 320px');
  const panel=page.locator('[data-ve-panel]:visible');for(const step of ['1','2','3']){const choice=panel.locator('[data-ve-step="'+step+'"]');await reachable(choice,venture+' stage '+step+' at 320px');await choice.click();}
  const guide=page.locator('[data-venture-field-guide]');for(const choice of await guide.locator('[data-vfg-art-choice]').all()){await reachable(choice,venture+' artwork reading at 320px');await choice.click();}
  for(const area of await guide.locator('[data-vfg-area]').all()){const summary=area.locator('summary');await reachable(summary,venture+' native field summary at 320px');if(!await area.evaluate(element=>element.open))await summary.click();}
  await fit(page,venture+' expanded field guide at 320px');
 }
 await page.locator('[data-venture-field-guide]').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/field-guide-320.png'});
 await visit(page,'/');const journeys=page.locator('[data-portfolio-journey]');
 check(await journeys.count()===3,'Home offers three wider portfolio stories.');
 const destinations=await page.locator('.pj-guide-link').evaluateAll(links=>[...new Set(links.map(link=>link.getAttribute('href')))]);
 check(ventures.every(venture=>destinations.includes('/projects/nrth-'+venture+'#nrth-'+venture+'-field-guide')),'Home stories lead to the new field guide for every venture.');
 const journeyIds=await journeys.evaluateAll(elements=>elements.map(element=>element.id));
 for(const id of journeyIds){
  const journey=page.locator('#'+id);await journey.locator('summary').click();
  await journey.locator('.pj-reading').waitFor({state:'visible'});
  check(await journey.evaluate(element=>element.open)&&await journey.locator('.pj-reading').isVisible(),id+' opens through its native story control.');
  check(await journey.evaluate(element=>getComputedStyle(element,'::details-content').transitionDuration.split(',').every(duration=>parseFloat(duration)===0)),id+' respects reduced motion in its native disclosure content.');
  check((await journey.locator('.pj-question').textContent()).trim().length>40&&(await journey.locator('.pj-takeaway').textContent()).trim().length>40,id+' explains the common question and resulting perspective.');
  const stages=journey.locator('.pj-stages>li');check(await stages.count()>=3&&await stages.count()<=4,id+' connects three or four meaningful venture perspectives.');
  check(await stages.evaluateAll(elements=>elements.every(element=>(element.querySelector('p')?.textContent||'').trim().length>50&&element.querySelector('.pj-guide-link'))),id+' gives each perspective its own explanation and guide path.');await fit(page,id+' at 320px');
 }
 for(const id of journeyIds){await visit(page,'/#'+id);await page.waitForFunction(id=>document.getElementById(id)?.hasAttribute('open'),id);check(await page.locator('#'+id).evaluate(element=>element.open),'The '+id+' shared home anchor restores its portfolio story.');}

 const denied=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});listen(denied);
 await denied.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Clipboard unavailable');}}}));
 const blocked=await denied.newPage();await visit(blocked,'/projects/nrth-tms');await blocked.locator('[data-ve-panel]:visible [data-ve-step="2"]').click();const guide=blocked.locator('[data-venture-field-guide]'),area=guide.locator('[data-vfg-area]').last(),id=await area.getAttribute('data-vfg-area');
 await area.locator('summary').click();await area.locator('[data-vfg-share]').click();const fallback=area.locator('[data-vfg-share-input]');await fallback.waitFor({state:'visible'});
 check(new URL(await fallback.inputValue()).searchParams.get('guide')===id&&new URL(await fallback.inputValue()).searchParams.get('step')==='2','Denied clipboard access exposes the selected field link and retains its work stage.');
 check(await fallback.evaluate(element=>element instanceof HTMLInputElement&&element===document.activeElement&&element.selectionStart===0&&element.selectionEnd===element.value.length),'The field link fallback is focused and selected for manual copying.');await denied.close();

 const native=await browser.newContext({viewport:{width:320,height:700},javaScriptEnabled:false,reducedMotion:'reduce'});listen(native);const plain=await native.newPage();
 for(const venture of ventures){
  await visit(plain,'/projects/nrth-'+venture);const guide=plain.locator('[data-venture-field-guide]');
  check(await plain.locator('[data-ve-step-panel]').count()===9&&await plain.locator('.ve-step-record p').count()===9&&await plain.locator('.ve-step-checkpoint>p').count()===9,venture+' native page retains all nine full stage readings.');
  check(await guide.locator('[data-vfg-art-panel]:visible').count()===3,venture+' native image retains every descriptive reading.');
  for(const area of await guide.locator('[data-vfg-area]').all()){if(!await area.evaluate(element=>element.open))await area.locator('summary').click();check(await area.locator('[data-vfg-content]').isVisible(),venture+' native field content remains readable and interactive.');}
  await fit(plain,venture+' native field guide at 320px');
 }
 await visit(plain,'/');for(const journey of await plain.locator('[data-portfolio-journey]').all()){await journey.locator('summary').click();check(await journey.locator('.pj-reading').isVisible(),'Native home portfolio stories remain readable without JavaScript.');}await fit(plain,'Native home portfolio stories at 320px');await native.close();

 const motion=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});listen(motion);const moving=await motion.newPage();await visit(moving,'/projects/nrth-health');
 await moving.locator('[data-vfg-art-choice]').nth(1).click();await moving.locator('[data-vfg-art-choice]').last().click();await moving.waitForTimeout(600);
 check(await moving.locator('[data-vfg-art-panel]:visible').count()===1&&await moving.locator('[data-vfg-art-choice]').last().getAttribute('aria-selected')==='true','Interrupted artwork selection settles on the latest reading.');
 await moving.locator('footer [data-motion-toggle]').click();await moving.waitForFunction(()=>document.documentElement.classList.contains('motion-paused'));
 await moving.locator('[data-vfg-art-choice]').first().click();await noAnimation(moving.locator('[data-venture-field-guide]'),'Globally paused field artwork');
 const crop=await moving.locator('[data-vfg-image]').evaluate(element=>getComputedStyle(element).transform);await moving.waitForTimeout(200);
 check(await moving.locator('[data-vfg-image]').evaluate(element=>getComputedStyle(element).transform)===crop,'Global pause retains the selected crop as a stable image.');
 await moving.locator('[data-ve-panel]:visible [data-ve-step="2"]').click();await noAnimation(moving.locator('[data-ve-panel]:visible'),'Globally paused work stage');
 await visit(moving,'/');const pausedJourney=moving.locator('[data-portfolio-journey]').first();await pausedJourney.locator('summary').click();await pausedJourney.locator('.pj-reading').waitFor({state:'visible'});
 check(await pausedJourney.evaluate(element=>getComputedStyle(element,'::details-content').transitionDuration.split(',').every(duration=>parseFloat(duration)===0)),'Global pause also keeps the native home story disclosure still.');await noAnimation(pausedJourney,'Globally paused home story');await motion.close();
 check(errors.length===0,'The field guides and stage exploration have no uncaught browser errors.');
 evidence.push('All work-stage decisions were verified as reviewed inquiry drafts; no messages were sent.','The suite uses no WebGL renderer; existing motion suites retain that coverage.');
 fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:true,errors,evidence},null,2));console.log(checks+' field-guide checks passed.');await browser.close();
})().catch(async error=>{console.error(error);fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:false,error:String(error),errors,evidence},null,2));await browser?.close();process.exitCode=1;});
