import {emitDiscovery} from './prepared-inquiry';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = document.documentElement.classList.contains('motion-paused');
try { paused ||= localStorage.getItem('nrth-motion') === 'paused'; } catch {}
const animations = new Set<Animation>();
function stopAnimations() { animations.forEach(animation => animation.cancel()); animations.clear(); }
window.addEventListener('nrth:motion', event => {
  paused = Boolean((event as CustomEvent<{paused:boolean}>).detail.paused);
  if (paused) stopAnimations();
});
reduced.addEventListener('change', () => { if (reduced.matches) stopAnimations(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopAnimations(); });

for (const root of document.querySelectorAll<HTMLElement>('[data-investor-compare]')) {
  const choices = [...root.querySelectorAll<HTMLInputElement>('[data-investor-choice]')];
  const slots = [...root.querySelectorAll<HTMLElement>('[data-investor-slot]')];
  const templates = new Map([...root.querySelectorAll<HTMLTemplateElement>('[data-investor-template]')].map(template => [template.dataset.investorTemplate!, template]));
  const defaults = ['nrth-health','nrth-tms','nrth-systems'].filter(slug => templates.has(slug));
  const status = root.querySelector<HTMLElement>('[data-investor-status]')!;
  const count = root.querySelector<HTMLElement>('[data-investor-count]')!;
  const save = root.querySelector<HTMLButtonElement>('[data-investor-save]')!;
  const share = root.querySelector<HTMLButtonElement>('[data-investor-share]')!;
  const sharePanel = root.querySelector<HTMLElement>('[data-investor-share-panel]')!;
  const shareUrl = root.querySelector<HTMLInputElement>('[data-investor-share-url]')!;
  const inquiry = root.querySelector<HTMLAnchorElement>('[data-investor-inquiry]')!;
  let selected = [...defaults];
  let copyRequest = 0;

  function readQuery() {
    const query = new URL(location.href).searchParams.get('compare');
    if (query === null) return [...defaults];
    if (query === 'none') return [];
    const valid = [...new Set(query.split(',').map(value => value.trim()))].filter(slug => templates.has(slug)).slice(0,3);
    return valid.length ? valid : [...defaults];
  }

  function comparisonUrl() {
    const url = new URL(location.href);
    url.searchParams.set('compare', selected.length ? selected.join(',') : 'none');
    return url;
  }

  function nameFor(slug: string) {
    return choices.find(choice => choice.value === slug)?.dataset.investorName || slug;
  }

  function animate(card: HTMLElement) {
    if (paused || reduced.matches || document.hidden || !card.animate) return;
    const animation = card.animate([{opacity:.3,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}], {duration:480,easing:'cubic-bezier(.16,1,.3,1)'});
    animations.add(animation);
    animation.addEventListener('finish', () => animations.delete(animation), {once:true});
    animation.addEventListener('cancel', () => animations.delete(animation), {once:true});
  }

  function update(next: string[], options: {announce?:boolean;url?:boolean;motion?:boolean} = {}) {
    selected = next.filter(slug => templates.has(slug)).slice(0,3);
    copyRequest++;
    stopAnimations();
    choices.forEach(choice => { choice.checked = selected.includes(choice.value); });
    slots.forEach((slot,index) => {
      const slug = selected[index];
      if (slot.dataset.investorSlot === (slug || 'empty')) return;
      slot.replaceChildren();
      slot.dataset.investorSlot = slug || 'empty';
      if (slug) {
        const card = templates.get(slug)!.content.firstElementChild!.cloneNode(true) as HTMLElement;
        slot.append(card);
        if (options.motion !== false) animate(card);
      } else {
        const empty = document.createElement('div');
        empty.className = 'investor-compare-empty';
        const title = document.createElement('span');
        title.textContent = 'An open perspective.';
        const description = document.createElement('p');
        description.textContent = 'Choose another venture above to bring its questions into the comparison.';
        empty.append(title,description);
        slot.append(empty);
      }
    });
    const names = selected.map(nameFor);
    count.textContent = `${selected.length} of 3 perspectives selected.`;
    const inquiryUrl = new URL('/contact',location.origin);
    inquiryUrl.searchParams.set('project','investor');
    if (names.length) inquiryUrl.searchParams.set('topic',('Portfolio discussion: '+names.join(', ')).slice(0,180));
    inquiry.href = inquiryUrl.pathname+inquiryUrl.search;
    inquiry.textContent = names.length ? 'Discuss these perspectives' : 'Start an investor conversation';
    save.disabled = selected.length === 0;
    shareUrl.value = comparisonUrl().href;
    root.dataset.investorSelected = selected.join(',');
    if (options.url) {
      try { history.replaceState(history.state,'',comparisonUrl()); } catch {}
    }
    if (options.announce) status.textContent = names.length ? `${names.join(', ')} selected. Comparison and inquiry updated.` : 'No ventures selected. Choose up to three to build a comparison.';
  }

  choices.forEach(choice => choice.addEventListener('change', () => {
    if (choice.checked && selected.length === 3 && !selected.includes(choice.value)) {
      choice.checked = false;
      status.textContent = `${nameFor(choice.value)} was not added. Three ventures are already selected. Clear one before adding another.`;
      return;
    }
    const next = choice.checked ? [...selected,choice.value] : selected.filter(slug => slug !== choice.value);
    update(next,{announce:true,url:true});
  }));

  root.querySelector<HTMLButtonElement>('[data-investor-reset]')!.addEventListener('click', () => update([...defaults],{announce:true,url:true}));
  share.addEventListener('click', async () => {
    const request = ++copyRequest;
    const url = comparisonUrl().href;
    shareUrl.value = url;
    try {
      await navigator.clipboard.writeText(url);
      if (request === copyRequest) status.textContent = 'The comparison link is copied. It opens the same venture selection.';
    } catch {
      if (request !== copyRequest) return;
      sharePanel.hidden = false;
      shareUrl.focus({preventScroll:true});
      shareUrl.select();
      status.textContent = 'Automatic copy is unavailable. The comparison link is selected for you to copy.';
    }
  });

  function readingPack() {
    const lines = ['NRTH — Investor reading pack','Public venture directions and questions for discussion.','',`Selection: ${selected.map(nameFor).join(', ')}`,`Comparison: ${comparisonUrl().href}`,''];
    for (const slug of selected) {
      const card = templates.get(slug)!.content.firstElementChild!;
      lines.push(nameFor(slug),`Published scope: ${card.querySelector('[data-investor-stage]')!.textContent!.trim()}`);
      card.querySelectorAll('dl > div').forEach(row => {
        lines.push('',`${row.querySelector('dt')!.textContent!.trim()}:`,row.querySelector('dd')!.textContent!.trim());
      });
      lines.push('',`Venture overview: ${new URL('/projects/'+slug,location.origin).href}`,'','—','');
    }
    lines.push('Questions for a first discussion','');
    root.querySelectorAll('.investor-reading-questions details').forEach(details => {
      lines.push(details.querySelector('summary')!.childNodes[0].textContent!.trim(),details.querySelector('div > p')!.textContent!.trim(),`Ask to review: ${details.querySelector('.investor-reading-request')!.textContent!.replace(/^Ask to review\s*/, '').trim()}`,'');
    });
    lines.push('Public company overview: https://nrth.group/resources/nrth-company-overview.pdf','Company introduction: https://nrth.group/about','Working approach: https://nrth.group/approach','Investor inquiries: investors@nrth.group','','Confirm current stage, availability, evidence and commercial information directly with NRTH. Investment terms require a separate discussion and appropriate documentation.');
    return lines.join('\n');
  }

  save.addEventListener('click', () => {
    if (!selected.length) return;
    const url = URL.createObjectURL(new Blob([readingPack()],{type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nrth-investor-reading-pack.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    status.textContent = `Reading pack saved with ${selected.length} venture perspectives and five discussion questions.`;
    emitDiscovery('reading_pack_saved',{venture:'investor'});
  });
  window.addEventListener('popstate', () => update(readQuery(),{announce:true,motion:false}));

  root.querySelector<HTMLElement>('[data-investor-controls]')!.hidden = false;
  update(readQuery(),{motion:false});
}
