/**
 * Central env access (Vite exposes only vars prefixed with VITE_).
 * Copy `.env.example` → `.env` and set the Maps key locally. Never commit `.env`.
 */
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;

/** Optional favourites API — frontend still works if this is down. */
export const FAVORITES_API_BASE_URL =
  (import.meta.env.VITE_FAVORITES_API_URL as string | undefined) ??
  'http://localhost:8081/api';

export const hasGoogleMapsKey = Boolean(
  GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_api_key_here',
);
