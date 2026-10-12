const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const base=process.env.NRTH_TEST_URL||'http://127.0.0.1:4173';
const output=process.env.NRTH_STUDY_REPORT||'artifacts/studies';
let assertions=0;
function assert(value,message){assertions++;if(!value)throw new Error(message);}
const records=['one-population-six-readings','the-question-that-travels','conditions-change-the-question','room-between-the-moments'];
const fields=['mobility','health','systems','materials','events','research'];
(async()=>{
 await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-webgl','--disable-gpu']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',error=>errors.push(String(error)));
 async function go(route){const response=await page.goto(base+route,{waitUntil:'networkidle'});assert(response?.status()===200,route+' loads');}
 async function noOverflow(label){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' has no horizontal overflow');}
 try{
  await go('/work');
  assert(await page.locator('[data-work-entry]').count()===4,'Four published design study cards');
  assert(await page.locator('[data-work-filter]').isVisible(),'Native filter enhanced');
  for(const kind of ['form','handoff','conditions','rhythm']){
   const button=page.locator('[data-work-kind="'+kind+'"]');await button.click();
   assert(await page.locator('[data-work-entry]:visible').count()===1,kind+' filters one actual study');
   assert(await button.getAttribute('aria-pressed')==='true',kind+' active filter announced');
   assert((await page.locator('[data-work-status]').textContent()).includes('1 study'),kind+' filter count available');
  }
  await page.locator('[data-work-kind="all"]').focus();await page.keyboard.press('Enter');
  assert(await page.locator('[data-work-entry]:visible').count()===4,'Keyboard restores every record');
  await noOverflow('Desktop library');await page.screenshot({path:path.join(output,'work-desktop.png'),fullPage:true});
  for(const slug of records){
   await go('/work/'+slug);
   assert(await page.locator('h1').count()===1,slug+' one main title');
   assert(await page.locator('.study-method-grid article').count()===4,slug+' documented method');
   assert(await page.locator('.study-record>div').count()===2,slug+' support and limits remain distinct');
   assert(await page.locator('.study-record li').count()===6,slug+' explicit support and scope');
   assert(await page.locator('.study-review-list li').count()===3,slug+' practical review');
   const download=await page.request.get(base+'/resources/studies/'+slug+'-worksheet.txt');
   assert(download.status()===200,slug+' worksheet exists');
   assert((await download.text()).includes('YOUR CONTEXT'),slug+' editable worksheet contains preparation');
   const structured=await page.request.get(base+'/resources/studies/'+slug+'-record.json');
   assert(structured.status()===200,slug+' record exists');const record=await structured.json();
   assert(record.recordType==='illustrative-website-design-study',slug+' machine record identifies scope');
   assert(record.canonical==='https://nrth.group/work/'+slug,slug+' structured canonical');
   assert(record.limits.length===3&&record.supports.length===3,slug+' structured boundaries');
   const exhibit=page.locator('[data-evidence-exhibit]').first();
   const original=await exhibit.locator('.evidence-case-0 .evidence-exhibit-observation p').textContent();
   const second=exhibit.locator('[data-exhibit-case][value="1"]');await second.focus();await page.keyboard.press('Space');
   assert(await second.isChecked(),slug+' example changes by keyboard');
   assert(await exhibit.locator('.evidence-case-1').isVisible(),slug+' alternate model visible');
   assert(!(await exhibit.locator('.evidence-case-0').isVisible()),slug+' only selected model exposed');
   assert(original!==await exhibit.locator('.evidence-case-1 .evidence-exhibit-observation p').textContent(),slug+' example changes observation');
   await exhibit.locator('.evidence-case-1 .evidence-exhibit-review summary').click();
   assert(await exhibit.locator('.evidence-case-1 .evidence-exhibit-review').getAttribute('open')!==null,slug+' tradeoff disclosure opens');
   await noOverflow('Desktop '+slug);
  }
  for(const field of fields){
   await go('/industries/'+field);
   const exhibits=page.locator('.industry-exhibit-list [data-evidence-exhibit]');
   assert(await exhibits.count()===3,field+' has three concrete exhibits');
   for(let i=0;i<3;i++){
    const exhibit=exhibits.nth(i);
    assert(await exhibit.locator('.evidence-values>div').count()===8,field+' exhibit '+i+' has four conditions in each state');
    assert(await exhibit.locator('[data-exhibit-case]').count()===2,field+' exhibit '+i+' has two alternatives');
    assert(await exhibit.locator('.evidence-exhibit-scope').count()===1,field+' exhibit '+i+' has explicit synthetic scope');
    const label=exhibit.locator('.evidence-exhibit-controls label').nth(1);await label.click();
    assert(await exhibit.locator('.evidence-case-1').isVisible(),field+' exhibit '+i+' switch changes view');
    assert(await exhibit.locator('.evidence-case-1 .evidence-values strong').count()===4,field+' exhibit '+i+' visible evidence values');
   }
   const worksheet=await page.request.get(base+'/resources/studies/'+field+'-context-worksheet.txt');
   assert(worksheet.status()===200,field+' preparation worksheet exists');
   assert((await worksheet.text()).includes('WHAT REMAINS UNCONFIRMED'),field+' worksheet keeps unknowns explicit');
   await noOverflow('Desktop '+field);
  }
  await page.setViewportSize({width:320,height:800});
  for(const route of ['/work','/work/the-question-that-travels','/industries/materials','/industries/events','/research']){await go(route);await noOverflow('320px '+route);}
  await go('/work/the-question-that-travels');
  const exhibit=page.locator('[data-evidence-exhibit]').first();await exhibit.locator('.evidence-exhibit-controls label').nth(1).click();
  await page.locator('[data-prepare-inquiry]').click();await page.waitForURL('**/contact?project=nrth-health');
  const message=page.locator('textarea[name="message"]');
  assert((await message.inputValue()).includes('The question that travels.'),'Study context reaches editable inquiry');
  assert((await message.inputValue()).includes('Question first'),'Selected example context reaches editable inquiry');
  await page.goto(base+'/industries/materials',{waitUntil:'networkidle'});await page.screenshot({path:path.join(output,'materials-phone.png'),fullPage:true});
  const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const native=await plain.newPage();
  await native.goto(base+'/work/the-question-that-travels',{waitUntil:'networkidle'});
  const nativeExhibit=native.locator('[data-evidence-exhibit]').first();
  assert(await nativeExhibit.locator('.evidence-case-0').isVisible(),'No JavaScript initial example readable');
  await nativeExhibit.locator('.evidence-exhibit-controls label').nth(1).click();
  assert(await nativeExhibit.locator('.evidence-case-1').isVisible(),'No JavaScript native controls change model');
  await nativeExhibit.locator('.evidence-case-1 .evidence-exhibit-review summary').click();
  assert(await nativeExhibit.locator('.evidence-case-1 .evidence-exhibit-review').getAttribute('open')!==null,'No JavaScript review remains accessible');
  await native.goto(base+'/work',{waitUntil:'networkidle'});
  assert(await native.locator('[data-work-entry]:visible').count()===4,'No JavaScript all records remain available');
  assert(!(await native.locator('[data-work-filter]').isVisible()),'No JavaScript inactive filter not exposed');await plain.close();
  assert(errors.length===0,'No browser errors: '+errors.join('; '));
  await fs.writeFile(path.join(output,'results.json'),JSON.stringify({assertions,passed:true,base,records:records.length,industryExhibits:18,downloads:15,errors},null,2));
  console.log('Passed '+assertions+' documented study, exhibit, download, inquiry and fallback checks.');
 }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
