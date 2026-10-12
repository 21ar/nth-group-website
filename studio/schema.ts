import {defineField,defineType} from 'sanity';
const ventures = ['nrth-health','nrth-tms','nrth-telematics','nrth-logistics','nrth-systems','nrth-labs','nrth-chemicals','nrth-fleet','nrth-events'];
const fields = ['Health','Mobility','Systems','Materials','Events','Research'];
const text = (name: string, title: string, rows = 3) => defineField({name,title,type:'text',rows,validation:Rule=>Rule.required()});
const pairs = (name: string, title: string) => defineField({name,title,type:'array',of:[{type:'object',fields:[defineField({name:'title',type:'string',validation:Rule=>Rule.required()}),text('text','Description')]}],validation:Rule=>Rule.min(3).max(3)});
const opening = (name: string, title: string) => defineField({name,title,type:'object',fields:[defineField({name:'label',type:'string',validation:Rule=>Rule.required()}),defineField({name:'lines',title:'Headline lines',type:'array',of:[{type:'string'}],validation:Rule=>Rule.required().length(2)}),text('copy','Supporting copy'),...(name === 'investors' ? [defineField({name:'link',title:'Link label',type:'string'})] : [])]});
export const schemaTypes = [
  defineType({name:'venture',title:'Ventures',type:'document',fields:[
    defineField({name:'slug',title:'Venture identity',type:'string',options:{list:ventures},validation:Rule=>Rule.required()}),
    defineField({name:'headline',title:'Headline',type:'string',validation:Rule=>Rule.required().max(100)}),
    text('description','Search & overview description',2),text('introduction','Introduction'),text('statement','Core perspective',2),
    defineField({name:'audience',title:'Audience',type:'array',of:[{type:'string'}],validation:Rule=>Rule.min(1).max(5)}),
    pairs('capabilities','Three focus areas'),pairs('journey','Three workflow stages'),text('connection','Related venture context'),
    defineField({name:'stage',title:'Confirmed development stage',type:'string',initialValue:'overview',description:'Choose a factual, owner-confirmed stage. Website concept demonstrations do not establish product availability.',options:{list:[{title:'Overview / discuss availability',value:'overview'},{title:'Research',value:'research'},{title:'Prototype',value:'prototype'},{title:'Pilot',value:'pilot'},{title:'Available',value:'available'}]}}),
    defineField({name:'reviewedAt',title:'Stage reviewed on',type:'date',validation:Rule=>Rule.custom((value,context)=>context.document?.stage && context.document.stage !== 'overview' && !value ? 'Add the date this stage was confirmed.' : true)}),
    defineField({name:'productUrl',title:'Confirmed product URL',type:'url',validation:Rule=>Rule.uri({scheme:['https']})}),
    defineField({name:'demoUrl',title:'Approved demonstration URL',type:'url',validation:Rule=>Rule.uri({scheme:['https']})}),
    defineField({name:'coverImage',title:'Cover artwork or approved product image',type:'image',options:{hotspot:true}}),
    defineField({name:'coverAlt',title:'Image description',type:'string',validation:Rule=>Rule.custom((value,context)=>context.document?.coverImage && !value ? 'Describe the image for accessibility.' : true)}),
  ],preview:{select:{title:'slug',subtitle:'stage',media:'coverImage'}}}),
  defineType({name:'industry',title:'Industry story',type:'document',fields:[defineField({name:'name',title:'Field',type:'string',options:{list:fields},validation:Rule=>Rule.required()}),defineField({name:'title',title:'Two headline lines',type:'array',of:[{type:'string'}],validation:Rule=>Rule.required().length(2)}),text('copy','Story copy')]}),
  defineType({name:'siteSettings',title:'Company & homepage',type:'document',fields:[opening('opening','Homepage opening'),opening('investors','Investor introduction'),defineField({name:'companyFacts',title:'Approved company facts',type:'array',of:[{type:'object',fields:[defineField({name:'label',type:'string',validation:Rule=>Rule.required()}),defineField({name:'value',type:'string',validation:Rule=>Rule.required()})]}]})],preview:{prepare:()=>({title:'NRTH / Company & homepage'})}}),
  defineType({name:'article',title:'Journal',type:'document',fields:[
    defineField({name:'title',type:'string',validation:Rule=>Rule.required()}),defineField({name:'slug',type:'slug',options:{source:'title'},validation:Rule=>Rule.required()}),defineField({name:'category',type:'string',options:{list:['Perspective',...fields]},validation:Rule=>Rule.required()}),text('description','Summary',2),
    defineField({name:'author',type:'string',initialValue:'NRTH Editorial',validation:Rule=>Rule.required()}),defineField({name:'publishedAt',title:'Publication date',type:'date',validation:Rule=>Rule.required()}),
    defineField({name:'paragraphs',title:'Article paragraphs',type:'array',of:[{type:'text',rows:5}],validation:Rule=>Rule.required().min(2)}),
    defineField({name:'prompts',title:'Practical takeaways',type:'array',of:[{type:'string'}]}),defineField({name:'related',title:'Related ventures',type:'array',of:[{type:'string',options:{list:ventures}}]}),
  ]}),
  defineType({name:'milestone',title:'Published milestones',type:'document',fields:[defineField({name:'title',type:'string',validation:Rule=>Rule.required()}),defineField({name:'date',type:'date',validation:Rule=>Rule.required()}),text('text','What happened'),defineField({name:'venture',type:'string',options:{list:ventures}}),defineField({name:'source',title:'Internal evidence / reviewer',type:'text',description:'For editorial review only. This field is not sent to the public website.'})]}),
];
