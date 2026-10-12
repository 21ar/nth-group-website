export type EditorialModelKind = 'company' | 'approach' | 'partnership';
export type EditorialLens = {key:string;title:string;description:string;output:string;test:string;};

export const editorialModels:Record<EditorialModelKind,{label:string;title:string;description:string;lenses:EditorialLens[]}> = {
 company:{
  label:'How NRTH fits together',title:'Distinct work.\nA shared outlook.',description:'Explore three ways to read the portfolio. The structure connects ideas while leaving room for the expertise each field needs.',
  lenses:[
   {key:'identity',title:'One company identity.',description:'NRTH Inc. is the company. NRTH is the shared name across the portfolio, and nrth.group is the place to explore it.',output:'A recognizable name and a consistent way to introduce each direction.',test:'A shared identity should make the portfolio easier to understand, without implying that every venture offers the same thing.'},
   {key:'ventures',title:'Room for specific work.',description:'Nine venture identities describe different subjects: care, transport, vehicle signals, logistics, software, research, materials, fleet resources and events.',output:'A clear subject, an intended audience and a focused question for each venture.',test:'An industry needs its own context. A promising idea in one field is a starting point for investigation in another.'},
   {key:'questions',title:'Knowledge that can travel.',description:'Information, coordination, trust and experimentation recur across the portfolio. Those connections create useful conversations between otherwise different disciplines.',output:'Questions and methods that can inform more than one venture.',test:'Keep the connection when it improves the work. Change the method when the people, evidence or constraints are different.'},
  ],
 },
 approach:{
  label:'From interest to a decision',title:'A question takes\nshape through evidence.',description:'Open a stage to see what it should produce and what makes the next step worth taking. The path can move backward when a result changes the question.',
  lenses:[
   {key:'frame',title:'Frame the right question.',description:'Describe the task, the person trying to complete it and the point where the current approach becomes difficult. Separate what is observed from what is assumed.',output:'A short problem statement, a view of the current workflow and the uncertainty that matters most.',test:'Would answering this question change a real decision? If not, make it smaller or connect it to a clearer purpose.'},
   {key:'investigate',title:'Choose a useful test.',description:'Match the method to the uncertainty: a conversation for context, an interface prototype for comprehension, a process map for handoffs or a technical study for feasibility.',output:'A bounded investigation with relevant participants or evidence, clear observations and recorded limits.',test:'Can the method reveal that the original idea is wrong? A useful test makes room for an unexpected result.'},
   {key:'decide',title:'Read what changed.',description:'Compare the observations with the starting assumptions. Identify what is supported, what is still uncertain and which practical constraints need another perspective.',output:'A decision to continue, revise, investigate further or set the idea aside, with the reasons attached.',test:'Does the evidence support the size of the claim? Early learning should not be presented as proof of a complete product.'},
   {key:'scope',title:'Give the next step edges.',description:'Define the purpose, responsibilities, information requirements and conditions for a follow-on effort. Timing and commercial terms belong to that specific opportunity.',output:'A proposed scope, the people responsible for it and the criteria for reviewing the result.',test:'Can everyone explain what is included, what is unresolved and what would make the next step successful?'},
  ],
 },
 partnership:{
  label:'Different expertise, a useful connection',title:'Bring a perspective.\nFind common ground.',description:'A collaboration becomes more specific when the contribution and the question are visible. Explore the kinds of perspective that can meet an NRTH direction.',
  lenses:[
   {key:'operations',title:'Experience of the work.',description:'Operators, care teams, logistics coordinators and other practitioners see details that are difficult to discover from the outside. Bring the decisions, exceptions and handoffs you know well.',output:'An honest picture of the current task, who encounters it and where a different approach could matter.',test:'Useful context includes the awkward cases and constraints, rather than only an idealized workflow.'},
   {key:'technical',title:'Expertise in the possibility.',description:'Software, vehicle systems, materials and research each need evidence appropriate to their field. Bring a method, a technical question or expertise that can make an assumption testable.',output:'A focused uncertainty and the information, capability or study that could help examine it.',test:'Be clear about what has been demonstrated, what remains theoretical and what review would be required.'},
   {key:'experience',title:'Intention for an experience.',description:'Creative and production perspectives can connect the purpose of a gathering with its format, rhythm and practical requirements. Begin with the people and the moment you want to create.',output:'A shared purpose, an audience context and a view of the production conditions.',test:'A distinctive experience still needs a clear reason to exist and a practical way to deliver it.'},
  ],
 },
};
