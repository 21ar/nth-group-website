export {};
const root=document.querySelector<HTMLElement>('[data-partnership-brief]');
if(root){
 const form=root.querySelector<HTMLFormElement>('[data-brief-form]')!;
 const status=root.querySelector<HTMLElement>('[data-brief-status]')!;
 const titles:Record<string,string>={challenge:'A challenge to solve.',experiment:'An idea to test.',experience:'An experience to create.'};
 const prompts:Record<string,string>={challenge:'Start with the work that feels harder than it should. Who encounters it, and what would a better outcome change?',experiment:'Name the assumption you would like to examine. What evidence would help you decide whether to take the idea further?',experience:'Start with why people should gather. Who is it for, and what should they take away from the experience?'};
 form.hidden=false;
 const read=()=>{const data=new FormData(form);return {direction:String(data.get('direction')),venture:String(data.get('venture')),contribution:String(data.get('contribution')),timing:String(data.get('timing')),question:String(data.get('question')).trim()};};
 function text(){const v=read();return `Partnership outline — NRTH\n\nStarting point: ${titles[v.direction]}\nConnection: ${v.venture}\nPerspective: ${v.contribution}\nTiming: ${v.timing}\n\n${v.question||'The possibility: to be discussed.'}`;}
 function update(){const v=read();root!.querySelector('[data-brief-title]')!.textContent=titles[v.direction];root!.querySelector('[data-brief-prompt]')!.textContent=prompts[v.direction];for(const key of ['venture','contribution','timing'] as const)root!.querySelector(`[data-brief-${key}]`)!.textContent=v[key];root!.querySelector('[data-brief-question-preview]')!.textContent=v.question||'Add your idea to complete this outline.';status.textContent='';}
 form.addEventListener('input',update);
 form.addEventListener('change',event=>{if((event.target as HTMLInputElement).name==='direction'){const panel=root.querySelector('.brief-preview')!;panel.classList.remove('is-changing');requestAnimationFrame(()=>panel.classList.add('is-changing'));}});
 form.addEventListener('reset',()=>requestAnimationFrame(update));
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;try{sessionStorage.setItem('nrth-partnership-brief',JSON.stringify({version:1,message:text(),createdAt:Date.now()}));location.assign('/contact?project=partnership&brief=prepared');}catch{status.textContent='This browser could not transfer your brief. Save or copy it here, then open an inquiry.';}});
 root.querySelector('[data-brief-save]')!.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([text()],{type:'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='nrth-partnership-outline.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Your partnership outline was saved as a text file.';});
 root.querySelector('[data-brief-copy]')!.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text());status.textContent='Your outline is copied.';}catch{status.textContent='Copy is unavailable here. You can save a text copy instead.';}});
 update();
}
