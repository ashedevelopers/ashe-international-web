import { uuid } from './crypto.js';

// Writes an admin-facing notification (shown in the admin dashboard). Never throws.
export async function notifyAdmin(env, type, title, body = null, meta = null) {
  try {
    await env.DB
      .prepare('INSERT INTO notifications (id, type, title, body, metadata) VALUES (?, ?, ?, ?, ?)')
      .bind(uuid(), type, title, body, meta ? JSON.stringify(meta) : null).run();
  } catch (e) { console.error('[ASHE notify]', e.message); }
}
