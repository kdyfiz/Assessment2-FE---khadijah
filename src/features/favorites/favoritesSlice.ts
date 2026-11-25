/**
 * Favourites slice — mirrors rows stored in the Spring Boot DB.
 * `apiAvailable` drives whether the Favourites UI / star buttons are shown.
 */
import { createSlice } from '@reduxjs/toolkit';
import type { FavoritePlace } from '../places/types';
import { addFavorite, deleteFavorite, loadFavorites } from './favoritesThunks';

export interface FavoritesState {
  items: FavoritePlace[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  apiAvailable: boolean;
}

const initialState: FavoritesState = {
  items: [],
  status: 'idle',
  error: null,
  // Optimistic until first load fails (frontend still usable offline)
  apiAvailable: true,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavoritesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.apiAvailable = true;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load favorites';
        state.apiAvailable = false;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        const exists = state.items.some(
          (f) => f.placeId === action.payload.placeId,
        );
        if (!exists) {
          state.items.unshift(action.payload);
        }
        state.apiAvailable = true;
        state.error = null;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to save favorite';
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f.placeId !== action.payload);
      })
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to remove favorite';
      });
  },
});

export const { clearFavoritesError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
