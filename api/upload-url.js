const { createClient } = require('@supabase/supabase-js');
const { isAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await isAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const { path } = req.body;
  if (!path) return res.status(400).json({ error: 'path is required' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase.storage
    .from('card-photos')
    .createSignedUploadUrl(path);
  if (error) return res.status(500).json({ error: error.message });

  const { data: urlData } = supabase.storage.from('card-photos').getPublicUrl(path);

  return res.status(200).json({
    signedUrl: data.signedUrl,
    publicUrl: urlData.publicUrl,
  });
};
