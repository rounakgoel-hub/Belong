export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')

  if (req.method === 'OPTIONS') return res.status(204).end()

  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'No query' })

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=8&country=in`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`iTunes ${response.status}`)
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
