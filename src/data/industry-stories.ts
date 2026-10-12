export type IndustryStory = {
  name: 'Mobility' | 'Health' | 'Systems' | 'Materials' | 'Events' | 'Research';
  slug: string;
  description: string;
  headline: [string, string];
  introduction: string;
  perspective: string;
  perspectiveCopy: string;
  diagram: {
    label: string;
    nodes: {id: string; label: string; x: number; y: number}[];
    paths: {id: string; d: string; nodes: string[]}[];
  };
  contexts: {id: string; title: string; situation: string; decision: string; questions: string[]; takeaway: string; ventures: string[]}[];
  details: {title: string; text: string}[];
  ventures: {slug: string; connection: string; role: string}[];
  questions: {question: string; answer: string}[];
  contact: string;
};

export const industryStories: IndustryStory[] = [
  {
    name: 'Mobility', slug: 'mobility',
    description: 'Explore the NRTH mobility perspective: transportation plans, vehicle signals, fleet readiness and logistics handoffs, with practical questions for each decision.',
    headline: ['Movement is a system.', 'Every handoff matters.'],
    introduction: 'The work starts before a vehicle moves and continues after it arrives. A useful view of mobility connects the commitment being made, the resources behind it and the people responsible when something changes.',
    perspective: 'One movement. Several decisions.',
    perspectiveCopy: 'A shipment plan, a vehicle observation and a customer commitment describe different parts of the same situation. Keeping those perspectives distinct makes their connections easier to understand. Four NRTH ventures approach the work from those different starting points.',
    diagram: {
      label: 'A mobility decision connects planning, resources, observations and the next handoff.',
      nodes: [{id:'brief',label:'Commitment',x:90,y:230},{id:'plan',label:'Plan',x:290,y:90},{id:'vehicle',label:'Readiness',x:290,y:370},{id:'signal',label:'Signals',x:480,y:90},{id:'dispatch',label:'Assignment',x:480,y:370},{id:'handoff',label:'Handoff',x:680,y:230}],
      paths: [
        {id:'shipment',d:'M90 230 C140 230 190 90 290 90 C400 90 370 370 480 370 C570 370 610 230 680 230',nodes:['brief','plan','dispatch','handoff']},
        {id:'readiness',d:'M290 370 C350 370 410 370 480 370 C580 370 590 230 680 230',nodes:['vehicle','dispatch','handoff']},
        {id:'change',d:'M480 90 C420 90 350 90 290 90 C390 90 540 230 680 230',nodes:['signal','plan','handoff']},
      ],
    },
    contexts: [
      {id:'shipment',title:'A shipment needs a workable plan',situation:'A movement request arrives with a delivery window, loading constraints and an expectation about who will coordinate it.',decision:'The first useful question is whether the commitment can be supported by the available time, resources and handoffs.',questions:['Which constraint can change, and which one cannot?','Who confirms the assignment and the receiving arrangement?','What information must travel with the job?'],takeaway:'Bring a representative movement request and the decisions it creates. That is a stronger starting point than a long feature list.',ventures:['nrth-tms','nrth-logistics']},
      {id:'readiness',title:'The resource may not fit the job',situation:'A vehicle is available on a schedule, but its actual suitability depends on condition, capacity, responsibility and the next operating commitment.',decision:'Separate calendar availability from readiness. Then identify the evidence the person making an assignment needs.',questions:['What makes a vehicle suitable for this work?','Who owns the readiness decision?','How does a change reach the planner?'],takeaway:'Describe the resource, the job and the information used to match them. Readiness and assignment belong in the same conversation.',ventures:['nrth-fleet','nrth-tms','nrth-telematics']},
      {id:'change',title:'Reality changes the original plan',situation:'A fresh observation suggests a delay or a changed route. Its value depends on whether it is reliable and who can act on it.',decision:'Connect the observation to a decision, an owner and the commitment affected by that decision.',questions:['How fresh is the observation?','Which commitment is actually at risk?','Who needs to approve or communicate the next step?'],takeaway:'An exception is useful when it carries context. Identify the action that should follow the signal, including when no action is needed.',ventures:['nrth-telematics','nrth-tms','nrth-logistics']},
    ],
    details: [
      {title:'Operating constraints',text:'Timing, access, capacity and responsibilities determine whether a movement is practical. Capture the conditions behind the request.'},
      {title:'Information quality',text:'An observation has a source, an age and limits. Those details influence how confidently someone can use it.'},
      {title:'Decision ownership',text:'Planning, dispatch and partner coordination can involve different people. Make the next decision and its owner explicit.'},
      {title:'The chain of commitments',text:'Follow the job beyond one screen or team. A change often affects a later appointment, a receiving partner or a future assignment.'},
    ],
    ventures: [
      {slug:'nrth-tms',role:'Transportation planning',connection:'Starts with the job, its constraints and the decisions needed to turn a request into an assignment.'},
      {slug:'nrth-telematics',role:'Vehicle observations',connection:'Starts with signals and asks what their age, quality and operational context allow someone to conclude.'},
      {slug:'nrth-fleet',role:'Resource readiness',connection:'Starts with the vehicles and responsibilities that support the plan, including what affects future capacity.'},
      {slug:'nrth-logistics',role:'Coordination and handoffs',connection:'Starts with the sequence of commitments and the information that needs to pass between people and partners.'},
    ],
    questions: [
      {question:'Which mobility venture should I start with?',answer:'Start with the decision: planning an assignment points toward TMS, understanding vehicle observations toward Telematics, assessing resources toward Fleet, and coordinating partner handoffs toward Logistics. Describe the whole operation if the problem crosses those boundaries.'},
      {question:'Does the diagram represent an existing integrated platform?',answer:'It describes how the areas of work can relate. Specific software capabilities, integrations and commercial arrangements are established directly with NRTH.'},
      {question:'What makes a useful first conversation?',answer:'A representative job, the people making decisions, the information they use and an example of an exception. An anonymized process description is enough to begin.'},
    ],
    contact:'nrth-tms',
  },
  {
    name:'Health',slug:'health',
    description:'Explore NRTH’s health perspective: understandable information, access, care coordination and the everyday decisions that shape a person’s experience.',
    headline:['Information has a purpose.', 'People come first.'],
    introduction:'A person can encounter several systems while trying to answer one simple question. The health perspective starts with that experience: what someone needs to understand, what they can do next and where a careful connection could reduce effort.',
    perspective:'The question travels with the person.',
    perspectiveCopy:'Health work can involve people receiving care, people coordinating it and the systems that hold the information. The challenge is to preserve meaning as the question moves between them. NRTH Health explores that experience alongside the software and research questions around it.',
    diagram:{
      label:'A health question connects a person, understandable information and an appropriately supported next step.',
      nodes:[{id:'person',label:'Person',x:100,y:230},{id:'access',label:'Access',x:290,y:90},{id:'question',label:'Question',x:290,y:370},{id:'information',label:'Information',x:480,y:90},{id:'coordination',label:'Coordination',x:480,y:370},{id:'next',label:'Next step',x:680,y:230}],
      paths:[
        {id:'understanding',d:'M100 230 C140 350 190 370 290 370 C375 370 390 90 480 90 C570 90 620 120 680 230',nodes:['person','question','information','next']},
        {id:'handoff',d:'M290 370 C350 370 405 370 480 370 C580 370 625 330 680 230',nodes:['question','coordination','next']},
        {id:'access',d:'M100 230 C145 130 190 90 290 90 C355 90 420 90 480 90 C595 90 640 135 680 230',nodes:['person','access','information','next']},
      ],
    },
    contexts:[
      {id:'understanding',title:'Someone needs to understand what comes next',situation:'A person has information in front of them, but the terminology, order or navigation makes the next practical step difficult to find.',decision:'Define the question in the person’s own terms before deciding what an interface should show.',questions:['What are they trying to understand right now?','Which terms need context or a simpler explanation?','What next step is appropriate for the information available?'],takeaway:'Bring the question, the setting in which it arises and a sample of the information. The objective is comprehension, not more content.',ventures:['nrth-health','nrth-labs']},
      {id:'handoff',title:'A question passes between teams',situation:'Several people are involved in a coordination task. A handoff can lose its purpose when ownership and the outstanding question are unclear.',decision:'Identify what must remain visible when the task changes hands, including who can resolve it.',questions:['What is still unanswered?','Who accepts responsibility for the next step?','Which information is necessary for that person’s role?'],takeaway:'Map one real handoff, including the exceptional case. That reveals more than a generic diagram of an ideal care journey.',ventures:['nrth-health','nrth-systems']},
      {id:'access',title:'Access creates effort before the task starts',situation:'Someone encounters a device, language, navigation or permissions barrier before reaching the information they need.',decision:'Distinguish the access requirement from assumptions about how someone will interact with it.',questions:['In what setting and on what device will this be used?','What assistive or language needs should be understood?','How is the right level of access established?'],takeaway:'Describe the access conditions and test them early. Accessibility and appropriate permissions affect the shape of the whole experience.',ventures:['nrth-health','nrth-systems','nrth-labs']},
    ],
    details:[
      {title:'The person’s context',text:'A task can feel very different under time pressure or on a shared device. Begin with the circumstances around the interaction.'},
      {title:'Meaning and comprehension',text:'Information is useful when the reader can interpret it. Study vocabulary, hierarchy and the relationship to the next decision.'},
      {title:'Appropriate access',text:'Information boundaries and role responsibilities need to be understood before a workflow is connected.'},
      {title:'Evidence for the use',text:'Distinguish an interface study from a clinical application. Intended use determines the evidence and review that would be needed.'},
    ],
    ventures:[
      {slug:'nrth-health',role:'The health experience',connection:'Considers the person’s question, the information around it and the coordination involved in everyday care.'},
      {slug:'nrth-systems',role:'Supporting foundations',connection:'Brings a perspective on access boundaries, information exchange and workflows that span several tools.'},
      {slug:'nrth-labs',role:'Questions worth studying',connection:'Offers a research perspective on testing assumptions about comprehension, navigation and interaction.'},
    ],
    questions:[
      {question:'Is this a clinical service or medical product?',answer:'This page describes NRTH’s area of inquiry. It does not provide care, medical advice or a claim about clinical performance. Any clinical application would need its own defined scope, evidence and appropriate review.'},
      {question:'Can we discuss an information or coordination problem?',answer:'Yes. Describe the task, the people involved and the point where understanding or responsibility becomes difficult. An anonymized example can support an initial conversation.'},
      {question:'What should I share initially?',answer:'A process description, intended audience and constraints are useful. Avoid sending personal health information through the general contact form.'},
    ],
    contact:'nrth-health',
  },
  {
    name:'Systems',slug:'systems',
    description:'Explore NRTH’s systems perspective: workflow boundaries, information exchange, decision ownership and software that can evolve with the work.',
    headline:['A connection is useful', 'when the work is clear.'],
    introduction:'A system is more than its software. It includes the people using it, the rules they rely on and the information they pass to each other. The systems perspective examines those relationships before turning them into interfaces or integrations.',
    perspective:'Make the boundaries visible.',
    perspectiveCopy:'A shared workflow can contain several versions of the truth: what someone requested, what a tool recorded and what another team understood. The interesting work lies at those edges. Clear contracts, visible ownership and deliberate interfaces make a connection easier to maintain.',
    diagram:{
      label:'A systems decision follows the relationship between a task, its information contract and the person responsible for the outcome.',
      nodes:[{id:'task',label:'Task',x:90,y:230},{id:'interface',label:'Interface',x:290,y:90},{id:'ownership',label:'Ownership',x:290,y:370},{id:'contract',label:'Contract',x:480,y:90},{id:'exception',label:'Exception',x:480,y:370},{id:'change',label:'Change',x:680,y:230}],
      paths:[
        {id:'workflow',d:'M90 230 C155 230 210 90 290 90 C410 90 390 370 480 370 C585 370 615 230 680 230',nodes:['task','interface','exception','change']},
        {id:'exchange',d:'M290 90 C345 90 420 90 480 90 C580 90 610 230 680 230',nodes:['interface','contract','change']},
        {id:'evolution',d:'M290 370 C355 370 420 370 480 370 C570 370 620 300 680 230',nodes:['ownership','exception','change']},
      ],
    },
    contexts:[
      {id:'workflow',title:'A workflow crosses several tools',situation:'A person completes one task by moving between systems, repeating information or checking whether someone else has finished a prerequisite.',decision:'Understand the task as a whole before choosing which step to automate or connect.',questions:['What is the person trying to finish?','Where does work wait, repeat or lose context?','What happens when the expected sequence breaks?'],takeaway:'Walk through one normal case and one exception. They help define the boundary of a useful change.',ventures:['nrth-systems','nrth-health','nrth-logistics']},
      {id:'exchange',title:'Two systems mean different things by the same field',situation:'An integration can move a value successfully while still losing the meaning, ownership or timing that made the value useful.',decision:'Agree on the information contract: what a record means, when it changes and how errors are handled.',questions:['Which source owns the value?','How are updates, duplicates and missing values interpreted?','What does the receiving system need to know about freshness?'],takeaway:'Bring an example record and its lifecycle. A shared definition is more useful than a connection diagram alone.',ventures:['nrth-systems','nrth-telematics']},
      {id:'evolution',title:'The next change is difficult to make safely',situation:'A process has grown around an existing tool, but its dependencies and original assumptions are no longer easy to see.',decision:'Make the affected responsibilities, interfaces and exceptional cases observable before expanding the system.',questions:['Who depends on the current behaviour?','How will a failed change be recognized?','Which parts need to evolve independently?'],takeaway:'Identify the smallest useful boundary to improve. Record why it exists so the next change has a clearer starting point.',ventures:['nrth-systems','nrth-labs']},
    ],
    details:[
      {title:'The unit of work',text:'Define the task in terms of an outcome someone can recognize, including what counts as incomplete or blocked.'},
      {title:'Information contracts',text:'Make meaning, source ownership, timing and failure behaviour explicit when information crosses a boundary.'},
      {title:'Operational visibility',text:'Consider how people will understand the current state and recognize when an expected transition has not happened.'},
      {title:'Change over time',text:'A useful system leaves room for maintenance, different operating conditions and a future decision that has not yet been made.'},
    ],
    ventures:[
      {slug:'nrth-systems',role:'The software foundation',connection:'Considers interfaces, rules and information exchange in relation to the work people need to complete.'},
      {slug:'nrth-telematics',role:'Signals in context',connection:'Introduces questions about freshness, source quality and the meaning of an observation across system boundaries.'},
      {slug:'nrth-labs',role:'Focused experiments',connection:'Provides a way to frame a small prototype around one uncertain assumption before a wider commitment.'},
    ],
    questions:[
      {question:'Does NRTH offer every integration shown here?',answer:'The diagram explains areas of consideration, not an integration catalogue. Current capability, access requirements and any implementation scope are confirmed directly with NRTH.'},
      {question:'Can the discussion begin with an existing process?',answer:'Yes. A process description, an example of the information exchanged and an explanation of who uses it can establish the most useful starting point.'},
      {question:'Should the first conversation be technical?',answer:'It can be, but it does not have to be. Start with the work and the decision that needs to improve. Technical constraints matter once that purpose is clear.'},
    ],
    contact:'nrth-systems',
  },
  {
    name:'Materials',slug:'materials',
    description:'Explore NRTH’s materials perspective: intended applications, operating conditions, material evidence and the industrial partners around a technical question.',
    headline:['A material direction', 'begins with a real use.'],
    introduction:'The same property can be useful in one application and unsuitable in another. The materials perspective starts with the intended use, the conditions around it and the evidence needed to assess whether a direction deserves further attention.',
    perspective:'The application gives the property meaning.',
    perspectiveCopy:'Materials questions connect technical requirements with practical realities: handling, documentation, supply and the people familiar with the application. NRTH Chemicals approaches those industrial questions, with research and logistics offering additional perspectives where they are relevant.',
    diagram:{
      label:'A materials question connects intended use, operating conditions, evidence and the practical application.',
      nodes:[{id:'use',label:'Intended use',x:100,y:230},{id:'conditions',label:'Conditions',x:300,y:90},{id:'partners',label:'Expertise',x:300,y:370},{id:'properties',label:'Properties',x:485,y:90},{id:'evidence',label:'Evidence',x:485,y:370},{id:'application',label:'Application',x:680,y:230}],
      paths:[
        {id:'application',d:'M100 230 C150 145 215 90 300 90 C360 90 425 90 485 90 C610 90 630 230 680 230',nodes:['use','conditions','properties','application']},
        {id:'evidence',d:'M485 90 C550 160 550 300 485 370 C405 370 370 370 300 370 C450 430 600 350 680 230',nodes:['properties','evidence','partners','application']},
        {id:'practical',d:'M100 230 C155 320 220 370 300 370 C370 370 420 370 485 370 C590 370 625 310 680 230',nodes:['use','partners','evidence','application']},
      ],
    },
    contexts:[
      {id:'application',title:'An application needs a different material direction',situation:'A process or intended use creates a requirement, but the important property cannot be assessed independently of the operating conditions.',decision:'Translate the intended use into a bounded set of requirements before comparing possible directions.',questions:['Under what conditions will the material be used?','Which property is essential, and how is it assessed?','What other requirements limit the choice?'],takeaway:'Bring the application and its conditions, including what a satisfactory outcome would mean. Avoid starting with a material name alone.',ventures:['nrth-chemicals','nrth-labs']},
      {id:'evidence',title:'A technical claim needs a clearer basis',situation:'A specification sounds relevant, but the test context, source or applicability to the intended use is not yet clear.',decision:'Identify the evidence that would support a decision and the expertise needed to interpret its limits.',questions:['What does the available documentation actually establish?','Do the conditions match the intended application?','Who is qualified to assess any remaining uncertainty?'],takeaway:'Keep claims attached to their evidence. A focused question can establish whether more information or an independent assessment is needed.',ventures:['nrth-chemicals','nrth-labs']},
      {id:'practical',title:'Technical suitability meets an operational constraint',situation:'A promising direction still needs to fit handling, documentation, availability and the responsibilities of the people involved.',decision:'Consider the practical chain alongside the technical requirement instead of leaving it until the end.',questions:['What handling and documentation requirements apply?','Which participants understand the application and its constraints?','How would material provenance and responsibility be established?'],takeaway:'Discuss the operating arrangement as part of the application. Technical interest does not by itself establish supply or suitability.',ventures:['nrth-chemicals','nrth-logistics']},
    ],
    details:[
      {title:'Conditions of use',text:'Temperature, exposure, process conditions and intended application influence what a property means in practice.'},
      {title:'Relevant evidence',text:'Understand the scope of a specification or test before transferring its conclusion to a different setting.'},
      {title:'Technical expertise',text:'The people who know the application can clarify constraints that a material description does not capture.'},
      {title:'Practical responsibilities',text:'Provenance, handling, documentation and the supply arrangement would need clear owners in any eventual offering.'},
    ],
    ventures:[
      {slug:'nrth-chemicals',role:'Industrial applications',connection:'Starts with the need and the material requirements behind it, together with the partners who understand its use.'},
      {slug:'nrth-labs',role:'The research question',connection:'Brings a perspective on isolating an uncertainty and defining the evidence a focused study would need.'},
      {slug:'nrth-logistics',role:'The operational chain',connection:'Introduces the responsibilities and handoffs around a possible material movement or supply arrangement.'},
    ],
    questions:[
      {question:'Is this a catalogue of materials for sale?',answer:'This page outlines an area of industrial interest. It does not establish available inventory, specifications, certified suitability or a supply commitment. Any offering would be discussed and documented separately.'},
      {question:'What information should an industrial partner bring?',answer:'The intended application, operating conditions, relevant requirements and the technical question to resolve. Existing non-confidential documentation can help define the context.'},
      {question:'Does the diagram provide chemical or handling instructions?',answer:'No. It describes the questions around an application. Appropriate technical expertise and safety documentation are required for any actual material selection, handling or use.'},
    ],
    contact:'nrth-chemicals',
  },
  {
    name:'Events',slug:'events',
    description:'Explore NRTH’s events perspective: the purpose of a gathering, audience experience, program rhythm and the practical coordination behind a shared moment.',
    headline:['People bring the energy.', 'Design gives it direction.'],
    introduction:'A gathering asks people to share their attention for a while. The events perspective considers why they arrive, how the experience unfolds and what makes a shared moment valuable after the schedule is over.',
    perspective:'A program is only part of the experience.',
    perspectiveCopy:'Arrival, transitions, shared moments and the space for conversation shape what people take away. A coherent event connects those choices to its purpose. NRTH Events considers the experience, while Systems and Labs offer perspectives on coordination and unfamiliar formats.',
    diagram:{
      label:'An event experience connects its purpose with arrival, shared moments, interaction and what people take away.',
      nodes:[{id:'purpose',label:'Purpose',x:90,y:230},{id:'arrival',label:'Arrival',x:290,y:90},{id:'production',label:'Coordination',x:290,y:370},{id:'moment',label:'Shared moment',x:485,y:90},{id:'interaction',label:'Exchange',x:485,y:370},{id:'after',label:'Takeaway',x:680,y:230}],
      paths:[
        {id:'purpose',d:'M90 230 C145 120 220 90 290 90 C360 90 420 90 485 90 C585 90 610 230 680 230',nodes:['purpose','arrival','moment','after']},
        {id:'rhythm',d:'M290 90 C350 150 400 90 485 90 C555 150 555 300 485 370 C570 370 625 310 680 230',nodes:['arrival','moment','interaction','after']},
        {id:'coordination',d:'M90 230 C145 340 220 370 290 370 C360 370 420 370 485 370 C570 370 625 310 680 230',nodes:['purpose','production','interaction','after']},
      ],
    },
    contexts:[
      {id:'purpose',title:'The gathering needs a clearer reason to exist',situation:'There is a format or date in mind, but the intended exchange and the people it should serve are still broad.',decision:'Define what the gathering should make possible for its audience before filling the program.',questions:['Who should feel that this was time well spent?','What exchange, connection or experience matters most?','What should remain with someone after they leave?'],takeaway:'A short statement of purpose can guide programming, partners and production choices. The format should follow that statement.',ventures:['nrth-events','nrth-labs']},
      {id:'rhythm',title:'The schedule has moments, but the experience needs flow',situation:'Individual sessions or activities are defined, yet arrival, transitions and time for conversation feel disconnected.',decision:'Look at the audience’s experience across the whole gathering, including the spaces between programmed moments.',questions:['How does someone enter and orient themselves?','Where does the energy need a change of pace?','When can people make the connections the event promises?'],takeaway:'Map the experience as a sequence of attention and movement. Transitions deserve a place in the design.',ventures:['nrth-events','nrth-labs']},
      {id:'coordination',title:'Several partners need to deliver one coherent experience',situation:'Production, programming and partner commitments are developing in parallel. A late change may affect several parts of the gathering.',decision:'Give each important dependency an owner and connect practical choices back to the audience purpose.',questions:['Which decisions affect another team’s work?','Who confirms a changed commitment?','What needs to remain consistent for the audience?'],takeaway:'Describe a dependency and its handoff. That reveals where a coordination tool or a simpler operating agreement might help.',ventures:['nrth-events','nrth-systems']},
    ],
    details:[
      {title:'Audience and intention',text:'Be specific about who is gathering and the exchange that would make the experience valuable to them.'},
      {title:'Rhythm and transitions',text:'Attention changes over time. Consider arrival, programmed moments, rest and conversation as parts of one sequence.'},
      {title:'Practical dependencies',text:'Programming, production and partners influence each other. Make the responsibilities behind those connections explicit.'},
      {title:'The lasting impression',text:'Ask what someone should understand, remember or be able to do after the event. That informs the choices made before it.'},
    ],
    ventures:[
      {slug:'nrth-events',role:'The shared experience',connection:'Starts with why people gather and the design choices that connect purpose, rhythm and practical production.'},
      {slug:'nrth-systems',role:'Coordinating the work',connection:'Brings a perspective on ownership, information exchange and the workflows connecting event participants and partners.'},
      {slug:'nrth-labs',role:'Unfamiliar formats',connection:'Offers a research perspective on testing an interaction or format before treating it as the whole event concept.'},
    ],
    questions:[
      {question:'Can I book a specific event service here?',answer:'The website introduces NRTH’s events direction. Availability, responsibilities, location, timing and any service arrangement are confirmed directly in a conversation.'},
      {question:'What is useful in an initial event brief?',answer:'Audience, purpose, timing, location constraints and the experience you want to create. Include what is already decided and what remains open.'},
      {question:'Can an event idea involve technology or a new format?',answer:'Those questions can connect to Systems or Labs as well as Events. Describe what the interaction should make possible for the audience so the right perspective can be discussed.'},
    ],
    contact:'nrth-events',
  },
  {
    name:'Research',slug:'research',
    description:'Explore NRTH’s research perspective: precise questions, focused experiments, evidence and decisions that connect ideas across health, systems, materials and other fields.',
    headline:['An unfamiliar possibility.', 'A more precise question.'],
    introduction:'Early ideas benefit from a small enough question to investigate. The research perspective looks for the uncertainty that matters, the simplest way to learn about it and the decision that would change when the evidence arrives.',
    perspective:'Progress can be a better question.',
    perspectiveCopy:'A prototype does not need to imitate an entire finished product to be useful. It can make one assumption visible or reveal that the original question needs to change. NRTH Labs connects that way of working to the technical and industrial contexts around the company.',
    diagram:{
      label:'A research inquiry moves from a question through assumptions and an experiment to evidence and a decision, with room to revisit the question.',
      nodes:[{id:'question',label:'Question',x:90,y:230},{id:'assumption',label:'Assumption',x:290,y:90},{id:'context',label:'Context',x:290,y:370},{id:'experiment',label:'Experiment',x:485,y:90},{id:'evidence',label:'Evidence',x:485,y:370},{id:'decision',label:'Decision',x:680,y:230}],
      paths:[
        {id:'question',d:'M90 230 C145 125 220 90 290 90 C370 90 420 90 485 90 C565 90 615 150 680 230',nodes:['question','assumption','experiment','decision']},
        {id:'experiment',d:'M290 370 C390 350 400 90 485 90 C555 160 555 300 485 370 C565 370 625 315 680 230',nodes:['context','experiment','evidence','decision']},
        {id:'learning',d:'M485 370 C370 430 200 380 90 230 C150 315 220 370 290 370 C430 420 595 380 680 230',nodes:['evidence','question','context','decision']},
      ],
    },
    contexts:[
      {id:'question',title:'An idea contains too many unknowns',situation:'A concept is interesting, but discussing the whole thing at once makes it difficult to decide what should be investigated first.',decision:'Choose the assumption whose answer would most change the next commitment.',questions:['What would have to be true for the idea to be useful?','Which assumption has the least supporting evidence?','What decision depends on resolving it?'],takeaway:'Write one testable question and name the decision it supports. That gives an early study a clear purpose.',ventures:['nrth-labs','nrth-systems']},
      {id:'experiment',title:'A prototype needs a sharper objective',situation:'There is a desire to make something tangible, but building every part of the concept would obscure the uncertainty the prototype is meant to address.',decision:'Design the smallest experiment that can distinguish between the plausible answers.',questions:['What would count as useful evidence?','What can the experiment leave out?','Which conditions must be present for its result to mean something?'],takeaway:'A focused prototype earns its complexity. Include the pieces needed to answer the question, and record what it does not establish.',ventures:['nrth-labs','nrth-health','nrth-chemicals']},
      {id:'learning',title:'The result changes the direction',situation:'A study reveals a limitation, an unexpected observation or a reason to reconsider the initial assumption.',decision:'Keep the evidence and its conditions attached to the next decision, even when the original idea is put aside.',questions:['What was observed, and under which conditions?','Which conclusion is supported and which remains uncertain?','Should the next step continue, change course or stop?'],takeaway:'Learning remains valuable when it is recorded clearly enough to revisit. A changed question can be a useful outcome.',ventures:['nrth-labs','nrth-systems']},
    ],
    details:[
      {title:'A bounded question',text:'Frame the inquiry so different answers would lead to different decisions. Avoid studying a broad theme without a purpose.'},
      {title:'A relevant experiment',text:'Keep the conditions that matter and leave out the ones that do not. Explain what the study is capable of establishing.'},
      {title:'Evidence with limits',text:'Record observations separately from interpretation. A useful result includes its uncertainty and the circumstances in which it arose.'},
      {title:'A deliberate next step',text:'Continuing, reframing and putting an idea aside are all possible decisions. The value lies in making that choice with better information.'},
    ],
    ventures:[
      {slug:'nrth-labs',role:'The experimental perspective',connection:'Focuses on assumptions, prototypes and the evidence needed to make an early possibility concrete enough to discuss.'},
      {slug:'nrth-systems',role:'Technical context',connection:'Introduces questions about software boundaries, interaction and how a technical idea would fit real work.'},
      {slug:'nrth-chemicals',role:'Industrial context',connection:'Introduces the intended application, operating conditions and technical expertise around a material question.'},
      {slug:'nrth-health',role:'Human context',connection:'Introduces questions about comprehension, access and the circumstances in which a person encounters information.'},
    ],
    questions:[
      {question:'Does the research page list validated scientific results?',answer:'It describes NRTH’s approach to early questions and experimentation. The visual studies elsewhere on the website are creative demonstrations. Any technical or scientific result would require its own methods, evidence and stated limits.'},
      {question:'Can an external partner bring a research question?',answer:'Yes. Explain the question, why its answer matters, what is already known and the context in which a study would need to be useful. Scope and any collaboration arrangement are discussed separately.'},
      {question:'Where can I try the interactive visual studies?',answer:'The main Research page includes a visual study of form, structure and perspective. It is a way to explore the design system, rather than a simulation of a commercial or scientific process.'},
    ],
    contact:'nrth-labs',
  },
];

export function getIndustryStory(slug: string) {
  const story = industryStories.find(story => story.slug === slug);
  if (!story) throw new Error('Unknown industry story: ' + slug);
  return story;
}
