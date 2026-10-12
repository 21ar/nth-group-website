export const inquiryProjects=['general','partnership','investor','nrth-health','nrth-tms','nrth-telematics','nrth-logistics','nrth-systems','nrth-labs','nrth-chemicals','nrth-fleet','nrth-events'] as const;
export type InquiryProject=typeof inquiryProjects[number];
export const contextKinds=['industry','venture','perspective','scenario','example','connection','visual-study','comparison','research-outline','partnership-outline','work-study'] as const;
export type ContextKind=typeof contextKinds[number];
export type InquiryContextItem={kind:ContextKind;label:string;value:string};
export type PreparedInquiry={version:1;createdAt:number;project:InquiryProject;items:InquiryContextItem[];draftMessage?:string};
export const inquiryContextKey='nrth-prepared-inquiry';
export const inquiryContextTTL=3600000;
const string=(value:unknown,max:number)=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
export function validatePreparedInquiry(input:unknown,now=Date.now()):PreparedInquiry|null{
 if(!input||typeof input!=='object')return null;const value=input as PreparedInquiry;
 if(value.version!==1||!Number.isFinite(value.createdAt)||value.createdAt>now||now-value.createdAt>=inquiryContextTTL||!inquiryProjects.includes(value.project)||!Array.isArray(value.items)||value.items.length>8)return null;
 if(!value.items.every(item=>item&&contextKinds.includes(item.kind)&&string(item.label,140)&&string(item.value,700)))return null;
 if(value.draftMessage!==undefined&&(!string(value.draftMessage,4500)))return null;
 // Rebuild the object: unknown keys and arbitrary nested data never travel onward.
 return {version:1,createdAt:value.createdAt,project:value.project,items:value.items.map(item=>({kind:item.kind,label:item.label.trim(),value:item.value.trim()})),...(value.draftMessage?{draftMessage:value.draftMessage.trim()}: {})};
}
export function preparedInquiryText(context:PreparedInquiry):string{
 const selection=context.items.length?'My starting point at NRTH\n\n'+context.items.map(item=>`${item.label}: ${item.value}`).join('\n\n'):'';
 return [context.draftMessage,selection].filter(Boolean).join('\n\n').slice(0,4500);
}
