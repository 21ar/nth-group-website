export type Article={slug:string;category:string;title:string;description:string;paragraphs:string[];related:string[];author:string;publishedAt:string;prompts?:string[]};
export const articles:Article[]=[
  {
    "slug": "clarity-is-a-design-decision",
    "category": "Perspective",
    "title": "Attention is part of the system.",
    "description": "An interface asks for more than input. It asks for a share of someone's attention.",
    "author": "NRTH Editorial",
    "publishedAt": "2026-10-10",
    "paragraphs": [
      "A person using a tool is rarely thinking only about the tool. There may be a shipment waiting for an assignment, a team waiting for an answer or an unfamiliar piece of information to understand. The interface enters an existing situation. It should be judged by how well it supports that situation, rather than how many functions it can display at once.",
      "The first useful question is therefore about a decision. What is this person trying to establish, and what happens after they establish it? A list of features cannot answer that question. A task description can: review an incomplete request, decide which information is needed and pass the request to the person who can continue it. The screen has a purpose before it has a layout.",
      "Attention becomes a practical design constraint. A useful screen gives the current decision a clear place, separates what matters now from what can wait and leaves the surrounding context within reach. Detail still matters. Its position, timing and explanation determine whether it helps someone understand the work or asks them to search for the work inside the interface.",
      "Information has a condition as well as a value. A status may be current, delayed, inferred or unconfirmed. Those differences should travel with the information, especially when another person will act on it. A timestamp buried in a secondary panel may technically be present while doing little to help someone judge the item in front of them.",
      "Imagine a coordinator reviewing an internal service request. The request has a preferred date, a note from its originator and an unanswered question about who will follow up. Displaying every field with equal emphasis gives the coordinator plenty to read. Showing the unresolved question beside the next responsible person gives the coordinator a way to move the request forward. This is an illustrative workflow, rather than a description of a deployed NRTH product.",
      "Progressive detail can support that decision. The initial view might explain why the request needs attention, what information is missing and which action is available. Its history can remain one step away. The deeper view must still be discoverable, with an ordinary label and a clear return path. Hiding necessary information behind an unfamiliar interaction transfers the cost of a clean layout to the person using it.",
      "The difficult cases reveal the quality of the organization. What happens when information is old, a request is incomplete or responsibility changes? What happens when someone returns after an interruption? If those situations require a person to reconstruct the state of the work from scattered clues, the interface is asking them to become part of its missing structure.",
      "A useful review follows the whole task. Ask someone to explain the next decision, identify the evidence supporting it and describe what the next person will receive. Record where they hesitate or make assumptions. The observation is more useful than a preference about whether a screen looks modern. A short review cannot establish every usability outcome, but it can expose a specific question worth investigating.",
      "Across NRTH's health, mobility and systems directions, the details vary. The question remains useful: what does this experience ask a person to notice, remember or work out? Start with one decision, make its context legible and make the continuation explicit. A more deliberate answer creates room for the work itself."
    ],
    "related": [
      "nrth-health",
      "nrth-systems"
    ],
    "prompts": [
      "Which decision should this screen help someone make?",
      "Which information changes that decision?",
      "Where would uncertainty or missing information become visible?",
      "Who needs to understand what happens next?"
    ]
  },
  {
    "slug": "connecting-the-parts-of-movement",
    "category": "Mobility",
    "title": "Movement has more than one story.",
    "description": "A job, a vehicle, a resource and a handoff each describe a different part of the same journey.",
    "author": "NRTH Editorial",
    "publishedAt": "2026-10-10",
    "paragraphs": [
      "Follow a movement of goods and several stories appear at once. There is a job to plan, a vehicle whose activity can be observed, a resource whose readiness matters and a sequence of handoffs between people or organizations. A connected view becomes useful when those stories keep their meaning. The point of joining them is to support a decision that would be difficult to make from one perspective alone.",
      "Transportation management frames the assignment: what needs to move, under which constraints and with whose responsibility. Telematics frames an observation: what is being reported, when was it observed and what can be inferred from it? Fleet work frames the resource: what is available, appropriate and ready? Logistics frames the commitments that join a wider process. Each perspective carries a different kind of evidence.",
      "A location observation, for example, does not establish that a vehicle is suitable for the next job. A vehicle marked available does not establish that a receiving team can accept a delivery. A completed movement does not necessarily establish that the information needed for the next handoff has reached its recipient. Those distinctions belong in the model of the work before they become interface elements.",
      "Consider a hypothetical delivery whose receiving window changes after planning. The job still describes the original commitment. A recent signal might describe where the vehicle was observed. A fleet record might describe an important resource constraint. The receiving team holds a different part of the situation. A useful view would make the disagreement visible rather than combine those facts into a single reassuring status.",
      "The next step is to name the decision: can the current plan still satisfy the updated commitment, and who can approve a change? Only then is it useful to decide which information should cross the boundary. The relevant observation needs its source and time. The resource constraint needs an owner. The changed commitment needs an acknowledged recipient. More data is useful when it closes one of those gaps.",
      "Connections also need to survive uncertainty. Information can arrive late, be duplicated or describe different moments. A receiving system should distinguish an observed fact from a calculated interpretation and an unconfirmed assumption. When those distinctions disappear, the appearance of a connected process can become stronger than the evidence supporting it.",
      "A practical investigation follows one exception through the process. Map the event, its source, the people depending on it and the actions they are permitted to take. Ask what happens if the information is missing or arrives out of sequence. Identify where a person must leave the system to resolve a conflict. That map gives a prototype or integration study a specific question to answer.",
      "The handoff is an especially useful place to review the experience. A good handoff includes the work being transferred, the context that changes its interpretation and the responsibility for what follows. An acknowledgement may need to mean more than successful delivery of a message. Its meaning depends on the actual agreement between the people or organizations involved.",
      "NRTH TMS, Telematics, Fleet and Logistics are separate venture directions because those distinctions matter. Their relationship is an opportunity to investigate how better context could travel between them. Specific capabilities, data access, integrations and operating arrangements need to be established through a direct discussion. A wider perspective should make those questions easier to ask."
    ],
    "related": [
      "nrth-tms",
      "nrth-telematics",
      "nrth-fleet",
      "nrth-logistics"
    ],
    "prompts": [
      "Is the immediate question about a job, a signal, a resource or a handoff?",
      "What would make information from another perspective trustworthy enough to use?",
      "Who owns a change after it crosses a system boundary?"
    ]
  },
  {
    "slug": "making-room-for-experimentation",
    "category": "Research",
    "title": "Make the question smaller.",
    "description": "A focused experiment can move an ambitious idea further than a premature plan.",
    "author": "NRTH Editorial",
    "publishedAt": "2026-10-10",
    "paragraphs": [
      "An ambitious idea often contains several uncertainties at once. Does the problem exist in the form imagined? Would a different experience help? Can the technical approach support the intended use? Treating those questions as one makes an experiment difficult to design and its result difficult to interpret. An appealing demonstration can leave the important uncertainty untouched.",
      "A smaller question can still belong to a larger ambition. The useful reduction isolates an uncertainty whose answer would change the next decision. It creates a clear reason for the experiment and a practical boundary around what the result can establish. Write the decision beside the question. If no plausible observation would change that decision, the proposed study may need a different purpose.",
      "Consider the broad ambition to make a handoff easier to understand. That contains questions about the process, the information and the interaction. One smaller question might be whether a recipient can identify the next responsible person from a proposed handoff summary. A simple prototype could investigate that interpretation without pretending to establish the value of a complete new system.",
      "The method should follow that boundary. A conversation can examine whether the imagined workflow matches the work people actually describe. A process map can make dependencies visible. An interface prototype can show how someone interprets a specific interaction. A document review can examine what an existing source supports. None of those methods automatically answers the questions belonging to the others.",
      "Specify the conditions that make the observation meaningful. Who is participating, what context will they receive and which materials will they encounter? What information are they allowed to use? A task performed with extensive guidance may reveal a different thing from a task performed independently. Those conditions are part of the result, rather than administrative detail to discard afterward.",
      "Before beginning, describe an observation that would support the idea, one that would challenge it and an outcome that would remain inconclusive. For the handoff example, a participant correctly naming the responsible person might support the summary's clarity in that task. Hesitation or a different interpretation would suggest a revision. Agreement that the design looks attractive would leave the original question open.",
      "Keep the observation separate from the interpretation. Record what someone did or said before explaining why it might have happened. A single hesitation can have several causes: unfamiliar terminology, an unclear relationship or a missing piece of context. Preserving that distinction gives the next investigation somewhere useful to begin and keeps a narrow observation from becoming a broad claim.",
      "The visual study on NRTH's Research page offers another small example. The same chrome fragments can move between an irregular mineral and an ordered framework. The controls reveal a relationship between order, orientation and perception. They do not establish a scientific result or a wider product capability. Describing that limit is part of making the study useful.",
      "NRTH Labs frames this research direction: specific questions, tangible investigations and clear observations. End with a next decision and its reason. Continue the approach, revise the question, choose another method or stop an investigation that no longer addresses a useful uncertainty. Learning can make an ambition more precise before it makes it bigger."
    ],
    "related": [
      "nrth-labs",
      "nrth-systems",
      "nrth-chemicals"
    ],
    "prompts": [
      "Which uncertainty would change the next decision?",
      "What is the smallest credible way to investigate it?",
      "What can this method establish, and what will remain open?",
      "What will you do differently after the observation?"
    ]
  }
];
