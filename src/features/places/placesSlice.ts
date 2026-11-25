/**
 * Places slice — holds every search the user tries (newest first).
 * Intentionally in-memory only; refresh clears history.
 * Favourites that must survive refresh live in `features/favorites` + the DB.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PlaceSearchResult } from './types';
import { recordPlaceSearch } from './placesThunks';

export interface PlacesState {
  searches: PlaceSearchResult[];
  selectedId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlacesState = {
  searches: [],
  selectedId: null,
  status: 'idle',
  error: null,
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    /** Re-focus map on a previous search row without creating a new entry. */
    selectPlace(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
    clearSearchHistory(state) {
      state.searches = [];
      state.selectedId = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(recordPlaceSearch.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(recordPlaceSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Keep every attempt — do not dedupe by placeId.
        state.searches.unshift(action.payload);
        state.selectedId = action.payload.id;
        // Soft cap so a very long session does not grow forever
        if (state.searches.length > 100) {
          state.searches = state.searches.slice(0, 100);
        }
      })
      .addCase(recordPlaceSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Failed to record place';
      });
  },
});

export const { selectPlace, clearSearchHistory } = placesSlice.actions;
export default placesSlice.reducer;
