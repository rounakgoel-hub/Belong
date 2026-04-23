import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { CHENNAI_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../lib/constants'
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

  return (
    <MapContainer
      center={CHENNAI_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      attributionControl={false}
      style={{ width: '100%', height: '100%', background: '#1A1614' }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ClickHandler onMapClick={onMapClick} placingMode={placingMode} />

      {pins.map(pin => (
        <PinMarker
          key={pin.id}
          pin={pin}
          isOwn={pin.anon_id === myAnonId}
          onClick={onPinClick}
        />
      ))}

      {placingMode && <PlacingPin position={placingPosition} />}
    </MapContainer>
  )
}
