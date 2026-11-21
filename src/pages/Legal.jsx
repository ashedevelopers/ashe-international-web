import Layout from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { SITE } from '../data/site.js';

const Doc = ({ title, tag, intro, sections, desc }) => (
  <Layout title={title} description={desc}>
    <PageHeader title={title} tag={tag} intro={intro} tone='bg-ashe-clay' />
    <article className='mx-auto my-12 max-w-3xl px-4'>
      {sections.map(([h, t]) => <section key={h} className='mb-7'><h2 className='mb-2 text-3xl'>{h}</h2><p className='text-[16px] leading-relaxed'>{t}</p></section>)}
      <p className='mt-8 text-sm opacity-70'>Questions? Write to <a className='underline' href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </article>
  </Layout>
);

export const Privacy = () => (
  <Doc title='Privacy Policy' tag='Your data' desc='How ASHE International collects, uses and protects your personal information.' intro='How we collect, use and protect your information.'
    sections={[
      ['What we collect', 'When you donate, pledge, volunteer, contact us or create an account we collect the details you give us: your name, email address, phone number, message, and donation details such as amount and currency. If you create an account we also store your password in hashed form.'],
      ['How we use it', 'We use your information to process donations and pledges, reply to you, run fundraiser and volunteer programs, send receipts and updates you asked for, keep the platform secure and report on our impact. We do not sell your data.'],
      ['Payments', 'Mobile money gifts are processed by Nylon Pay. We do not see or store your mobile money PIN or card details. We keep the transaction reference, amount and status so we can match your gift.'],
      ['Where it is stored', 'Your information is stored on Cloudflare infrastructure, and form submissions are also recorded in a secured Google Sheet used by our team to follow up.'],
      ['Cookies', 'We use a sign-in cookie to keep you logged in and a small setting to remember your cookie choice.'],
      ['Your choices', 'You can ask to see, correct or delete your personal information at any time by contacting us. We keep records required for financial accountability.'],
    ]} />
);

export const Terms = () => (
  <Doc title='Terms of Use' tag='The rules' desc='Terms of use for the ASHE International website and fundraising platform.' intro='Please read these terms before using our website and platform.'
    sections={[
      ['Using the site', 'You may use this site for lawful purposes only. Please do not misuse it, attempt to break its security, or submit false information.'],
      ['Accounts', 'You are responsible for keeping your password safe and for activity on your account. Provide accurate details and tell us if you suspect unauthorised use.'],
      ['Donations', 'Gifts are processed by third-party payment providers. Please check the amount and details before you confirm. Contact us promptly if you believe a payment was made in error.'],
      ['Fundraisers', 'Campaigns are reviewed by the ASHE team before they go live. We may suspend or remove a campaign that is inaccurate, misleading or breaks these terms. Funds are released in phases against proof of impact.'],
      ['Content', 'The ASHE name, logo, photographs and text belong to ASHE International or its partners. Please ask before reusing them.'],
      ['Changes', 'We may update these terms from time to time. Continuing to use the site means you accept the updated terms.'],
    ]} />
);
