import { fail } from './http.js';
import { hasRole } from './auth.js';

// Admin, or the owner of the project.
export async function ownsProject(env, projectId, u) {
  if (hasRole(u, 'admin')) return true;
  const p = await env.DB.prepare('SELECT owner_id FROM projects WHERE id = ?').bind(projectId).first();
  return !!p && p.owner_id === u.sub;
}

export async function assertOwnsProject(env, projectId, u) {
  if (!(await ownsProject(env, projectId, u))) fail('Forbidden', 403);
}
