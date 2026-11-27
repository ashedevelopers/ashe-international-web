// The four text values below are "live bindings": the dashboard can replace them before the page renders (see setAboutText).
export let MOTTO = 'Beyond Emergency, Toward Self-Reliance';

export let MISSION = 'We equip refugees, displaced people and marginalised groups, especially youth and women, with the skills, resources and opportunities to feed their families, earn an income and lead their own recovery.';

export let VISION = 'A world where refugees and displaced people shape their own future and live with dignity and independence.';

export let FOCUS_NOTE = 'Youth and women are at the centre of every programme.';

export const getAboutText = () => ({ motto: MOTTO, mission: MISSION, vision: VISION, focusNote: FOCUS_NOTE });
export function setAboutText(v) {
  if (!v || typeof v !== 'object') return;
  if (typeof v.motto === 'string') MOTTO = v.motto;
  if (typeof v.mission === 'string') MISSION = v.mission;
  if (typeof v.vision === 'string') VISION = v.vision;
  if (typeof v.focusNote === 'string') FOCUS_NOTE = v.focusNote;
}

export const VALUES = [
  { t: 'Right Action', d: 'Every activity serves the common good.' },
  { t: 'Love over Selfishness', d: 'Solidarity and empathy guide our work.' },
  { t: 'Abundant Joy', d: 'We build hope through positive engagement.' },
  { t: 'Integrity & Accountability', d: 'We manage funds and programmes transparently.' },
  { t: 'Participation & Inclusion', d: 'Communities decide with us, free from discrimination.' },
];

export const OBJECTIVES = [
  'Improve food security and nutrition through sustainable farming.',
  'Strengthen climate resilience and protect the environment.',
  'Create income opportunities for youth and women.',
  'Provide market-relevant vocational training.',
  'Expand access to education, literacy and digital skills.',
  'Strengthen families through psychosocial support.',
  'Ensure safe water, sanitation and hygiene.',
  'Build local leadership so affected people own the decisions that shape their lives.',
  'Advocate for the rights of displaced and marginalised groups.',
];
