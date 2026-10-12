const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
const base=(process.env.NRTH_TEST_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const out='artifacts/matterfield/depth';fs.mkdirSync(out,{recursive:true});
const fields=['Mobility','Health','Systems','Materials','Events','Research'];
const stops=[.43,.508,.586,.664,.742,.82];
let browser,checks=0;const errors=[];
function check(value,message){assert.ok(value,message);checks++;}
(async()=>{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 const page=await context.newPage();
 const visit=async path=>{const r=await page.goto(base+path,{waitUntil:'networkidle'});check(r.status()===200,path+' is available.');};
 const capture=async name=>page.screenshot({path:out+'/'+name+'.png'});
 const progress=async p=>{await page.evaluate(p=>{const e=document.querySelector('[data-matter-story]');scrollTo({top:p*(e.offsetHeight-innerHeight),behavior:'instant'});},p);await page.waitForFunction(p=>Math.abs(Number(document.querySelector('[data-matter-story]').dataset.matterProgress)-p)<.001,p,{timeout:30000});await page.waitForTimeout(350);};
 const fit=async label=>check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' fits horizontally.');
 await visit('/');await page.waitForFunction(()=>document.querySelector('[data-matter-story]').dataset.mode==='webgl',null,{timeout:45000});
 await page.locator('.discover-cue').click();await page.waitForFunction(()=>{const root=document.querySelector('[data-matter-story]');return Number(root.dataset.matterProgress)>.4&&Number(root.dataset.matterProgress)<.47;},null,{timeout:30000});
 check(await page.locator('[data-matter-story]').getAttribute('data-active-form')==='Mobility'&&await page.locator('[data-field-panel="Mobility"]').isVisible(),'The discovery cue begins the industry journey with Mobility.');
 const samples=[];
 for(let i=0;i<fields.length;i++){
  await progress(stops[i]);check(await page.locator('[data-matter-story]').getAttribute('data-active-form')===fields[i],fields[i]+' is reached by scrolling.');
  check(await page.locator('[data-field-panel="'+fields[i]+'"]').isVisible(),fields[i]+' shows its matched content.');
  samples.push(await page.locator('[data-matter-story]').getAttribute('data-matter-sample'));
 }
 check(new Set(samples).size===6,'Native scrolling reaches six distinct arrangements.');
 await progress(.469);
 await page.waitForFunction(()=>document.querySelector('[data-matter-story]').dataset.readingMoving==='false',null,{timeout:30000});
 check(await page.locator('[data-field-panel]:visible').count()===1&&await page.locator('[data-field-panel]:visible').evaluate(element=>Number(getComputedStyle(element).opacity)>.99),'Stopping between formations leaves one fully legible reading.');
 await progress(.99);
 check(await page.locator('[data-matter-world] canvas').evaluate(element=>Number(getComputedStyle(element).opacity)>.99)&&await page.locator('[data-story-atlas-preview]').count()===0,'The original fragment sculpture remains visible through the portfolio handoff.');
 check(await page.locator('[data-matter-ending]').evaluate(element=>Number(getComputedStyle(element).opacity)>.99)&&await page.locator('[data-matter-ending] h2').textContent().then(text=>text.includes('possibilities')),'The ending resolves into the preferred spacious portfolio introduction.');
 await progress(.43);check(await page.locator('[data-matter-story]').getAttribute('data-active-form')==='Mobility','Reverse scrolling restores the first field.');
 await page.locator('[data-matter-field="Events"]').click();await page.waitForTimeout(1700);
 check(await page.locator('[data-matter-story]').getAttribute('data-field-mode')==='selected','Manual choice overrides the scroll position.');
 await page.waitForTimeout(300);check(await page.locator('[data-field-panel="Events"]').isVisible(),'A manual choice holds while scrolling rests.');
 await progress(.59);await page.waitForTimeout(1200);check(await page.locator('[data-matter-story]').getAttribute('data-field-mode')==='scroll','Moving onward rejoins the continuous journey.');
 await capture('journey-desktop');
 for(const field of fields){
  await page.locator('[data-matter-field="'+field+'"]').click();
  await page.waitForFunction(field=>{const panel=document.querySelector('[data-field-panel="'+field+'"]');return !panel.hidden&&Number(getComputedStyle(panel).opacity)>.2;},field,{timeout:30000});
  check(await page.locator('[data-field-panel="'+field+'"] [data-story-inspect]').evaluate(element=>{const box=element.getBoundingClientRect();return document.elementFromPoint(box.x+box.width/2,box.y+box.height/2)?.closest('[data-story-inspect]')===element;}),field+' active reading receives pointer events while outgoing copy clears.');
  await page.waitForFunction(()=>document.querySelector('[data-matter-story]').dataset.readingMoving==='false',null,{timeout:30000});
  check(await page.locator('[data-field-panel="'+field+'"]').evaluate(element=>{const style=getComputedStyle(element);return Number(style.opacity)===1&&new DOMMatrixReadOnly(style.transform).m42===0;}),field+' settles at a stable, fully legible position.');
  const opener=page.locator('[data-field-panel="'+field+'"] [data-story-inspect]');await opener.click();
  check(await page.locator('[data-story-inspector]').evaluate(e=>e.open),field+' opens its detail inspector.');
  check(await page.locator('[data-inspector-group]:visible [data-inspector-tab]').count()===3,field+' has three useful perspectives.');
  if(field==='Materials'){await page.waitForTimeout(900);await capture('inspection-materials-applications');}
  const before=await page.locator('[data-inspector-group]:visible [data-inspector-panel]:visible').textContent();
  await page.locator('[data-inspector-group]:visible [data-inspector-tab]').first().focus();await page.keyboard.press('End');
  check(await page.locator('[data-matter-story]').getAttribute('data-inspect-part')==='2',field+' inspection targets actual fragments.');
  check(await page.locator('[data-inspector-group]:visible [data-inspector-panel]:visible').textContent()!==before,field+' inspection changes the substantive explanation.');
  check(await page.evaluate(()=>document.body.style.overflow==='hidden'),'The reading overlay holds the underlying scroll position.');
  if(field==='Materials'){await page.waitForTimeout(900);await capture('inspection-materials-partners');}
  await page.keyboard.press('Escape');check(await opener.evaluate(e=>e===document.activeElement),field+' close restores focus to its trigger.');
 }
 console.log('Continuous six-field journey and eighteen inspector perspectives passed.');
 await page.emulateMedia({reducedMotion:'reduce'});
 await visit('/industries');check(await page.locator('.industry-guide-grid a').count()===6,'The industry directory reaches all six guides.');
 for(const field of fields){
  const route='/industries/'+field.toLowerCase();await visit(route);
  check((await page.locator('link[rel="canonical"]').getAttribute('href')).endsWith(route),'Canonical metadata points to '+field+'.');
  check(await page.locator('[data-industry-choice]').count()===3,field+' has three specific decision contexts.');
  const choices=page.locator('[data-industry-choice]');await choices.nth(1).locator('summary').click();
  await page.waitForFunction(()=>document.querySelector('[data-industry-diagram]').dataset.industryContext===document.querySelectorAll('[data-industry-choice]')[1].dataset.industryChoice);
  check(await page.locator('[data-industry-path][data-active="true"]').count()===1,field+' context highlights the matching diagram path.');
  check(await page.locator('.industry-questions details').count()===3,field+' provides three scope questions.');
  const r=await page.request.get(base+'/resources/social/industries-'+field.toLowerCase()+'.png');check(r.ok(),field+' has a generated social image.');
  await fit(field);if(field==='Materials')await capture('industry-desktop');
 }
 console.log('Six detailed industry pages, diagrams and metadata passed.');
 await visit('/investors');check(await page.locator('[data-investor-card]').count()===3,'Investor comparisons start with three perspectives.');
 await page.locator('[data-investor-choice][value="nrth-chemicals"]').click();
 check(!await page.locator('[data-investor-choice][value="nrth-chemicals"]').isChecked(),'A fourth venture is rejected without discarding the first three.');
 await page.locator('[data-investor-choice][value="nrth-health"]').uncheck();await page.locator('[data-investor-choice][value="nrth-chemicals"]').check();
 check((await page.locator('[data-investor-compare]').getAttribute('data-investor-selected')).includes('nrth-chemicals'),'Replacing a venture updates the comparison.');
 const download=page.waitForEvent('download');await page.locator('[data-investor-save]').click();const file=await download;
 const pack=fs.readFileSync(await file.path(),'utf8');check(pack.includes('NRTH Chemicals')&&pack.includes('Published scope:')&&pack.includes('https://nrth.group/about'),'The saved reading pack contains selected ventures, actual scope and working resource links.');
 await capture('investors-desktop');
 await page.locator('[data-investor-inquiry]').click();await page.waitForURL('**/contact?*');check(await page.locator('[name="project"]').inputValue()==='investor','The comparison prepares an investor inquiry.');check((await page.locator('[name="message"]').inputValue()).toLowerCase().includes('nrth chemicals'),'The chosen comparison is retained in the inquiry.');
 await visit('/investors?compare=nrth-events,nrth-fleet');check(await page.locator('[data-investor-card]').count()===2,'A shared comparison restores two selected perspectives.');await page.locator('[data-investor-reset]').click();check(await page.locator('[data-investor-card]').count()===3,'Reset restores the initial comparison.');
 await visit('/research');await page.locator('[data-experiment-planner]').scrollIntoViewIfNeeded();
 const outlines=new Set();
 for(const field of fields){
  await page.locator('[data-experiment-field-control]').selectOption(field.toLowerCase());
  for(const method of ['conversation','interface-prototype','process-map','document-review']){
   await page.locator('[data-experiment-method-control][value="'+method+'"]').check();
   const observation=await page.locator('[data-experiment-observations]').textContent(),limit=await page.locator('[data-experiment-limit]').textContent();
   check(observation.trim().length>40&&limit.trim().length>40,field+'/'+method+' produces a usable observation and a clear limit.');
   outlines.add((await page.locator('[data-experiment-question-preview]').textContent())+observation+limit);
  }
 }
 check(outlines.size===24,'All field and method combinations provide distinct plans.');
 await page.locator('[data-experiment-question]').fill('What information helps a new colleague understand a changing handoff?');
 const saved=page.waitForEvent('download');await page.locator('[data-experiment-download]').click();const outline=fs.readFileSync(await (await saved).path(),'utf8');check(outline.includes('new colleague'),'A saved research outline includes the actual written question.');
 await capture('experiment-desktop');await page.locator('[data-experiment-continue]').click();await page.waitForURL('**/contact?*');
 check(await page.locator('[name="project"]').inputValue()==='nrth-labs','The prepared outline opens a Labs inquiry.');check((await page.locator('[name="message"]').inputValue()).includes('new colleague'),'The complete research outline remains editable in the inquiry.');check(await page.evaluate(()=>sessionStorage.getItem('nrth-research-outline')===null),'The temporary research transfer clears after consumption.');
 console.log('Investor comparisons and twenty-four research plans passed.');
 for(const width of [390,320]){
  await page.setViewportSize({width,height:width===390?844:568});
  for(const [route,selector,name] of [['/industries/materials','[data-industry-explorer]','industry'],['/investors','[data-investor-compare]','investors'],['/research','[data-experiment-planner]','experiment']]){await visit(route);await page.locator(selector).evaluate(e=>e.scrollIntoView({block:'start'}));await fit(name+' '+width);await capture(name+'-'+width);}
 }
 const plain=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});const p=await plain.newPage();
 await p.goto(base+'/industries/health');check(await p.locator('[data-industry-choice]').count()===3,'Industry contexts remain native disclosures without JavaScript.');
 await p.goto(base+'/investors');check(await p.locator('[data-investor-card]').count()===3,'Investor comparisons have a useful server-rendered default.');
 await p.goto(base+'/research');check(await p.locator('[data-experiment-planner] details').count()===4,'Research methods are readable without JavaScript.');await plain.close();
 check(errors.length===0,'No uncaught browser errors.');fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:true,errors},null,2));console.log(checks+' depth checks passed.');await browser.close();
})().catch(async error=>{console.error(error);fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:false,error:String(error),errors},null,2));await browser?.close();process.exitCode=1;});
