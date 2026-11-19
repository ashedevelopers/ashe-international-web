import { json } from '../../_lib/http.js';
import { tokenCookie } from '../../_lib/auth.js';

// POST /api/auth/signout: clears the session cookie (bearer tokens are discarded client-side).
export async function onRequestPost() {
  return json({ message: 'Signed out' }, 200, { 'Set-Cookie': tokenCookie('', 0) });
}
