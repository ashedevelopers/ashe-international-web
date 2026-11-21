import { Link } from 'react-router-dom';
import Layout, { useDonate } from '../components/Layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Programs from '../components/Programs.jsx';
import ImpactGallery from '../components/ImpactGallery.jsx';
import { PartnerCards } from '../components/Partners.jsx';
import LeadForm from '../components/LeadForm.jsx';
import { CtaBand } from '../components/Footer.jsx';
import { Button, Img, Reveal, Sticker } from '../components/ui.jsx';
import { ABOUT, FEATURED, FUNDRAISER_FEATURES, SITE, TEAM, TRAINING } from '../data/site.js';

const Wrap = ({ children, className = '' }) => <section className={`mx-3.5 my-14 md:mx-7 ${className}`}>{children}</section>;

function Cta() { const d = useDonate(); return <CtaBand onDonate={d} />; }

export function About() {
  return (
    <Layout title='About Us' description='Learn about ASHE: our story, mission, vision and the team empowering refugees and host communities in Nakivale Refugee Settlement, Uganda.'>
      <PageHeader title='About ASHE' tag='Our story' intro={ABOUT.intro} />
      <Wrap className='grid gap-4 md:grid-cols-2'>
        {[['Our mission', ABOUT.mission, 'bg-ashe-mint', 'team'], ['Our vision', ABOUT.vision, 'bg-ashe-yellow', 'community']].map(([k, v, tone, img], i) => (
          <Reveal key={k} i={i} className={`overflow-hidden rounded-[28px] border-2 border-ashe-ink ${tone}`}>
            <Img name={img} alt='' className='aspect-[16/10] w-full object-cover' />
            <div className='p-6'><Sticker rotate={-3}>{k}</Sticker><h2 className='mt-3 text-4xl md:text-5xl'>{v.title}</h2><p className='mt-3'>{v.text}</p></div>
          </Reveal>
        ))}
      </Wrap>
      <Wrap>
        <h2 className='mb-6 text-center text-[clamp(40px,8vw,92px)]'>Meet the team</h2>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          {TEAM.map((m, i) => (
            <Reveal key={m.id} i={i % 4}>
              <article className='h-full overflow-hidden rounded-[24px] border-2 border-ashe-ink bg-white'>
                <Img name={`team/${m.id}`} alt={m.name} className='aspect-square w-full object-cover' />
                <div className='p-3.5'><h3 className='text-xl'>{m.name}</h3><p className='mt-1 text-[13px] opacity-80'>{m.role}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center'>{ABOUT.leader}</p>
      </Wrap>
      <Cta />
    </Layout>
  );
}

export function ProgramsPage() {
  return (
    <Layout title='Programs' description='Explore ASHE programs: mushroom cultivation, computer skills, entrepreneurship, climate resilience and environmental awareness for refugees in Uganda.'>
      <PageHeader title='Our programs' tone='bg-ashe-yellow' tag='What we do' intro='From vocational training and digital literacy to permaculture and entrepreneurship, explore the initiatives helping refugees and host communities thrive.' />
      <Programs />
      <Wrap>
        <h2 className='mb-6 text-center text-[clamp(36px,7vw,76px)]'>Comprehensive training programs</h2>
        <div className='mx-auto grid max-w-4xl gap-3 md:grid-cols-2'>
          {TRAINING.map((t, i) => <Reveal key={t.t} i={i} className='rounded-[24px] border-2 border-ashe-ink bg-ashe-mint p-5'><h3 className='text-2xl'>{t.t}</h3><p className='mt-1'>{t.d}</p></Reveal>)}
        </div>
      </Wrap>
      <Cta />
    </Layout>
  );
}

export function GalleryPage() {
  return (
    <Layout title='Gallery' description='Photos from ASHE programs and community life in Nakivale Refugee Settlement, Uganda.'>
      <PageHeader title='Gallery' tone='bg-ashe-clay' tag='Community' intro='Moments from our programs and the people we work with.' />
      <ImpactGallery />
      <Cta />
    </Layout>
  );
}

export function PartnersPage() {
  return (
    <Layout title='Partners' description='The organisations that partner with ASHE to support refugees and host communities in Uganda.'>
      <PageHeader title='Our partners' tag='Together' intro='We are proud to collaborate with partners who share our commitment to humanitarian action.' />
      <Wrap><PartnerCards /></Wrap>
      <Wrap className='rounded-[28px] border-2 border-ashe-ink bg-ashe-yellow p-8 text-center'>
        <h2 className='text-4xl md:text-6xl'>Become a partner</h2>
        <p className='mx-auto mt-3 max-w-xl'>Join organisations making real impact for refugees and host communities in Uganda.</p>
        <div className='mt-5'><Button as={Link} to='/contact'>Get in touch</Button></div>
      </Wrap>
    </Layout>
  );
}

export function StartFundraiser() {
  return (
    <Layout title='Start a Fundraiser' description='NGOs, schools and churches can raise funds with ASHE: digital agreements, phased releases and proof of impact.'>
      <PageHeader title='Start a fundraiser' tone='bg-ashe-clay' tag='For organizations' intro='Are you an NGO, school or church? Submit your project, sign agreements digitally, set funding phases and unlock funds with verified proof of impact.' />
      <Wrap className='grid gap-3 md:grid-cols-3'>
        {FUNDRAISER_FEATURES.map((f, i) => <Reveal key={f.t} i={i} className='rounded-[24px] border-2 border-ashe-ink bg-white p-6'><h3 className='text-3xl'>{f.t}</h3><p className='mt-2'>{f.d}</p></Reveal>)}
      </Wrap>
      <Wrap className='flex flex-wrap justify-center gap-3'>
        <Button as={Link} to='/signup'>Create a fundraiser account</Button>
        <Button as={Link} to='/contact' tone='yellow'>Talk to our team</Button>
      </Wrap>
    </Layout>
  );
}

export function Volunteer() {
  return (
    <Layout title='Volunteer' description='Become an ASHE volunteer and help refugees and host communities in Nakivale, Uganda.'>
      <PageHeader title='Volunteer' tone='bg-ashe-yellow' tag='Join us' intro='Share your time and skills with refugees and host communities in Nakivale.' />
      <Wrap className='mx-auto max-w-2xl rounded-[28px] border-2 border-ashe-ink bg-white p-6'>
        <LeadForm type='volunteer' messageLabel='How would you like to help? Skills and availability' button='Sign me up' success='We received your volunteer application and will contact you soon.' />
      </Wrap>
    </Layout>
  );
}

export function Contact() {
  return (
    <Layout title='Contact' description='Contact ASHE International in Nakivale Refugee Settlement, Isingiro District, Uganda.'>
      <PageHeader title='Contact' tone='bg-ashe-mint' tag='East Africa' intro='Questions, partnerships or press? We would love to hear from you.' />
      <Wrap className='grid gap-4 md:grid-cols-2'>
        <div className='grid content-start gap-3'>
          <div className='rounded-[24px] border-2 border-ashe-ink bg-ashe-yellow p-5'><h3 className='text-3xl'>Phone</h3><a className='mt-1 block font-semibold underline' href={SITE.phoneHref}>{SITE.phone}</a></div>
          <div className='rounded-[24px] border-2 border-ashe-ink bg-ashe-mint p-5'><h3 className='text-3xl'>Email</h3><a className='mt-1 block font-semibold underline' href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
          <div className='rounded-[24px] border-2 border-ashe-ink bg-ashe-clay p-5'><h3 className='text-3xl'>Find us</h3><p className='mt-1'>{SITE.address}</p></div>
        </div>
        <div className='rounded-[28px] border-2 border-ashe-ink bg-white p-6'>
          <LeadForm type='contact' button='Contact us' success='Your message was sent. We will reply as soon as we can.' />
        </div>
      </Wrap>
    </Layout>
  );
}
