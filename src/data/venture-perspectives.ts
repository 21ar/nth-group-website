export type VenturePerspective = {
 kind:string;graphic:string;question:string;audience:string[];lens:string;
 focus:{bring:string;shape:string;review:string}[];
 preparation:{title:string;text:string}[];
 connection:string;related:Record<string,string>;
};

export const venturePerspectives:Record<string,VenturePerspective>={
 'nrth-health':{
  kind:'health',graphic:'Information follows the question.',question:'What would make the next step easier to understand?',
  audience:['People navigating health information','Care coordination teams','Organizations exploring better access'],
  lens:'Comprehension is part of the experience. Begin with the question a person is actually asking, then examine how information, access and responsibility support the answer.',
  focus:[
   {bring:'A representative question and the information someone sees while trying to answer it.',shape:'An information hierarchy separating the immediate answer, supporting context and appropriate next step.',review:'Can someone explain the meaning in their own words without losing an important qualification?'},
   {bring:'One coordination task, including the point at which responsibility changes hands.',shape:'A handoff description keeping the outstanding question, relevant information and next owner together.',review:'Does the receiving person understand what remains unresolved and who can resolve it?'},
   {bring:'The intended setting, user roles, device conditions and information sensitivity.',shape:'An access brief recording the boundaries the experience must respect.',review:'What evidence, professional input or review would this intended use require before it could be offered?'},
  ],
  preparation:[{title:'Describe the moment',text:'Choose a specific question, the setting where it arises and the people who encounter it. Use an anonymized example rather than personal health records.'},{title:'Show the information',text:'Bring a redacted document or describe the screens, terminology and decisions involved. Include what is confusing or missing.'},{title:'Name the intended use',text:'Explain whether the discussion concerns information design, coordination or another use. That determines the appropriate expertise and evidence.'}],
  connection:'Health questions can create software and research questions at the same time. Keeping the person’s experience visible helps those conversations stay connected.',
  related:{'nrth-systems':'The permissions, responsibilities and interfaces surrounding a health information task.','nrth-labs':'A focused study of comprehension, access or an uncertain interaction.'},
 },
 'nrth-tms':{
  kind:'mobility',graphic:'From commitment to movement.',question:'Can the commitment become a workable assignment?',
  audience:['Transportation planners','Dispatch and operations teams','Organizations coordinating shipments'],
  lens:'A request, a plan and an assignment are different states of the same job. Their constraints and owners need to stay visible when one becomes the next.',
  focus:[
   {bring:'A movement request with collection and delivery windows, capacity needs and access conditions.',shape:'A planning brief separating fixed constraints from choices the team can negotiate.',review:'Which resource and timing assumptions still need confirmation before the job can be assigned?'},
   {bring:'The people approving, assigning and communicating a job, plus one example of a changed plan.',shape:'A decision path showing who can approve the change and what context reaches dispatch.',review:'Does the assignment retain the original commitment, and can a later change reach its owner?'},
   {bring:'An exception that requires a decision, including the information available at that moment.',shape:'An exception definition with an affected commitment, responsible person and possible next action.',review:'Would this information change a decision, or merely create another notification?'},
  ],
  preparation:[{title:'Bring a representative job',text:'Describe the freight, windows, access requirements and resource assumptions. An anonymized job is sufficient to begin.'},{title:'Follow one change',text:'Show what happens when timing or availability changes: who notices, who approves and who communicates the revision.'},{title:'Choose the decision',text:'Identify the planning decision that deserves a clearer answer before discussing screens, integrations or an extensive feature list.'}],
  connection:'Transportation planning sits between a commitment and the resources needed to meet it. The adjacent ventures introduce observations, readiness and partner coordination.',
  related:{'nrth-telematics':'The observations that can change confidence in the transportation plan.','nrth-fleet':'The suitability and readiness of the resources behind an assignment.','nrth-logistics':'The partner commitments and handoffs before and after the movement.'},
 },
 'nrth-telematics':{
  kind:'mobility',graphic:'An observation finds context.',question:'What can this observation actually tell us?',
  audience:['Vehicle operations teams','People interpreting vehicle activity','Technical and transport partners'],
  lens:'A signal gains meaning through its source, freshness and relationship to the work. Making those conditions visible is as useful as displaying the observation itself.',
  focus:[
   {bring:'The signal source, update pattern and known gaps or uncertainty.',shape:'A signal definition keeping the observation, its timestamp and its limitations together.',review:'Can someone distinguish what was observed from what is inferred, including an older or missing signal?'},
   {bring:'One operating question and the job or commitment the vehicle activity relates to.',shape:'A context map linking an observation to the work it may help explain.',review:'What additional information would be required before drawing an operational conclusion?'},
   {bring:'The decision that should follow a meaningful signal, and the person able to make it.',shape:'An action brief describing when a signal merits attention and when it does not.',review:'Does the proposed connection help someone act, with a clear path when the information is insufficient?'},
  ],
  preparation:[{title:'Describe the source',text:'State what is observed, how it is obtained and when it updates. A signal definition is more useful initially than a large raw data export.'},{title:'Attach the operating question',text:'Explain which task or commitment the observation could inform, along with the other context a team uses.'},{title:'Include an imperfect case',text:'Bring an example of stale, missing or ambiguous information. Its handling helps define whether the direction could be useful.'}],
  connection:'Signals, plans and readiness describe different sides of vehicle activity. Their relationship matters without assuming an existing technical integration.',
  related:{'nrth-tms':'The job and timing commitments that give a vehicle observation operational context.','nrth-fleet':'The resources and responsibilities behind the vehicle activity.','nrth-systems':'The source boundaries and information contracts needed to interpret a signal responsibly.'},
 },
 'nrth-logistics':{
  kind:'mobility',graphic:'The next step has an owner.',question:'What must stay clear when the work changes hands?',
  audience:['Logistics coordinators','Transport and receiving partners','Teams managing operational handoffs'],
  lens:'Movement is a chain of expectations. A useful handoff preserves the commitment, the necessary information and the person who owns what happens next.',
  focus:[
   {bring:'A movement with partner requirements, timing dependencies and confirming parties.',shape:'A dependency map showing which commitment relies on another being fulfilled.',review:'Which dependency could interrupt the work, and how would the team discover that in time?'},
   {bring:'One handoff and the messages, documents or status changes accompanying it.',shape:'A handoff agreement describing what is transferred, what is accepted and what remains open.',review:'Can both sides tell who owns the next step without reconstructing the whole conversation?'},
   {bring:'A breakdown or disputed expectation, including the sequence before it occurred.',shape:'An exception account distinguishing missing information from unclear responsibility.',review:'What change would address the cause, and how would the next handoff demonstrate that it helped?'},
  ],
  preparation:[{title:'Follow the commitment',text:'Begin with the promise being made, then follow the people and partners whose work supports it.'},{title:'Bring one handoff',text:'Describe what the sending and receiving parties each need to know. Use redacted examples of documents or communications.'},{title:'Explain the awkward case',text:'Show a delayed, incomplete or disputed handoff. That often exposes the missing agreement more clearly than an ideal process.'}],
  connection:'A handoff can involve a transport plan, a resource and a software boundary. The wider portfolio helps keep those related questions in view.',
  related:{'nrth-tms':'The assignment and timing decisions that create the next logistics commitment.','nrth-fleet':'The resource responsibilities that can influence a handoff.','nrth-systems':'The ownership and exchange of information between teams and tools.'},
 },
 'nrth-systems':{
  kind:'systems',graphic:'Boundaries make connections useful.',question:'Where does the work need a clearer boundary?',
  audience:['Teams navigating complex workflows','Organizations joining tools and information','Technical collaborators'],
  lens:'A useful system makes the important rules understandable. The interface, information contract and operational responsibility should describe the same work.',
  focus:[
   {bring:'The systems or teams involved and one exchange of information between them.',shape:'A boundary description covering ownership, access, accepted inputs and failure conditions.',review:'Can each side explain what it guarantees, what it expects and what happens when that expectation is unmet?'},
   {bring:'A task someone performs, including an unusual state or recovery step.',shape:'A task model connecting the interface to the decision, rather than only the available data.',review:'Can the person complete, correct and resume the task without losing context?'},
   {bring:'A likely change, the people maintaining the system and the evidence they need during operation.',shape:'A change brief recording dependencies, observable outcomes and a practical recovery path.',review:'Could the next team understand the purpose, detect a problem and change the affected part with confidence?'},
  ],
  preparation:[{title:'Choose a real task',text:'Describe who performs it, why it matters and where the current process becomes uncertain.'},{title:'Sketch the boundaries',text:'List the tools, responsibilities and information exchanges around the task. Avoid credentials or production data.'},{title:'Bring a change or failure',text:'Show what happens when input is missing, permission changes or a dependency stops behaving as expected.'}],
  connection:'Systems questions arise wherever information meets a real task. The adjacent ventures supply distinct human, operational and experimental contexts.',
  related:{'nrth-labs':'A small experiment testing an uncertain technical or interaction assumption.','nrth-health':'The human context, appropriate access and comprehension around health information.','nrth-telematics':'The freshness, provenance and meaning of observations moving across a boundary.'},
 },
 'nrth-labs':{
  kind:'research',graphic:'One question. Many possibilities.',question:'Which unknown would change the next decision?',
  audience:['People with an early question','Technical and creative collaborators','Organizations examining a new direction'],
  lens:'An experiment earns its complexity by answering something specific. The useful outcome is a better decision, including a reason to change the question or stop.',
  focus:[
   {bring:'An idea, its most uncertain assumption and the decision depending on that assumption.',shape:'A bounded question with plausible answers that would lead to different next steps.',review:'Would learning the answer change what happens next, or only add information?'},
   {bring:'The conditions that matter, available evidence and the limits of a possible study.',shape:'An experiment outline with a method, observable result and explicit exclusions.',review:'Can the proposed method distinguish between plausible answers without pretending to validate the entire idea?'},
   {bring:'Observations, the conditions under which they were made and anything unexpected.',shape:'A learning note separating the evidence, its interpretation and the next commitment.',review:'What can be concluded, what remains uncertain and should the direction continue, change or stop?'},
  ],
  preparation:[{title:'Write the decision',text:'Explain what you would do differently if the question had one answer rather than another.'},{title:'Separate known and assumed',text:'Bring existing evidence and its limits. Keep an attractive idea distinct from a supported conclusion.'},{title:'Bound the first study',text:'Identify time, access and expertise constraints, then choose a question a focused investigation could reasonably address.'}],
  connection:'Early research is grounded by the context in which an idea would matter. Other NRTH directions supply practical questions rather than automatic proof of an opportunity.',
  related:{'nrth-systems':'The technical boundary or interaction a prototype would need to examine.','nrth-chemicals':'The application, material conditions and evidence around an industrial question.','nrth-health':'The comprehension and access conditions around a person’s information needs.'},
 },
 'nrth-chemicals':{
  kind:'materials',graphic:'Properties meet an application.',question:'Which conditions define a useful material direction?',
  audience:['Industrial and technical partners','Organizations describing material requirements','People examining an intended application'],
  lens:'A material question starts with its intended use. Properties, operating conditions and evidence need to stay connected before an early direction can be assessed.',
  focus:[
   {bring:'The intended application, operating environment and properties that matter to it.',shape:'An application brief separating required properties from preferences and unresolved assumptions.',review:'Which operating conditions could change the assessment, and which require specialist input?'},
   {bring:'The specification, source information and documents relevant to the proposed use.',shape:'An evidence checklist connecting each requirement to the document or test needed to assess it.',review:'Is the evidence applicable to this use, and what technical or safety questions remain unanswered?'},
   {bring:'The expertise and responsibilities needed across application, evaluation and handling.',shape:'A partner discussion brief with distinct questions for each technical and industrial role.',review:'Who is qualified to evaluate the open questions, and what is needed before a further commitment?'},
  ],
  preparation:[{title:'Define the application',text:'Describe what the material would need to do and the environment in which it would operate.'},{title:'Name the requirements',text:'Identify critical properties and the specifications or documents already available. Do not treat an early direction as a qualified offering.'},{title:'Bring the right expertise',text:'Explain the technical, industrial and handling responsibilities involved so the discussion can be scoped appropriately.'}],
  connection:'An industrial material question may lead to a focused study or a coordination question. Those links begin with the application and its requirements.',
  related:{'nrth-labs':'A bounded investigation of an application assumption, with methods and limits stated clearly.','nrth-logistics':'The coordination and handling context around a potential industrial material movement.'},
 },
 'nrth-fleet':{
  kind:'mobility',graphic:'Readiness supports the next move.',question:'Is the resource ready for the work ahead?',
  audience:['Fleet and operations teams','People responsible for vehicle readiness','Organizations planning resource capacity'],
  lens:'Availability is only one part of readiness. The assignment needs to account for suitability, responsibility and the commitments after the immediate job.',
  focus:[
   {bring:'The resource, proposed assignment and conditions determining suitability.',shape:'A readiness brief showing what is known, what needs confirmation and who owns the assessment.',review:'Does the person assigning the work have enough information to distinguish available from ready?'},
   {bring:'The responsibilities recorded during a working day and how changes move between people.',shape:'An ownership map keeping the resource, current responsibility and unresolved action together.',review:'Can the next person understand the current state without piecing together several separate updates?'},
   {bring:'The upcoming workload and commitments that could affect future availability.',shape:'A capacity conversation connecting immediate work with maintenance considerations and later assignments.',review:'Which assumptions could reduce future capacity, and when should they be revisited?'},
  ],
  preparation:[{title:'Describe the resource',text:'Explain the vehicle context, capacity requirements and suitability factors relevant to the work.'},{title:'Identify responsibility',text:'Name the people making readiness and assignment decisions, including how a change is passed between them.'},{title:'Look one commitment ahead',text:'Include a later job or maintenance consideration that could change how the immediate assignment is assessed.'}],
  connection:'Readiness supports the transportation plan, while observations and handoffs may change the operating picture. Each perspective answers a different question.',
  related:{'nrth-telematics':'The observations that help explain resource activity, with their uncertainty intact.','nrth-tms':'The requirements and timing of the assignment the resource is expected to support.','nrth-logistics':'The responsibilities and partner handoffs surrounding the vehicle’s work.'},
 },
 'nrth-events':{
  kind:'events',graphic:'Purpose shapes the rhythm.',question:'What should people take away from the gathering?',
  audience:['People planning a shared experience','Hosts and organizational partners','Creative and production collaborators'],
  lens:'The purpose of a gathering should shape its rhythm and practical decisions. Arrival, transitions and time to connect all contribute to what the experience becomes.',
  focus:[
   {bring:'The people attending, the reason for bringing them together and the exchange that should become possible.',shape:'An experience brief defining the intended takeaway and the conditions needed to support it.',review:'Would the proposed experience give the audience a reason to be there and a clear connection to its purpose?'},
   {bring:'The expected duration, key shared moments and practical access needs.',shape:'A rhythm map of arrival, participation, transitions and space for connection.',review:'Where does the experience need energy, where does it need time, and what happens between programmed moments?'},
   {bring:'The program, partners and production constraints around the gathering.',shape:'A coordination brief linking each practical decision to the audience experience it supports.',review:'Are responsibilities, timing and contingencies clear enough for the intended experience to remain coherent?'},
  ],
  preparation:[{title:'Begin with the people',text:'Describe who would attend, what brings them together and what they should take away.'},{title:'Sketch the experience',text:'Identify the moments that matter, the setting and access conditions that could shape participation.'},{title:'State the practical limits',text:'Bring timing, venue, partner and production considerations. Scope and any delivery arrangement are discussed directly.'}],
  connection:'An experience can create interaction and experimentation questions beyond the event itself. Those connections should serve the gathering’s purpose.',
  related:{'nrth-labs':'A focused prototype or study of an unfamiliar experience or shared interaction.','nrth-systems':'The information, interfaces and coordination boundaries around the gathering.'},
 },
};
