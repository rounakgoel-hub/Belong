import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { pinColor, initials } from '../../lib/constants'

function createPinIcon(pin, isOwn = false) {
  const color = pinColor(pin.handle || '♪')
  const border = isOwn ? `border: 2.5px solid #C9A84C;` : `border: 2px solid ${color};`
  const glow = isOwn
    ? `box-shadow: 0 0 0 3px rgba(201,168,76,0.25), 0 2px 8px rgba(0,0,0,0.5);`
    : `box-shadow: 0 2px 8px rgba(0,0,0,0.4);`

  const avatar = pin.album_art_url
    ? `<img
        src="${pin.album_art_url}"
        alt=""
        style="
          width:36px; height:36px; border-radius:50%;
          object-fit:cover;
          display:block;
          ${border}
          ${glow}
        "
      />`
    : `<div style="
        width:36px; height:36px; border-radius:50%;
        background:${color};
        display:flex; align-items:center; justify-content:center;
        font-family:'Plus Jakarta Sans',sans-serif;
        font-weight:700; font-size:13px; color:#FFF9EF;
        ${border}
        ${glow}
      ">${initials(pin.handle)}</div>`

  const html = `
    <div style="position:relative; width:36px; display:flex; flex-direction:column; align-items:center;">
      ${avatar}
      <div style="width:2px; height:10px; background:${color}; opacity:0.7;"></div>
      <div style="width:5px; height:5px; border-radius:50%; background:${color}; opacity:0.5;"></div>
    </div>
  `

  return L.divIcon({
    html,
    className: '',
    iconSize: [36, 58],
    iconAnchor: [18, 58],
    popupAnchor: [0, -58],
  })
}

export default function PinMarker({ pin, isOwn, onClick }) {
  const map = useMap()
  const markerRef = useRef(null)

  useEffect(() => {
    const icon = createPinIcon(pin, isOwn)
    const marker = L.marker([pin.lat, pin.lng], { icon })
    marker.on('click', () => onClick?.(pin))
    marker.addTo(map)
    markerRef.current = marker

    return () => marker.remove()
  }, [pin.id, pin.album_art_url, pin.resonance_count, isOwn])

  return null
}
