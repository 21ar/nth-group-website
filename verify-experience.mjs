import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import graphics from './scripts/browser-graphics.cjs';
const base=process.env.NRTH_TEST_URL || 'http://127.0.0.1:4173', output='artifacts/implementation';
await mkdir(output,{recursive:true});let checks=[];const check=(value,label)=>{assert.ok(value,label);checks.push(label);};
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}}), errors=[];
 await page.addInitScript(graphics.exerciseWebGL);
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('[data-hero-scene]').dataset.renderer==='webgl');
 check(await page.locator('.site-header .brand svg path').count()===4,'Header uses all four canonical letter paths.');
 check(await page.locator('.fold-intro .text-link').count()===0,'The opening has no redundant Explore button.');
 for(const progress of [0,.05,.17,.34,.4444,.61,.78,.995,.61,.17,0]) {
  await page.evaluate(value=>scrollTo({top:(document.querySelector('[data-story]').offsetHeight-innerHeight)*value,behavior:'instant'}),progress);
  await page.waitForFunction(value=>Math.abs(Number(document.querySelector('[data-story]').dataset.progress)-value)<.003,progress);await page.waitForTimeout(650);
  check(await page.locator('[data-hero-scene] canvas').count()===1,'One surface renderer persists at scroll '+progress+'.');
  check(await page.locator('.site-header').evaluate(element=>element.getBoundingClientRect().top===0),'Navigation persists at scroll '+progress+'.');
 }
 await page.screenshot({path:output+'/accepted-desktop-opening.png'});
 await page.locator('[data-demo="dispatch"]').scrollIntoViewIfNeeded();await page.waitForTimeout(800);
 await page.locator('[data-demo-destination]').selectOption('Vancouver, BC');await page.locator('[data-dispatch-next="1"]').click();
 check((await page.locator('[data-dispatch-error]').innerText()).includes('different destination'),'TMS rejects an identical origin and destination.');
 await page.locator('[data-demo-destination]').selectOption('Calgary, AB');await page.locator('[data-dispatch-next="1"]').click();
 await page.locator('[data-demo-vehicle][value="NR-03"]').check();await page.locator('[data-dispatch-next="2"]').click();
 check((await page.locator('[data-vehicle-error]').innerText()).includes('16 pallets'),'TMS checks vehicle capacity.');
 await page.locator('[data-demo-vehicle][value="NR-02"]').check();await page.locator('[data-dispatch-next="2"]').click();await page.locator('[data-dispatch-create]').click();
 check(await page.locator('[data-plan-complete]').isVisible(),'A valid sample plan completes.');
 let download=page.waitForEvent('download');await page.locator('[data-plan-download]').click();check((await download).suggestedFilename()==='nrth-tms-sample-plan.json','The sample plan can be downloaded.');
 await page.screenshot({path:output+'/accepted-tms-demo.png'});
 for(const slug of ['health','tms','telematics','logistics','systems','labs','chemicals','fleet','events']) {
  const response=await page.goto(base+'/projects/nrth-'+slug,{waitUntil:'networkidle'});
  check(response.ok(),'Venture '+slug+' renders.');check(await page.locator('.venture-demo').count()===1,'Venture '+slug+' has its own concept.');
  check((await page.locator('.concept-label').innerText()).includes('Sample data'),'Venture '+slug+' identifies sample data.');
  await page.locator('.venture-demo').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
  if(['health','logistics'].includes(slug)){await page.locator('[data-sequence-step="1"]').focus();await page.keyboard.press('ArrowRight');check(await page.locator('[data-sequence-step="2"]').getAttribute('aria-selected')==='true',slug+' workflow supports keyboard selection.');}
  if(slug==='telematics'){await page.locator('[data-telemetry-time-input]').fill('3');check(await page.locator('[data-demo]').getAttribute('data-signal')==='review','Telematics identifies stale sample data.');}
  if(slug==='fleet'){await page.locator('[data-fleet-filter="Review"]').click();check(await page.locator('[data-fleet-record]:visible').count()===1,'Fleet filters records needing review.');check((await page.locator('[data-fleet-detail]').innerText()).includes('maintenance'),'Fleet selection explains the next action.');}
  if(slug==='systems'){await page.locator('[data-workflow-run]').click();await page.waitForFunction(()=>!document.querySelector('[data-workflow-output]').hidden);check(await page.locator('[data-workflow-output] li').count()===2,'Systems executes the selected rule.');await page.locator('[data-workflow-rule]').selectOption('all');await page.locator('[data-workflow-run]').click();await page.waitForFunction(()=>!document.querySelector('[data-workflow-output]').hidden);check(await page.locator('[data-workflow-output] li').count()===3,'Systems changes its result for a different rule.');}
  if(slug==='chemicals'){await page.locator('[data-material-choice="1"]').click();check((await page.locator('[data-material-title]').innerText()).includes('Water'),'Materials changes the application brief.');download=page.waitForEvent('download');await page.locator('[data-material-brief]').click();check((await download).suggestedFilename().includes('brief'),'Materials provides a local conversation brief.');}
  if(slug==='events'){await page.locator('[data-agenda-duration]').selectOption('120');const durations=await page.locator('.agenda-block').evaluateAll(elements=>elements.map(element=>parseInt(element.lastElementChild.textContent,10)));check(durations.reduce((sum,value)=>sum+value,0)===120,'Events allocates the selected duration exactly.');}
  if(slug==='labs'){await page.locator('[data-lab-connection]').fill('90');check(await page.locator('[data-lab-connection-value]').innerText()==='90%','Labs responds to the connection control.');}
  await page.screenshot({path:output+'/venture-'+slug+'.png'});
 }
 for(const route of ['/industries/mobility','/partnerships','/press','/research','/investors','/about','/insights']) {
  check((await page.goto(base+route,{waitUntil:'networkidle'})).ok(),route+' is available.');await page.screenshot({path:output+'/route-'+route.slice(1).replaceAll('/','-')+'.png'});
 }
 check((await page.request.get(base+'/resources/nrth-company-overview.pdf')).headers()['content-type']?.includes('pdf'),'Company overview is a downloadable PDF.');
 check((await page.request.get(base+'/resources/nrth-wordmark.svg')).ok(),'Canonical SVG is downloadable.');
 await page.goto(base+'/contact?project=investor',{waitUntil:'networkidle'});await page.locator('#name').fill('Local reviewer');await page.locator('#email').fill('local@example.com');await page.locator('#message').fill('A local test of the investor inquiry flow.');await page.getByRole('button',{name:'Prepare inquiry'}).click();
 check((await page.locator('[data-inquiry-email]').getAttribute('href')).startsWith('mailto:investors@nrth.group'),'Investor fallback uses the correct inbox.');
 const readiness=await (await page.request.get(base+'/api/inquiries')).json();
 if(readiness.delivery)await page.route('**/api/inquiries',route=>route.request().method()==='POST'?route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Website delivery is currently unavailable.'})}):route.continue());
 await page.locator('[data-inquiry-send]').click();
 await page.locator('[data-inquiry-error]').waitFor({state:'visible'});check((await page.locator('[data-inquiry-error]').innerText()).includes('unavailable'),'Missing delivery configuration gives an accurate error.');
 check(await page.locator('#message').inputValue()==='A local test of the investor inquiry flow.','A failed send preserves the inquiry.');
 await page.screenshot({path:output+'/contact-unconfigured.png'});
 const preview=await page.request.get(base+'/preview/venture/nrth-health',{maxRedirects:0});check(preview.status()===302,'Unauthenticated draft preview is protected.');check((await page.request.get(base+'/api/preview/state')).status()===401,'Draft API requires an editor session.');
 for(const route of ['/','/projects','/projects/nrth-tms','/research','/press','/investors','/contact']) {
  await page.setViewportSize({width:390,height:844});await page.goto(base+route,{waitUntil:'networkidle'});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile '+route+' has no horizontal overflow.');await page.screenshot({path:output+'/mobile-'+(route.slice(1).replaceAll('/','-')||'home')+'.png'});
 }
 await page.goto(base,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Inside NRTH',exact:true}).click();check(await page.locator('main').evaluate(element=>element.inert),'Open mobile menu isolates page controls.');await page.keyboard.press('Escape');check(await page.getByRole('button',{name:'Inside NRTH',exact:true}).evaluate(element=>element===document.activeElement),'Menu closure restores focus.');
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto(base,{waitUntil:'networkidle'});check(await reduced.locator('[data-hero-scene] canvas').count()===0,'Reduced motion uses the static canonical identity.');check(await reduced.locator('[data-story]').evaluate(element=>getComputedStyle(element.querySelector('.fold-viewport')).position==='relative'),'Reduced motion removes the long scroll track.');
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(base+'/projects');check(await nojs.locator('.project-row').count()===9,'All nine ventures are available without JavaScript.');
 const fallback=await browser.newPage();await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.includes('webgl'))return null;return original.call(this,type,...args);};});await fallback.goto(base,{waitUntil:'networkidle'});await fallback.waitForFunction(()=>document.querySelector('[data-hero-scene]').dataset.renderer==='surface');check(await fallback.locator('[data-hero-scene] canvas').count()===1,'A WebGL failure falls back to one continuous Canvas renderer.');
 check(errors.length===0,'The reviewed journeys have no runtime exceptions.');await writeFile(output+'/experience-results.json',JSON.stringify({checks,errors},null,2));console.log(checks.length+' experience checks passed.');
} finally {await browser.close();}
