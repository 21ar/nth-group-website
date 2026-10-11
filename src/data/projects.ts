export type Project={slug:string;name:string;category:string;number:string;headline:string;description:string;introduction:string;focus:{title:string;text:string}[];related:string[];stage?:'overview'|'research'|'prototype'|'pilot'|'available';reviewedAt?:string;productUrl?:string;demoUrl?:string;coverImage?:string;coverAlt?:string;};
export const projects:Project[]=[
  {
    "slug": "nrth-health",
    "name": "NRTH Health",
    "category": "Health",
    "number": "01",
    "headline": "Care deserves less friction.",
    "description": "Health information, everyday care and the people at the centre of it.",
    "introduction": "The distance between a person and the information they need can shape their experience of care. NRTH Health considers how careful interfaces, information handling and practical workflows could help close that distance.",
    "focus": [
      {
        "title": "Information people can use",
        "text": "Organize health information around the questions people ask, with language and navigation that respect their context."
      },
      {
        "title": "Workflows that respect attention",
        "text": "Investigate where coordination adds effort for care teams and what a more coherent handoff would need."
      },
      {
        "title": "Trust from the outset",
        "text": "Treat privacy, access and accessibility as foundations. Any clinical use would require its own evidence and appropriate review."
      }
    ],
    "related": [
      "nrth-systems",
      "nrth-labs"
    ]
  },
  {
    "slug": "nrth-tms",
    "name": "NRTH TMS",
    "category": "Mobility",
    "number": "02",
    "headline": "Make every move count.",
    "description": "Transportation planning with the whole operation in mind.",
    "introduction": "A transportation decision affects more than a route. NRTH TMS considers the relationship between a shipment, its constraints, the people coordinating it and the resources available to move it.",
    "focus": [
      {
        "title": "Plan around the job",
        "text": "Bring shipment requirements, timing and resource constraints into one planning perspective."
      },
      {
        "title": "Keep decisions connected",
        "text": "Consider how an assignment reaches dispatch and how changes return to the people responsible for the plan."
      },
      {
        "title": "Know what needs attention",
        "text": "Make exceptions and unanswered questions visible so operational teams can prioritize the next decision."
      }
    ],
    "related": [
      "nrth-telematics",
      "nrth-fleet",
      "nrth-logistics"
    ]
  },
  {
    "slug": "nrth-telematics",
    "name": "NRTH Telematics",
    "category": "Mobility",
    "number": "03",
    "headline": "Signals that tell a bigger story.",
    "description": "Vehicle signals, their context and the decisions they can inform.",
    "introduction": "A location is a point. Its meaning depends on the work around it. NRTH Telematics investigates how vehicle activity, signal quality and operational context could become more useful together.",
    "focus": [
      {
        "title": "Understand the signal",
        "text": "Distinguish a fresh observation from an older one, and show uncertainty that affects how the information can be used."
      },
      {
        "title": "Read activity in context",
        "text": "Consider the connection between movement, an assigned job and the questions an operations team needs answered."
      },
      {
        "title": "Connect with purpose",
        "text": "Begin with a specific decision rather than a feed of every available signal."
      }
    ],
    "related": [
      "nrth-tms",
      "nrth-fleet",
      "nrth-systems"
    ]
  },
  {
    "slug": "nrth-logistics",
    "name": "NRTH Logistics",
    "category": "Mobility",
    "number": "04",
    "headline": "Get the handoffs right.",
    "description": "People and processes behind the movement of goods.",
    "introduction": "Goods move through a sequence of commitments. NRTH Logistics looks between those commitments: who has the information, who owns the next step and what changes when a plan meets reality.",
    "focus": [
      {
        "title": "Map the dependencies",
        "text": "Understand how requirements, partners and timing influence movement before treating them as separate tasks."
      },
      {
        "title": "Make responsibility visible",
        "text": "Keep ownership and expectations clear when work passes from one team to another."
      },
      {
        "title": "Learn from the exceptions",
        "text": "Use the points where a process breaks down to identify what a better connection would need to change."
      }
    ],
    "related": [
      "nrth-tms",
      "nrth-fleet",
      "nrth-systems"
    ]
  },
  {
    "slug": "nrth-systems",
    "name": "NRTH Systems",
    "category": "Systems",
    "number": "05",
    "headline": "Give complexity a useful structure.",
    "description": "Software foundations designed around how work actually happens.",
    "introduction": "Tools are only part of a system. NRTH Systems considers the rules, interfaces and information flows that allow people and software to work together with fewer uncertain edges.",
    "focus": [
      {
        "title": "Define the boundaries",
        "text": "Make responsibility, access and the exchange of information explicit before joining systems together."
      },
      {
        "title": "Design for the real workflow",
        "text": "Structure interfaces around the task in front of someone, including the awkward cases that determine whether a tool is useful."
      },
      {
        "title": "Build for the next change",
        "text": "Consider maintenance, observability and how a system can evolve without obscuring its original purpose."
      }
    ],
    "related": [
      "nrth-labs",
      "nrth-health",
      "nrth-telematics"
    ]
  },
  {
    "slug": "nrth-labs",
    "name": "NRTH Labs",
    "category": "Research",
    "number": "06",
    "headline": "Follow the question further.",
    "description": "Experiments, prototypes and ideas that cross disciplines.",
    "introduction": "Some of the most interesting work starts before the answer is clear. NRTH Labs is the research direction within NRTH: a place to examine assumptions and make an unfamiliar possibility concrete enough to discuss.",
    "focus": [
      {
        "title": "Ask something specific",
        "text": "Find a question whose answer would change a decision, then identify the evidence that would be useful."
      },
      {
        "title": "Make a small experiment",
        "text": "Use a focused prototype or technical study to investigate one uncertainty at a time."
      },
      {
        "title": "Keep what is learned",
        "text": "Record the result and its limits, including the reasons to continue, change course or put an idea aside."
      }
    ],
    "related": [
      "nrth-systems",
      "nrth-chemicals",
      "nrth-health"
    ]
  },
  {
    "slug": "nrth-chemicals",
    "name": "NRTH Chemicals",
    "category": "Materials",
    "number": "07",
    "headline": "Start at the material level.",
    "description": "Chemicals, applications and industrial needs.",
    "introduction": "The properties of a material shape what can be made with it. NRTH Chemicals considers an industrial need, the material requirements behind it and the partners who understand its application.",
    "focus": [
      {
        "title": "Begin with the application",
        "text": "Understand operating conditions and intended use before assessing a material direction."
      },
      {
        "title": "Ask for the right evidence",
        "text": "Keep specifications, provenance and appropriate safety documentation central to any eventual offering."
      },
      {
        "title": "Connect expertise",
        "text": "Explore conversations with technical and industrial partners who can give an early direction substance."
      }
    ],
    "related": [
      "nrth-labs",
      "nrth-logistics"
    ]
  },
  {
    "slug": "nrth-fleet",
    "name": "NRTH Fleet",
    "category": "Mobility",
    "number": "08",
    "headline": "Keep the whole operation in view.",
    "description": "Vehicles, readiness and the responsibilities that keep a fleet working.",
    "introduction": "A fleet decision combines the immediate job with the condition and availability of the resources behind it. NRTH Fleet looks at that wider operating picture, from everyday responsibilities to longer-term planning.",
    "focus": [
      {
        "title": "Readiness before assignment",
        "text": "Consider the information a team needs to assess whether a resource fits the work in front of it."
      },
      {
        "title": "Ownership through the day",
        "text": "Understand how vehicle responsibilities and operational changes are recorded and passed between people."
      },
      {
        "title": "Plan beyond the next job",
        "text": "Explore the connection between daily activity, maintenance considerations and future capacity."
      }
    ],
    "related": [
      "nrth-telematics",
      "nrth-tms",
      "nrth-logistics"
    ]
  },
  {
    "slug": "nrth-events",
    "name": "NRTH Events",
    "category": "Events",
    "number": "09",
    "headline": "Make a moment matter.",
    "description": "Experiences shaped around why people gather and what they take away.",
    "introduction": "An event is a temporary world with a lasting impression. NRTH Events considers the intention, rhythm and practical details that help a gathering become more than the sum of its schedule.",
    "focus": [
      {
        "title": "Give the gathering a purpose",
        "text": "Start with the people attending and the exchange, experience or connection the event should make possible."
      },
      {
        "title": "Design the rhythm",
        "text": "Consider arrival, shared moments, transitions and the time people need to connect."
      },
      {
        "title": "Connect the practical work",
        "text": "Bring programming, partners and production considerations back to the purpose of the gathering."
      }
    ],
    "related": [
      "nrth-labs",
      "nrth-systems"
    ]
  }
];
export const categories=['All','Mobility','Health','Systems','Materials','Events','Research'];
export function stageLabel(project:Project){const labels={overview:'Discuss current scope',research:'Research',prototype:'Prototype',pilot:'Pilot',available:'Available'};return labels[project.stage||'overview'];}
