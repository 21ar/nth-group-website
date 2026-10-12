const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('@playwright/test');
const base=process.env.NRTH_TEST_URL||'http://127.0.0.1:4173';
const out='artifacts/next-stage';fs.mkdirSync(out,{recursive:true});
let checks=0,browser;const errors=[];
const check=(value,label)=>{assert.ok(value,label);checks++;};
const ventures=['health','tms','telematics','logistics','systems','labs','chemicals','fleet','events'];
(async()=>{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-webgl']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});
 context.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
 const page=await context.newPage();
 const visit=async route=>{const response=await page.goto(base+route,{waitUntil:'networkidle'});check(response.ok(),route+' loads');};
 const fit=async label=>check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' fits');
 const unique=async label=>{const result=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(node=>node.id);return ids.length===new Set(ids).size;});check(result,label+' has unique document/diagram IDs');};
 await visit('/');
 const atlas=page.locator('[data-portfolio-atlas]');check(await atlas.locator('[data-atlas-choice]').count()===9,'The atlas contains all nine directions');
 await atlas.locator('[data-atlas-choice="nrth-tms"]').click();
 check(await atlas.getAttribute('data-atlas-selected')==='nrth-tms','Selecting a form changes its reading');
 check(await atlas.locator('[data-atlas-panel="nrth-tms"]').isVisible(),'The transportation question is visible');
 await atlas.locator('[data-atlas-field="Mobility"]').click();check(await atlas.locator('[data-atlas-choice]:visible').count()===4,'Mobility exposes four distinct perspectives');
 await atlas.locator('[data-atlas-field="All"]').click();await atlas.locator('[data-atlas-choice="nrth-health"]').focus();await page.keyboard.press('End');
 check(await atlas.getAttribute('data-atlas-selected')==='nrth-events','The atlas supports ordinary keyboard navigation');
 const homeExample=page.locator('[data-worked-example]');check(await homeExample.locator('[data-example-choice]').count()===3,'The homepage offers a concrete worked example');
 await homeExample.locator('[data-example-choice]').nth(2).click();check(await homeExample.getAttribute('data-example-state')==='2','The homepage example changes its work');
 await unique('Homepage');await fit('Homepage');
 await page.locator('.portfolio-section').evaluate(element=>scrollTo({top:element.offsetTop+240,behavior:'instant'}));await page.screenshot({path:out+'/atlas-desktop.png'});
 const signatures=[];
 for(const slug of ventures){
  await visit('/projects/nrth-'+slug);const model=page.locator('[data-worked-example]');
  check(await model.count()===1,slug+' has its own worked example');
  check(await model.locator('[data-example-node]').count()===6,slug+' shows six explicit records and responsibilities');
  const states=[];
  for(let i=0;i<3;i++){
   await page.locator('[data-scenario-choice]').nth(i).click();
   await page.waitForFunction(i=>document.querySelector('[data-worked-example]').dataset.exampleState===String(i)&&document.querySelector('[data-worked-example]').dataset.exampleSettled==='true',i);
   const pose=await model.locator('[data-example-node]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('transform')).join('|'));
   const edges=await model.locator('[data-example-edge]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-mode')+':'+node.getAttribute('opacity')).join('|'));
   states.push(pose+edges);check((await model.locator('[data-example-caption]').textContent()).trim().length>50,slug+' scenario '+i+' explains what changes');
  }
  check(new Set(states).size===3,slug+' scenarios change the actual diagram and dependencies');signatures.push(states.join(';'));
  if(await model.getAttribute('data-example-dependencies')==='true')await model.locator('[data-example-dependencies-toggle]').click();
  check(await model.getAttribute('data-example-dependencies')==='false','Downstream work can be folded away');
  await model.locator('[data-example-dependencies-toggle]').click();check(await model.getAttribute('data-example-dependencies')==='true','Downstream work can be traced deliberately');
  const record=model.locator('[data-example-part-record]').nth(4),part=await record.getAttribute('data-example-part-record');
  if(!await record.evaluate(element=>element.open))await record.locator('summary').click();
  await page.waitForFunction(part=>document.querySelector('[data-worked-example]').dataset.examplePart===part,part);
  check(await model.getAttribute('data-example-part')===part,slug+' inspection highlights the corresponding record');
  check((await model.locator('.ve-synthetic').textContent()).includes('Synthetic'),'Example scope stays visible');
  check(await page.locator('[data-structured-editorial]').count()>=1,'Current scope has a structured reading');await unique(slug);await fit(slug);
 }
 check(new Set(signatures).size===9,'All nine ventures have distinct model behavior');
 for(const field of ['mobility','health','systems','materials','events','research']){
  await visit('/industries/'+field);const exhibits=page.locator('[data-evidence-exhibit]');check(await exhibits.count()===3,field+' has three concrete exhibits');
  for(let i=0;i<3;i++){
   const exhibit=exhibits.nth(i);const before=await exhibit.locator('.evidence-exhibit-observation:visible').textContent();const radio=exhibit.locator('input[type=radio]').nth(1);await exhibit.locator('label[for="'+await radio.getAttribute('id')+'"]').click();
   check(await radio.isChecked(),'The labelled evidence control selects its native radio');
   check(await exhibit.locator('.evidence-case:visible').count()===1,'Only the selected evidence case is presented');check(await exhibit.locator('.evidence-exhibit-observation:visible').textContent()!==before,'The evidence choice changes the observation');
  }
  await unique(field);await fit(field);
 }
 await visit('/work');const studyLinks=await page.locator('[data-work-library] .work-library-record-link').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
 check(studyLinks.length===4,'The work library has four documented design studies');
 for(const route of studyLinks){await visit(route);check((await page.locator('main').textContent()).includes('design study'),'A study identifies its actual nature');check(await page.locator('a[download]').count()>0,'The study has an artifact to take away');await unique(route);await fit(route);}
 await visit('/insights');const articleLinks=await page.locator('.journal-grid .journal-card').evaluateAll(links=>links.map(link=>link.getAttribute('href')));check(articleLinks.length===8,'The journal has eight substantial articles');
 for(const route of articleLinks){await visit(route);check(await page.locator('.journal-diagram input[type=radio]').count()===3,'The article has an authored interactive diagram');await page.locator('.journal-diagram input[type=radio]').last().check();check(await page.locator('[data-diagram-reading="continuation"]').isVisible(),'The diagram exposes its selected reading');await unique(route);await fit(route);}
 for(const width of [390,320]){
  await page.setViewportSize({width,height:width===390?844:700});
  for(const route of ['/','/projects/nrth-chemicals','/work','/work/one-population-six-readings','/insights/motion-should-explain-the-change','/search','/contact']){await visit(route);await fit(route+' '+width);}
  await visit('/');await atlas.locator('[data-atlas-choice="nrth-tms"]').click();await fit('Interactive atlas '+width);await atlas.scrollIntoViewIfNeeded();await page.screenshot({path:out+'/atlas-'+width+'.png'});
 }
 const native=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plain=await native.newPage();
 await plain.goto(base+'/');check(await plain.locator('[data-atlas-choice]').count()===9&&await plain.locator('[data-atlas-choice]').first().getAttribute('role')===null,'Native atlas links open real overviews');
 await plain.goto(base+'/projects/nrth-health');check(await plain.locator('[data-example-record]:visible').count()===3,'All three example records remain readable without JavaScript');
 check(await plain.locator('[data-example-part-record]').count()===6,'The native example retains its inspectable responsibilities');
 await plain.goto(base+'/work');check(await plain.locator('.work-library-record-link').count()===4,'The study library is server rendered');
 check(errors.length===0,'No uncaught page errors');
 fs.writeFileSync(out+'/experience-results.json',JSON.stringify({checks,passed:true,errors},null,2));console.log(checks+' next-stage experience checks passed.');await browser.close();
})().catch(async error=>{fs.writeFileSync(out+'/experience-results.json',JSON.stringify({checks,passed:false,error:String(error),errors},null,2));console.error(error);await browser?.close();process.exitCode=1;});
