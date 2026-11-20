import { san } from './http.js';

// Sanitized string or null (empty / missing becomes null).
export const nstr = (v, max = 5000) => san(String(v ?? '')).slice(0, max) || null;
