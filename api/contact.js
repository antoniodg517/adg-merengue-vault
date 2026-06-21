// Sends a contact-form email via Resend. No SDK needed — just the REST API.
// Requires env RESEND_API_KEY. Sends to the vault owner; visitor's email goes
// in reply_to so a reply lands straight in their inbox.
const TO = 'adg.merenguevault@gmail.com';
const FROM = 'ADG Merengue Vault <onboarding@resend.dev>';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email non configurata (manca RESEND_API_KEY).' });
  }

  const { name, email, message, card } = req.body || {};
  const emailOk = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (!emailOk) return res.status(400).json({ error: 'Email non valida.' });
  if (!message || !String(message).trim()) return res.status(400).json({ error: 'Messaggio mancante.' });

  const subject = card ? `Interesse carta: ${card}` : 'Nuovo messaggio dal sito — ADG Merengue Vault';
  const text = [
    `Nome: ${name || '—'}`,
    `Email: ${email}`,
    card ? `Carta di interesse: ${card}` : null,
    '',
    String(message).trim(),
  ].filter(v => v !== null).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email.trim(),
        subject,
        text,
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      return res.status(502).json({ error: 'Invio fallito.', detail });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
