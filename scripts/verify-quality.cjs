const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const base = (process.env.NRTH_TEST_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const out = path.resolve(__dirname, '../artifacts/quality-review/final');
fs.mkdirSync(out, {recursive: true});
const errors = [], evidence = [];
let browser, checks = 0;
function check(condition, message) {assert.ok(condition, message);checks++;}
const slugs = ['health', 'tms', 'telematics', 'logistics', 'systems', 'labs', 'chemicals', 'fleet', 'events'];
const journal = ['clarity-is-a-design-decision', 'connecting-the-parts-of-movement', 'making-room-for-experimentation'];
const editorial = [['/about', 'company'], ['/approach', 'approach'], ['/partnerships', 'partnership']];

function listen(context) {context.on('page', page => page.on('pageerror', error => errors.push(error.message)));}
async function visit(page, route) {
  const response = await page.goto(base + route, {waitUntil: 'networkidle'});
  check(response?.status() === 200, route + ' is available.');
  await page.evaluate(() => document.fonts.ready);
}
async function capture(page, name, selector) {
  if (selector) await page.locator(selector).first().evaluate(element => scrollTo({top: element.getBoundingClientRect().top + scrollY - 115, behavior: 'instant'}));
  await page.screenshot({path: path.join(out, name + '.png')});
}
async function fit(page, label) {check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label + ' fits horizontally.');}
async function idsAndFragments(page, label) {
  const result = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    const missing = [];
    for (const element of document.querySelectorAll('svg *')) {
      for (const attribute of element.attributes) {
        for (const match of attribute.value.matchAll(/url\(["']?#([^\s\)"']+)["']?\)/g)) if (!document.getElementById(match[1])) missing.push(match[1]);
        if ((attribute.name === 'href' || attribute.name === 'xlink:href') && attribute.value.startsWith('#') && !document.getElementById(attribute.value.slice(1))) missing.push(attribute.value);
      }
    }
    for (const link of document.querySelectorAll('a[href]')) {
      const url = new URL(link.getAttribute('href'), location.href);
      if (url.origin === location.origin && url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '') && url.hash && !document.getElementById(decodeURIComponent(url.hash.slice(1)))) missing.push(url.hash);
    }
    return {count: ids.length, unique: new Set(ids).size, missing};
  });
  check(result.count === result.unique, label + ' has unique SVG and document IDs.');
  check(result.missing.length === 0, label + ' resolves every SVG and same-page fragment reference: ' + result.missing.join(', '));
}
async function examineEditorial(page, route, kind, width) {
  await visit(page, route);
  const root = page.locator('[data-editorial-model="' + kind + '"]');
  await page.waitForFunction(kind => document.querySelector('[data-editorial-model="' + kind + '"]').dataset.editorialReady === 'true', kind);
  const details = root.locator('[data-editorial-lens]');
  check(await details.count() >= 3, kind + ' offers multiple substantive perspectives.');
  for (const index of [await details.count() - 1, 1, 0]) {
    const reading = details.nth(index), summary = reading.locator('summary');
    const key = await reading.getAttribute('data-editorial-lens');
    await summary.scrollIntoViewIfNeeded();
    const before = await summary.evaluate(element => element.getBoundingClientRect().top);
    await summary.focus();await page.keyboard.press('Enter');
    await page.waitForFunction(({kind, key}) => document.querySelector('[data-editorial-model="' + kind + '"] [data-editorial-lens="' + key + '"]').open, {kind, key});
    await page.waitForTimeout(70);
    const after = await summary.evaluate(element => element.getBoundingClientRect().top);
    check(await details.evaluateAll(elements => elements.filter(element => element.open).length) === 1, kind + ' keeps one enhanced perspective open.');
    check(Math.abs(after - before) <= 2, kind + ' preserves the selected summary at ' + width + 'px (movement ' + (after - before).toFixed(2) + 'px).');
    check(await summary.evaluate(element => element === document.activeElement), kind + ' keeps keyboard focus on the selected summary.');
    const layer = root.locator('.editorial-layer--' + key);
    check(await layer.evaluate(element => Number(getComputedStyle(element).opacity)) === 1, kind + ' highlights the matching graphic perspective.');
    check((await reading.locator('dd').first().textContent()).trim().length > 30, kind + ' explains a practical output.');
  }
  await idsAndFragments(page, kind);
}

(async () => {
  browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader']});
  const reduced = await browser.newContext({viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce', acceptDownloads: true});
  listen(reduced);
  const page = await reduced.newPage();

  for (const [route, kind] of editorial) {
    await examineEditorial(page, route, kind, 1440);
    await capture(page, kind + '-desktop', '[data-editorial-model]');
  }
  for (const [route, mode] of [['/research', 'research'], ['/investors', 'investor']]) {
    await visit(page, route);
    const root = page.locator('[data-decision-lens]'), readings = root.locator('[data-decision-reading]');
    check(await readings.count() === 4, mode + ' explains four connected evidence perspectives.');
    for (const index of [3, 1]) {
      const reading = readings.nth(index), summary = reading.locator('summary'), key = await reading.getAttribute('data-decision-reading');
      await summary.scrollIntoViewIfNeeded();const before = await summary.evaluate(element => element.getBoundingClientRect().top);
      await summary.focus();await page.keyboard.press('Enter');
      await page.waitForFunction(key => document.querySelector('[data-decision-lens]').dataset.decisionActive === key, key);
      check(await readings.evaluateAll(elements => elements.filter(element => element.open).length) === 1, mode + ' keeps its evidence reading exclusive.');
      check(Math.abs(await summary.evaluate(element => element.getBoundingClientRect().top) - before) <= 2, mode + ' preserves the chosen evidence summary.');
      check(await summary.evaluate(element => element === document.activeElement), mode + ' preserves evidence keyboard focus.');
      check(await root.locator('[data-decision-path="' + key + '"] .decision-path-highlight').evaluate(element => Number(getComputedStyle(element).opacity)) === 1, mode + ' highlights the selected evidence path.');
    }
    await idsAndFragments(page, mode);
    await capture(page, mode + '-evidence-desktop', '[data-decision-lens]');
  }
  for (const slug of journal) {
    await visit(page, '/insights/' + slug);
    const root = page.locator('.journal-diagram'), choices = root.locator('input[type="radio"]');
    check(await choices.count() === 3, slug + ' has three labelled native illustration perspectives.');
    const readings = new Set();
    for (const key of ['purpose', 'context', 'continuation']) {
      await root.locator('input[value="' + key + '"]').check();
      const active = root.locator('[data-diagram-reading="' + key + '"]');
      check(await root.locator('[data-diagram-reading]:visible').count() === 1 && await active.isVisible(), slug + ' exposes the reading for ' + key + '.');
      check(await root.locator('[data-diagram-part="' + key + '"]').evaluate(element => Number(getComputedStyle(element).opacity)) === 1, slug + ' emphasizes the matching ' + key + ' geometry.');
      readings.add((await active.textContent()).trim());
    }
    check(readings.size === 3, slug + ' changes the meaning as well as the illustration.');
    await choices.last().focus();await page.keyboard.press('ArrowLeft');
    check(await choices.nth(1).isChecked() && await choices.nth(1).evaluate(element => element === document.activeElement), slug + ' uses ordinary radio keyboard navigation.');
    await idsAndFragments(page, slug);
  }
  await capture(page, 'journal-desktop', '.journal-diagram');

  await visit(page, '/projects');
  const rows = page.locator('[data-index-row]');
  check(await rows.count() === 9, 'The portfolio retains all nine venture links.');
  for (let index = 0; index < 9; index++) {
    const row = rows.nth(index), slug = await row.getAttribute('data-index-venture');
    await row.focus();
    check(await page.locator('[data-index-art].is-active').count() === 1 && await page.locator('[data-index-art].is-active').getAttribute('data-index-art') === slug, slug + ' selects its art through keyboard focus.');
    check((await page.locator('[data-index-caption]').textContent()).includes((await row.locator('.index-name').textContent()).trim()), slug + ' updates its caption with the selected venture.');
  }
  // IDs differ between SVG instances. Compare actual path geometry, not those IDs.
  const geometrySignatures = await page.locator('[data-index-art]').evaluateAll(plates => plates.map(plate => [...plate.querySelectorAll('.quality-plate-piece')].map(piece => {
    const direct = piece.querySelector('path');if (direct) return direct.getAttribute('d');
    const use = piece.querySelector('use');return use ? document.getElementById(use.getAttribute('href').slice(1))?.getAttribute('d') : '';
  }).join('|')));
  check(new Set(geometrySignatures).size === 9, 'All nine venture previews have genuinely distinct geometry.');
  await rows.first().hover();check(await page.locator('[data-index-art].is-active').getAttribute('data-index-art') === 'nrth-health', 'Pointer exploration and keyboard exploration select the same portfolio art.');
  await idsAndFragments(page, 'The nine-art portfolio');
  await capture(page, 'portfolio-desktop', '[data-venture-index]');

  await visit(page, '/press');
  const download = page.waitForEvent('download');
  await page.getByRole('link',{name:'Download the company reference',exact:true}).click();
  const reference = fs.readFileSync(await (await download).path(), 'utf8');
  check(reference.includes('NRTH Inc.') && reference.includes('nrth.group'), 'The downloaded reference distinguishes the company and domain.');
  check(slugs.every(slug => reference.includes('NRTH ' + (slug === 'tms' ? 'TMS' : slug.charAt(0).toUpperCase() + slug.slice(1)))), 'The company reference contains every venture identity.');
  check(await page.locator('.editorial-press-specimen svg g').first().locator('path').count() === 4, 'The press specimen retains all four supplied logo contours.');
  const specimen = await page.locator('.editorial-press-specimen').first().locator('path').evaluateAll(paths => paths.map(element => element.getAttribute('d')));
  const headerMark = await page.locator('.masthead .brand path').evaluateAll(paths => paths.map(element => element.getAttribute('d')));
  check(JSON.stringify(specimen) === JSON.stringify(headerMark), 'Press and site navigation use the same canonical logo.');
  await idsAndFragments(page, 'Press resources');

  for (const width of [390, 320]) {
    await page.setViewportSize({width, height: width === 390 ? 844 : 700});
    for (const [route, kind] of editorial) {await examineEditorial(page, route, kind, width);await fit(page, kind + ' ' + width);}
    for (const route of ['/research', '/investors', '/press', '/projects/nrth-telematics', '/insights/clarity-is-a-design-decision', '/contact']) {
      await visit(page, route);await fit(page, route + ' ' + width);await idsAndFragments(page, route + ' ' + width);
      await page.evaluate(() => scrollTo({top: 300, behavior: 'instant'}));
      await page.waitForFunction(() => document.querySelector('.masthead').classList.contains('is-scrolled'));
      check(await page.locator('.masthead').evaluate(element => {const color = getComputedStyle(element).backgroundColor;return color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent';}), route + ' has a readable masthead after scrolling.');
    }
    const contact = await page.locator('.contact-layout').evaluate(element => {
      const side = element.querySelector('.contact-side'), form = element.querySelector('.contact-form');
      return {sideVisible: getComputedStyle(side).display !== 'none', below: side.getBoundingClientRect().top > form.getBoundingClientRect().bottom, addresses: [...side.querySelectorAll('.contact-addresses a')].map(link => link.getAttribute('href'))};
    });
    check(contact.sideVisible && contact.below, 'Phone contact guidance remains available below the form at ' + width + 'px.');
    check(contact.addresses.length === 3 && contact.addresses.every(href => href.startsWith('mailto:')), 'Phone contact retains all three inquiry destinations at ' + width + 'px.');
    await capture(page, 'contact-' + width, '.contact-side');
    await visit(page, '/insights/clarity-is-a-design-decision');await capture(page, 'journal-' + width, '.journal-diagram');
  }

  const native = await browser.newContext({viewport: {width: 390, height: 844}, javaScriptEnabled: false, reducedMotion: 'reduce'});
  listen(native);const staticPage = await native.newPage();
  for (const [route, kind] of editorial) {
    await visit(staticPage, route);
    const root = staticPage.locator('[data-editorial-model]'), details = root.locator('[data-editorial-lens]');
    check(await details.first().getAttribute('name') !== null, kind + ' retains native exclusive grouping without JavaScript.');
    await details.last().locator('summary').click();
    check(await details.evaluateAll(elements => elements.filter(element => element.open).length) === 1 && await details.last().evaluate(element => element.open), kind + ' remains explorable with native disclosures.');
  }
  await visit(staticPage, '/insights/clarity-is-a-design-decision');
  await staticPage.locator('.journal-diagram input[value="context"]').check();
  check(await staticPage.locator('[data-diagram-reading="context"]').isVisible() && await staticPage.locator('[data-diagram-reading]:visible').count() === 1, 'Journal perspectives change their reading without JavaScript.');
  await native.close();

  // Normal motion uses the SVG-only investor route, avoiding a second WebGL renderer.
  const motion = await browser.newContext({viewport: {width: 1440, height: 1000}, reducedMotion: 'no-preference'});
  listen(motion);const moving = await motion.newPage();await visit(moving, '/investors');
  const plate = moving.locator('[data-quality-plate]').first();
  const entryPosition = await plate.evaluate(element => {
    const top = Math.max(0, element.getBoundingClientRect().top + scrollY - innerHeight * .8);
    scrollTo({top, behavior: 'instant'});return top;
  });
  await moving.waitForFunction(() => !!document.querySelector('[data-quality-plate]').style.getPropertyValue('--plate-assembly'));
  await moving.waitForTimeout(800);
  const resting = await plate.evaluate(element => Number(element.style.getPropertyValue('--plate-assembly')));
  await plate.evaluate(element => scrollTo({top: element.getBoundingClientRect().top + scrollY - 130, behavior: 'instant'}));
  await moving.waitForFunction(() => Number(document.querySelector('[data-quality-plate]').style.getPropertyValue('--plate-assembly')) > .98);
  const assembled = await plate.evaluate(element => Number(element.style.getPropertyValue('--plate-assembly')));
  await moving.evaluate(top => scrollTo({top, behavior: 'instant'}), entryPosition);
  await moving.waitForFunction(assembled => Number(document.querySelector('[data-quality-plate]').style.getPropertyValue('--plate-assembly')) < assembled - .2, assembled);
  check(assembled > resting + .2, 'The material study assembles as it enters and reverses as the reader scrolls back.');
  await plate.evaluate(element => scrollTo({top: element.getBoundingClientRect().top + scrollY - 130, behavior: 'instant'}));
  const bounds = await plate.boundingBox();
  await moving.mouse.move(bounds.x + bounds.width * .85, bounds.y + Math.min(bounds.height * .45, 650));
  await moving.waitForFunction(() => Math.abs(parseFloat(document.querySelector('[data-quality-plate]').style.getPropertyValue('--plate-x'))) > 1);
  check(await plate.evaluate(element => Math.abs(parseFloat(element.style.getPropertyValue('--plate-x')))) > 1, 'Pointer response changes the actual visible material study.');
  await moving.mouse.move(10, 120);
  await moving.waitForFunction(() => Math.abs(parseFloat(document.querySelector('[data-quality-plate]').style.getPropertyValue('--plate-x'))) < .04 && Math.abs(parseFloat(document.querySelector('[data-quality-plate]').style.getPropertyValue('--plate-y'))) < .04);
  check(await plate.evaluate(element => Math.abs(parseFloat(element.style.getPropertyValue('--plate-x')))) < .04, 'The material study returns to rest after pointer exit.');
  await moving.evaluate(() => {const observedWindow=/** @type {Window & {qualityMutationCount:number,qualityMutationObserver:MutationObserver}} */ (window);observedWindow.qualityMutationCount = 0;observedWindow.qualityMutationObserver = new MutationObserver(records => observedWindow.qualityMutationCount += records.length);observedWindow.qualityMutationObserver.observe(document.querySelector('[data-quality-plate]'), {attributes: true, attributeFilter: ['style']});scrollTo({top: document.body.scrollHeight, behavior: 'instant'});});
  await moving.waitForTimeout(150);await moving.evaluate(() => window.qualityMutationCount = 0);await moving.waitForTimeout(400);
  check(await moving.evaluate(() => window.qualityMutationCount) === 0, 'An offscreen material study stops updating styles.');
  await moving.locator('footer [data-motion-toggle]').click();
  await moving.waitForFunction(() => document.documentElement.classList.contains('motion-paused'));
  check(await plate.evaluate(element => Number(element.style.getPropertyValue('--plate-assembly')) === 1 && parseFloat(element.style.getPropertyValue('--plate-x')) === 0), 'The global pause presents a fully assembled still composition.');
  await plate.evaluate(element => scrollTo({top: element.getBoundingClientRect().top + scrollY - 130, behavior: 'instant'}));
  await moving.waitForTimeout(100);await moving.evaluate(() => window.qualityMutationCount = 0);
  const pausedBounds = await plate.boundingBox();await moving.mouse.move(pausedBounds.x + pausedBounds.width * .8, pausedBounds.y + Math.min(pausedBounds.height * .4, 600));
  await moving.waitForTimeout(350);
  check(await moving.evaluate(() => window.qualityMutationCount) === 0, 'The global pause suppresses scroll and pointer style animation.');
  await moving.evaluate(() => {const observedWindow=/** @type {Window & {qualityMutationObserver:MutationObserver}} */ (window);observedWindow.qualityMutationObserver.disconnect();});
  await motion.close();

  // The full homepage is inspected only with reduced motion.
  await page.setViewportSize({width: 1440, height: 1000});await visit(page, '/');
  await idsAndFragments(page, 'The complete homepage');await fit(page, 'The detailed homepage');
  const guideDestinations=await page.locator('[data-portfolio-atlas] .atlas-links a[href^="/industries/"]').evaluateAll(links=>[...new Set(links.map(link=>link.getAttribute('href')))]);
  check(guideDestinations.length===6&&['mobility','health','systems','materials','events','research'].every(field=>guideDestinations.includes('/industries/'+field)),'The homepage atlas retains all six industry guide destinations.');
  check(errors.length === 0, 'No uncaught browser errors in the quality review.');
  evidence.push('SVG material assembly is reversible, responsive and idle/offscreen aware; no WebGL benchmark is implied.');
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({checks, passed: true, errors, evidence}, null, 2));
  console.log(checks + ' quality checks passed.');await reduced.close();await browser.close();
})().catch(async error => {
  console.error(error);fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({checks, passed: false, error: String(error), errors}, null, 2));
  await browser?.close();process.exitCode = 1;
});
