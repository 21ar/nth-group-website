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
 const portfolio=page.locator('[data-venture-index]'),rows=portfolio.locator('[data-index-row]');
 check(await rows.count()===9,'The homepage portfolio contains all nine venture directions');
 check(await portfolio.locator('[data-index-art]').count()===9,'Each direction has its own large artwork');
 await portfolio.locator('[data-index-filter="Mobility"]').click();
 check(await portfolio.locator('[data-index-row]:visible').count()===4,'The mobility filter exposes four distinct perspectives');
 check(await portfolio.locator('[data-index-filter="Mobility"]').getAttribute('aria-pressed')==='true','The selected field is announced by its native control');
 check(await portfolio.locator('[data-index-art].is-active').getAttribute('data-index-art')==='nrth-tms','Filtering away the current direction selects a matching artwork');
 check((await portfolio.locator('[data-index-caption]').textContent()).includes('NRTH TMS'),'The filtered artwork retains its matching caption');
 await portfolio.locator('[data-index-search]').fill('Fleet');
 check(await portfolio.locator('[data-index-row]:visible').count()===1&&await portfolio.locator('[data-index-row]:visible').getAttribute('data-index-venture')==='nrth-fleet','Search and field filtering combine to find the matching venture');
 check(await portfolio.locator('[data-index-art].is-active').getAttribute('data-index-art')==='nrth-fleet','The search result also selects its matching artwork');
 check((await portfolio.locator('[data-index-result]').textContent()).trim()==='1 venture','The result status announces the matching count');
 await portfolio.locator('[data-index-search]').fill('not-a-venture');
 check(await portfolio.locator('[data-index-empty]').isVisible()&&await portfolio.locator('[data-index-row]:visible').count()===0,'An unmatched search gives a clear empty state');
 check(await portfolio.locator('[data-index-art].is-active').count()===0&&(await portfolio.locator('[data-index-caption]').textContent()).trim()==='','An unmatched search clears stale artwork and its caption');
 check(await portfolio.locator('.index-art').evaluate(element=>element.classList.contains('is-empty')),'The empty result also hides the unused artwork frame');
 await portfolio.locator('[data-index-reset]').click();
 check(await portfolio.locator('[data-index-row]:visible').count()===9,'The recovery control restores all nine directions');
 check(await portfolio.locator('[data-index-search]').inputValue()===''&&await portfolio.locator('[data-index-filter="All"]').getAttribute('aria-pressed')==='true','Recovery clears both the search and selected field');
 check(await portfolio.locator('[data-index-search]').evaluate(element=>element===document.activeElement),'Recovery leaves keyboard focus on the cleared search');
 check(await portfolio.locator('[data-index-art].is-active').getAttribute('data-index-art')==='nrth-health'&&!await portfolio.locator('.index-art').evaluate(element=>element.classList.contains('is-empty')),'Recovery restores the first artwork and its frame');
 await portfolio.locator('[data-index-venture="nrth-tms"]').focus();
 check(await portfolio.locator('[data-index-art].is-active').getAttribute('data-index-art')==='nrth-tms','Keyboard exploration selects the transportation artwork');
 check((await portfolio.locator('[data-index-caption]').textContent()).includes('NRTH TMS'),'The artwork caption follows the selected venture');
 await portfolio.locator('[data-index-venture="nrth-events"]').hover();
 check(await portfolio.locator('[data-index-art].is-active').getAttribute('data-index-art')==='nrth-events','Pointer exploration selects the same large-art presentation');
 const guides=page.locator('.industry-guide-grid>a');
 check(await guides.count()===6,'The homepage gives each of the six industries a dedicated large guide');
 check(await guides.locator('[data-quality-plate]').count()===6,'Every industry guide retains its original material illustration');
 check(await guides.locator('.industry-guide-question').count()===6,'Every industry guide explains the question behind its illustration');
 await unique('Homepage');await fit('Homepage');
 await page.locator('.portfolio-section').evaluate(element=>scrollTo({top:element.offsetTop+240,behavior:'instant'}));await page.screenshot({path:out+'/portfolio-desktop.png'});
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
  await visit('/');await portfolio.locator('[data-index-filter="Mobility"]').click();
  check(await portfolio.locator('[data-index-row]:visible').count()===4,'The mobile field filter retains all four mobility directions at '+width);
  await portfolio.locator('[data-index-venture="nrth-tms"]').focus();
  check(await portfolio.locator('[data-index-art].is-active').getAttribute('data-index-art')==='nrth-tms','The mobile portfolio selects the matching artwork at '+width);
  await fit('Interactive portfolio '+width);await portfolio.scrollIntoViewIfNeeded();await page.screenshot({path:out+'/portfolio-'+width+'.png'});
  await page.locator('.industry-directory').scrollIntoViewIfNeeded();await fit('Industry directory '+width);await page.screenshot({path:out+'/industry-guides-'+width+'.png'});
 }
 const native=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plain=await native.newPage();
 await plain.goto(base+'/');
 check(await plain.locator('[data-index-row]').count()===9&&await plain.locator('[data-index-row]').first().getAttribute('role')===null,'All nine native portfolio links open real overviews');
 check(await plain.locator('[data-index-row]:visible').count()===9,'The unfiltered portfolio remains available without JavaScript');
 check(await plain.locator('.industry-guide-grid>a').count()===6,'All six industry guides are server rendered');
 await plain.goto(base+'/projects/nrth-health');check(await plain.locator('[data-example-record]:visible').count()===3,'All three example records remain readable without JavaScript');
 check(await plain.locator('[data-example-part-record]').count()===6,'The native example retains its inspectable responsibilities');
 await plain.goto(base+'/work');check(await plain.locator('.work-library-record-link').count()===4,'The study library is server rendered');
 check(errors.length===0,'No uncaught page errors');
 fs.writeFileSync(out+'/experience-results.json',JSON.stringify({checks,passed:true,errors},null,2));console.log(checks+' next-stage experience checks passed.');await browser.close();
})().catch(async error=>{fs.writeFileSync(out+'/experience-results.json',JSON.stringify({checks,passed:false,error:String(error),errors},null,2));console.error(error);await browser?.close();process.exitCode=1;});
