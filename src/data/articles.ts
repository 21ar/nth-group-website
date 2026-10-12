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
      "That makes attention a practical design constraint. A useful screen gives the current decision a clear place, separates what matters now from what can wait and leaves the surrounding context within reach. This is not a reason to remove important detail. It is a reason to organize detail around the moments when someone needs it.",
      "The difficult cases reveal the quality of that organization. What happens when information is old, a request is incomplete or responsibility changes? If those situations require a person to infer the state of the work from scattered clues, the interface is asking them to become part of its missing structure.",
      "One helpful method is to describe a task without naming a screen. Write down the decision, the information that can change it and the person responsible for what follows. That description can challenge an attractive interface that does not actually make the decision easier.",
      "Across NRTH's health, mobility and systems directions, the details vary. The question remains useful: what does this experience ask a person to notice, remember or work out? A more deliberate answer creates room for the work itself."
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
      "Follow a movement of goods and several stories appear at once. There is a job to plan, a vehicle whose activity can be observed, a resource whose readiness matters and a sequence of handoffs between people or organizations. A connected view becomes useful when those stories keep their meaning.",
      "Transportation management frames the assignment: what needs to move, under which constraints and with whose responsibility. Telematics frames an observation: what is being reported, when was it observed and what can be inferred from it? Fleet work frames the resource: what is available, appropriate and ready? Logistics frames the commitments that join a wider process.",
      "Those perspectives overlap, but joining them is not simply a matter of putting their information on the same screen. A signal may be too old to support a planning decision. A resource may look available while an important constraint is missing. A handoff may be complete for one team and still ambiguous for another.",
      "A useful connection starts with a decision and works backwards. Which part of another story could improve that decision? Who understands its source, freshness and limitations? How will a change become visible to the people depending on it? Those questions give integration a purpose.",
      "NRTH TMS, Telematics, Fleet and Logistics are separate venture directions because those distinctions matter. Their relationship is an opportunity to investigate how better context could travel between them, with specific capabilities and arrangements established through a direct discussion."
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
      "An ambitious idea often contains several uncertainties at once. Does the problem exist in the form imagined? Would a different experience help? Can the technical approach support the intended use? Treating those questions as one makes an experiment difficult to design and its result difficult to interpret.",
      "A smaller question can still belong to a larger ambition. The useful reduction is the one that isolates an uncertainty whose answer would change the next decision. It creates a clear reason for the experiment and a practical boundary around what the result can establish.",
      "The method should follow that boundary. A prototype can reveal how someone interprets an interaction. A technical study can examine a constraint in an approach. A conversation can test whether the imagined workflow matches the work people actually do. None of those methods automatically answers the other questions.",
      "Before beginning, describe the observation that would support the idea, the observation that would challenge it and the outcomes that would remain inconclusive. That description helps prevent a visually impressive prototype or an agreeable conversation from becoming more evidence than it should be.",
      "The visual study on NRTH's Research page offers a small example. The same chrome fragments can move between an irregular mineral and an ordered framework. The controls reveal a relationship between order, orientation and perception. They do not establish a scientific result or a wider product capability. Describing that limit is part of making the study useful.",
      "NRTH Labs frames this research direction: specific questions, tangible investigations and clear observations. An experiment may produce a new approach. It may also produce a narrower problem, a reason to change direction or a useful decision to stop."
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
