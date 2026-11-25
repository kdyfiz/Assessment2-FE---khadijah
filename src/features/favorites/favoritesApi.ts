/**
 * HTTP client for the optional Spring Boot favourites API.
 * Base URL: VITE_FAVORITES_API_URL (default http://localhost:8081/api)
 */
import { FAVORITES_API_BASE_URL } from '../../config/env';
import type { FavoritePlace, PlaceSelectionPayload } from '../places/types';

function truncate(value: string, max: number) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

/** Match backend column limits / @NotBlank rules before sending. */
function sanitizePayload(place: PlaceSelectionPayload) {
  const name = truncate(place.name || 'Unknown place', 500) || 'Unknown place';
  const address = truncate(place.address || name, 1000) || name;

  return {
    placeId: place.placeId.trim(),
    name,
    address,
    lat: place.lat,
    lng: place.lng,
  };
}

async function readErrorMessage(res: Response, fallback: string) {
  const text = await res.text();
  if (!text) return `${fallback} (${res.status})`;

  try {
    const json = JSON.parse(text) as {
      message?: string;
      error?: string;
      detail?: string;
      errors?: Array<{ defaultMessage?: string; field?: string }>;
    };

    if (json.errors?.length) {
      return json.errors
        .map((e) => e.defaultMessage || e.field)
        .filter(Boolean)
        .join(', ');
    }

    return json.message || json.detail || json.error || `${fallback} (${res.status})`;
  } catch {
    return text.length > 180 ? `${fallback} (${res.status})` : text;
  }
}

export async function fetchFavorites(): Promise<FavoritePlace[]> {
  const res = await fetch(`${FAVORITES_API_BASE_URL}/favorites`);
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, 'Failed to load favourites'));
  }
  return res.json();
}

export async function saveFavorite(
  place: PlaceSelectionPayload,
): Promise<FavoritePlace> {
  const payload = sanitizePayload(place);

  if (!payload.placeId) {
    throw new Error('Missing place id — pick a suggestion from the list first');
  }

  const res = await fetch(`${FAVORITES_API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, 'Failed to save favourite'));
  }

  return res.json();
}

export async function removeFavorite(placeId: string): Promise<void> {
  const res = await fetch(
    `${FAVORITES_API_BASE_URL}/favorites/${encodeURIComponent(placeId)}`,
    { method: 'DELETE' },
  );
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, 'Failed to remove favourite'));
  }
}
