// Check the restored design's real content, interactions and native alternatives.
// The separate browser/depth suites verify WebGL motion; this CI suite uses no GPU.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
const base=(process.env.NRTH_TEST_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const out='artifacts/matterfield/baseline';fs.mkdirSync(out,{recursive:true});
const ventures=['health','tms','telematics','logistics','systems','labs','chemicals','fleet','events'];
const fields=['mobility','health','systems','materials','events','research'];
const articles=['clarity-is-a-design-decision','connecting-the-parts-of-movement','making-room-for-experimentation'];
let browser,checks=0;const errors=[];
function check(value,label){assert.ok(value,label);checks++;}
async function fit(page,label){check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' has no horizontal overflow.');}
async function visit(page,route){const response=await page.goto(base+route,{waitUntil:'networkidle'});check(response.status()===200,route+' is available.');}
async function downloadable(page,selector){const event=page.waitForEvent('download');await page.locator(selector).click();return fs.readFileSync(await (await event).path(),'utf8');}

(async()=>{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-webgl']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});
 context.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
 const page=await context.newPage();
 // Review/preparation is exercised; no test can deliver a real inquiry.
 await page.route('**/api/inquiries',route=>route.abort());
 await visit(page,'/');
 check(await page.locator('.brand').first().locator('path').count()===4,'The canonical NRTH logo retains all four contours.');
 check(await page.locator('.matter-static-fields').isVisible(),'Reduced motion offers the complete readable industry journey.');
 check(await page.locator('[data-matter-world] canvas').count()===0,'Reduced motion does not initialize the opening renderer.');
 check(await page.locator('.portfolio-section [data-index-row]').count()===9,'The original portfolio structure contains all nine ventures.');
 check(await page.locator('.manifesto-section img').count()>0,'The original architectural artwork remains in the company story.');
 check(await page.locator('.industry-guide-grid a').count()===6,'The home directory retains all six industry guides.');
 check(await page.locator('[data-connection-choice]').count()===9,'All nine ventures remain explorable through their relationships.');
 await page.locator('[data-connection-choice="nrth-chemicals"]').click();
 check(await page.locator('[data-connection-story]:visible').count()===1,'Choosing a relationship exposes one clear reading.');
 check(await page.locator('[data-connection-choice="nrth-chemicals"]').getAttribute('aria-pressed')==='true','The active venture relationship is announced.');
 await page.locator('[data-site-menu] summary').click();
 await page.waitForFunction(()=>document.querySelector('main').inert);
 check(await page.locator('.menu-ventures a').count()===9,'The menu provides every venture.');
 check(await page.locator('.menu-company a[href="/investors"]').isVisible(),'The investor page is reachable through the menu.');
 await page.locator('.menu-ventures a').last().focus();await page.keyboard.press('Tab');
 check(await page.locator('[data-site-menu] summary').evaluate(element=>element===document.activeElement),'The open menu wraps keyboard focus.');
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('main').inert);
 check(await page.locator('[data-site-menu] summary').evaluate(element=>element===document.activeElement),'Closing the menu restores focus.');

 await visit(page,'/projects');
 await page.locator('[data-index-filter="Mobility"]').click();
 check(await page.locator('[data-index-row]:visible').count()===4,'Mobility narrows the portfolio to four relevant ventures.');
 check((await page.locator('[data-index-result]').textContent()).includes('4 ventures'),'Filtering updates the result announcement.');
 check((await page.locator('[data-index-caption]').textContent()).includes((await page.locator('[data-index-row]:visible .index-name').first().textContent()).trim()),'Filtering selects a caption from the visible ventures immediately.');
 check(await page.locator('[data-index-art="0"]').evaluate(element=>element.classList.contains('is-active')),'Mobility filtering retains the corresponding architectural artwork.');
 await page.locator('[data-index-filter="All"]').click();await page.locator('[data-index-search]').fill('Health');
 check(await page.locator('[data-index-row]:visible').count()===1,'Portfolio search finds the requested venture.');
 check(await page.locator('[data-index-art="1"]').evaluate(element=>element.classList.contains('is-active'))&&(await page.locator('[data-index-caption]').textContent()).includes('Health'),'Search synchronizes the visible venture with its original mineral artwork and caption.');
 await page.locator('[data-index-row]:visible').focus();
 check((await page.locator('[data-index-caption]').textContent()).includes('Health'),'Keyboard selection updates the original image caption.');
 await page.locator('[data-index-search]').fill('no matching venture');
 check(await page.locator('[data-index-empty]').isVisible(),'An empty search explains how to recover.');
 check(await page.locator('.index-art').evaluate(element=>element.hidden)&&await page.locator('[data-index-art].is-active').count()===0,'An empty search clears the stale venture illustration.');
 await page.locator('[data-index-search]').fill('');
 check(await page.locator('[data-index-row]:visible').count()===9,'Clearing search restores the whole portfolio.');

 for(const venture of ventures){
  const route='/projects/nrth-'+venture;await visit(page,route);
  check(await page.locator('.venture-heading-art img').count()===1,venture+' retains its large original artwork.');
  check(await page.locator('[data-focus-choice]').count()===3,venture+' retains three detailed focus perspectives.');
  check(await page.locator('.vs-workflow-stages article').count()===3,venture+' retains its three-step workflow.');
  check(await page.locator('[data-scenario-choice]').count()===3,venture+' retains three practical scenarios.');
  check(await page.locator('.vs-questions details').count()===3,venture+' retains three scope questions.');
  await page.locator('[data-focus-choice]').first().focus();await page.keyboard.press('ArrowDown');
  check(await page.locator('[data-focus-choice]').nth(1).getAttribute('aria-selected')==='true'&&await page.locator('[data-focus-panel]:visible').count()===1,venture+' focus perspectives work by keyboard.');
  const before=(await page.locator('[data-scenario-panel]:visible').textContent()).trim();
  await page.locator('[data-scenario-choice]').first().focus();await page.keyboard.press('End');
  check(await page.locator('[data-scenario-choice]').last().getAttribute('aria-selected')==='true',venture+' scenario selection works by keyboard.');
  check(await page.locator('[data-scenario-panel]:visible').count()===1&&(await page.locator('[data-scenario-panel]:visible').textContent()).trim()!==before,venture+' scenario changes the explanation.');
  check((await page.locator('[data-scenario-panel]:visible a').getAttribute('href')).includes('project=nrth-'+venture),venture+' scenario carries the correct inquiry context.');
  await page.locator('.vs-questions summary').first().click();
  check(await page.locator('.vs-questions details').first().evaluate(element=>element.open),venture+' questions expand natively.');
  await fit(page,route);
 }
 for(const field of fields){
  await visit(page,'/industries/'+field);
  check(await page.locator('[data-industry-choice]').count()===3,field+' retains three complete decision contexts.');
  const choice=page.locator('[data-industry-choice]').last(),key=await choice.getAttribute('data-industry-choice');
  await choice.locator('summary').click();
  await page.waitForFunction(key=>document.querySelector('[data-industry-diagram]').dataset.industryContext===key,key);
  check(await page.locator('[data-industry-path][data-active="true"]').count()===1,field+' selection emphasizes one corresponding diagram path.');
  check(await page.locator('[data-industry-path="'+key+'"]').getAttribute('data-active')==='true',field+' decision and illustration remain matched.');
  check(await page.locator('.industry-questions details').count()===3,field+' retains its scope questions.');
 }
 for(const slug of articles){
  await visit(page,'/insights/'+slug);
  check(await page.locator('.wide-art img').count()===1,slug+' retains its full-width original illustration.');
  check(await page.locator('.article-prose>p').count()>=5,slug+' retains its substantive editorial detail.');
  check(await page.locator('.article-prose li').count()>=3,slug+' offers practical questions to take further.');
 }
 for(const route of ['/about','/approach','/press','/insights','/industries','/privacy','/terms']){
  await visit(page,route);check(await page.locator('h1').count()===1,route+' has one primary heading.');await fit(page,route);
 }

 await visit(page,'/investors');
 check(await page.locator('[data-investor-card]').count()===3,'The investor comparison starts with three useful readings.');
 await page.locator('[data-investor-choice][value="nrth-chemicals"]').click();
 check(!await page.locator('[data-investor-choice][value="nrth-chemicals"]').isChecked(),'The comparison explains its three-venture limit.');
 await page.locator('[data-investor-choice][value="nrth-health"]').uncheck();await page.locator('[data-investor-choice][value="nrth-chemicals"]').check();
 check(await page.locator('[data-investor-card="nrth-chemicals"]').count()===1,'Replacing a perspective updates the comparison.');
 const pack=await downloadable(page,'[data-investor-save]');
 check(pack.includes('NRTH Chemicals')&&pack.includes('Published scope:')&&pack.includes('https://nrth.group/about'),'The saved investor pack retains the actual selection, scope and reading links.');
 await page.locator('[data-investor-inquiry]').click();await page.waitForURL('**/contact?*');
 check(await page.locator('[name="project"]').inputValue()==='investor','The comparison prepares an investor inquiry.');
 check((await page.locator('[name="message"]').inputValue()).toLowerCase().includes('nrth chemicals'),'The comparison remains in the editable inquiry.');

 await visit(page,'/research');
 check(await page.locator('[data-experiment-method-control]').count()===4,'The research planner retains four bounded methods.');
 const outlines=new Set();
 for(const field of fields){
  await page.locator('[data-experiment-field-control]').selectOption(field);await page.locator('[data-experiment-method-control][value="document-review"]').check();
  const observation=(await page.locator('[data-experiment-observations]').textContent()).trim();
  check(observation.length>40&&(await page.locator('[data-experiment-limit]').textContent()).trim().length>40,field+' research specifies observations and limits.');
  outlines.add((await page.locator('[data-experiment-question-preview]').textContent())+observation);
 }
 check(outlines.size===6,'Each research field produces a distinct, relevant outline.');
 await page.locator('[data-experiment-question]').fill('Which context helps a colleague understand the next handoff?');
 check((await downloadable(page,'[data-experiment-download]')).includes('next handoff'),'A saved research outline includes the written question.');
 await page.locator('[data-experiment-continue]').click();await page.waitForURL('**/contact?*');
 check(await page.locator('[name="project"]').inputValue()==='nrth-labs'&&(await page.locator('[name="message"]').inputValue()).includes('next handoff'),'A research outline travels into an editable Labs inquiry.');
 check(await page.evaluate(()=>sessionStorage.getItem('nrth-research-outline')===null),'Research transfer clears temporary content after consumption.');

 await visit(page,'/partnerships');
 check(await page.locator('.wide-art img').count()===1,'Partnerships retains the original architectural image and structure.');
 await page.locator('[name="direction"][value="experiment"]').check();await page.locator('[name="venture"]').selectOption('NRTH Labs');await page.locator('[name="contribution"]').selectOption('Research knowledge');
 await page.locator('[name="question"]').fill('How might teams understand a change in responsibility?');
 check((await downloadable(page,'[data-brief-save]')).includes('Research knowledge'),'A saved partnership brief includes the selected contribution.');
 await page.locator('.brief-continue').click();await page.waitForURL('**/contact?*');
 check(await page.locator('[name="project"]').inputValue()==='partnership'&&(await page.locator('[name="message"]').inputValue()).includes('change in responsibility'),'The partnership outline survives its inquiry handoff.');
 await page.locator('[name="name"]').fill('Baseline reviewer');await page.locator('[name="email"]').fill('reviewer@example.com');await page.locator('.form-submit').click();
 check(await page.locator('[data-inquiry-result]').isVisible(),'Inquiries are reviewed before delivery.');
 check((await page.locator('[data-inquiry-email]').getAttribute('href')).startsWith('mailto:partnerships@nrth.group?'),'The prepared partnership uses its intended inbox.');

 await page.setViewportSize({width:320,height:700});
 for(const route of ['/','/projects','/projects/nrth-health','/projects/nrth-tms','/projects/nrth-events','/industries/materials','/investors','/research','/partnerships','/insights/clarity-is-a-design-decision','/about','/contact']){await visit(page,route);await fit(page,route+' at 320px');}
 check(await page.locator('.contact-side').evaluate(element=>getComputedStyle(element).display!=='none'),'Phone contact retains its direct inquiry guidance.');
 await page.screenshot({path:out+'/contact-320.png'});
 const native=await browser.newContext({viewport:{width:320,height:700},javaScriptEnabled:false,reducedMotion:'reduce'});const plain=await native.newPage();
 await visit(plain,'/');
 check(await plain.locator('.matter-static-fields a[href^="/industries/"]').count()===6&&await plain.locator('.matter-static-fields a[href^="/projects/"]').count()===9,'The native opening exposes all ventures and industries without JavaScript.');
 await visit(plain,'/projects/nrth-health');
 check(await plain.locator('[data-scenario-panel]:visible').count()===3,'All venture scenarios remain readable without JavaScript.');
 await plain.locator('.vs-questions summary').last().click();
 check(await plain.locator('.vs-questions details').last().evaluate(element=>element.open),'Native venture questions remain interactive.');
 await visit(plain,'/industries/health');await plain.locator('[data-industry-choice]').last().locator('summary').click();
 check(await plain.locator('[data-industry-choice]').last().evaluate(element=>element.open),'Industry decision contexts remain native disclosures.');
 await visit(plain,'/investors');check(await plain.locator('[data-investor-card]').count()===3,'Native investors retain the initial complete comparison.');
 await visit(plain,'/research');check(await plain.locator('[data-experiment-planner] details').count()===4,'Research methods remain readable without JavaScript.');
 await native.close();check(errors.length===0,'The restored baseline has no uncaught browser errors.');
 fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:true,errors},null,2));console.log(checks+' restored-baseline checks passed.');await browser.close();
})().catch(async error=>{console.error(error);fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:false,error:String(error),errors},null,2));await browser?.close();process.exitCode=1;});
