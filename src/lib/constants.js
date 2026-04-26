export const EDITION_ID = 'ed000001-0000-0000-0000-000000000001'

export const CHENNAI_CENTER = [13.0827, 80.2707]
export const DEFAULT_ZOOM = 12

export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
export const TILE_URL_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
export const TILE_URL_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'

// Warm 5-colour palette for pin avatars
export const PIN_COLORS = [
  '#B52900', // red
  '#E05A35', // red-light
  '#C9A84C', // gold
  '#8B6F5E', // warm brown
  '#6B8F71', // muted sage
]

export const DARK = {
  bg: '#1A1614',
  surface: '#221E1C',
  surface2: '#2E2825',
  text: '#FFF9EF',
  muted: '#8A7E78',
  border: 'rgba(255,249,239,0.08)',
  red: '#B52900',
  redLight: '#E05A35',
  gold: '#C9A84C',
}

export const LIGHT = {
  bg: '#F5EFE6',
  surface: '#EDE4D8',
  surface2: '#E2D5C3',
  text: '#2A1F0A',
  muted: '#8A7060',
  border: 'rgba(42,31,10,0.12)',
  red: '#B52900',
  redLight: '#E05A35',
  gold: '#C9A84C',
}

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
