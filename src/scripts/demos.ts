const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motion = () => !reduced.matches && !document.documentElement.classList.contains('motion-paused');
function announce(root: HTMLElement, action: string) {window.dispatchEvent(new CustomEvent('nrth:interaction', {detail: {venture: root.dataset.demoSlug, action}}));}
function arrive(element: Element | null) {if (element && motion()) element.animate([{transform: 'translateY(8px)', opacity: .8}, {transform: 'translateY(0)', opacity: 1}], {duration: 320, easing: 'cubic-bezier(.22,1,.36,1)'});}
function save(name: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelectorAll<HTMLElement>('[data-demo]').forEach(root => {
  const q = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const all = <T extends Element = HTMLElement>(selector: string) => [...root.querySelectorAll<T>(selector)];
  if (root.dataset.demo === 'dispatch') {
    const origin = q<HTMLSelectElement>('[data-demo-origin]'), destination = q<HTMLSelectElement>('[data-demo-destination]');
    let step = 0;
    const vehicle = () => q<HTMLInputElement>('[data-demo-vehicle]:checked').value;
    function choose(next: number) {
      const routeError = q('[data-dispatch-error]'), vehicleError = q('[data-vehicle-error]');
      routeError.textContent = ''; vehicleError.textContent = '';
      if (next > 0 && origin.value === destination.value) {routeError.textContent = 'Choose a different destination for this sample route.'; next = 0;}
      if (next === 2 && vehicle() === 'NR-03') {vehicleError.textContent = 'This sample load has 16 pallets. Choose a vehicle with room for the load.'; next = 1;}
      step = next;
      all<HTMLButtonElement>('[data-dispatch-step]').forEach(button => {if (Number(button.dataset.dispatchStep) === step) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');});
      all('[data-dispatch-panel]').forEach(panel => {panel.hidden = Number(panel.dataset.dispatchPanel) !== step;});
      q('[data-route-origin]').textContent = origin.value; q('[data-route-destination]').textContent = destination.value; q('[data-route-vehicle]').textContent = vehicle();
      arrive(q('[data-dispatch-panel="' + step + '"]'));
      announce(root, 'dispatch-step-' + step);
    }
    all<HTMLButtonElement>('[data-dispatch-step]').forEach(button => button.addEventListener('click', () => choose(Number(button.dataset.dispatchStep))));
    all<HTMLButtonElement>('[data-dispatch-next]').forEach(button => button.addEventListener('click', () => choose(Number(button.dataset.dispatchNext))));
    q('[data-dispatch-create]').addEventListener('click', () => {q('[data-plan-complete]').hidden = false; q('[data-dispatch-create]').hidden = true; q('[data-plan-state]').textContent = 'Sample plan created'; arrive(q('[data-plan-complete]')); announce(root, 'demo-completed');});
    q('[data-plan-reset]').addEventListener('click', () => {q('[data-plan-complete]').hidden = true; q('[data-dispatch-create]').hidden = false; q('[data-plan-state]').textContent = 'Ready for review'; choose(0);});
    q('[data-plan-download]').addEventListener('click', () => save('nrth-tms-sample-plan.json', JSON.stringify({type: 'Illustrative NRTH TMS concept — not a dispatched shipment', shipment: 'NR-1042', origin: origin.value, destination: destination.value, vehicle: vehicle(), pallets: 16, responsibility: 'Sample dispatch team'}, null, 2), 'application/json'));
    [origin, destination, ...all<HTMLInputElement>('[data-demo-vehicle]')].forEach(input => input.addEventListener('change', () => {q('[data-plan-complete]').hidden = true; q('[data-dispatch-create]').hidden = false; q('[data-plan-state]').textContent = 'Ready for review';}));
  }
  if (root.dataset.demo === 'sequence') {
    const tabs = all<HTMLButtonElement>('[data-sequence-step]'), panels = all('[data-sequence-panel]');
    function select(index: number, focus = false) {
      tabs.forEach((tab, i) => {tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; panels[i].hidden = i !== index;});
      if (focus) tabs[index].focus(); arrive(panels[index]); announce(root, 'workflow-step-' + index);
    }
    tabs.forEach((tab, i) => {tab.addEventListener('click', () => select(i)); tab.addEventListener('keydown', event => {let next = i; if (event.key === 'ArrowRight') next = (i + 1) % tabs.length; else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = tabs.length - 1; else return; event.preventDefault(); select(next, true);});});
  }
  if (root.dataset.demo === 'telemetry') {
    const points = [
      {time: '09:10', speed: 0, activity: 'Stopped', age: 2, note: 'A stationary sample point. Location alone does not explain the next action.'},
      {time: '09:12', speed: 28, activity: 'Moving', age: 3, note: 'The sample journey has started. Activity adds context to the position.'},
      {time: '09:14', speed: 62, activity: 'Moving', age: 4, note: 'The vehicle is moving and the sample signal is recent.'},
      {time: '09:16', speed: 74, activity: 'Moving', age: 65, note: 'The sample signal is older. Check freshness before drawing a conclusion.'},
      {time: '09:18', speed: 35, activity: 'Slowing', age: 3, note: 'The sample vehicle is slowing. Consider the wider workflow before acting.'},
      {time: '09:20', speed: 0, activity: 'Stopped', age: 1, note: 'The final sample point is stationary. A handoff can now add operational context.'},
    ];
    const input = q<HTMLInputElement>('[data-telemetry-time-input]');
    function update() {
      const index = Number(input.value), point = points[index];
      q('[data-telemetry-speed]').replaceChildren(document.createTextNode(String(point.speed) + ' '), Object.assign(document.createElement('small'), {textContent: 'km/h'}));
      q('[data-telemetry-activity]').textContent = point.activity;
      q('[data-telemetry-age]').replaceChildren(document.createTextNode(String(point.age) + ' '), Object.assign(document.createElement('small'), {textContent: 'sec'}));
      q('[data-telemetry-time]').textContent = point.time; q('[data-telemetry-insight]').textContent = point.note;
      q('[data-telemetry-marker]').style.setProperty('--point', String(index));
      root.dataset.signal = point.age > 30 ? 'review' : 'recent'; announce(root, 'telemetry-point-' + index);
    }
    input.addEventListener('input', update); update();
  }
  if (root.dataset.demo === 'fleet') {
    const filters = all<HTMLButtonElement>('[data-fleet-filter]'), records = all<HTMLButtonElement>('[data-fleet-record]');
    function select(record: HTMLButtonElement) {
      records.forEach(item => item.setAttribute('aria-pressed', String(item === record)));
      q('[data-fleet-selected]').textContent = 'Selected / ' + record.dataset.fleetRecord;
      q('[data-fleet-detail]').textContent = record.dataset.fleetNote || '';
      arrive(q('.fleet-detail')); announce(root, 'fleet-record-' + record.dataset.fleetRecord);
    }
    records.forEach(record => record.addEventListener('click', () => select(record)));
    filters.forEach(filter => filter.addEventListener('click', () => {filters.forEach(button => button.setAttribute('aria-pressed', String(button === filter))); records.forEach(record => {record.hidden = filter.dataset.fleetFilter !== 'All' && record.dataset.fleetState !== filter.dataset.fleetFilter;}); select(records.find(record => !record.hidden)!);}));
  }
  if (root.dataset.demo === 'workflow') {
    const button = q<HTMLButtonElement>('[data-workflow-run]'), rule = q<HTMLSelectElement>('[data-workflow-rule]');
    const records = [{id: 'Request A', review: true, owner: 'Operations'}, {id: 'Request B', review: false, owner: 'Planning'}, {id: 'Request C', review: true, owner: 'Coordination'}];
    let run = 0;
    button.addEventListener('click', async () => {
      const version = ++run; button.disabled = true; button.textContent = 'Running sample…';
      const nodes = all('[data-workflow-node]'); q('[data-workflow-output]').hidden = true;
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].dataset.state = 'running'; nodes[i].querySelector('[data-workflow-state]')!.textContent = 'Processing';
        if (motion()) await new Promise(resolve => setTimeout(resolve, 260));
        if (version !== run) return;
        nodes[i].dataset.state = 'complete'; nodes[i].querySelector('[data-workflow-state]')!.textContent = 'Complete';
      }
      const result = rule.value === 'review' ? records.filter(record => record.review) : records;
      const output = q('[data-workflow-output]'); output.replaceChildren();
      const heading = document.createElement('strong'); heading.textContent = result.length + ' sample requests in the next action'; output.append(heading);
      const list = document.createElement('ul'); result.forEach(record => {const item = document.createElement('li'); item.textContent = record.id + ' → ' + record.owner; list.append(item);}); output.append(list); output.hidden = false;
      button.disabled = false; button.textContent = 'Run sample workflow'; arrive(output); announce(root, 'demo-completed');
    });
    window.addEventListener('pagehide', () => {run++;});
  }
  if (root.dataset.demo === 'materials') {
    const briefs = [
      {name: 'Coatings', questions: ['What surface and environment are involved?', 'Which performance requirements matter?', 'What specifications and documentation are needed?']},
      {name: 'Water processes', questions: ['What is the process and intended application?', 'Which operating conditions need to be understood?', 'What testing and safety documentation are required?']},
      {name: 'Manufacturing', questions: ['Where does the material sit in the production process?', 'Which compatibility and handling requirements apply?', 'What documentation and acceptance criteria are needed?']},
    ];
    let selected = 0;
    all<HTMLButtonElement>('[data-material-choice]').forEach(button => button.addEventListener('click', () => {selected = Number(button.dataset.materialChoice); all('[data-material-choice]').forEach(item => item.setAttribute('aria-pressed', String(item === button))); q('[data-material-title]').textContent = briefs[selected].name; q('[data-material-questions]').replaceChildren(...briefs[selected].questions.map(text => Object.assign(document.createElement('li'), {textContent: text}))); arrive(q('.material-context')); announce(root, 'material-application-' + selected);}));
    q('[data-material-brief]').addEventListener('click', () => save('nrth-materials-conversation-brief.txt', 'NRTH Chemicals / Application conversation\n\nApplication: ' + briefs[selected].name + '\n\n' + briefs[selected].questions.map(text => text + '\nYour context:').join('\n\n') + '\n\nThis is a conversation framework, not a product or safety specification.\nContact: hello@nrth.group'));
  }
  if (root.dataset.demo === 'agenda') {
    const format = q<HTMLSelectElement>('[data-agenda-format]'), duration = q<HTMLSelectElement>('[data-agenda-duration]');
    let agenda: {title: string; minutes: number}[] = [];
    function update() {
      const total = Number(duration.value), ratios = [.1, .22, .34, .24];
      const titles = format.value === 'exchange' ? ['Welcome & context', 'A shared question', 'Small-group exploration', 'Exchange & connections', 'Next steps'] : ['Welcome & context', 'Product perspective', 'Guided exploration', 'Questions & discussion', 'Next steps'];
      const minutes = ratios.map(r => Math.round(total * r)); minutes.push(total - minutes.reduce((sum, n) => sum + n, 0));
      agenda = titles.map((title, i) => ({title, minutes: minutes[i]}));
      const parent = q('[data-agenda-blocks]'); parent.replaceChildren();
      let elapsed = 0;
      agenda.forEach(({title, minutes}) => {
        const row = document.createElement('div'); row.className = 'agenda-block';
        const time = document.createElement('span'); time.textContent = String(9 + Math.floor(elapsed / 60)).padStart(2, '0') + ':' + String(elapsed % 60).padStart(2, '0');
        const label = document.createElement('strong'); label.textContent = title;
        const length = document.createElement('span'); length.textContent = minutes + ' min';
        row.append(time, label, length); parent.append(row); elapsed += minutes;
      });
      arrive(parent); announce(root, 'agenda-' + total);
    }
    [format, duration].forEach(input => input.addEventListener('change', update)); update();
    q('[data-agenda-download]').addEventListener('click', () => save('nrth-sample-agenda.txt', 'NRTH Events / Sample agenda\n' + format.selectedOptions[0].textContent + ' / ' + duration.value + ' minutes\n\n' + agenda.map(item => item.title + ' — ' + item.minutes + ' min').join('\n') + '\n\nIllustrative planning concept; not a scheduled event.'));
  }
  if (root.dataset.demo === 'lab') void import('./lab-study').then(({startStudy}) => startStudy(root));
});
export {};
