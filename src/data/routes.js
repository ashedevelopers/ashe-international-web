export const SITE_URL = 'https://asheinternational.org';

const BASE = 'ASHE (Action For Save Humanity in Emergency)';
const t = (name) => `${name} · ${BASE}`;

// Public pages that are rendered to real HTML files at build time (title, description and canonical link are injected per page).
export const ROUTES = [
  { path: '/', title: `${BASE} | Rooted in Nakivale, Growing Together`, description: 'ASHE empowers refugees and host communities in Nakivale Refugee Settlement, Uganda through vocational training, mushroom cultivation, computer skills, entrepreneurship and climate resilience. Donate, partner or volunteer today.' },
  { path: '/about', title: t('About Us'), description: 'Learn about ASHE: our story, mission, vision and the team empowering refugees and host communities in Nakivale Refugee Settlement, Uganda.' },
  { path: '/programs', title: t('Programs'), description: 'Explore ASHE programs: mushroom cultivation, computer skills, entrepreneurship, climate resilience and environmental awareness for refugees in Uganda.' },
  { path: '/projects', title: t('Projects'), description: 'Hand-picked campaigns making the biggest impact for refugees and host communities in Uganda.' },
  { path: '/partners', title: t('Partners'), description: 'The organisations that partner with ASHE to support refugees and host communities in Uganda.' },
  { path: '/volunteer', title: t('Volunteer'), description: 'Become an ASHE volunteer and help refugees and host communities in Nakivale, Uganda.' },
  { path: '/gallery', title: t('Gallery'), description: 'Photos from ASHE programs and community life in Nakivale Refugee Settlement, Uganda.' },
  { path: '/contact', title: t('Contact'), description: 'Contact ASHE International in Nakivale Refugee Settlement, Isingiro District, Uganda.' },
  { path: '/start-fundraiser', title: t('Start a Fundraiser'), description: 'NGOs, schools and churches can raise funds with ASHE: digital agreements, phased releases and proof of impact.' },
  { path: '/privacy', title: t('Privacy Policy'), description: 'How ASHE International collects, uses and protects your personal information.' },
  { path: '/terms', title: t('Terms of Use'), description: 'Terms of use for the ASHE International website and fundraising platform.' },
];
