/**
 * Google Places Autocomplete textbox.
 *
 * Uses PlaceAutocompleteElement (Places API New).
 * Legacy google.maps.places.Autocomplete is blocked for new Cloud projects
 * (LegacyApiNotActivatedMapError). See:
 * https://developers.google.com/maps/documentation/javascript/place-autocomplete-new
 *
 * onActiveChange dims the lists below so suggestion rows stay fully clickable.
 */
import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import type { PlaceSelectionPayload } from '../types';

interface PlaceAutocompleteProps {
  onPlaceChosen: (place: PlaceSelectionPayload) => void;
  disabled?: boolean;
  onActiveChange?: (active: boolean) => void;
}

export function PlaceAutocomplete({
  onPlaceChosen,
  disabled = false,
  onActiveChange,
}: PlaceAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onPlaceChosenRef = useRef(onPlaceChosen);
  const onActiveChangeRef = useRef(onActiveChange);
  onPlaceChosenRef.current = onPlaceChosen;
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !window.google?.maps) return;

    let disposed = false;
    let element: google.maps.places.PlaceAutocompleteElement | null = null;

    const setActive = (active: boolean) => {
      onActiveChangeRef.current?.(active);
    };

    const handleSelect = async (event: Event) => {
      const { placePrediction } =
        event as google.maps.places.PlacePredictionSelectEvent;
      if (!placePrediction) return;

      const place = placePrediction.toPlace();
      await place.fetchFields({
        fields: ['id', 'displayName', 'formattedAddress', 'location'],
      });

      const location = place.location;
      if (!place.id || !location) return;

      const name = place.displayName ?? place.formattedAddress ?? 'Unknown place';
      // Backend rejects blank address — fall back to name if Google omits it
      const address = (place.formattedAddress ?? '').trim() || name;

      onPlaceChosenRef.current({
        placeId: place.id,
        name,
        address,
        lat: location.lat(),
        lng: location.lng(),
      });
      setActive(false);
    };

    const handleFocusIn = () => setActive(true);
    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && container.contains(next)) return;
      // Delay so a click on a prediction can register before we undim the list
      window.setTimeout(() => setActive(false), 180);
    };

    void (async () => {
      const { PlaceAutocompleteElement } = (await google.maps.importLibrary(
        'places',
      )) as google.maps.PlacesLibrary;

      if (disposed || !containerRef.current) return;

      element = new PlaceAutocompleteElement({
        placeholder: 'Search a place, street, or landmark…',
      });

      if (disabled) {
        element.setAttribute('disabled', 'true');
      }

      element.addEventListener('gmp-select', handleSelect);
      element.addEventListener('focusin', handleFocusIn);
      element.addEventListener('focusout', handleFocusOut);
      containerRef.current.replaceChildren(element);
    })();

    return () => {
      disposed = true;
      setActive(false);
      if (element) {
        element.removeEventListener('gmp-select', handleSelect);
        element.removeEventListener('focusin', handleFocusIn);
        element.removeEventListener('focusout', handleFocusOut);
        element.remove();
      }
      container.replaceChildren();
    };
  }, [disabled]);

  return (
    <Box sx={{ position: 'relative', zIndex: 40 }}>
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          position: 'relative',
          zIndex: 40,
          '& gmp-place-autocomplete': {
            width: '100%',
            display: 'block',
            position: 'relative',
            zIndex: 40,
          },
        }}
      />
      <FormHelperText sx={{ mx: 0.5, mt: 1 }}>
        Pick any suggestion from the dropdown list
      </FormHelperText>
    </Box>
  );
}
