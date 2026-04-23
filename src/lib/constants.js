export const EDITION_ID = 'ed000001-0000-0000-0000-000000000001'

export const CHENNAI_CENTER = [13.0827, 80.2707]
export const DEFAULT_ZOOM = 12

export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'

// Warm 5-colour palette for pin avatars
export const PIN_COLORS = [
  '#B52900', // red
  '#E05A35', // red-light
  '#C9A84C', // gold
  '#8B6F5E', // warm brown
  '#6B8F71', // muted sage
]

export function pinColor(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return PIN_COLORS[Math.abs(hash) % PIN_COLORS.length]
}

export function initials(handle) {
  if (!handle) return '♪'
  return handle
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const SHOW_DATE = new Date('2026-05-30T19:00:00+05:30')
export const WIPE_DATE = new Date('2026-06-01T00:00:00+05:30')

export function daysUntil(date) {
  const diff = date - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
