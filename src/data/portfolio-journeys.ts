export type PortfolioJourney = {
 id:string;title:string;summary:string;question:string;
 stages:{slug:string;name:string;title:string;text:string}[];
 takeaway:string;
};

export const portfolioJourneys:PortfolioJourney[]=[
 {id:'care-understanding',title:'From care information to understanding.',summary:'Health, systems and research meet around a person’s practical next step.',question:'How could an appointment preparation question keep its meaning as it passes between a person, a coordinator and a source of information?',stages:[
  {slug:'nrth-health',name:'NRTH Health',title:'Begin with the person’s task.',text:'Describe the question before the visit: the place, timing, preparation or administrative support someone needs. The first useful record is the question itself, expressed in language the person understands.'},
  {slug:'nrth-systems',name:'NRTH Systems',title:'Give the answer an owner.',text:'Identify the approved information source, the people who may use it and the way a correction reaches the experience. An answer needs its context, access boundary and update responsibility.'},
  {slug:'nrth-labs',name:'NRTH Labs',title:'Examine whether it is understood.',text:'A focused, non-clinical study can observe whether people find the relevant information and understand the intended administrative next step. That evidence can challenge the design before the question becomes a wider implementation.'},
 ],takeaway:'A useful thread links the person’s question, the responsibility behind an answer and evidence about understanding.'},
 {id:'movement-reality',title:'When a movement plan meets reality.',summary:'Four mobility perspectives explain a changing commitment.',question:'What does an operations team need to understand when a planned movement changes?',stages:[
  {slug:'nrth-tms',name:'NRTH TMS',title:'Make the commitment explicit.',text:'Start with the job, agreed windows, equipment requirements and downstream commitments. Keep confirmed arrangements distinct from questions that still need a response.'},
  {slug:'nrth-fleet',name:'NRTH Fleet',title:'Understand the resource behind it.',text:'The selected resource brings its own availability, suitability and responsibilities. A readiness discussion needs a named owner and the information that person can responsibly confirm.'},
  {slug:'nrth-telematics',name:'NRTH Telematics',title:'Place an observation in context.',text:'Read vehicle activity beside the assigned job and the time of the observation. An older location, missing interval or observed stop should retain its uncertainty rather than silently become a new commitment.'},
  {slug:'nrth-logistics',name:'NRTH Logistics',title:'Carry the change across the handoff.',text:'Identify the partner or receiving team affected by the revision, what they need to know and how the accepted change returns to the planning owner. The loop closes with a clear responsibility, not another disconnected notification.'},
 ],takeaway:'A change becomes actionable when the plan, the resource, the evidence and the receiving responsibility remain connected.'},
 {id:'question-gathering',title:'From a material question to a shared idea.',summary:'Materials, experiments and gatherings offer different ways to develop a question.',question:'How could a material application become a focused investigation and a useful conversation?',stages:[
  {slug:'nrth-chemicals',name:'NRTH Chemicals',title:'Describe what the material must do.',text:'Begin with the application and the conditions that matter: the required behaviour, the source of the requirement and the evidence already available. A material name alone does not define a useful comparison.'},
  {slug:'nrth-labs',name:'NRTH Labs',title:'Make one uncertainty examinable.',text:'Frame a limited question and the observations that could inform it. Record the expertise, method and conditions needed before proposing an experiment; the aim is a decision informed by suitable evidence.'},
  {slug:'nrth-events',name:'NRTH Events',title:'Give the question a shared setting.',text:'A workshop, demonstration or conversation can bring different perspectives around the emerging idea. The format should explain what is known, leave room for questions and give the exchange an understandable purpose.'},
  {slug:'nrth-systems',name:'NRTH Systems',title:'Keep the exchange coherent.',text:'Consider the information and responsibilities behind the gathering: the source of the material being shared, the audience’s access needs and the route for an unanswered question afterward.'},
 ],takeaway:'The application gives the investigation a purpose; the shared setting gives the idea a chance to meet a different perspective.'},
];
