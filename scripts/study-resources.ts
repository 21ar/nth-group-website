import {mkdir,writeFile} from 'node:fs/promises';
import {designStudies,studyTitle} from '../src/data/design-studies';
import {industryStories,industryBriefs} from '../src/data/industry-stories';
import {industryExhibits} from '../src/data/industry-exhibits';
const directory='public/resources/studies';
await mkdir(directory,{recursive:true});
const scope='These are records of implemented website design work. Synthetic examples are illustrative. No customer, clinical, laboratory or event outcomes are reported.';
for(const study of designStudies){
 const record={schemaVersion:1,recordType:'illustrative-website-design-study',...study,title:studyTitle(study),scope,canonical:'https://nrth.group/work/'+study.slug};
 await writeFile(directory+'/'+study.slug+'-record.json',JSON.stringify(record,null,2)+'\n');
 const parts=[
  'NRTH / DESIGN STUDY WORKSHEET',studyTitle(study),study.subtitle,'Recorded: '+study.date,'Reviewed: '+study.reviewedAt,'https://nrth.group/work/'+study.slug,'',scope,'',
  'THE QUESTION',study.question,'','YOUR CONTEXT','What task or application are you considering?\n\nWhat decision would this question inform?\n\nWhich conditions need to remain in view?\n',
  'WHAT THE ARTIFACT SUPPORTS',...study.supports.map(text=>'- '+text),'','LIMITS TO RETAIN',...study.limits.map(text=>'- '+text),'',
  'A PRACTICAL REVIEW',...study.nextReview.map((text,i)=>(i+1)+'. '+text+'\n\nYour observation:\n'),'OBSERVATION AND INTERPRETATION','What was actually observed?\n\nUnder which conditions?\n\nWhat might it mean?\n\nWhat remains unresolved?\n',
  'THE NEXT DECISION','Continue, revise or stop?\n\nWhat evidence supports that choice?\n\nWho owns the next step?\n',
  'RETURN TO THE ARTIFACT','https://nrth.group'+study.artifact.href,'','PREPARE A CONVERSATION','Share descriptions or redacted examples you are able to disclose. Do not include personal health information or confidential documents in the general inquiry form.','https://nrth.group/contact?project='+study.ventures[0]+'&topic='+encodeURIComponent('Design study: '+studyTitle(study)),
 ];
 await writeFile(directory+'/'+study.slug+'-worksheet.txt',parts.join('\n')+'\n');
}
for(const story of industryStories){
 const brief=industryBriefs[story.slug];
 const parts=['NRTH / '+story.name.toUpperCase()+' CONTEXT WORKSHEET','https://nrth.group/industries/'+story.slug,'',brief.question,'',
  'YOUR DECISION','What needs to be decided?\n\nWho can make that decision?\n\nWhich condition could change it?\n','USEFUL CONTEXT',
  ...brief.exhibits.flatMap((exhibit,i)=>[(i+1)+'. '+exhibit.title,'Bring: '+exhibit.bring,'Clarify: '+exhibit.clarify,'Example to inspect: '+industryExhibits[story.slug][i].title,'Your description or redacted example:\n']),
  'REVIEW LENSES',...brief.review.flatMap(review=>[review.title,review.text,'Your observation:\n']),
  'WHAT REMAINS UNCONFIRMED','Evidence still needed:\n\nRelevant expertise:\n\nNext responsible role:\n','THE EXAMPLE’S LIMIT',scope,'The diagrams show information and responsibility. They do not establish product availability, actual integrations, material suitability or operational outcomes.','',
  'NEXT CONVERSATION','https://nrth.group/contact?project='+story.contact+'&topic='+encodeURIComponent(story.name+': a first conversation'),
 ];
 await writeFile(directory+'/'+story.slug+'-context-worksheet.txt',parts.join('\n')+'\n');
}
await writeFile(directory+'/design-study-reference.txt',['NRTH / PUBLIC DESIGN STUDY REFERENCE','Record date: 2026-10-12','https://nrth.group/work','',scope,'',...designStudies.flatMap(study=>[studyTitle(study),study.description,'Question: '+study.question,'Artifact: https://nrth.group'+study.artifact.href,'Record: https://nrth.group/work/'+study.slug,'Worksheet: https://nrth.group/resources/studies/'+study.slug+'-worksheet.txt',''])].join('\n')+'\n');
console.log('Generated 15 documented study resources.');
