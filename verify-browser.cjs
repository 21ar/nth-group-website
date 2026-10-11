const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const {chromium} = require('playwright');

const base = (process.env.NRTH_TEST_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const output = 'artifacts/matterfield/browser';
const ventures = ['health', 'tms', 'telematics', 'logistics', 'systems', 'labs', 'chemicals', 'fleet', 'events'];
const fields = ['Mobility', 'Health', 'Systems', 'Materials', 'Events', 'Research'];
const errors = [];
let checks = 0, browser;
function check(value, message) {assert.ok(value, message); checks++;}
fs.mkdirSync(output, {recursive:true});

(async () => {
  browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless:true, args:['--no-sandbox', '--enable-unsafe-swiftshader']});
  const context = await browser.newContext({viewport:{width:1440, height:1000}, acceptDownloads:true});
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  const page = await context.newPage();
  const visit = async route => {
    const response = await page.goto(base + route, {waitUntil:'networkidle'});
    check(response.status() === 200, route + ' serves a public page.');
  };
  const screenshot = async name => page.screenshot({path:path.join(output, name + '.png')});
  const ready = () => page.waitForFunction(() => document.querySelector('[data-matter-story]')?.dataset.mode === 'webgl', null, {timeout:45000});
  const state = () => page.locator('[data-matter-story]').evaluate(e => ({progress:Number(e.dataset.matterProgress), frames:Number(e.dataset.frames), sample:JSON.parse(e.dataset.matterSample || '[]')}));
  const progress = async value => {
    await page.evaluate(value => {const e = document.querySelector('[data-matter-story]'); scrollTo({top:value * (e.offsetHeight - innerHeight), behavior:'instant'});}, value);
    await page.waitForFunction(value => Math.abs(Number(document.querySelector('[data-matter-story]').dataset.matterProgress) - value) < .002, value, {timeout:25000});
  };
  const settle = async () => {
    for (let attempt = 0; attempt < 40; attempt++) {
      const before = (await state()).frames; await page.waitForTimeout(400);
      if ((await state()).frames === before) return;
    }
    throw new Error('The scene did not settle.');
  };
  const overflow = async route => check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route + ' has no horizontal document overflow.');
  const invitationFits = async route => {
    check(await page.locator('.contact-invitation-title').evaluateAll(elements => elements.every(e => {const range = document.createRange(); range.selectNodeContents(e); return [...range.getClientRects()].every(rect => rect.left >= 8 && rect.right <= innerWidth - 8);})), route + ' contact headline is readable without clipping.');
  };

  await visit('/'); await ready(); await settle(); await page.waitForTimeout(900); await screenshot('opening');
  check(await page.locator('[data-matter-world] canvas').count() === 1, 'One shared canvas carries the story.');
  check(await page.locator('.brand').first().locator('path').count() === 4, 'The supplied NRTH identity retains all four contours.');
  const opening = await state(); await progress(.28); const intermediate = await state(); await screenshot('connection');
  check(intermediate.sample.some((value, i) => Math.abs(value - opening.sample[i]) > .1), 'Scrolling actually changes geometry.');
  await progress(.46); await screenshot('intermediate');
  await progress(.6); await settle(); await screenshot('mobility');
  const poses = [];
  for (const field of fields) {
    await page.locator('[data-matter-field="' + field + '"]').click(); await settle();
    check(await page.locator('[data-field-panel="' + field + '"]').isVisible(), field + ' has a readable selected panel.');
    check(await page.locator('[data-field-panel]:visible').count() === 1, 'Hidden industry copy is removed from the active interface.');
    poses.push((await state()).sample);
    await screenshot('field-' + field.toLowerCase());
  }
  check(new Set(poses.map(pose => JSON.stringify(pose))).size === 6, 'All six industry selections reach distinct geometry.');
  await page.locator('[data-matter-field="Mobility"]').click(); await page.waitForTimeout(350);
  const interruption = await page.evaluate(() => {
    const root=document.querySelector('[data-matter-story]'), before=JSON.parse(root.dataset.matterSample);
    document.querySelector('[data-matter-field="Systems"]').click();
    return new Promise(resolve => requestAnimationFrame(() => resolve({before,after:JSON.parse(root.dataset.matterSample)})));
  });
  check(interruption.before.every((value,i) => Math.abs(value-interruption.after[i]) < .25), 'An interrupted selection continues from its displayed pose without teleporting.');
  await settle(); check((await state()).sample.every((value,i) => Math.abs(value-poses[2][i]) < .01), 'An interrupted selection reaches the newly requested form.');
  await page.locator('[data-matter-field="Mobility"]').click(); await settle();
  await page.locator('[data-matter-field="Mobility"]').focus(); await page.keyboard.press('ArrowRight');
  check(await page.locator('[data-matter-field="Health"]').getAttribute('aria-selected') === 'true', 'Industry selection supports arrow keys.');
  await page.keyboard.press('End'); check(await page.locator('[data-matter-field="Research"]').evaluate(e => e === document.activeElement), 'End moves focus with the active tab.');
  await settle();
  await progress(0); await settle();
  const reverse = await state(); check(reverse.sample.every((value, i) => Math.abs(value - opening.sample[i]) < .01), 'Reverse scrolling restores the opening geometry.');
  const beforePointer = reverse.frames; await page.mouse.move(1150, 390); await settle();
  check((await state()).frames > beforePointer, 'Pointer interaction draws a response.');
  const idle = (await state()).frames; await page.waitForTimeout(700); check((await state()).frames === idle, 'Idle rendering stops.');
  await progress(.96); await screenshot('light-exit');
  await page.locator('.portfolio-section').scrollIntoViewIfNeeded(); await page.waitForTimeout(1200); await screenshot('portfolio');
  const offscreen = (await state()).frames; await page.waitForTimeout(700); check((await state()).frames === offscreen, 'Offscreen rendering stops.');
  await page.locator('.manifesto-section').scrollIntoViewIfNeeded(); await page.waitForTimeout(1500); await screenshot('manifesto');
  await page.locator('.contact-invitation').scrollIntoViewIfNeeded(); await page.waitForTimeout(1200); await screenshot('invitation');
  await invitationFits('/'); await overflow('/');

  await page.locator('[data-site-menu] summary').click();
  await page.waitForFunction(() => document.querySelector('main').inert);
  check(await page.locator('.menu-ventures a').count() === 9, 'All nine ventures are one menu choice away.');
  check(await page.locator('.menu-company a[href="/investors"]').isVisible(), 'Investors is reachable from the menu.');
  for (const venture of ventures) check(await page.locator('.menu-ventures a[href="/projects/nrth-' + venture + '"]').count() === 1, 'The menu routes to NRTH ' + venture + '.');
  await screenshot('menu');
  await page.locator('.menu-ventures a').last().focus(); await page.keyboard.press('Tab');
  check(await page.locator('[data-site-menu] summary').evaluate(e => e === document.activeElement), 'Menu focus wraps to its close control.');
  await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('main').inert);
  check(await page.locator('[data-site-menu] summary').evaluate(e => e === document.activeElement), 'Escape restores focus to Menu.');

  console.log('Scroll, geometry, idle rendering and menu checks passed.');
  await page.emulateMedia({reducedMotion:'reduce'});
  await visit('/projects'); await page.locator('[data-index-filter="Mobility"]').click();
  check(await page.locator('[data-index-row]:visible').count() === 4, 'Mobility filters to four relevant ventures.');
  await page.locator('[data-index-filter="All"]').click(); await page.locator('[data-index-search]').fill('Health');
  check(await page.locator('[data-index-row]:visible').count() === 1, 'Search narrows to the intended venture.');
  await page.locator('[data-index-row]:visible').focus();
  check((await page.locator('[data-index-caption]').textContent()).includes('Health'), 'Keyboard focus updates the portfolio artwork context.');
  await page.locator('[data-index-search]').fill('no venture matches this phrase'); check(await page.locator('[data-index-empty]').isVisible(), 'Search explains an empty result.');
  await page.locator('[data-index-search]').fill(''); check(await page.locator('[data-index-row]:visible').count() === 9, 'Clearing search restores the complete portfolio.');
  await screenshot('directory');

  for (const venture of ventures) {
    const route = '/projects/nrth-' + venture; await visit(route); await overflow(route); await invitationFits(route);
    check(await page.locator('h1').count() === 1, route + ' has one primary heading.');
    check(await page.locator('[data-focus-choice]').count() === 3, route + ' has three areas of focus.');
    await page.locator('[data-focus-choice]').first().focus(); await page.keyboard.press('ArrowDown');
    check(await page.locator('[data-focus-panel]:visible').count() === 1 && await page.locator('[data-focus-choice]').nth(1).getAttribute('aria-selected') === 'true', route + ' focus selection works by keyboard.');
    check((await page.locator('[data-focus-panel]:visible a').getAttribute('href')).includes('project=nrth-' + venture), route + ' inquiry preserves the venture context.');
  }

  const supporting = ['/about', '/investors', '/research', '/approach', '/partnerships', '/press', '/insights', '/contact', '/industries/mobility', '/privacy', '/terms'];
  for (const route of supporting) {
    await visit(route); await overflow(route); await invitationFits(route);
    check(await page.locator('h1').count() === 1, route + ' has a single primary heading.');
    check(await page.locator('link[rel="canonical"]').getAttribute('href') === 'https://nrth.group' + route, route + ' has a production canonical.');
    check((await page.locator('meta[name="description"]').getAttribute('content')).length > 40, route + ' has useful search metadata.');
    check(await page.locator('script[type="application/ld+json"]').count() > 0, route + ' includes structured data.');
    if (['/about', '/investors', '/contact'].includes(route)) await screenshot(route.slice(1));
  }
  const sitemap = await (await context.request.get(base + '/sitemap-0.xml')).text();
  check(ventures.every(venture => sitemap.includes('/projects/nrth-' + venture)) && sitemap.includes('/investors') && !sitemap.includes('/preview'), 'The sitemap exposes the complete public portfolio and excludes private previews.');
  const icon = await context.request.get(base + '/favicon.svg'); check(icon.ok() && (await icon.text()).includes('<path'), 'The tab icon serves actual logo artwork.');
  const pdf = await context.request.get(base + '/resources/nrth-company-overview.pdf'); check(pdf.ok() && (await pdf.body()).subarray(0,4).toString() === '%PDF', 'The company overview is a working PDF.');
  const preview = await context.request.get(base + '/preview'); check((await preview.text()).includes('noindex'), 'The editorial preview remains excluded from search.');

  await visit('/contact?project=investor&topic=The%20next%20step');
  check(await page.locator('[name="project"]').inputValue() === 'investor', 'The investor inquiry is preselected.');
  check((await page.locator('[name="message"]').inputValue()).includes('the next step'), 'The chosen question is carried into the inquiry.');
  await page.locator('[name="name"]').fill('Browser reviewer'); await page.locator('[name="email"]').fill('reviewer@example.com');
  await page.locator('[name="message"]').fill('A browser test introduction. No real message should be sent.');
  await page.locator('.form-submit').click();
  check(await page.locator('[data-inquiry-result]').isVisible(), 'A message is reviewed before sending.');
  check((await page.locator('[data-inquiry-email]').getAttribute('href')).startsWith('mailto:investors@nrth.group?'), 'The email alternative uses the investor inbox.');
  const inquiryDownload = page.waitForEvent('download'); await page.locator('[data-inquiry-download]').click();
  const inquiryFile = await (await inquiryDownload).path(); check(fs.readFileSync(inquiryFile, 'utf8').includes('Browser reviewer'), 'A saved inquiry contains the actual draft.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {origin:base});
  await page.locator('[data-inquiry-copy]').click(); check((await page.evaluate(() => navigator.clipboard.readText())).includes('Browser reviewer'), 'Copy preserves the prepared message.');
  await page.route('**/api/inquiries', route => route.fulfill({status:503, contentType:'application/json', body:JSON.stringify({error:'Mock delivery unavailable. Use the email alternative.'})}));
  await page.locator('[data-inquiry-send]').click(); await page.locator('[data-inquiry-error]').waitFor({state:'visible'});
  check((await page.locator('[name="message"]').inputValue()).includes('No real message'), 'Delivery failure preserves the inquiry.');
  check((await page.locator('[data-inquiry-send]').textContent()).includes('Retry'), 'Unconfirmed delivery is not presented as success.');
  await screenshot('contact-review');
  await page.locator('[data-inquiry-edit]').click(); check(await page.locator('[name="message"]').evaluate(e => e === document.activeElement), 'Editing returns focus to the message.');

  await visit('/research'); await page.locator('[data-matter-lab]').scrollIntoViewIfNeeded();
  await page.locator('[data-lab-controls]').waitFor({state:'visible', timeout:45000});
  await page.locator('[data-lab-structure]').fill('80'); await page.locator('[data-lab-angle]').fill('40');
  check(await page.locator('[data-lab-structure-value]').textContent() === '80%' && await page.locator('[data-lab-angle-value]').textContent() === '40°', 'The visual study responds to both controls.');
  await screenshot('research-study');
  const studyDownload = page.waitForEvent('download'); await page.locator('[data-lab-save]').click(); const study = await studyDownload;
  check(study.suggestedFilename() === 'nrth-structure-study.png', 'The study saves a shareable image.');
  const savedImage = fs.readFileSync(await study.path()); const metadata = await sharp(savedImage).metadata(); const stats = await sharp(savedImage).stats();
  check(metadata.width > 250 && metadata.height > 250 && stats.channels.some(channel => channel.stdev > 10), 'The saved study contains the rendered arrangement, not a blank canvas.');

  console.log('Portfolio, supporting pages, inquiry and research study checks passed.');
  await page.emulateMedia({reducedMotion:'no-preference'});
  for (const viewport of [{width:390,height:844},{width:360,height:640},{width:320,height:568},{width:1440,height:700}]) {
    await page.setViewportSize(viewport); await visit('/'); await ready(); await settle(); await page.waitForTimeout(900);
    await screenshot('opening-' + viewport.width); await overflow('opening-' + viewport.width);
    await progress(.6); await settle(); await screenshot('fields-' + viewport.width);
    check(await page.locator('[data-matter-field]:visible').count() === 6, 'All field controls fit ' + viewport.width + 'px.');
    const fits = await page.locator('[data-field-panel]:visible, .matter-select').evaluateAll(elements => elements.map(e => {const r=e.getBoundingClientRect(); return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};}));
    check(fits.every(r => r.top >= 75 && r.bottom <= viewport.height && r.left >= 0 && r.right <= viewport.width + 1), 'Industry copy and controls stay inside ' + viewport.width + 'px viewport.');
    check(fits[0].bottom + 12 <= fits[1].top, 'Industry copy clears its controls at ' + viewport.width + 'px.');
    for (const field of fields.slice(1)) {
      await page.locator('[data-matter-field="' + field + '"]').click(); await settle();
      check(await page.locator('[data-field-panel="' + field + '"]').isVisible(), field + ' selection works at ' + viewport.width + 'px.');
      const panel = await page.locator('[data-field-panel="' + field + '"]').boundingBox(); const controls = await page.locator('.matter-select').boundingBox();
      check(panel.y + panel.height + 12 <= controls.y, field + ' clears the navigation at ' + viewport.width + 'px.');
    }
    if (viewport.width < 768) {
      await page.emulateMedia({reducedMotion:'reduce'});
      for (const route of ['/projects','/about','/investors','/projects/nrth-telematics','/contact']) {await visit(route); await overflow(route); await invitationFits(route); if(viewport.width===390)await screenshot(route.slice(1).replaceAll('/','-')+'-mobile');}
      await page.emulateMedia({reducedMotion:'no-preference'});
    }
  }

  await page.setViewportSize({width:390,height:844}); await page.emulateMedia({reducedMotion:'reduce'}); await visit('/');
  check(await page.locator('[data-matter-world] canvas').count() === 0 && await page.locator('.matter-static-fields').isVisible(), 'Reduced motion retains all industry content without initializing the story renderer.');
  await screenshot('reduced-motion');
  await page.emulateMedia({reducedMotion:'no-preference'}); await visit('/'); await ready();
  await page.locator('[data-site-menu] summary').click(); await page.locator('.menu-panel [data-motion-toggle]').click();
  check(await page.locator('[data-matter-story]').evaluate(e => !e.classList.contains('matter-ready')), 'Pause motion switches to a natural reading layout.');
  await page.locator('.menu-panel [data-motion-toggle]').click(); check(await page.locator('[data-matter-story]').evaluate(e => e.classList.contains('matter-ready')), 'Motion can be enabled again.');
  await page.keyboard.press('Escape');
  await page.evaluate(() => document.querySelector('[data-matter-world] canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForFunction(() => document.querySelector('[data-matter-story]').dataset.mode === 'static');
  check(await page.locator('.matter-static-fields a').count() === 9, 'Losing an active graphics context restores the complete readable journey.');
  await page.setViewportSize({width:844,height:390}); await visit('/');
  check(await page.locator('[data-matter-world] canvas').count() === 0 && await page.locator('.matter-static-fields').isVisible(), 'Short landscape windows get the readable static journey.');

  const failureContext = await browser.newContext({viewport:{width:390,height:844}});
  await failureContext.addInitScript(() => {const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args);};});
  const failurePage = await failureContext.newPage(); await failurePage.goto(base, {waitUntil:'networkidle'});
  await failurePage.waitForFunction(() => document.querySelector('[data-matter-story]').dataset.mode === 'static', null, {timeout:30000});
  check(await failurePage.locator('.matter-static-fields a').count() === 9, 'Graphics failure retains every venture link.');
  await failurePage.screenshot({path:path.join(output,'graphics-fallback.png')}); await failureContext.close();
  const touchContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const touchPage=await touchContext.newPage();touchPage.on('pageerror',error=>errors.push(error.message));
  await touchPage.goto(base,{waitUntil:'networkidle'});
  await touchPage.waitForFunction(()=>document.querySelector('[data-matter-story]')?.dataset.mode==='webgl',null,{timeout:45000});
  await touchPage.evaluate(()=>{const e=document.querySelector('[data-matter-story]');scrollTo({top:.6*(e.offsetHeight-innerHeight),behavior:'instant'});});
  await touchPage.waitForFunction(()=>Number(document.querySelector('[data-matter-story]').dataset.matterProgress)>.598,null,{timeout:25000});
  const touchBefore=await touchPage.locator('[data-matter-story]').getAttribute('data-matter-sample');
  await touchPage.locator('[data-matter-field="Systems"]').tap();await touchPage.waitForTimeout(2500);
  check(await touchPage.locator('[data-matter-field="Systems"]').getAttribute('aria-selected')==='true','Touch selects an industry without hover.');
  check(await touchPage.locator('[data-matter-story]').getAttribute('data-matter-sample')!==touchBefore,'Touch selection reshapes the live geometry.');
  await touchContext.close();
  const noJS = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const noJSPage = await noJS.newPage();
  await noJSPage.goto(base, {waitUntil:'networkidle'}); check(await noJSPage.locator('.matter-static-fields a').count() === 9, 'No JavaScript retains the complete industry introduction.');
  await noJSPage.locator('[data-site-menu] summary').click(); check(await noJSPage.locator('.menu-ventures a').first().isVisible(), 'The native menu works without JavaScript.');
  await noJSPage.goto(base + '/projects',{waitUntil:'networkidle'});check(await noJSPage.locator('[data-index-row]:visible').count() === 9 && await noJSPage.locator('[data-index-search]:visible').count() === 0, 'No JavaScript shows the directory without inactive filtering controls.');
  await noJSPage.goto(base + '/contact',{waitUntil:'networkidle'});check(await noJSPage.locator('.contact-addresses a[href="mailto:hello@nrth.group"]').isVisible(), 'No JavaScript retains a direct contact path.');
  await noJS.close(); check(errors.length === 0, 'No uncaught browser errors: ' + errors.join('; '));
  await browser.close();
  const report={checks,passed:true,base,graphics:'Chromium software WebGL; no driver masking. Hardware performance not benchmarked.',email:'Mocked failure only. No real inquiry sent.'};
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');console.log(checks+' browser checks passed. Captures: '+output);
})().catch(async error=>{console.error(error);await browser?.close();process.exit(1);});
