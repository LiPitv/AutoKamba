import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet'
import L, { type LatLngExpression } from 'leaflet'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const sosIcon = L.divIcon({
  className: '',
  html: '<div style="width:34px;height:34px;border-radius:9999px;background:#E53935;border:4px solid#fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>',
  iconSize: [34, 34],
})

const providerIcon = L.divIcon({
  className: '',
  html: '<div style="width:30px;height:30px;border-radius:9999px;background:#00B86B;border:4px solid#fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>',
  iconSize: [30, 30],
})

interface MapClickData {
  lat: number
  lng: number
}

function MapClickLayer({ onMapClick }: { onMapClick?: (data: MapClickData) => void }) {
  useMapEvents({
    click: (e) => onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng }),
  })
  return null
}

export function Map({
  center,
  points = [],
  onClick,
  radiusKm,
  zoom = 14,
  className = 'h-64 w-full',
}: {
  center?: LatLngExpression
  points?: { lat: number; lng: number; label?: string; type?: 'sos' | 'provider' }[]
  onClick?: (data: MapClickData) => void
  radiusKm?: number
  zoom?: number
  className?: string
}) {
  return (
    <MapContainer
      center={center ?? [-8.8383334, 13.2344444]}
      zoom={zoom}
      className={className}
      scrollWheelZoom={false}
    >
      <MapClickLayer onMapClick={onClick} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point, i) => (
        <Marker
          key={i}
          position={[point.lat, point.lng]}
          icon={point.type === 'sos' ? sosIcon : point.type === 'provider' ? providerIcon : icon}
        >
          {point.label && <Popup>{point.label}</Popup>}
        </Marker>
      ))}
      {radiusKm != null && points[0] && (
        <Circle center={[points[0].lat, points[0].lng]} radius={radiusKm * 1000} pathOptions={{ color: '#00B86B', fillOpacity: 0.06 }} />
      )}
    </MapContainer>
  )
}

export function useGeolocation() {
  return (): Promise<{ latitude: number; longitude: number }> =>
    new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocalização não suportada neste navegador.'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => reject(new Error('Não foi possível obter a sua localização. Autorize o acesso ou selecione no mapa.')),
        { enableHighAccuracy: true, timeout: 10000 },
      )
    })
}