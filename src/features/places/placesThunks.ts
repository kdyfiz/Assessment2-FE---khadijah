/**
 * Places async actions (Redux Thunk via createAsyncThunk).
 * Flow: Google suggestion selected → recordPlaceSearch → placesSlice stores it.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { PlaceSearchResult, PlaceSelectionPayload } from './types';

export const recordPlaceSearch = createAsyncThunk<
  PlaceSearchResult,
  PlaceSelectionPayload,
  { rejectValue: string }
>('places/recordPlaceSearch', async (payload, { rejectWithValue }) => {
  try {
    // Small async boundary so Thunk middleware is clearly exercised
    await new Promise((resolve) => setTimeout(resolve, 120));

    if (!payload.placeId || Number.isNaN(payload.lat) || Number.isNaN(payload.lng)) {
      return rejectWithValue('Invalid place selection from Google Places');
    }

    const result: PlaceSearchResult = {
      // Unique per attempt so duplicates still show as separate history rows
      id: `${payload.placeId}-${Date.now()}`,
      placeId: payload.placeId,
      name: payload.name,
      address: payload.address,
      lat: payload.lat,
      lng: payload.lng,
      searchedAt: new Date().toISOString(),
    };

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return rejectWithValue(message);
  }
});
