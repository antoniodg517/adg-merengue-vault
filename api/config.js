const { createClient } = require('@supabase/supabase-js');
const { isAdmin } = require('./_auth');

function sb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Global key/value site settings (e.g. the selected Top XI formation).
// Table: site_config (key text primary key, value text)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await sb().from('site_config').select('*');
    if (error) return res.status(500).json({ error: error.message });
    const out = {};
    (data || []).forEach(r => { out[r.key] = r.value; });
    return res.status(200).json(out);
  }

  if (req.method === 'POST') {
    if (!(await isAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });
    const { key, value } = req.body || {};
    if (!key) return res.status(400).json({ error: 'key required' });
    const { error } = await sb().from('site_config').upsert({ key, value }, { onConflict: 'key' });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
