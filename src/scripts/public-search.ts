import {searchRecords,searchTypes,searchTypeLabels,type SearchRecord} from '../data/search-engine';
let index:Promise<SearchRecord[]>|undefined;
function records(){return index ||= fetch('/search-index.json',{credentials:'omit'}).then(async response=>{
 if(!response.ok)throw new Error('Index unavailable');const payload=await response.json();
 if(payload.version!==1||!Array.isArray(payload.records))throw new Error('Invalid index');
 return payload.records.filter((record:SearchRecord)=>record&&searchTypes.includes(record.type)&&typeof record.title==='string'&&typeof record.description==='string'&&Array.isArray(record.aliases)&&record.aliases.every(value=>typeof value==='string')&&typeof record.url==='string'&&record.url.startsWith('/')&&!record.url.startsWith('//')&&!/^\/(preview|api|404)(\/|$)/.test(record.url)) as SearchRecord[];
}).catch(error=>{index=undefined;throw error;});}
const dialog=document.querySelector<HTMLDialogElement>('[data-search-dialog]');
const opener=document.querySelector<HTMLAnchorElement>('[data-search-open]');
const interfaces=[...document.querySelectorAll<HTMLElement>('[data-public-search]')];
for(const root of interfaces){
 const input=root.querySelector<HTMLInputElement>('[data-public-search-input]')!,result=root.querySelector<HTMLElement>('[data-public-search-results]')!,status=root.querySelector<HTMLElement>('[data-public-search-status]')!;
 const filters=[...root.querySelectorAll<HTMLButtonElement>('[data-search-type]')];let type:typeof searchTypes[number]='all',request=0,timer:ReturnType<typeof setTimeout>|undefined;
 async function update(){
  const current=++request;status.textContent='Finding the relevant perspectives…';
  try{
   const all=await records();if(current!==request)return;
   const matches=searchRecords(all,input.value,type,100),visible=matches.slice(0,24);
   result.replaceChildren(...visible.map(record=>{
    const item=document.createElement('li'),link=document.createElement('a'),kind=document.createElement('span'),title=document.createElement('strong'),description=document.createElement('p');
    link.href=record.url;link.dataset.searchResult=record.type;kind.className='search-result-kind';kind.textContent=searchTypeLabels[record.type];title.textContent=record.title;description.textContent=record.description;link.append(kind,title,description);item.append(link);return item;
   }));
   status.textContent=matches.length?`${matches.length} ${matches.length===1?'result':'results'}${matches.length>24?'. Showing the first 24.':'.'}`:'No matches yet. Try a broader question, another word or Everything.';
   root.querySelectorAll<HTMLElement>('[data-search-enhanced]').forEach(element=>element.hidden=false);
   const directory=document.querySelector<HTMLDetailsElement>('[data-search-directory]');if(root.hasAttribute('data-search-page')&&directory)directory.open=false;
  }catch{if(current!==request)return;status.textContent='Search could not load. Use the public directory to explore every section.';result.replaceChildren();}
 }
 input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>void update(),90);});
 filters.forEach(button=>button.addEventListener('click',()=>{const requested=button.dataset.searchType as typeof searchTypes[number];if(!searchTypes.includes(requested))return;type=requested;filters.forEach(filter=>filter.setAttribute('aria-pressed',String(filter===button)));void update();}));
 input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){const first=result.querySelector<HTMLAnchorElement>('a');if(first){event.preventDefault();first.focus();}}});
 root.addEventListener('click',event=>{const resultLink=(event.target as Element).closest<HTMLAnchorElement>('[data-search-result]');if(resultLink)window.dispatchEvent(new CustomEvent('nrth:discovery',{detail:{action:'search_result_opened',type:resultLink.dataset.searchResult}}));});
 if(root.hasAttribute('data-search-page'))void update();
 else dialog?.addEventListener('nrth:search-open',()=>void update());
}
if(dialog&&opener&&typeof dialog.showModal==='function'){
 opener.addEventListener('click',event=>{event.preventDefault();const menu=document.querySelector<HTMLDetailsElement>('[data-site-menu]');if(menu)menu.open=false;requestAnimationFrame(()=>{dialog.showModal();dialog.dispatchEvent(new Event('nrth:search-open'));dialog.querySelector<HTMLInputElement>('input')?.focus({preventScroll:true});document.documentElement.classList.add('search-open');});});
 dialog.querySelector('[data-search-close]')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();dialog.close();}},{capture:true});
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{document.documentElement.classList.remove('search-open');opener.focus({preventScroll:true});});
 document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key==='k'&&!event.altKey&&!dialog.open){event.preventDefault();opener.click();}});
}
