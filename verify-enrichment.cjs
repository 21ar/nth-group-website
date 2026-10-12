const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const sharp=require('sharp');
const base=(process.env.NRTH_TEST_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const out='artifacts/matterfield/enrichment';
const ventures=['health','tms','telematics','logistics','systems','labs','chemicals','fleet','events'];
let checks=0,browser;
const errors=[];
function check(condition,message){assert.ok(condition,message);checks++;}
fs.mkdirSync(out,{recursive:true});
(async()=>{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 const page=await context.newPage();
 const visit=async route=>{const r=await page.goto(base+route,{waitUntil:'networkidle'});check(r.status()===200,route+' is available.');};
 const fits=async label=>check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' fits horizontally.');
 const capture=async (selector,name)=>{await page.locator(selector).evaluate(e=>e.scrollIntoView({block:'start'}));await page.waitForTimeout(150);await page.screenshot({path:out+'/'+name+'.png'});};

 await visit('/');
 check(await page.locator('[data-connection-choice]').count()===9,'All nine ventures are in the constellation.');
 check(await page.locator('[data-connection-field]').count()===6,'All six fields are offered.');
 for(const venture of ventures){
  await page.locator('[data-connection-choice="nrth-'+venture+'"]').click();
  check(await page.locator('[data-connection-story]:visible').count()===1,venture+' has one active relationship story.');
  check(await page.locator('[data-connection-choice="nrth-'+venture+'"]').getAttribute('aria-pressed')==='true',venture+' has a selected control.');
  check(await page.locator('[data-connection-path-group][data-connection-path-active="true"]').count()===1,venture+' has one active path group.');
  check(await page.locator('[data-connection-story]:visible .connections-related a').count()>=2,venture+' explains multiple possible handoffs.');
 }
 await page.locator('[data-connection-choice="nrth-health"]').focus();await page.keyboard.press('End');
 check(await page.locator('[data-connection-choice]').last().evaluate(e=>e===document.activeElement),'Constellation keyboard navigation moves selection and focus.');
 await capture('[data-connections-explorer]','connections-desktop');await fits('The constellation');
 console.log('Constellation selections and keyboard checks passed.');

 for(const venture of ventures){
  await visit('/projects/nrth-'+venture);
  check(await page.locator('[data-venture-stories]').count()===1,venture+' includes its detailed story.');
  const choices=page.locator('[data-scenario-choice]');
  check(await choices.count()>=2,venture+' offers meaningful context choices.');
  const before=await page.locator('[data-scenario-panel]:visible').textContent();await choices.nth(1).click();
  check(await page.locator('[data-scenario-panel]:visible').count()===1&&await page.locator('[data-scenario-panel]:visible').textContent()!==before,venture+' changes the context and decision.');
  check((await page.locator('[data-scenario-panel]:visible a').getAttribute('href')).includes('project=nrth-'+venture),venture+' carries its scenario to an inquiry.');
  await choices.nth(1).focus();await page.keyboard.press('End');
  check(await choices.last().getAttribute('aria-selected')==='true'&&await choices.last().evaluate(e=>e===document.activeElement),venture+' supports keyboard scenario selection.');
  check(await page.locator('[data-venture-stories] .vs-questions details').count()===3,venture+' answers three practical questions.');
  await page.locator('[data-venture-stories] details summary').first().click();
  check(await page.locator('[data-venture-stories] details').first().getAttribute('open')!==null,venture+' questions expand natively.');
 }
 await capture('[data-venture-stories]','venture-desktop');
 console.log('All nine venture scenarios and questions passed.');

 await visit('/partnerships');
 await page.locator('[name="direction"][value="experiment"]').check();
 await page.locator('[name="venture"]').selectOption('NRTH Labs');
 await page.locator('[name="contribution"]').selectOption('Research knowledge');
 await page.locator('[name="question"]').fill('We want to investigate how information is understood across an operational handoff.');
 check((await page.locator('[data-brief-title]').textContent()).includes('idea to test'),'The brief changes its framing.');
 check((await page.locator('[data-brief-question-preview]').textContent()).includes('operational handoff'),'The outline reflects the actual question.');
 const download=page.waitForEvent('download');await page.locator('[data-brief-save]').click();
 const file=await download;check(fs.readFileSync(await file.path(),'utf8').includes('Research knowledge'),'A saved brief includes the selected expertise.');
 await capture('[data-partnership-brief]','brief-desktop');
 await page.locator('.brief-continue').click();await page.waitForURL('**/contact?*');
 check(await page.locator('[name="project"]').inputValue()==='partnership','The prepared brief opens the correct inquiry.');
 check((await page.locator('[name="message"]').inputValue()).includes('operational handoff'),'The prepared outline transfers into editable inquiry text.');
 check(await page.evaluate(()=>sessionStorage.getItem('nrth-partnership-brief')===null),'The temporary handoff is cleared after use.');
 await page.locator('[name="name"]').fill('Browser reviewer');await page.locator('[name="email"]').fill('reviewer@example.com');
 await page.locator('.form-submit').click();
 check((await page.locator('[data-inquiry-email]').getAttribute('href')).startsWith('mailto:partnerships@nrth.group?'),'Review routes the brief to the partnerships inbox without sending it.');
 await page.evaluate(()=>sessionStorage.setItem('nrth-partnership-brief',JSON.stringify({version:1,message:'Expired brief should not populate.',createdAt:Date.now()-3600001})));await page.reload({waitUntil:'networkidle'});
 check(await page.locator('[name="message"]').inputValue()==='','An expired handoff does not repopulate the form.');
 console.log('Partnership draft, export, transfer and review checks passed.');

 await visit('/research');await page.locator('[data-matter-lab]').scrollIntoViewIfNeeded();await page.locator('[data-lab-controls]').waitFor({state:'visible',timeout:45000});
 check(await page.locator('[data-lab-target]').count()===6,'The research lab offers six distinct forms.');
 await page.locator('[data-lab-structure]').fill('100');
 const samples=[];
 for(const form of ['Systems','Mobility','Health','Materials','Events','Research']){
  await page.locator('[data-lab-target="'+form+'"]').click();
  check(await page.locator('[data-lab-panel="'+form+'"]').isVisible(),form+' has a relevant observation.');
  const d=page.waitForEvent('download');await page.locator('[data-lab-save]').click();
  const buffer=fs.readFileSync(await (await d).path());const stats=await sharp(buffer).stats();
  check(stats.channels.some(c=>c.stdev>10),form+' exports a nonblank actual rendering.');samples.push(buffer.toString('base64'));
 }
 check(new Set(samples).size===6,'All six selections produce distinct rendered exports.');
 await page.locator('[data-lab-angle]').fill('40');
 await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
 await page.locator('[data-lab-share]').click();const studyLink=await page.evaluate(()=>navigator.clipboard.readText());
 check(new URL(studyLink).searchParams.get('study')==='Research'&&new URL(studyLink).searchParams.get('angle')==='40','A study link carries the selected arrangement and perspective.');
 await page.goto(studyLink,{waitUntil:'networkidle'});await page.locator('[data-matter-lab]').scrollIntoViewIfNeeded();await page.locator('[data-lab-controls]').waitFor({state:'visible'});
 check(await page.locator('[data-lab-target="Research"]').getAttribute('aria-selected')==='true'&&await page.locator('[data-lab-structure]').inputValue()==='100'&&await page.locator('[data-lab-angle]').inputValue()==='40','A shared study restores the actual controls and selected form.');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-lab-target="Mobility"]').click();await page.waitForTimeout(100);
 const interruption=await page.locator('[data-matter-lab]').evaluate(root=>{const before=root.dataset.weights.split(',').map(Number);root.querySelector('[data-lab-target="Health"]').click();const immediate=root.dataset.weights.split(',').map(Number);return new Promise(resolve=>requestAnimationFrame(()=>resolve({before,immediate,after:root.dataset.weights.split(',').map(Number)})));});
 check(interruption.before.every((v,i)=>v===interruption.immediate[i]),'Selecting a new research target preserves the current displayed weights exactly.');
 check(interruption.before.every((v,i)=>Math.abs(v-interruption.after[i])<.2),'An interrupted research morph starts from its displayed mixture.');
 await page.waitForFunction(()=>Number(document.querySelector('[data-matter-lab]').dataset.weights.split(',')[3])>.9998,null,{timeout:30000});
 await page.waitForTimeout(500);const frames=await page.locator('[data-matter-lab]').getAttribute('data-frames');await page.waitForTimeout(500);
 check(await page.locator('[data-matter-lab]').getAttribute('data-frames')===frames,'The settled research renderer stops drawing.');
 await page.locator('[data-lab-structure]').fill('60');
 await page.waitForFunction(()=>{const w=document.querySelector('[data-matter-lab]').dataset.weights.split(',').map(Number);return Math.abs(w[0]-.31744)<.0002&&Math.abs(w[3]-.68256)<.0002;},null,{timeout:30000});
 check(await page.locator('[data-matter-lab]').evaluate(e=>e.dataset.weights.split(',').map(Number).every(Number.isFinite)),'Animated structure changes reach a finite mixed arrangement.');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('[data-lab-reset]').click();
 check(await page.locator('[data-lab-structure]').inputValue()==='35'&&await page.locator('[data-lab-angle]').inputValue()==='0','Reset restores the initial study controls.');
 await capture('[data-matter-lab]','research-desktop');
 console.log('Research forms, exports, shared state and continuous motion passed.');

 for(const width of [390,320]){
  await page.setViewportSize({width,height:width===390?844:568});
  for(const [route,selector,name] of [['/','[data-connections-explorer]','connections'],['/projects/nrth-tms','[data-venture-stories]','venture'],['/partnerships','[data-partnership-brief]','brief'],['/research','[data-matter-lab]','research']]){
   await visit(route);await capture(selector,name+'-'+width);await fits(name+' at '+width+'px');
  }
 }
 const plain=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});const staticPage=await plain.newPage();
 await staticPage.goto(base+'/');check(await staticPage.locator('[data-connection-static]:visible').count()>0,'Relationship content is available without JavaScript.');
 await staticPage.goto(base+'/projects/nrth-health');check(await staticPage.locator('[data-venture-stories] .vs-questions details').count()===3,'Venture questions remain available without JavaScript.');
 check(await staticPage.locator('[data-scenario-panel]:visible').count()===3,'All scenario contexts are readable without JavaScript.');
 await staticPage.goto(base+'/partnerships');check(await staticPage.locator('noscript').last().isVisible(),'Partnership instructions remain available without JavaScript.');
 await plain.close();
 check(errors.length===0,'No uncaught browser errors.');
 fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:true,errors},null,2));console.log(checks+' enrichment checks passed.');
 await browser.close();
})().catch(async error=>{console.error(error);fs.writeFileSync(out+'/results.json',JSON.stringify({checks,passed:false,error:String(error),errors},null,2));await browser?.close();process.exitCode=1;});
