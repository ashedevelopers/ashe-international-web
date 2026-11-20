// Single source of truth for page copy. Facts here come from the live site; edit freely, keep claims accurate.
export const NAV = [
  { label: 'About', href: '#story' },
  { label: 'Programs', href: '#programs' },
  { label: 'Impact', href: '#impact' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO = {
  tag: 'Nakivale, Uganda',
  lines: ['Rooted in', 'Nakivale.', 'Growing together.'],
  body: 'ASHE empowers refugees and host communities with skills, farming and enterprise, so families can stand on their own.',
  chip: { value: '1,500+', label: 'people impacted' },
};

export const TICKER = ['Mushroom farming', 'Computer skills', 'Entrepreneurship', 'Climate resilience', 'Sewing training', 'Permaculture', 'Nakivale'];

export const STORY = {
  tag: 'Who we are',
  title: 'Action for Save Humanity in Emergency',
  body: 'We work side by side with refugees and their Ugandan neighbours in Nakivale Refugee Settlement, Isingiro District, turning training and shared land into lasting livelihoods.',
};

export const STATS = [
  { value: 1500, plus: true, label: 'People impacted', tone: 'bg-ashe-yellow' },
  { value: 12, plus: true, label: 'Volunteer staff', tone: 'bg-ashe-mint' },
  { value: 4, plus: false, label: 'Core programs', tone: 'bg-ashe-clay' },
];

export const PROGRAMS = [
  { icon: 'mushroom', image: 'farm', title: 'Vocational & Mushroom Cultivation', text: 'Hands-on training that turns a small harvest into steady income.' },
  { icon: 'computer', image: 'digital', title: 'Digital & Computer Skills', text: 'Practical computer classes that open doors to work and learning.' },
  { icon: 'market', image: 'market', title: 'Entrepreneurship & Market Access', text: 'Business workshops and market links for refugee and host entrepreneurs.' },
  { icon: 'climate', image: 'trees', title: 'Climate Resilience', text: 'Tree planting and permaculture that protect land and livelihoods.' },
];

// image = file name (without extension) in public/images. Replace or extend with more field photos.
export const GALLERY = [
  { image: 'community', cat: 'Community', caption: 'Gathering in the settlement' },
  { image: 'digital', cat: 'Digital', caption: 'Computer skills session' },
  { image: 'farm', cat: 'Farming', caption: 'Training in the fields' },
  { image: 'team', cat: 'Community', caption: 'The ASHE field team' },
  { image: 'trees', cat: 'Climate', caption: 'Tree planting' },
  { image: 'market', cat: 'Livelihoods', caption: 'Fresh produce handover' },
  { image: 'irrigation', cat: 'Farming', caption: 'Irrigating the crops' },
  { image: 'families', cat: 'Community', caption: 'Families we serve' },
  { image: 'outreach', cat: 'Community', caption: 'Outreach and registration' },
  { image: 'homevisit', cat: 'Community', caption: 'Home visit' },
  { image: 'fields', cat: 'Climate', caption: 'Working the land' },
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

export const FOOTER = { cta: ['Grow', 'Together'], copy: '© 2026 ASHE International. Action For Save Humanity in Emergency.' };
