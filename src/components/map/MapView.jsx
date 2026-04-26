import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
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

export default function MapView({ pins, onPinClick, placingMode, placingPosition, onMapClick }) {
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
}
