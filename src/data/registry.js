// Every piece of editable site content. Dashboard > Site content builds its forms from this list, and
// src/lib/content.js applies the saved versions (content keys "site.<name>") before the site renders.
import { HERO, TICKER, STORY, STATS, PROGRAMS, GALLERY, FAQS, DONATE, FOOTER } from './asheContent.js';
import { SITE, PAGES, TEAM, ABOUT, TRAINING, FUNDRAISER_FEATURES, FEATURED, CAMPAIGN } from './site.js';
import { VALUES, OBJECTIVES, getAboutText, setAboutText } from './about.js';
import { PARTNERS } from './partners.js';
import { HERO_SLIDES, GLANCE } from './home.js';

// Field builders: k = key, l = label, t = type, h = hint.
const T = (k, l, o) => ({ k, l, t: 'text', ...o });
const A = (k, l, o) => ({ k, l, t: 'area', ...o });
const U = (k, l, o) => ({ k, l, t: 'url', ...o });
const IM = (k, l, o) => ({ k, l: l || 'Photo', t: 'image', h: 'Pick a photo name already on the site, paste a link, or upload a new photo.', ...o });
const N = (k, l, o) => ({ k, l, t: 'number', ...o });
const B = (k, l, o) => ({ k, l, t: 'bool', ...o });
const S = (k, l, o) => ({ k, l, t: 'strings', ...o });
const NS = (k, l, o) => ({ k, l, t: 'numbers', ...o });
const SEL = (k, l, options) => ({ k, l, t: 'select', o: options });
const L = (k, l, f, o) => ({ k, l, t: 'list', f, ...o });
const G = (k, l, f, o) => ({ k, l, t: 'group', f, ...o });

const TONES = [
  { v: 'bg-ashe-yellow', l: 'Yellow' }, { v: 'bg-ashe-mint', l: 'Mint' }, { v: 'bg-[#B9DDF2]', l: 'Sky blue' },
  { v: 'bg-ashe-clay', l: 'Clay' }, { v: 'bg-[#A8E6B5]', l: 'Fresh green' },
];
const ICON_OPTS = ['mushroom', 'climate', 'market', 'tailoring', 'computer', 'family', 'water'].map((v) => ({ v, l: v }));

// Edits the live object/array in place, so every component that imported it sees the change.
const inPlace = (target) => ({
  get: () => target,
  set: (v) => { if (Array.isArray(target)) target.splice(0, target.length, ...v); else Object.assign(target, v); },
});
const entry = (group, label, page, target, root) => ({ group, label, page, ...inPlace(target), root });

export const GROUPS = ['Home page', 'About page', 'Partners', 'Menu, contact & footer', 'Campaign & donations'];

export const REGISTRY = {
  hero_slides: entry('Home page', 'Top banner slides', '/', HERO_SLIDES, L('', '', [
    T('tag', 'Small label'), T('title', 'Headline'), A('text', 'Text under the headline'), IM('image'), T('alt', 'Photo description (for screen readers)'),
    B('campaign', 'This slide opens the campaign preview (instead of Donate)'),
  ], { item: 'Slide', min: 1 })),
  hero_badge: entry('Home page', 'Top banner badge', '/', HERO, G('', '', [G('chip', 'Badge on the banner photo', [T('value', 'Number, e.g. 1,500+'), T('label', 'Caption')])])),
  ticker: entry('Home page', 'Scrolling words strip', '/', TICKER, S('', '', { item: 'Word' })),
  story: entry('Home page', 'Who we are', '/', STORY, G('', '', [T('tag', 'Small label'), T('title', 'Title'), A('body', 'Text')])),
  stats: entry('Home page', 'Three big numbers', '/', STATS, L('', '', [N('value', 'Number'), B('plus', 'Show a + after it'), T('label', 'Label'), SEL('tone', 'Card colour', TONES)], { item: 'Number' })),
  glance: entry('Home page', 'Year at a glance', '/', GLANCE, G('', '', [
    T('tag', 'Small label'), T('title', 'Heading'), A('profile', 'Line under the heading'),
    L('items', 'Numbers', [N('v', 'Number'), T('l', 'Title'), T('n', 'Note under it'), SEL('tone', 'Card colour', TONES)], { item: 'Number' }),
  ])),
  programs: entry('Home page', 'What we do (focus areas)', '/', PROGRAMS, L('', '', [T('title', 'Title'), A('text', 'Text'), IM('image'), SEL('icon', 'Animated icon', ICON_OPTS)], { item: 'Focus area' })),
  values: entry('Home page', 'Core values', '/', VALUES, L('', '', [T('t', 'Value'), A('d', 'Description')], { item: 'Value' })),
  gallery: entry('Home page', 'Community impact gallery', '/gallery', GALLERY, L('', '', [IM('image'), T('cat', 'Filter group', { h: 'e.g. Farming, Climate, Training' }), T('caption', 'Caption')], { item: 'Photo' })),
  faqs: entry('Home page', 'Questions & answers', '/', FAQS, L('', '', [T('q', 'Question'), A('a', 'Answer')], { item: 'Question' })),
  about_text: {
    group: 'About page', label: 'Motto, mission & vision', page: '/about', root: G('', '', [T('motto', 'Motto'), A('mission', 'Mission'), A('vision', 'Vision'), T('focusNote', 'Focus areas note')]),
    get: getAboutText, set: setAboutText,
  },
  about: entry('About page', 'About intro & leadership', '/about', ABOUT, G('', '', [
    A('intro', 'Introduction'), G('mission', 'Mission block', [T('title', 'Title'), A('text', 'Text')]), G('vision', 'Vision block', [T('title', 'Title'), A('text', 'Text')]), A('leader', 'Message about the founder'),
  ])),
  objectives: entry('About page', 'Objectives', '/about', OBJECTIVES, S('', '', { item: 'Objective' })),
  training: entry('About page', 'Training programmes', '/about', TRAINING, L('', '', [T('t', 'Title'), A('d', 'Description')], { item: 'Programme' })),
  team: entry('About page', 'Team', '/about', TEAM, L('', '', [T('name', 'Name'), T('role', 'Role'), T('id', 'Photo file name', { h: 'Leave as it is for current members.' })], { item: 'Member' })),
  partners: entry('Partners', 'Partners', '/partners', PARTNERS, L('', '', [T('name', 'Name'), T('kind', 'Type, e.g. NGO Partner'), A('text', 'Short description'), U('url', 'Website'), T('file', 'Logo file name', { h: 'File inside /images/partners/' }), B('dark', 'Logo needs a dark background')], { item: 'Partner' })),
  site: entry('Menu, contact & footer', 'Contact details & social links', '/contact', SITE, G('', '', [
    T('phone', 'Phone (as shown)'), T('phoneHref', 'Phone link', { h: 'Looks like tel:+256755082017' }), T('email', 'Email'), A('address', 'Address'),
    L('socials', 'Social links', [T('l', 'Name'), U('u', 'Link')], { item: 'Link' }),
  ])),
  pages: entry('Menu, contact & footer', 'Menu & footer links', '/', PAGES, L('', '', [T('l', 'Label'), T('to', 'Page address', { h: 'Only pages that exist, e.g. /about' })], { item: 'Link' })),
  footer: entry('Menu, contact & footer', 'Footer text', '/', FOOTER, G('', '', [T('copy', 'Copyright line'), S('cta', 'Big footer words', { item: 'Word' })])),
  fundraiser_features: entry('Campaign & donations', 'Fundraiser features', '/start-fundraiser', FUNDRAISER_FEATURES, L('', '', [T('t', 'Title'), A('d', 'Description')], { item: 'Feature' })),
  campaign: entry('Campaign & donations', 'Current campaign', '/projects', CAMPAIGN, G('', '', [
    T('title', 'Title'), T('place', 'Place'), T('short', 'One-line summary'), A('description', 'Description'), IM('image'), U('url', 'Donation link (Zeffy)'),
  ])),
  featured: entry('Campaign & donations', 'Featured campaign card', '/projects', FEATURED, G('', '', [T('title', 'Title'), T('place', 'Place'), IM('image')])),
  donate: entry('Campaign & donations', 'Donate form', '/', DONATE, G('', '', [
    S('currencies', 'Currencies (3-letter codes)', { item: 'Currency' }), NS('presets', 'Quick amounts', { item: 'Amount' }),
    G('methods', 'Payment methods', [
      G('Mobile Money', 'Mobile money', [T('phoneLabel', 'Phone box label'), A('note', 'Note shown to the donor')]),
      G('Bank / International', 'Bank / international', [T('phoneLabel', 'Phone box label'), A('note', 'Note shown to the donor')]),
    ]),
  ])),
};

// Untouched copies taken before any saved content is applied (used by "Restore original").
export const DEFAULTS = Object.fromEntries(Object.entries(REGISTRY).map(([k, e]) => [k, JSON.parse(JSON.stringify(e.get()))]));
