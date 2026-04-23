import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { pinColor, initials } from '../../lib/constants'

function createPinIcon(handle, isOwn = false, pulse = false) {
  const color = pinColor(handle || '♪')
  const label = initials(handle)
  const glowStyle = pulse ? `box-shadow: 0 0 0 6px ${color}44, 0 0 0 12px ${color}22;` : ''
  const ownBorder = isOwn ? `border: 2px solid #C9A84C;` : ''

  const html = `
    <div style="position:relative; width:36px; display:flex; flex-direction:column; align-items:center;">
      <div style="
        width:36px; height:36px; border-radius:50%;
        background:${color};
        display:flex; align-items:center; justify-content:center;
        font-family:'Plus Jakarta Sans',sans-serif;
        font-weight:700; font-size:13px; color:#FFF9EF;
        ${glowStyle}
        ${ownBorder}
        transition: box-shadow 0.4s;
      ">${label}</div>
      <div style="
        width:2px; height:10px;
        background:${color};
        opacity:0.7;
      "></div>
      <div style="
        width:5px; height:5px; border-radius:50%;
        background:${color};
        opacity:0.5;
      "></div>
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
    const icon = createPinIcon(pin.handle, isOwn, isOwn)
    const marker = L.marker([pin.lat, pin.lng], { icon })
    marker.on('click', () => onClick?.(pin))
    marker.addTo(map)
    markerRef.current = marker

    return () => marker.remove()
  }, [pin.id, pin.resonance_count, isOwn])

  return null
}
