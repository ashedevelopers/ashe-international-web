import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);

// user: undefined while loading, null when signed out, otherwise { id, email, display_name, roles[] }.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const reload = useCallback(() => api('/auth/session').then((d) => setUser(d.user)).catch(() => setUser(null)), []);
  useEffect(() => { reload(); }, [reload]);
  const value = useMemo(() => ({
    user, reload,
    signin: async (email, password) => { const d = await api('/auth/signin', { method: 'POST', body: { email, password } }); setUser(d.user); return d.user; },
    signup: async (b) => { const d = await api('/auth/signup', { method: 'POST', body: b }); setUser(d.user); return d.user; },
    signout: async () => { await api('/auth/signout', { method: 'POST' }); setUser(null); },
    has: (...r) => !!user && r.some((x) => user.roles.includes(x)),
  }), [user, reload]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
