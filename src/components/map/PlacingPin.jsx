import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const PULSE_HTML = `
  <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
    <div style="
      width:14px;height:14px;border-radius:50%;
      background:#B52900;
      position:absolute;
      animation:placePulse 1.2s ease-out infinite;
    "></div>
    <div style="
      width:14px;height:14px;border-radius:50%;
      border:2px dashed #B52900;
      position:absolute;
      opacity:0.6;
      animation:placeSpin 3s linear infinite;
    "></div>
  </div>
`

export default function PlacingPin({ position }) {
  const map = useMap()
  const markerRef = useRef(null)

  useEffect(() => {
    if (!position) { markerRef.current?.remove(); return }

    const icon = L.divIcon({ html: PULSE_HTML, className: '', iconSize: [40, 40], iconAnchor: [20, 20] })
    if (markerRef.current) {
      markerRef.current.setLatLng(position)
    } else {
      markerRef.current = L.marker(position, { icon, zIndexOffset: 1000 }).addTo(map)
    }
  }, [position])

  useEffect(() => () => markerRef.current?.remove(), [])

  return null
}
