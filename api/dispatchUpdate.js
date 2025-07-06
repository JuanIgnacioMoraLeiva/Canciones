// api/dispatchUpdate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { songs } = req.body;
  if (!songs) {
    return res.status(400).json({ error: 'Faltan datos de canciones' });
  }

  // Llamada a GitHub Actions
  const ghRes = await fetch(
    'https://api.github.com/repos/JuanIgnacioMoraLeiva/Canciones/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `token ${process.env.PAT_GITHUB}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.everest-preview+json'
      },
      body: JSON.stringify({
        event_type: 'update-songs',
        client_payload: { songs: JSON.stringify(songs) }
      })
    }
  );

  if (!ghRes.ok) {
    const text = await ghRes.text();
    return res.status(ghRes.status).send(text);
  }

  return res.status(200).json({ message: 'Dispatch enviado ✅' });
}
