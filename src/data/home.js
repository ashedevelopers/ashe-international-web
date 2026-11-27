// Home-page content that used to be written directly inside components. It is editable in Dashboard > Site content.
export const HERO_SLIDES = [
  { tag: 'Kitchen Gardens', title: 'Zero-land farming: kitchen gardens that feed families', text: '90 household gardens established in 2026: container gardens of kale, beet and cabbage.', image: 'field/kitchen-garden', alt: 'A field officer tending a kitchen garden' },
  { tag: 'Reforestation', title: 'Trees today, shade and food tomorrow', text: '2,500 seedlings raised and distributed to 120 households and 3 schools in 2026.', image: 'field/reforestation', alt: 'Families receiving tree seedlings' },
  { tag: 'Livelihoods', title: 'Goats that multiply: one gift, many families', text: '50 goats to 5 groups on a pass-on model: each group shares offspring with other households.', image: 'field/goats', alt: 'A group with the goats they received' },
  { tag: 'Featured Campaign', title: "Let's build a center for Nakivale's refugee women", text: 'A campaign to build a center for refugee women in Nakivale Refugee Settlement, Uganda.', image: 'outreach', alt: 'ASHE team meeting women in Nakivale', campaign: true },
];

// "At a glance" numbers section on the home page.
export const GLANCE = {
  tag: 'From our Annual Report',
  title: '2026 at a glance',
  profile: 'Participant profile: 65% women, 35% host-community members, 25% youth under 25.',
  items: [
    { v: 213, l: 'People reached', n: 'across 7 villages in Nakivale', tone: 'bg-ashe-yellow' },
    { v: 2500, l: 'Seedlings raised', n: 'distributed to 120 households and 3 schools', tone: 'bg-ashe-mint' },
    { v: 90, l: 'Household gardens', n: 'kitchen gardens established', tone: 'bg-[#B9DDF2]' },
    { v: 50, l: 'Goats', n: 'to 5 groups on a pass-on model', tone: 'bg-ashe-clay' },
    { v: 100, l: 'Birds', n: 'to 40 households', tone: 'bg-[#A8E6B5]' },
    { v: 30, l: 'Youth trained', n: 'in digital skills', tone: 'bg-ashe-yellow' },
  ],
};
