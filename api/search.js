export default async function handler(req, res) {
  // Handle iOS Safari preflight
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') return res.status(204).end()

  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'No query' })

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=8&country=in&lang=en_us`

    // 8s timeout — iTunes can be slow; iOS will kill hung fetches silently
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
