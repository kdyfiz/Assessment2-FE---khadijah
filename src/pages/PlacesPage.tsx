/**
 * Main screen: search (Google Places) + map + Redux search history.
 * Optional favourites section appears when Spring Boot on :8081 is reachable.
 *
 * Layout: left panel (search / history / favourites) + full-height map.
 * `searchActive` dims the lists so autocomplete suggestions stay clickable.
 */
import { useEffect, useMemo, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PlaceIcon from '@mui/icons-material/Place';
import { GOOGLE_MAPS_API_KEY, hasGoogleMapsKey } from '../config/env';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearSearchHistory } from '../features/places/placesSlice';
import { clearFavoritesError } from '../features/favorites/favoritesSlice';
import { usePlaceSelection } from '../features/places/hooks/usePlaceSelection';
import { PlaceAutocomplete } from '../features/places/components/PlaceAutocomplete';
import { MapPanel } from '../features/places/components/MapPanel';
import { SearchHistoryList } from '../features/places/components/SearchHistoryList';
import { FavoritesList } from '../features/favorites/components/FavoritesList';
import {
  addFavorite,
  deleteFavorite,
  loadFavorites,
} from '../features/favorites/favoritesThunks';
import type { FavoritePlace, PlaceSearchResult } from '../features/places/types';

/** Stable reference required by @react-google-maps/api useLoadScript. */
const LIBRARIES: ('places')[] = ['places'];

export function PlacesPage() {
  const dispatch = useAppDispatch();
  const [searchActive, setSearchActive] = useState(false);
  const {
    searches,
    selectedPlace,
    status,
    error,
    onPlaceChosen,
    onSelectFromHistory,
  } = usePlaceSelection();

  const favorites = useAppSelector((s) => s.favorites);
  const favoritePlaceIds = useMemo(
    () => new Set(favorites.items.map((f) => f.placeId)),
    [favorites.items],
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY ?? '',
    libraries: LIBRARIES,
  });

  useEffect(() => {
    void dispatch(loadFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (favorites.apiAvailable || favorites.status === 'loading') return;

    const timers = [1500, 4000, 8000].map((ms) =>
      window.setTimeout(() => {
        void dispatch(loadFavorites());
      }, ms),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [dispatch, favorites.apiAvailable, favorites.status]);

  const handleToggleFavorite = (place: PlaceSearchResult) => {
    const payload = {
      placeId: place.placeId,
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
    };

    if (favoritePlaceIds.has(place.placeId)) {
      void dispatch(deleteFavorite(place.placeId));
    } else {
      void dispatch(addFavorite(payload));
    }
  };

  const handleSelectFavorite = (item: FavoritePlace) => {
    // Re-focus on map and also record as a search (Redux history)
    onPlaceChosen({
      placeId: item.placeId,
      name: item.name,
      address: item.address,
      lat: item.lat,
      lng: item.lng,
    });
  };

  if (!hasGoogleMapsKey) {
    return (
      <Box sx={{ p: 3, maxWidth: 560, mx: 'auto', mt: 8 }}>
        <Alert severity="warning">
          Missing Google Maps API key. Copy <code>.env.example</code> to{' '}
          <code>.env</code> and set <code>VITE_GOOGLE_MAPS_API_KEY</code>.
        </Alert>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ p: 3, maxWidth: 560, mx: 'auto', mt: 8 }}>
        <Alert severity="error">
          Couldn’t load the map. Check your API key, billing, website
          restrictions for localhost, and that Maps JavaScript API + Places API
          are enabled.
        </Alert>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={36} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '380px 1fr' },
        gridTemplateRows: { xs: 'auto 1fr', md: '1fr' },
        height: { xs: 'auto', md: '100vh' },
        minHeight: '100vh',
      }}
    >
      {/* Side panel: brand + search + recent */}
      <Box
        component="aside"
        className="anim-rise"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          p: { xs: 2.5, md: 3 },
          bgcolor: 'background.paper',
          borderRight: { md: '1px solid' },
          borderColor: { md: 'divider' },
          zIndex: 3,
          maxHeight: { xs: 'none', md: '100vh' },
          minHeight: 0,
          // Keep visible so autocomplete suggestion list is fully clickable
          overflow: 'visible',
          boxShadow: { xs: 'none', md: '8px 0 32px rgba(21, 32, 43, 0.04)' },
        }}
      >
        <Stack spacing={0.75} className="anim-rise">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <PlaceIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontSize: '1.35rem', lineHeight: 1.1, m: 0 }}
              >
                Place Finder
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography variant="body2" color="text.secondary">
                  Search · pin · revisit
                </Typography>
                <Tooltip
                  title={
                    favorites.apiAvailable
                      ? 'Favourites sync is on'
                      : 'Favourites sync is offline'
                  }
                >
                  <Box
                    component="span"
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: favorites.apiAvailable
                        ? 'success.main'
                        : 'text.disabled',
                      display: 'inline-block',
                    }}
                    aria-hidden
                  />
                </Tooltip>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        <Box
          className="anim-rise anim-delay-1"
          sx={{
            position: 'relative',
            zIndex: 20,
            // Isolation helps the Google prediction popover stack above Recent
            isolation: 'isolate',
          }}
        >
          <PlaceAutocomplete
            onPlaceChosen={onPlaceChosen}
            disabled={status === 'loading'}
            onActiveChange={setSearchActive}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {error}
            </Alert>
          )}
          {favorites.error && (
            <Alert
              severity={favorites.apiAvailable ? 'warning' : 'info'}
              sx={{ mt: 1.5 }}
              onClose={() => dispatch(clearFavoritesError())}
            >
              {favorites.error}
            </Alert>
          )}
        </Box>

        <Box
          className="anim-rise anim-delay-2"
          sx={{
            flex: 1,
            minHeight: { xs: 220, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'auto',
            position: 'relative',
            zIndex: 1,
            // While suggestions are open, don't steal clicks from the dropdown
            pointerEvents: searchActive ? 'none' : 'auto',
            opacity: searchActive ? 0.35 : 1,
            transition: 'opacity 160ms ease',
          }}
          aria-hidden={searchActive}
        >
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <SearchHistoryList
              searches={searches}
              selectedId={selectedPlace?.id ?? null}
              favoritePlaceIds={favoritePlaceIds}
              onSelect={onSelectFromHistory}
              onClear={() => dispatch(clearSearchHistory())}
              onToggleFavorite={handleToggleFavorite}
              favoritesEnabled={favorites.apiAvailable}
            />
          </Box>

          {favorites.apiAvailable && (
            <>
              <Divider flexItem />
              <FavoritesList
                items={favorites.items}
                selectedPlaceId={selectedPlace?.placeId ?? null}
                onSelect={handleSelectFavorite}
                onRemove={(placeId) => void dispatch(deleteFavorite(placeId))}
              />
            </>
          )}
        </Box>
      </Box>

      {/* Map is the main visual plane */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          minHeight: { xs: '55vh', md: '100vh' },
          height: { xs: '55vh', md: '100%' },
          bgcolor: '#d9e3ea',
        }}
      >
        <MapPanel place={selectedPlace} />
      </Box>
    </Box>
  );
}
