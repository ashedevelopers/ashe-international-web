// Single source of truth for page copy. Mission, vision, values and focus areas come from ASHE's official statement;
// photos and captions in the gallery come from the 2025 and 2026 reports.
export const NAV = [
  { label: 'About', href: '#story' },
  { label: 'Programs', href: '#programs' },
  { label: 'Impact', href: '#impact' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO = {
  tag: 'Nakivale, Uganda',
  lines: ['Rooted in', 'Nakivale.', 'Growing together.'],
  body: 'We equip refugees, displaced people and marginalised groups, especially youth and women, with the skills, resources and opportunities to feed their families, earn an income and lead their own recovery.',
  chip: { value: '1,500+', label: 'served since founding' },
};

export const TICKER = ['Agriculture & food security', 'Climate action', 'Livelihoods', 'Tailoring & vocational skills', 'Digital skills', 'Family & community support', 'WASH', 'Self-reliance'];

export const STORY = {
  tag: 'Who we are',
  title: 'Action for Save Humanity in Emergency',
  body: 'We equip refugees, displaced people and marginalised groups, especially youth and women, with the skills, resources and opportunities to feed their families, earn an income and lead their own recovery.',
};

export const STATS = [
  { value: 1500, plus: true, label: 'People served since founding', tone: 'bg-ashe-yellow' },
  { value: 12, plus: true, label: 'Volunteer staff', tone: 'bg-ashe-mint' },
  { value: 7, plus: false, label: 'Focus areas', tone: 'bg-ashe-clay' },
];

// The seven focus areas. Youth and women are at the centre of every programme. image = file in public/images (without .jpg).
export const PROGRAMS = [
  { icon: 'mushroom', image: 'field/market-garden', title: 'Agriculture & Food Security', text: 'Farming training and land access.' },
  { icon: 'climate', image: 'field/reforestation', title: 'Environment & Climate Action', text: 'Tree planting and clean energy.' },
  { icon: 'market', image: 'field/goats', title: 'Entrepreneurship & Livelihoods', text: 'Start-up support, savings groups and mentoring.' },
  { icon: 'tailoring', image: 'community', title: 'Tailoring & Vocational Skills', text: 'Marketable trades.' },
  { icon: 'computer', image: 'field/youth-digital', title: 'Education & Digital Skills', text: 'Adult literacy and computer training.' },
  { icon: 'family', image: 'homevisit', title: 'Family & Community Support', text: 'Psychosocial care for at-risk youth, adolescent girls and single mothers.' },
  { icon: 'water', image: 'field/irrigation-2025', title: 'Water, Sanitation & Hygiene (WASH)', text: 'Menstrual hygiene and harvest water.' },
];

// Real field photos with captions taken from the 2025 and 2026 reports.
export const GALLERY = [
  { image: 'field/kitchen-garden', cat: 'Farming', caption: 'Kitchen gardens: container beds of kale, beet and cabbage' },
  { image: 'field/market-garden', cat: 'Farming', caption: 'Sustainable agriculture and market gardening' },
  { image: 'field/sack-gardens', cat: 'Farming', caption: 'Sack and ring gardens built from recycled materials' },
  { image: 'field/harvest-women', cat: 'Farming', caption: 'Group members showing their harvest' },
  { image: 'field/irrigation-2025', cat: 'Farming', caption: 'Staff and farmers irrigating a field plot' },
  { image: 'field/goats', cat: 'Livelihoods', caption: 'Goat pass-on: 50 goats to 5 groups' },
  { image: 'field/poultry', cat: 'Livelihoods', caption: 'Poultry, goats and small animal husbandry' },
  { image: 'field/poultry-distribution', cat: 'Livelihoods', caption: 'Tagged hens go to women\'s group members' },
  { image: 'field/reforestation', cat: 'Climate', caption: 'Families receive fruit and shade seedlings' },
  { image: 'field/seedling-nursery', cat: 'Climate', caption: 'Field officers manage the seedling nursery' },
  { image: 'field/school-tree-planting', cat: 'Climate', caption: 'A young participant plants a tree seedling at school' },
  { image: 'field/youth-planting', cat: 'Climate', caption: 'Youth volunteers planting tree seedlings' },
  { image: 'field/youth-digital', cat: 'Digital', caption: 'Hands-on laptop training for young people' },
  { image: 'field/staff-training', cat: 'Training', caption: 'Staff training with InnovYeng Entrepreneuriat Féminin' },
  { image: 'field/team-certificates', cat: 'Training', caption: 'The ASHE team receives certificates' },
  { image: 'field/community-distribution', cat: 'Community', caption: 'A community distribution event' },
  { image: 'field/village-gathering', cat: 'Community', caption: 'Community gathering in the settlement' },
];

// Fallback: if /images/<name>.jpg is missing, the live site's copy is used.
export const IMG_LIVE = {
  team: 'ashe-1-CiYohiym.jpg', digital: 'ashe-2-BsPKMHgT.jpg', families: 'ashe-3-CzbCW39a.jpg', market: 'ashe-4-Dt4VCnDR.jpg',
  homevisit: 'ashe-5-DDCoT7a1.jpg', farm: 'ashe-6-6Z7MYRHU.jpg', irrigation: 'ashe-7-B1p000qm.jpg', outreach: 'ashe-8-ujeapvmb.jpg',
  community: 'ashe-june-_zUKfqae.jpg', trees: 'ashe-qw-D7gMHgwH.jpg', fields: 'ashe-we--77jRzEU.jpg',
};

export const FAQS = [
  { q: 'How are donations used?', a: 'Gifts fund training, seed materials and equipment for refugees and host communities in Nakivale.' },
  { q: 'Can I start a fundraiser?', a: 'Yes. Sign up, submit your campaign and the team reviews it before it goes live.' },
  { q: 'How are funds released?', a: 'Campaign funds are released in phases, tied to milestones and proof of impact.' },
  { q: 'Can I volunteer or partner?', a: 'Yes. Use the Donate / Partner form and tell us how you would like to help.' },
];

export const DONATE = {
  currencies: ['UGX', 'USD', 'EUR', 'GBP'],
  presets: [10000, 50000, 100000],
  methods: {
    'Mobile Money': { phoneLabel: 'Mobile money number (MTN / Airtel)', note: 'You will get a secure mobile money prompt to confirm your gift.' },
    'Bank / International': { phoneLabel: 'Phone (optional)', note: 'We will email you our bank and international transfer details to complete your pledge.' },
  },
};

export const FOOTER = { cta: ['Grow', 'Together'], copy: '© 2024 - 2027 ASHE International. Action For Save Humanity in Emergency.' };
