const { createClient } = require('@supabase/supabase-js');

// Dual-mode admin auth (transition):
//  1) legacy static ADMIN_TOKEN (will be removed once Supabase Auth is live)
//  2) a valid Supabase Auth JWT belonging to ALLOWED_ADMIN_EMAIL
// Files prefixed with "_" are not exposed as routes by Vercel.
async function isAdmin(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return false;

  // 1) Legacy shared token
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) return true;

  // 2) Supabase Auth session JWT
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data || !data.user) return false;
    const allowed = (process.env.ALLOWED_ADMIN_EMAIL || '').toLowerCase();
    if (allowed && (data.user.email || '').toLowerCase() !== allowed) return false;
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = { isAdmin };
