import {experimentFields, defaultExperiment, createExperimentOutline, experimentOutlineText} from '../data/experiment-directions';
import {prepareInquiry,emitDiscovery} from './prepared-inquiry';

const root = document.querySelector<HTMLElement>('[data-experiment-planner]');
if (root) {
 const element = <T extends Element>(selector: string) => root.querySelector<T>(selector)!;
 const form = element<HTMLFormElement>('[data-experiment-controls]');
 const fieldControl = element<HTMLSelectElement>('[data-experiment-field-control]');
 const starterControl = element<HTMLSelectElement>('[data-experiment-starter]');
 const questionControl = element<HTMLTextAreaElement>('[data-experiment-question]');
 const status = element<HTMLElement>('[data-experiment-status]');
 const fallback = element<HTMLElement>('[data-experiment-copy-fallback]');
 const fallbackText = element<HTMLTextAreaElement>('[data-experiment-copy-text]');
 const methodInputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-experiment-method-control]'));
 let outline = createExperimentOutline(defaultExperiment.field, defaultExperiment.method, defaultExperiment.starter);
 let focusTimer: ReturnType<typeof setTimeout> | undefined;
 const setText = (selector: string, value: string) => { element<HTMLElement>(selector).textContent = value; };
 function setList(selector: string, values: string[]) {
  const list = element<HTMLElement>(selector);
  list.replaceChildren(...values.map(value => { const item = document.createElement('li'); item.textContent = value; return item; }));
 }
 function setStarterOptions(selected: number) {
  const field = experimentFields.find(item => item.id === fieldControl.value) ?? experimentFields[0];
  starterControl.replaceChildren(...field.starters.map((question, index) => new Option(question, String(index), index === selected, index === selected)));
 }
 function update(announce = false) {
  const method = methodInputs.find(input => input.checked)?.value ?? defaultExperiment.method;
  outline = createExperimentOutline(fieldControl.value, method, Number(starterControl.value), questionControl.value);
  root!.dataset.experimentField = outline.field.id;
  root!.dataset.experimentMethod = outline.method.id;
  setText('[data-experiment-question-preview]', outline.question);
  setText('[data-experiment-context]', outline.field.context);
  setList('[data-experiment-inputs]', outline.inputs);
  setText('[data-experiment-method-name]', outline.method.name);
  setText('[data-experiment-purpose]', outline.method.purpose);
  setText('[data-experiment-preparation]', outline.method.preparation);
  setText('[data-experiment-activity]', outline.method.activity);
  setList('[data-experiment-observations]', outline.observations);
  setText('[data-experiment-limit]', outline.method.limit);
  setText('[data-experiment-decision]', outline.decision);
  questionControl.placeholder = outline.field.starters[outline.starter];
  fallback.hidden = true;
  if (announce) status.textContent = `${outline.field.name} outline updated using ${outline.method.name.toLowerCase()}.`;
 }
 function showCopyFallback(value: string, label: string) {
  element<HTMLElement>('[data-experiment-copy-label]').textContent = label;
  fallbackText.value = value;
  fallback.hidden = false;
  fallbackText.focus({preventScroll: true});
  fallbackText.select();
 }
 async function copy(value: string, confirmation: string, label: string, action='research_outline_saved') {
  try {
   await navigator.clipboard.writeText(value);
   fallback.hidden = true;
   status.textContent = confirmation;
   emitDiscovery(action);
  } catch {
   showCopyFallback(value, label);
   status.textContent = 'Automatic copy is unavailable. Select and copy the text below, or save the outline as a text file.';
  }
 }
 const params = new URLSearchParams(location.search);
 const sharedField = params.get('experiment-field');
 const sharedMethod = params.get('experiment-method');
 const sharedStarter = Number(params.get('experiment-starter'));
 if (sharedField && experimentFields.some(field => field.id === sharedField)) {
  fieldControl.value = sharedField;
  const sharedOutline = createExperimentOutline(sharedField, sharedMethod ?? defaultExperiment.method, sharedStarter);
  setStarterOptions(sharedOutline.starter);
  methodInputs.forEach(input => { input.checked = input.value === sharedOutline.method.id; });
 }
 form.hidden = false;
 element<HTMLElement>('[data-experiment-actions]').hidden = false;
 root.dataset.experimentReady = 'true';
 form.addEventListener('submit', event => event.preventDefault());
 fieldControl.addEventListener('change', () => { setStarterOptions(0); update(true); });
 starterControl.addEventListener('change', () => {
  update(true);
  if (questionControl.value.trim()) status.textContent = 'Starter question changed. Your custom question is still in the outline; clear it to use the starter.';
 });
 methodInputs.forEach(input => input.addEventListener('change', () => update(true)));
 questionControl.addEventListener('input', () => { update(); status.textContent = ''; });
 form.addEventListener('focusin', event => {
  clearTimeout(focusTimer);
  const target = event.target as HTMLElement;
  root!.dataset.experimentFocus = target.matches('[data-experiment-method-control]') ? 'method' : 'question';
 });
 form.addEventListener('focusout', () => {
  focusTimer = setTimeout(() => { delete root!.dataset.experimentFocus; }, 80);
 });
 element<HTMLButtonElement>('[data-experiment-copy]').addEventListener('click', () => {
  void copy(experimentOutlineText(outline), 'Your research outline is copied.', 'Your research outline');
 });
 element<HTMLButtonElement>('[data-experiment-download]').addEventListener('click', () => {
  const objectUrl = URL.createObjectURL(new Blob([experimentOutlineText(outline)], {type: 'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `nrth-${outline.field.id}-research-outline.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  status.textContent = 'Your research outline was saved as a text file.';
  emitDiscovery('research_outline_saved');
 });
 element<HTMLButtonElement>('[data-experiment-share]').addEventListener('click', () => {
  const url = new URL('/research', location.origin);
  url.searchParams.set('experiment-field', outline.field.id);
  url.searchParams.set('experiment-method', outline.method.id);
  url.searchParams.set('experiment-starter', String(outline.starter));
  url.hash = 'experiment';
  void copy(url.href, 'Link copied. It includes the starting point and method, but not your custom question.', 'Your research starting point link','research_outline_shared');
 });
 element<HTMLButtonElement>('[data-experiment-reset]').addEventListener('click', () => {
  fieldControl.value = defaultExperiment.field;
  questionControl.value = '';
  setStarterOptions(defaultExperiment.starter);
  methodInputs.forEach(input => { input.checked = input.value === defaultExperiment.method; });
  update();
  status.textContent = 'The outline is back to the original mobility question.';
 });
 element<HTMLButtonElement>('[data-experiment-continue]').addEventListener('click', () => {
  const message = experimentOutlineText(outline);
  if (message.length > 4500) {
   status.textContent = 'This outline is too long to transfer. Save or copy it, then open a blank inquiry.';
   return;
  }
  prepareInquiry({project:'nrth-labs',draftMessage:message,items:[{kind:'research-outline',label:'Research outline',value:`${outline.field.name} — ${outline.method.name}. Review the question, observations, limits and next decision in this introduction.`}]});
 });
 update();
}
