export type Project = {
  slug: string; name: string; category: string; number: string;
  headline: string; description: string; introduction: string;
  focus: { title: string; text: string }[]; related: string[];
};

export const projects: Project[] = [
  {
    slug: 'nrth-health', name: 'NRTH Health', category: 'Health', number: '01',
    headline: 'A more human perspective on health.',
    description: 'Exploring the connection between people, care, and technology.',
    introduction: 'Health technology should make room for people. NRTH Health explores clearer, more considered ways to connect information, care, and everyday wellbeing.',
    focus: [
      { title: 'People first', text: 'Starting with the needs of people navigating health and care, rather than the complexity of the tools around them.' },
      { title: 'Clearer connections', text: 'Exploring how useful information and thoughtfully designed workflows can make care easier to understand.' },
      { title: 'Considered technology', text: 'Keeping privacy, accessibility, and the sensitivity of health information central to product exploration.' },
    ], related: ['nrth-systems', 'nrth-labs'],
  },
  {
    slug: 'nrth-tms', name: 'NRTH TMS', category: 'Mobility', number: '02',
    headline: 'A clearer view of transportation.',
    description: 'A transportation management project, built around the way work moves.',
    introduction: 'Moving freight means coordinating people, information, and decisions. NRTH TMS explores transportation management with a focus on clear planning and connected operational workflows.',
    focus: [
      { title: 'Planning', text: 'Exploring a more coherent view of transportation work, from an initial request to the decisions that follow.' },
      { title: 'Coordination', text: 'Considering the connections between dispatch, shipment information, and the people responsible for moving it.' },
      { title: 'Operational clarity', text: 'Making the right information easier to find and understand without adding another layer of complexity.' },
    ], related: ['nrth-telematics', 'nrth-logistics', 'nrth-fleet'],
  },
  {
    slug: 'nrth-telematics', name: 'NRTH Telematics', category: 'Mobility', number: '03',
    headline: 'Movement, with more context.',
    description: 'Exploring vehicle data and connected operational intelligence.',
    introduction: 'Data becomes useful when it helps someone make a decision. NRTH Telematics explores the relationship between vehicles, connected information, and the context behind movement.',
    focus: [
      { title: 'Connected information', text: 'Exploring how vehicle information can become part of a clearer operational picture.' },
      { title: 'Useful context', text: 'Considering how location, activity, and vehicle data can support informed decisions.' },
      { title: 'System connections', text: 'Investigating the links between vehicle intelligence and transportation or fleet workflows.' },
    ], related: ['nrth-fleet', 'nrth-tms', 'nrth-systems'],
  },
  {
    slug: 'nrth-logistics', name: 'NRTH Logistics', category: 'Mobility', number: '04',
    headline: 'Connecting the work behind movement.',
    description: 'A logistics project focused on coordination and connected processes.',
    introduction: 'Logistics is a network of handoffs. NRTH Logistics explores how clearer processes and better coordination can connect the people and businesses behind the movement of goods.',
    focus: [
      { title: 'Coordination', text: 'Understanding the relationships between requirements, partners, and the practical work of moving goods.' },
      { title: 'Clear handoffs', text: 'Exploring how information moves between teams, so responsibilities and next steps are easier to understand.' },
      { title: 'Connected processes', text: 'Bringing a broader perspective to the systems and workflows that surround logistics.' },
    ], related: ['nrth-tms', 'nrth-fleet', 'nrth-systems'],
  },
  {
    slug: 'nrth-systems', name: 'NRTH Systems', category: 'Technology', number: '05',
    headline: 'Complexity, thoughtfully connected.',
    description: 'Exploring software and systems that bring work together.',
    introduction: 'The best systems make their complexity useful. NRTH Systems explores software, infrastructure, and the connections that help different parts of a business work together.',
    focus: [
      { title: 'Software', text: 'Exploring purposeful tools around the real needs of the people using them.' },
      { title: 'Integration', text: 'Considering how information and workflows connect across existing systems.' },
      { title: 'Foundations', text: 'Thinking about maintainability, reliability, and clarity from the beginning.' },
    ], related: ['nrth-labs', 'nrth-telematics', 'nrth-health'],
  },
  {
    slug: 'nrth-labs', name: 'NRTH Labs', category: 'Technology', number: '06',
    headline: 'Room for the next idea.',
    description: 'Research, experiments, and a space to explore what comes next.',
    introduction: 'Progress begins with a question. NRTH Labs is a space for exploring ideas, testing approaches, and finding connections between disciplines before an idea becomes a product.',
    focus: [
      { title: 'Research', text: 'Understanding the problem before committing to a solution.' },
      { title: 'Experiments', text: 'Using focused explorations to test an idea and learn from what happens.' },
      { title: 'New connections', text: 'Looking across NRTH projects for opportunities to share knowledge and approaches.' },
    ], related: ['nrth-systems', 'nrth-health', 'nrth-chemicals'],
  },
  {
    slug: 'nrth-chemicals', name: 'NRTH Chemicals', category: 'Industry', number: '07',
    headline: 'A considered approach to materials.',
    description: 'Exploring opportunities in chemicals, materials, and industry.',
    introduction: 'Materials sit behind many of the things people rely on. NRTH Chemicals explores opportunities in the chemical sector and the relationships between materials, applications, and industrial needs.',
    focus: [
      { title: 'Applications', text: 'Understanding the needs that shape the use of chemicals and materials in industry.' },
      { title: 'Partnerships', text: 'Exploring conversations with people and businesses working in the sector.' },
      { title: 'Responsible information', text: 'Recognizing the importance of accurate specifications and appropriate safety documentation for any eventual offering.' },
    ], related: ['nrth-labs', 'nrth-logistics'],
  },
  {
    slug: 'nrth-fleet', name: 'NRTH Fleet', category: 'Mobility', number: '08',
    headline: 'A connected perspective on fleet work.',
    description: 'Exploring the vehicles, people, and processes behind fleet operations.',
    introduction: 'A fleet is more than a collection of vehicles. NRTH Fleet explores the operational picture around vehicles, the people who use them, and the processes that keep work moving.',
    focus: [
      { title: 'Vehicle operations', text: 'Considering how teams understand vehicle activity and responsibilities across a fleet.' },
      { title: 'Planning', text: 'Exploring the relationship between everyday fleet work and longer-term operational needs.' },
      { title: 'Connected workflows', text: 'Understanding where fleet information intersects with transportation and vehicle data.' },
    ], related: ['nrth-telematics', 'nrth-tms', 'nrth-logistics'],
  },
  {
    slug: 'nrth-events', name: 'NRTH Events', category: 'Experiences', number: '09',
    headline: 'Bringing people and ideas together.',
    description: 'Exploring experiences that create meaningful connections.',
    introduction: 'Some connections happen best in person. NRTH Events explores the planning, collaboration, and thoughtful details behind experiences that bring people together.',
    focus: [
      { title: 'Experiences', text: 'Considering the purpose of an event and the experience of the people attending it.' },
      { title: 'Collaboration', text: 'Exploring opportunities to connect people, communities, and organizations.' },
      { title: 'Thoughtful planning', text: 'Keeping the practical details aligned with the reason people gather.' },
    ], related: ['nrth-labs', 'nrth-systems'],
  },
];

export const categories = ['All', 'Health', 'Mobility', 'Technology', 'Industry', 'Experiences'];
