/**
 * Custom hook that connects the Places UI to Redux:
 * - onPlaceChosen → Thunk (record search + select)
 * - onSelectFromHistory → re-select an existing row for the map
 */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectPlace } from '../placesSlice';
import { recordPlaceSearch } from '../placesThunks';
import type { PlaceSearchResult, PlaceSelectionPayload } from '../types';

export function usePlaceSelection() {
  const dispatch = useAppDispatch();
  const { searches, selectedId, status, error } = useAppSelector(
    (state) => state.places,
  );

  const selectedPlace: PlaceSearchResult | null =
    searches.find((s) => s.id === selectedId) ?? searches[0] ?? null;

  const onPlaceChosen = useCallback(
    (payload: PlaceSelectionPayload) => {
      void dispatch(recordPlaceSearch(payload));
    },
    [dispatch],
  );

  const onSelectFromHistory = useCallback(
    (id: string) => {
      dispatch(selectPlace(id));
    },
    [dispatch],
  );

  return {
    searches,
    selectedPlace,
    status,
    error,
    onPlaceChosen,
    onSelectFromHistory,
  };
}
