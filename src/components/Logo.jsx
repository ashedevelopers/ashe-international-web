const LIVE_LOGO = 'https://asheinternational.org/assets/ashe-logo-YTZ5ZteW.jpeg';

// The ASHE logo image with a fallback to the live site's copy. Size it with className (for example 'h-12').
export default function Logo({ className = 'h-10' }) {
  return (
    <img src='/images/logo.png' alt='ASHE: Action For Save Humanity in Emergency' className={`w-auto ${className}`}
      onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = LIVE_LOGO; } }} />
  );
}
