import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';

// Used only at build time (scripts/prerender.mjs) to turn each public route into real HTML.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
