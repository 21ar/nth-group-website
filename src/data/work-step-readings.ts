export type WorkStepReading = {
  record: string;
  checkpoint: string;
};

/** Illustrative records and review questions, ordered to match each context's flow. */
export const workStepReadings: Record<string, Record<string, WorkStepReading[]>> = {
  'nrth-health': {
    'visit-preparation': [
      {
        record: 'An appointment preparation question in the person’s own words, with the message that prompted it and the detail they still need before arriving.',
        checkpoint: 'Does this identify one practical uncertainty the person needs resolved before the visit?',
      },
      {
        record: 'An answer linked to the organization’s approved instructions, with its applicable location, appointment type, information owner and date of the last confirmed update.',
        checkpoint: 'Can the reader tell whether these instructions apply to their appointment and where they came from?',
      },
      {
        record: 'A short contact handoff carrying the unresolved preparation question, the instructions already consulted and the administrative team responsible for the next response.',
        checkpoint: 'Does the person know whom to contact and which question to ask without repeating the whole journey?',
      },
    ],
    'care-coordination': [
      {
        record: 'An administrative request summary distinguishing its purpose, current status, authorized recipient and the minimum supporting information needed to understand the outstanding question.',
        checkpoint: 'Could the receiving team understand the request without seeing unrelated personal information?',
      },
      {
        record: 'A receiving responsibility note naming the team that can accept the request, the expected acknowledgment and the originating contact to notify if ownership changes.',
        checkpoint: 'What acknowledgment would show that a responsible team has accepted this specific request?',
      },
      {
        record: 'A return message explaining what was acknowledged, which administrative action follows, who owns it and what the person or coordinating team still needs to provide.',
        checkpoint: 'Can each participant distinguish an acknowledged request from a completed administrative action?',
      },
    ],
    'accessible-information': [
      {
        record: 'A task setting note describing the expected device, input method, language familiarity and environmental constraints, with access needs kept distinct from assumptions about the audience.',
        checkpoint: 'Which described access condition would materially change how someone reads or completes this task?',
      },
      {
        record: 'A content outline with the essential answer first, descriptive headings, understandable supporting detail and a labeled contact route in the intended reading order.',
        checkpoint: 'Does the reading order still explain the next action when layout and visual emphasis are removed?',
      },
      {
        record: 'An observation sheet noting where someone located the practical step, which input method they used and the words or controls that caused hesitation.',
        checkpoint: 'What observed barrier prevented understanding or action, and which part of the experience needs revision?',
      },
    ],
  },
  'nrth-tms': {
    'recurring-movements': [
      {
        record: 'A recurring job template alongside today’s request, separating reusable pickup requirements from dates, quantities, receiving arrangements and other details that need fresh confirmation.',
        checkpoint: 'Which requirement changed this time, and which apparently familiar detail still needs confirmation?',
      },
      {
        record: 'An assignment comparison joining the current job requirements to proposed equipment, availability and receiving commitments, with unresolved resource constraints left visible for the planner.',
        checkpoint: 'Does the proposed resource fit this job’s confirmed requirements rather than the previous job’s assumptions?',
      },
      {
        record: 'A dispatch handoff identifying the agreed job version, accepted assignment, relevant partner confirmations and any question the receiving team must resolve before proceeding.',
        checkpoint: 'Can dispatch identify the accepted version and distinguish confirmed details from open planning questions?',
      },
    ],
    'connected-stops': [
      {
        record: 'A stop schedule recording each location’s required work, available window, access conditions and the contact who can confirm that particular appointment or arrangement.',
        checkpoint: 'Is every stop tied to a specific requirement, confirmation owner and usable time window?',
      },
      {
        record: 'A dependency note showing which later appointment relies on an earlier stop’s timing, completion or documents, including the assumption that links the two commitments.',
        checkpoint: 'If this stop changes, can the planner identify the later commitment affected and explain why?',
      },
      {
        record: 'A proposed sequence revision with its planning owner, changed commitments and the partners whose acceptance is needed before the revised arrangement can be dispatched.',
        checkpoint: 'Whose acceptance is still needed before this revised sequence becomes the plan people act on?',
      },
    ],
    'planning-handover': [
      {
        record: 'A handover snapshot separating accepted assignments, provisional arrangements and unanswered requests, with the current revision and confirmation source beside each relevant planning detail.',
        checkpoint: 'Can the incoming planner see which commitments are accepted and which still await a response?',
      },
      {
        record: 'A planning rationale attached to an unusual assignment, describing the constraint it addresses, alternatives already considered and the downstream commitment that depends on it.',
        checkpoint: 'Would the next planner understand the consequence of changing this assignment before revising it?',
      },
      {
        record: 'An open question handover naming the incoming owner, required confirmation, available supporting context and the next planning decision that should wait for the answer.',
        checkpoint: 'Has someone explicitly accepted ownership of the unresolved question rather than simply received the handover?',
      },
    ],
  },
  'nrth-telematics': {
    'departure-context': [
      {
        record: 'An operations question tied to the assigned job and next handoff, stating which departure commitment the team is checking and what evidence would be relevant.',
        checkpoint: 'What particular commitment is being checked, and how could an observation inform that question?',
      },
      {
        record: 'An observation timeline placing recorded activity, source and timestamps beside the expected job sequence, with partner confirmations shown as separate evidence rather than inferred events.',
        checkpoint: 'Is the observation recent and relevant enough to inform this assignment’s next commitment?',
      },
      {
        record: 'An uncertainty note distinguishing the recorded movement from unconfirmed departure readiness or job completion, with the responsible contact and the exact confirmation still required.',
        checkpoint: 'Which conclusion remains unsupported by the vehicle observation, and who can confirm it?',
      },
    ],
    'stop-context': [
      {
        record: 'A recorded activity interval with its start and end observations, source timestamps and known coverage gaps, leaving the reason for the pause explicitly unconfirmed.',
        checkpoint: 'Does this description stay within what the recorded observations establish about the interval?',
      },
      {
        record: 'A context comparison placing the observed interval beside scheduled stops, receiving arrangements and known operational messages, without treating proximity alone as evidence of accepted work.',
        checkpoint: 'Which confirmed operating detail explains the interval, and which possible explanation remains an assumption?',
      },
      {
        record: 'A verification request naming the operations contact, the observed interval to clarify and the later commitment that could need attention if the situation differs from plan.',
        checkpoint: 'Can the responsible person answer a precise question instead of receiving an unexplained activity alert?',
      },
    ],
    'signal-continuity': [
      {
        record: 'A last-known observation label carrying its event time, receipt time where available, source and age, separate from the moment the operations team is viewing it.',
        checkpoint: 'Can the viewer distinguish when the activity was observed from when the information was displayed?',
      },
      {
        record: 'A coverage note comparing the expected source update interval with available observations, identifying the unsupported time span and the operational conclusion that cannot yet be made.',
        checkpoint: 'Which decision is limited by the gap rather than merely delayed by a missing update?',
      },
      {
        record: 'A verification choice connecting the unanswered operational question to a suitable alternate source, fresh observation or responsible contact, with the remaining uncertainty still stated.',
        checkpoint: 'Would this verification route provide the evidence needed for the decision the team is facing?',
      },
    ],
  },
  'nrth-logistics': {
    'partner-onboarding': [
      {
        record: 'A two-party requirements outline listing each side’s timing, contacts, document needs and acceptance conditions, with disagreements distinguished from details that have simply not been answered.',
        checkpoint: 'Can both parties identify what they must provide and what they require before proceeding?',
      },
      {
        record: 'An acceptance definition describing the acknowledgment each party recognizes, the person authorized to give it and any unresolved condition excluded from the agreed arrangement.',
        checkpoint: 'Would both parties interpret this acknowledgment as acceptance of the same arrangement and scope?',
      },
      {
        record: 'A first handoff brief bringing agreed requirements, current contacts and open questions together for the coordinators, with the source of each partner condition identifiable.',
        checkpoint: 'Can the coordinating team check the first movement against the arrangement both partners accepted?',
      },
    ],
    'document-thread': [
      {
        record: 'A document requirement list linking each requested item to its requesting party, purpose and dependent handoff, with the consequence of a missing item described clearly.',
        checkpoint: 'Which transition depends on this document, and what information does the receiving party need from it?',
      },
      {
        record: 'A document register preserving the originating owner, revision, transmission reference and receiving response, with received, reviewed and accepted recorded as distinct states where applicable.',
        checkpoint: 'Can the recipient identify the authoritative version without mistaking receipt for review or acceptance?',
      },
      {
        record: 'An outstanding requirement note naming the missing detail, its requested source, the party able to resolve it and the handoff waiting for a usable response.',
        checkpoint: 'Is the remaining gap precise enough for its owner to supply the needed information?',
      },
    ],
    'post-handoff': [
      {
        record: 'A state comparison preserving what each party means by sent, received and accepted, beside the evidence recorded and the state the downstream commitment actually requires.',
        checkpoint: 'Does the next party need evidence of receipt, acceptance or a different completed action?',
      },
      {
        record: 'A reconciliation question classifying the gap as a missing acknowledgment, disputed arrangement or unfinished task, with the relevant evidence and responsible party attached.',
        checkpoint: 'Has the team identified the unresolved condition itself rather than labeling every difference an exception?',
      },
      {
        record: 'A return confirmation identifying the now-understood handoff state, its supporting acknowledgment and any remaining action the downstream coordinator needs to consider before proceeding.',
        checkpoint: 'Can the next coordinator tell what is settled and what still requires a separate action?',
      },
    ],
  },
  'nrth-systems': {
    'access-lifecycle': [
      {
        record: 'A role task matrix linking necessary viewing and editing permissions to actual responsibilities, with records outside the task boundary explicitly excluded from the proposed access.',
        checkpoint: 'Is each requested permission justified by a task this role is responsible for performing?',
      },
      {
        record: 'An access change route identifying the approving owner, authoritative role record and connected tools that need the change, with acknowledgment responsibilities for each exchange.',
        checkpoint: 'Which source establishes the new responsibility, and who can authorize tools to reflect it?',
      },
      {
        record: 'An access review and removal checklist connecting role changes or departures to revocation owners, affected tools and the evidence needed to confirm that access has ended.',
        checkpoint: 'How will the responsible owner know that the former responsibility no longer grants access?',
      },
    ],
    'record-ownership': [
      {
        record: 'A field ownership map connecting each decision-relevant value to its authoritative source, update owner and permitted use, rather than assigning authority to a whole copied record.',
        checkpoint: 'For this decision, can the receiving team identify exactly which source owns the relevant value?',
      },
      {
        record: 'An exchange description stating the changed fields, source identity, revision meaning and receiving acknowledgment, alongside the specific actions the receiving workflow may take from that update.',
        checkpoint: 'What can the receiving workflow rely on, and which source context must accompany the change?',
      },
      {
        record: 'A conflict resolution path identifying the competing values, applicable ownership rule, person responsible for unresolved cases and the return update that reconciles connected records.',
        checkpoint: 'If both records change, which rule or owner settles the disagreement and communicates the result?',
      },
    ],
    'exchange-recovery': [
      {
        record: 'An exchange state definition distinguishing request creation, transmission, receipt and acceptance, with the acknowledgment or evidence required before the workflow advances between those states.',
        checkpoint: 'Does each displayed state correspond to evidence the exchange actually provides at that point?',
      },
      {
        record: 'A recoverable request record preserving the original identity, relevant inputs, attempts and acknowledgments, with any duplicate or conflicting response linked back to the same initiating action.',
        checkpoint: 'Can an operator trace this retry to the original request without treating it as new work?',
      },
      {
        record: 'A recovery instruction distinguishing a safe repeat from an action needing verification, identifying the unresolved state and the operational owner able to confirm the appropriate next step.',
        checkpoint: 'What evidence is required before repeating an action that might already have changed the work?',
      },
    ],
  },
  'nrth-labs': {
    'interaction-study': [
      {
        record: 'A study question naming the suspected misunderstanding, intended audience and design decision that would change if the assumption is unsupported by observed task behavior.',
        checkpoint: 'Would an answer to this question change a specific design decision rather than collect a preference?',
      },
      {
        record: 'A task and observation guide specifying the participant’s practical goal, neutral prompt and behaviors to note, with hesitation and explanations recorded separately from researcher interpretation.',
        checkpoint: 'Can the task expose the uncertainty without telling participants which control or answer to choose?',
      },
      {
        record: 'A finding note separating observed actions, participant explanations and possible interpretations, with contradictory examples retained and the narrower follow-up needed to distinguish the explanations.',
        checkpoint: 'Which interpretation is supported by the observation, and which competing explanation needs another study?',
      },
    ],
    'technical-prototype': [
      {
        record: 'A prototype boundary specifying the uncertain behavior, representative inputs, tested conditions and expected observation, with surrounding production requirements deliberately left outside the experiment.',
        checkpoint: 'Is the prototype examining one assumption under stated conditions rather than implying a complete implementation?',
      },
      {
        record: 'An edge case log preserving the input, timing or conflict introduced, the observed response and the specific uncertainty that each case was intended to examine.',
        checkpoint: 'Do these cases reveal the exchange’s meaning when information is delayed, absent or contradictory?',
      },
      {
        record: 'A prototype findings summary recording demonstrated behavior alongside unexamined access, operating and reliability needs, with a proposed follow-up for each gap affecting the next decision.',
        checkpoint: 'Which production requirement remains untested even if the prototype showed the intended behavior?',
      },
    ],
    'evidence-review': [
      {
        record: 'An evidence question stating the claim under review, intended use and pending decision, with the type of information or expertise needed to examine it.',
        checkpoint: 'What would the review need to establish for the pending decision to become better informed?',
      },
      {
        record: 'A source-linked review note preserving the relevant statement, document revision, origin and stated conditions, with its relationship to the evidence question explained beside the excerpt.',
        checkpoint: 'Can another reviewer locate the original statement and understand its relevance without losing its conditions?',
      },
      {
        record: 'An evidence gap list distinguishing missing source material from questions needing new observations or qualified interpretation, with the appropriate next investigation named for each unresolved point.',
        checkpoint: 'Does the unanswered point require another document, a focused study or specialist interpretation?',
      },
    ],
  },
  'nrth-chemicals': {
    'application-brief': [
      {
        record: 'An application outline describing the material’s intended role, relevant operating environment and requirement prompting the inquiry, with unspecified conditions retained as questions for the application owner.',
        checkpoint: 'Does the brief describe the actual use conditions rather than rely on a material name alone?',
      },
      {
        record: 'A specialist question list connecting application requirements to properties, compatibility considerations and requested documentation, with the responsible reviewer identified for each area needing technical interpretation.',
        checkpoint: 'Which technical question must a qualified reviewer answer before this direction can be considered further?',
      },
      {
        record: 'A review scope describing the requested evidence, application assumptions and unresolved questions, together with the specialist expertise needed to assess what the documentation can support.',
        checkpoint: 'Is the review bounded to this application, with missing evidence and necessary expertise clearly identified?',
      },
    ],
    'evidence-comparison': [
      {
        record: 'A specification entry preserving the reported property exactly as documented, with units, stated test conditions, source and revision beside it for the reviewer to inspect.',
        checkpoint: 'Have the original units and conditions remained attached to the reported property being compared?',
      },
      {
        record: 'A comparison note identifying which statements address the same application requirement, differences in conditions or definitions and the reviewer’s explanation of any limits on comparability.',
        checkpoint: 'Are these statements comparable for the intended question, or do their conditions require further interpretation?',
      },
      {
        record: 'A documentation query quoting the unresolved statement, naming the missing condition or definition and directing the question to its source or the appropriate technical specialist.',
        checkpoint: 'Could the source respond to this precise gap without guessing which document or condition is disputed?',
      },
    ],
    'partner-handoff': [
      {
        record: 'A technical handoff note naming the application question, next responsible participant and expertise or source information that participant is expected to contribute to the review.',
        checkpoint: 'Does the next participant have the responsibility and relevant expertise to address this specific question?',
      },
      {
        record: 'An inquiry package connecting the current application brief, requested document revisions and unresolved questions to their owners, with changes from the earlier scope visible for review.',
        checkpoint: 'Can the next reviewer distinguish the current application and evidence from superseded material?',
      },
      {
        record: 'A discussion status note separating inquiry receipt, pending specialist review and any accepted next action, while leaving technical conclusions and commercial terms unconfirmed until their owners agree.',
        checkpoint: 'What remains unconfirmed even after the inquiry has reached the appropriate partner?',
      },
    ],
  },
  'nrth-fleet': {
    'shift-handover': [
      {
        record: 'An asset handover snapshot combining the recorded status source and time, upcoming assignment and open maintenance or condition question, without presenting the record as operating clearance.',
        checkpoint: 'Can the receiving person distinguish current recorded information from the confirmation still needed for the work?',
      },
      {
        record: 'A receiving responsibility note stating what the incoming person must verify, the specialist or team owning an unresolved issue and the assignment that depends on the answer.',
        checkpoint: 'Which verification belongs to the receiving person, and which question requires another responsible owner?',
      },
      {
        record: 'An asset update message carrying the confirmed change, its responsible source and affected assignment or maintenance commitment to the owners whose next work relies on it.',
        checkpoint: 'Have the planning and maintenance owners received the confirmation relevant to their own commitments?',
      },
    ],
    'maintenance-coordination': [
      {
        record: 'A commitment comparison placing planned operational use beside the maintenance arrangement, with each time window, requirement and owner preserved so the actual scheduling conflict is visible.',
        checkpoint: 'Where do the two commitments compete, and which requirements explain why both cannot simply proceed unchanged?',
      },
      {
        record: 'A revision responsibility outline showing which owner can change the operational assignment, which can revise the maintenance arrangement and what acceptance each needs from the other.',
        checkpoint: 'Who has authority to revise each commitment, and what must the other team confirm?',
      },
      {
        record: 'An accepted arrangement update identifying the revised asset commitment, confirmation source and later assignments or appointments the relevant planners need to reconsider as a result.',
        checkpoint: 'Which dependent plans need an explicit revision now that the new arrangement has been accepted?',
      },
    ],
    'capacity-conversation': [
      {
        record: 'A future resource outline distinguishing accepted assignments and asset commitments from tentative demand or unconfirmed availability, with the basis of each provisional assumption shown separately.',
        checkpoint: 'Can the team see which parts of the outlook are commitments and which remain planning assumptions?',
      },
      {
        record: 'A dependency view identifying jobs or periods that rely on the same asset, availability assumption or unresolved status, with the shared source of uncertainty made explicit.',
        checkpoint: 'Which commitments would need reconsideration together if this shared resource assumption changes?',
      },
      {
        record: 'A resource confirmation request naming the most consequential open assumption, the owner able to clarify it and the evidence needed before the proposed commitment becomes better supported.',
        checkpoint: 'Would this answer resolve the uncertainty that most affects the proposed resource plan?',
      },
    ],
  },
  'nrth-events': {
    'arrival-orientation': [
      {
        record: 'An invitation content outline combining the gathering’s purpose, arrival arrangements and immediate support route, with optional detail separated from what someone needs before setting out.',
        checkpoint: 'Can an unfamiliar participant understand why to attend, where to arrive and how to ask for help?',
      },
      {
        record: 'An arrival journey sketch linking the first contact point to orientation cues, relevant spaces and available support, including the route for a participant with an access need.',
        checkpoint: 'After the first welcome, can someone find the next place or support without relying on prior familiarity?',
      },
      {
        record: 'An opening activity brief describing how newcomers join the intended exchange, what explanation they need and the participation choices available before the first programmed moment.',
        checkpoint: 'Does this introduction give participants a clear, comfortable way to contribute to the gathering’s purpose?',
      },
    ],
    'ideas-demonstration': [
      {
        record: 'A demonstration introduction naming the idea, question and audience context, with the behavior being shown and its limits explained in language a newcomer can understand.',
        checkpoint: 'Can the audience understand what the demonstration explores before being asked to interpret it?',
      },
      {
        record: 'A shared session outline arranging the demonstration, viewing or participation conditions and time for questions, with facilitation responsibilities around unfamiliar concepts and different interpretations.',
        checkpoint: 'Where can participants ask a question or contribute an interpretation while the idea is still present?',
      },
      {
        record: 'A conversation follow-up plan selecting the material, contact or next invitation that fits the exchange, with the owner and participant permission for any onward communication clear.',
        checkpoint: 'What can participants use afterward to continue the particular conversation this demonstration began?',
      },
    ],
    'format-transitions': [
      {
        record: 'A participant journey revision identifying the moments affected by a room, timing or format change, including arrival cues, informal space and the next shared session.',
        checkpoint: 'Which part of the participant’s journey changes first, and what later moments depend on it?',
      },
      {
        record: 'A transition coordination note linking programming, venue and production owners to the same revised arrangement, with access implications and required confirmations recorded before participant information changes.',
        checkpoint: 'Have the practical owners agreed the change and addressed its effect on access and participation?',
      },
      {
        record: 'A transition message stating the participant’s immediate next action, relevant place or timing and available support, delivered through a format appropriate to where people encounter the change.',
        checkpoint: 'At the point of transition, can attendees understand what to do next and where to find support?',
      },
    ],
  },
};
