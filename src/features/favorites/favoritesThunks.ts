/**
 * Favourites async actions (Redux Thunk).
 * These call Spring Boot; if the API is offline, loadFavorites rejects and
 * the UI hides the Favourites section / star actions.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { FavoritePlace, PlaceSelectionPayload } from '../places/types';
import * as favoritesApi from './favoritesApi';

export const loadFavorites = createAsyncThunk<
  FavoritePlace[],
  void,
  { rejectValue: string }
>('favorites/load', async (_, { rejectWithValue }) => {
  try {
    return await favoritesApi.fetchFavorites();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to load favorites';
    return rejectWithValue(message);
  }
});

export const addFavorite = createAsyncThunk<
  FavoritePlace,
  PlaceSelectionPayload,
  { rejectValue: string }
>('favorites/add', async (place, { rejectWithValue }) => {
  try {
    return await favoritesApi.saveFavorite(place);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to save favorite';
    return rejectWithValue(message);
  }
});

export const deleteFavorite = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('favorites/delete', async (placeId, { rejectWithValue }) => {
  try {
    await favoritesApi.removeFavorite(placeId);
    return placeId;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to remove favorite';
    return rejectWithValue(message);
  }
});
