/** One row in Redux search history (session only — clears on refresh). */
export interface PlaceSearchResult {
  /** Unique row id (placeId + timestamp) so the same place can appear more than once */
  id: string;
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  searchedAt: string;
}

/** Payload coming from Google Places when the user picks a suggestion. */
export interface PlaceSelectionPayload {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

/** Favourite row returned by the Spring Boot API (persisted in DB). */
export interface FavoritePlace {
  id: number;
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: string;
}
