/**
 * Map panel — centers on the selected place and drops a marker.
 * Expects the Google Maps script to already be loaded by PlacesPage (useLoadScript).
 */
import { GoogleMap, Marker } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { PlaceSearchResult } from '../types';

const DEFAULT_CENTER = { lat: 3.139, lng: 101.6869 }; // Kuala Lumpur
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

/** Light map styling so the UI chrome stays the visual focus. */
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c5d8e4' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#eef2f4' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#d5dde3' }],
  },
];

interface MapPanelProps {
  place: PlaceSearchResult | null;
}

export function MapPanel({ place }: MapPanelProps) {
  const center = place
    ? { lat: place.lat, lng: place.lng }
    : DEFAULT_CENTER;

  return (
    <Box
      className="anim-fade"
      sx={{
        position: 'relative',
        height: '100%',
        minHeight: { xs: 280, md: 0 },
        overflow: 'hidden',
      }}
    >
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={place ? 15 : 11}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
          styles: MAP_STYLES,
          gestureHandling: 'greedy',
        }}
      >
        {place && <Marker position={{ lat: place.lat, lng: place.lng }} />}
      </GoogleMap>

      {!place && (
        <Box
          className="anim-rise anim-delay-2"
          sx={{
            position: 'absolute',
            left: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            bgcolor: 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(8px)',
            px: 2,
            py: 1.25,
            borderRadius: 2,
            maxWidth: 300,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" color="text.primary">
            Explore the map
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search a place to drop a pin and save it in your recent list.
          </Typography>
        </Box>
      )}

      {place && (
        <Box
          key={place.id}
          className="anim-rise"
          sx={{
            position: 'absolute',
            top: { xs: 12, md: 20 },
            left: { xs: 12, md: 20 },
            right: { xs: 12, md: 'auto' },
            bgcolor: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(10px)',
            px: 2,
            py: 1.25,
            borderRadius: 2,
            maxWidth: 360,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle1" noWrap>
            {place.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {place.address}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
