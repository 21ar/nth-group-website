function initEditorialModels(){
 document.querySelectorAll<HTMLElement>('[data-editorial-model]').forEach(root=>{
  if(root.dataset.editorialReady==='true')return;
  root.dataset.editorialReady='true';
  const lenses=Array.from(root.querySelectorAll<HTMLDetailsElement>('[data-editorial-lens]'));
  // Native grouping is the useful no-JavaScript baseline. Enhance it so closing
  // a long earlier lens keeps the reader's selected heading in the same place.
  lenses.forEach(lens=>lens.removeAttribute('name'));
  let current=lenses.find(lens=>lens.open);
  lenses.forEach(lens=>lens.addEventListener('toggle',()=>{
   if(!lens.open)return;
   const summary=lens.querySelector('summary');
   const before=summary?.getBoundingClientRect().top;
   const previous=current;
   current=lens;
   lenses.forEach(other=>{if(other!==lens&&other.open)other.open=false;});
   if(previous!==lens&&summary&&before!==undefined&&before>=0&&before<innerHeight){
    const displacement=summary.getBoundingClientRect().top-before;
    if(Math.abs(displacement)>1)window.scrollBy({top:displacement,behavior:'instant'});
   }
  }));
 });
}
initEditorialModels();
document.addEventListener('astro:page-load',initEditorialModels);
