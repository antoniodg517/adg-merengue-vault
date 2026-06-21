const { createClient } = require('@supabase/supabase-js');

function sb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

function isAdmin(req) {
  return req.headers.authorization === `Bearer ${process.env.ADMIN_TOKEN}`;
}

// Which DB column each reorder group writes to.
const COLUMN = { collection: 'sort_order', grail: 'sort_grail', forsale: 'sort_forsale' };

// POST { group, order: [id1, id2, ...] } — writes each card's position to the
// column for that group. group defaults to 'collection'.
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  const order = req.body && req.body.order;
  const col = COLUMN[(req.body && req.body.group) || 'collection'];
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order array required' });
  if (!col) return res.status(400).json({ error: 'invalid group' });

  const client = sb();
  try {
    for (let i = 0; i < order.length; i++) {
      const { error } = await client.from('cards').update({ [col]: i }).eq('id', order[i]);
      if (error) throw error;
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
  return res.status(200).json({ ok: true, count: order.length });
};
