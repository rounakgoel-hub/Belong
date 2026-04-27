import { memo, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { CHENNAI_CENTER, DEFAULT_ZOOM, TILE_URL_DARK, TILE_URL_LIGHT, TILE_ATTRIBUTION } from '../../lib/constants'
import { useAppContext } from '../../context/AppContext'
import PinMarker from './PinMarker'
import PlacingPin from './PlacingPin'
import { getAnonId } from '../../lib/anonId'

function ClickHandler({ onMapClick, placingMode }) {
  useMapEvents({
    click(e) {
      if (placingMode) onMapClick?.(e.latlng)
    }
  })
  return null
}

const VENUE_LATLNG = [13.0671646, 80.259706]

const VENUE_ICON_HTML = `
  <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">
    <div style="
      display:flex;
      align-items:center;
      background:color-mix(in srgb, var(--bg) 72%, transparent);
      border:1.5px solid rgba(181,41,0,0.35);
      border-radius:99px;
      padding:5px 10px 5px 0;
      box-shadow:0 2px 12px rgba(0,0,0,0.5);
      gap:6px;
      white-space:nowrap;
      backdrop-filter:blur(6px);
    ">
      <div style="
        width:3px;
        height:28px;
        background:#B52900;
        border-radius:99px 0 0 99px;
        flex-shrink:0;
        margin-right:2px;
      "></div>
      <span style="
        color:var(--text);
        font-weight:800;
        font-size:9.5px;
        font-family:Plus Jakarta Sans,sans-serif;
        letter-spacing:-0.01em;
      ">Belong.</span>
      <div style="display:flex;align-items:center;gap:3px">
        <div style="
          width:5px;height:5px;
          border-radius:50%;
          background:#B52900;
          animation:venuePulse 1.5s ease-in-out infinite;
        "></div>
        <span style="
          color:#B52900;
          font-weight:800;
          font-size:9.5px;
          font-family:Plus Jakarta Sans,sans-serif;
        ">Live</span>
      </div>
    </div>
    <div style="width:1.5px;height:10px;background:#B52900"></div>
    <div style="width:4px;height:4px;border-radius:50%;background:#B52900"></div>
  </div>
`

function VenueMarker({ onClick }) {
  const map = useMap()
  const onClickRef = useRef(onClick)
  useEffect(() => { onClickRef.current = onClick }, [onClick])

  useEffect(() => {
    const icon = L.divIcon({
      html: VENUE_ICON_HTML,
      className: '',
      iconSize: [110, 50],
      iconAnchor: [55, 50],
    })
    const marker = L.marker(VENUE_LATLNG, { icon, zIndexOffset: 1000 })
    marker.on('click', () => onClickRef.current?.())
    marker.addTo(map)
    return () => marker.remove()
  }, [map])

  return null
}

// Pans the map when MapScreen receives a GPS grant during the drop flow.
function MapPanner({ panTo }) {
  const map = useMap()
  useEffect(() => {
    if (panTo) map.flyTo(panTo, 14)
  }, [panTo])
  return null
}

export default memo(function MapView({ pins, onPinClick, placingMode, placingPosition, onMapClick, onVenuePinClick, panTo }) {
  const myAnonId = getAnonId()
  const { theme } = useAppContext()
  const tileUrl = theme === 'light' ? TILE_URL_LIGHT : TILE_URL_DARK

  return (
    <MapContainer
      center={CHENNAI_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      attributionControl={false}
      style={{ width: '100%', height: '100%', background: 'var(--bg)' }}
    >
      {/* key forces tile layer remount when theme switches */}
      <TileLayer key={theme} url={tileUrl} attribution={TILE_ATTRIBUTION} />
      <ClickHandler onMapClick={onMapClick} placingMode={placingMode} />
      <VenueMarker onClick={onVenuePinClick} />
      <MapPanner panTo={panTo} />

      {pins.map(pin => (
        <PinMarker
          key={pin.id}
          pin={pin}
          isOwn={pin.anon_id === myAnonId}
          onClick={onPinClick}
        />
      ))}

      {(placingMode || placingPosition) && <PlacingPin position={placingPosition} />}
    </MapContainer>
  )
})
