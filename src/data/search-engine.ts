export const searchTypes = ['all','venture','industry','writing','research','resource','company'] as const;
export type SearchType = Exclude<typeof searchTypes[number],'all'>;
export type SearchRecord = {id:string;type:SearchType;title:string;description:string;url:string;aliases:string[]};
export const searchTypeLabels: Record<typeof searchTypes[number], string> = {all:'Everything',venture:'Ventures',industry:'Industries',writing:'Writing',research:'Research',resource:'Resources',company:'Company'};
export function normalizeSearch(value:string) {return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
export function searchRecords(records:SearchRecord[], query:string, type:typeof searchTypes[number]='all', limit=24):SearchRecord[] {
 const normalized=normalizeSearch(query.slice(0,120)),tokens=normalized.split(' ').filter(Boolean);
 return records.filter(record=>type==='all'||record.type===type).map(record=>{
  const title=normalizeSearch(record.title),aliases=record.aliases.map(normalizeSearch),description=normalizeSearch(record.description);
  const words=title+' '+aliases.join(' ')+' '+description;
  if(!tokens.every(token=>words.includes(token)))return {record,score:-1};
  let score=normalized?(title===normalized?100:title.startsWith(normalized)?60:title.includes(normalized)?40:0):0;
  for(const token of tokens) score+=title.split(' ').includes(token)?15:title.includes(token)?8:aliases.some(alias=>alias.includes(token))?6:1;
  return {record,score};
 }).filter(item=>item.score>=0).sort((a,b)=>b.score-a.score||records.indexOf(a.record)-records.indexOf(b.record)).slice(0,Math.max(1,Math.min(limit,100))).map(item=>item.record);
}
