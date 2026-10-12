/** Public review prompts. These describe how to examine work, not completed research or commercial results. */
export interface DecisionLensStep {
  key: string;
  label: string;
  title: string;
  copy: string;
  material: string;
  question: string;
}

export const decisionLenses = {
  research: {
    label: 'Reading the evidence',
    title: ['A result is only', 'the beginning.'],
    introduction: 'An observation becomes useful when you can trace it back to a question, understand how it was produced and say what decision it can support.',
    diagramTitle: 'From a research question to an informed next decision',
    diagramCaption: 'Read the connection, not just the conclusion. Select a lens to see what belongs in the record.',
    steps: [
      {key:'question',label:'Question',title:'Keep the original question in view.',copy:'A compelling prototype can distract from the uncertainty it was meant to examine. State the specific person, situation and decision the investigation concerns. Record any change in the question during the work.',material:'The question, its assumptions and the reason this uncertainty matters.',question:'Would the result change the decision we began with, or does it answer a different question?'},
      {key:'source',label:'Source',title:'Show how the observation was made.',copy:'A conversation records a perspective. A prototype exposes an interaction. A process map describes a handoff. Keep the method, context and source beside the observation so another person can follow the reasoning.',material:'Method, participants or source material, relevant context and a dated record of the observation.',question:'Could someone distinguish what was observed from the interpretation placed on it?'},
      {key:'limits',label:'Limits',title:'Make the edges of the result visible.',copy:'A small study may reveal a useful issue without showing how common it is. An invented scenario may test a workflow without proving real-world performance. Note missing perspectives, conditions and questions the method could not address.',material:'Known gaps, alternative explanations and what would need a different kind of investigation.',question:'Which conclusion would be too broad for the evidence we actually have?'},
      {key:'decision',label:'Decision',title:'Give the learning somewhere to go.',copy:'Continue, narrow the question, change the approach or set it aside. Name the next decision and the person responsible for it. If more work is needed, specify what new evidence would make that work worthwhile.',material:'A next decision, its owner, the remaining uncertainty and a bounded follow-up if needed.',question:'What will we do differently because of what we learned?'}
    ] satisfies DecisionLensStep[]
  },
  investor: {
    label: 'An informed conversation',
    title: ['Follow the idea.', 'Examine the substance.'],
    introduction: 'A broad portfolio becomes easier to assess when each direction has a clear context. Follow one opportunity from the intended need to the evidence a next step would require.',
    diagramTitle: 'Four connected lenses for reviewing a venture direction',
    diagramCaption: 'A discussion framework for the portfolio. The connections show review questions, rather than financial performance.',
    steps: [
      {key:'question',label:'Need',title:'Begin with the person and the problem.',copy:'Identify the intended user, the situation they face and the existing way they handle it. Explore why a different approach might matter before discussing an expanded feature set or market narrative.',material:'A defined audience, a representative use case and the basis for the proposed need.',question:'What makes this a problem worth addressing for this particular audience?'},
      {key:'source',label:'Evidence',title:'Separate the direction from demonstrated work.',copy:'Ask which materials can be examined today and what development stage they support. A concept, research record, prototype, pilot and available product each provide a different kind of evidence. Confirm the scope and date of review.',material:'Current work, development status, relevant findings and a clear account of unresolved assumptions.',question:'What has been established, under which conditions, and what remains to be tested?'},
      {key:'limits',label:'Dependencies',title:'Understand what the next step relies on.',copy:'Information access, specialist expertise, partner responsibilities, maintenance and appropriate review can shape an opportunity as much as the idea itself. Discuss who controls each dependency and what happens if it is unavailable.',material:'Dependencies, responsibilities, resource requirements and material constraints for the proposed scope.',question:'Which condition could change the plan, and who is responsible for resolving it?'},
      {key:'decision',label:'Next step',title:'Define a decision that can be reviewed.',copy:'A useful milestone explains what would be learned, how the result would be assessed and what would justify continuing or changing direction. Any capital needs, ownership or proposed terms belong in a documented discussion with NRTH.',material:'A bounded next step, evaluation criteria, decision ownership and company information relevant to the discussion.',question:'What new evidence would make the next commitment more informed?'}
    ] satisfies DecisionLensStep[]
  }
} as const;
