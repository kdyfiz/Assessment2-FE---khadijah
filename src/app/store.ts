/**
 * Redux store (Redux Toolkit).
 *
 * Middleware: RTK enables Redux Thunk by default.
 * Async work lives in createAsyncThunk files:
 *   - features/places/placesThunks.ts
 *   - features/favorites/favoritesThunks.ts
 */
import { configureStore } from '@reduxjs/toolkit';
import placesReducer from '../features/places/placesSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    places: placesReducer, // Google search history (session / in-memory)
    favorites: favoritesReducer, // Optional favourites synced with Spring Boot
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
