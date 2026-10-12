import {contextKinds,inquiryContextKey,inquiryProjects,preparedInquiryText,validatePreparedInquiry,type ContextKind,type InquiryContextItem,type InquiryProject,type PreparedInquiry} from '../data/inquiry-context';
const touched=new Set<string>();
const journeyKey='nrth-public-journey';
let handingOff=false,lastExhibit:HTMLElement|null=null;
const compact=(value:string|null|undefined,max=700)=>(value||'').replace(/\s+/g,' ').trim().slice(0,max);
const item=(kind:ContextKind,label:string,value:string):InquiryContextItem=>({kind,label:compact(label,140),value:compact(value)});
export function emitDiscovery(action:string,detail:Record<string,string|number>={}){window.dispatchEvent(new CustomEvent('nrth:discovery',{detail:{action,...detail}}));}
export function takePreparedInquiry():PreparedInquiry|null{
 try{const raw=sessionStorage.getItem(inquiryContextKey);sessionStorage.removeItem(inquiryContextKey);return raw?validatePreparedInquiry(JSON.parse(raw)):null;}catch{return null;}
}
function fallback(context:PreparedInquiry){
 const dialog=document.createElement('dialog');dialog.className='prepared-fallback';dialog.setAttribute('aria-labelledby','prepared-fallback-title');
 const title=document.createElement('h2');title.id='prepared-fallback-title';title.textContent='Keep your starting point.';
 const note=document.createElement('p');note.textContent='This browser could not carry your selection to the inquiry. Copy or save it here, then paste it into your introduction.';
 const label=document.createElement('label');label.textContent='Your prepared context';label.htmlFor='prepared-fallback-text';
 const text=document.createElement('textarea');text.id='prepared-fallback-text';text.readOnly=true;text.value=preparedInquiryText(context);
 const controls=document.createElement('div'),copy=document.createElement('button'),save=document.createElement('button'),continueLink=document.createElement('a'),close=document.createElement('button'),status=document.createElement('p');
 copy.type=save.type=close.type='button';copy.textContent='Copy context';save.textContent='Save context';continueLink.textContent='Open an introduction';continueLink.href='/contact?project='+context.project;close.textContent='Keep exploring';status.setAttribute('role','status');
 copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text.value);status.textContent='Context copied. Nothing has been sent.';}catch{text.focus();text.select();status.textContent='Select and copy the context, or save a text file.';}});
 save.addEventListener('click',()=>saveText(text.value,'nrth-prepared-context.txt'));
 close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>dialog.remove());
 controls.append(copy,save,continueLink,close);dialog.append(title,note,label,text,controls,status);document.body.append(dialog);
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');text.focus();text.select();
}
export function saveText(value:string,filename:string){const url=URL.createObjectURL(new Blob([value],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
/** Explicit handoff only. This never submits a message or places custom text in a URL. */
export function prepareInquiry(input:{project:InquiryProject;items?:InquiryContextItem[];draftMessage?:string},navigate=true):boolean{
 const context=validatePreparedInquiry({version:1,createdAt:Date.now(),project:input.project,items:input.items||[],draftMessage:input.draftMessage});if(!context)return false;
 try{sessionStorage.setItem(inquiryContextKey,JSON.stringify(context));sessionStorage.removeItem(journeyKey);handingOff=true;emitDiscovery('inquiry_context_prepared',{venture:context.project});if(navigate)location.assign('/contact?project='+context.project);return true;}catch{fallback(context);return false;}
}
function collect(link:HTMLAnchorElement):InquiryContextItem[]{
 const items:InquiryContextItem[]=[];
 const story=link.closest<HTMLElement>('[data-venture-stories]')||(touched.has('scenario')?document.querySelector<HTMLElement>('[data-venture-stories]'):null);
 if(story){const panel=link.closest<HTMLElement>('[data-scenario-panel]')||story.querySelector<HTMLElement>('[data-scenario-panel][aria-hidden="false"]');if(panel){const label=compact(panel.querySelector('h3')?.textContent,140),decision=compact(panel.querySelector('.vs-next-decision dd')?.textContent);if(label)items.push(item('scenario','Illustrative scenario',label+(decision?' — Next decision: '+decision:'')));}}
 const example=link.closest<HTMLElement>('[data-worked-example]')||story?.querySelector<HTMLElement>('[data-worked-example]')||(touched.has('example')?document.querySelector<HTMLElement>('[data-worked-example]'):null);
 if(example&&touched.has('example')){const caption=compact(example.querySelector('[data-example-caption]')?.textContent||example.querySelector('figcaption')?.textContent||example.querySelector('h3')?.textContent),part=example.querySelector<HTMLElement>('[data-example-part-record="'+example.dataset.examplePart+'"]');if(caption)items.push(item('example','Example examined',caption+(part?' — Inspected responsibility: '+compact(part.querySelector('[data-example-part-label]')?.textContent)+'. '+compact(part.querySelector('[data-example-part-detail]')?.textContent):'')));}
 const atlas=document.querySelector<HTMLElement>('[data-portfolio-atlas]');
 if(atlas&&touched.has('venture')){const panel=atlas.querySelector<HTMLElement>('[data-atlas-panel="'+atlas.dataset.atlasSelected+'"]');if(panel)items.push(item('venture','Venture explored',compact(panel.querySelector('h3')?.textContent)+' — '+compact(panel.querySelector('.atlas-question')?.textContent)));}
 const inspector=document.querySelector<HTMLDialogElement>('[data-story-inspector]');
 if(touched.has('industry')||inspector?.open){const group=inspector?.querySelector<HTMLElement>('[data-inspector-group]:not([hidden])'),panel=group?.querySelector<HTMLElement>('[data-inspector-panel]:not([hidden])');if(group&&panel)items.push(item('perspective',compact(group.dataset.inspectorGroup,140)+' perspective',compact(panel.querySelector('h3')?.textContent)+' — '+compact(panel.querySelector('blockquote')?.textContent)));else{const field=document.querySelector<HTMLElement>('[data-matter-field][aria-selected="true"]')?.dataset.matterField;if(field)items.push(item('industry','Industry explored',field));}}
 const lab=document.querySelector<HTMLElement>('[data-matter-lab]');
 if(lab&&touched.has('visual-study')){const form=lab.dataset.form||lab.querySelector<HTMLElement>('[data-lab-target][aria-selected=true]')?.dataset.labTarget||'Systems',structure=lab.querySelector<HTMLInputElement>('[data-lab-structure]')?.value||'35',angle=lab.querySelector<HTMLInputElement>('[data-lab-angle]')?.value||'0';items.push(item('visual-study','Visual study',`${form}; structure ${structure}%; perspective ${angle}°. A visual design study, not a scientific or product model.`));}
 const comparison=document.querySelector<HTMLElement>('[data-investor-compare]');
 if(comparison&&(touched.has('comparison')||link.hasAttribute('data-investor-inquiry'))){const selected=(comparison.dataset.investorSelected||'').split(',').filter(slug=>inquiryProjects.includes(slug as InquiryProject));if(selected.length)items.push(item('comparison','Venture perspectives',selected.map(slug=>comparison.querySelector<HTMLElement>(`[data-investor-choice][value="${slug}"]`)?.dataset.investorName||slug).join(', ')));}
 const connections=document.querySelector<HTMLElement>('[data-connections-explorer]');
 if(connections&&(touched.has('connection')||link.dataset.prepareContext==='connection')){
  const slug=connections.dataset.connectionSelected,active=connections.querySelector<HTMLElement>(`[data-connection-story="${slug}"]`),handoff=link.closest<HTMLDetailsElement>('[data-connection-handoff]')||active?.querySelector<HTMLDetailsElement>('[data-connection-handoff][open]');
  if(handoff){const target=handoff.closest('li')?.querySelector('a')?.textContent,source=active?.querySelector('.connections-source')?.textContent;items.push(item('connection','Information handoff',compact(source)+' to '+compact(target)+'. '+[...handoff.querySelectorAll('dl > div')].map(row=>compact(row.querySelector('dt')?.textContent)+': '+compact(row.querySelector('dd')?.textContent)).join(' ')));}
  else if(active)items.push(item('connection','Connection examined',compact(active.querySelector('.connections-source')?.textContent)+' — '+compact(active.querySelector('h3')?.textContent)));
 }
 const exhibit=link.closest<HTMLElement>('[data-evidence-exhibit]')||lastExhibit;
 if(exhibit){const checked=exhibit.querySelector<HTMLInputElement>('[data-exhibit-case]:checked'),panel=exhibit.querySelector('.evidence-case-'+(checked?.value||'0'));items.push(item('work-study','Illustrative exhibit',compact(exhibit.querySelector('h3')?.textContent)+' — '+compact(checked?.dataset.exhibitCase)+'. '+compact(panel?.querySelector('.evidence-exhibit-observation p')?.textContent)));}
 const prepared=link.dataset.prepareKind as ContextKind;
 if(prepared&&contextKinds.includes(prepared)&&link.dataset.prepareLabel&&link.dataset.prepareValue)items.push(item(prepared,link.dataset.prepareLabel,link.dataset.prepareValue));
 return items.slice(0,8).filter(entry=>entry.label&&entry.value);
}
const controls:[string,string][]=[['[data-scenario-choice]','scenario'],['[data-matter-field],[data-story-inspect],[data-inspector-tab]','industry'],['[data-lab-target],[data-lab-structure],[data-lab-angle],[data-lab-world]','visual-study'],['[data-investor-choice]','comparison'],['[data-connection-choice],[data-connection-field],[data-connection-handoff]','connection'],['[data-worked-example]','example'],['[data-atlas-choice],[data-atlas-field]','venture']];
for(const eventName of ['click','input','keydown','pointerdown'])document.addEventListener(eventName,event=>{if(!(event.target instanceof Element))return;for(const [selector,kind] of controls)if(event.target.closest(selector))touched.add(kind);const exhibit=event.target.closest<HTMLElement>('[data-evidence-exhibit]');if(exhibit)lastExhibit=exhibit;},{capture:true});
function previousJourney(){try{const raw=sessionStorage.getItem(journeyKey),record=raw?validatePreparedInquiry(JSON.parse(raw)):null;return record?.items||[];}catch{return [];}}
function mergeItems(current:InquiryContextItem[]){return [...previousJourney().filter(previous=>!current.some(next=>next.kind===previous.kind)),...current].slice(-8);}
window.addEventListener('pagehide',()=>{if(handingOff||location.pathname==='/contact')return;const link=document.createElement('a'),items=mergeItems(collect(link));if(!items.length)return;try{sessionStorage.setItem(journeyKey,JSON.stringify({version:1,createdAt:Date.now(),project:'general',items}));}catch{/* Only public selections are retained; the page remains usable without tab storage. */}});
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!(event.target instanceof Element))return;
 const link=event.target.closest<HTMLAnchorElement>('a[href]');if(!link||link.target==='_blank')return;
 const url=new URL(link.href,location.origin);if(url.origin!==location.origin||url.pathname!=='/contact'||location.pathname==='/contact')return;
 const requested=url.searchParams.get('project')||'general';if(!inquiryProjects.includes(requested as InquiryProject))return;
 const items=mergeItems(collect(link));if(!items.length)return;
 event.preventDefault();prepareInquiry({project:requested as InquiryProject,items});
});
