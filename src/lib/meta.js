import { useEffect } from 'react';

const BASE = 'ASHE (Action For Save Humanity in Emergency)';
const DEFAULT_DESC = 'ASHE empowers refugees and host communities in Nakivale Refugee Settlement, Uganda through vocational training, mushroom cultivation, computer skills, entrepreneurship and climate resilience.';

// Sets the browser tab title and meta description for each page, and scrolls to the top on navigation.
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} | Rooted in Nakivale, Growing Together`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description || DEFAULT_DESC);
    window.scrollTo(0, 0);
  }, [title, description]);
}
