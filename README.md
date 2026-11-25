# Assessment 2 — Place Finder

Search places with Google Places Autocomplete, pin them on a map, and keep search history in Redux (Thunk). Styling with Material UI.

Optional: star a place to save it via a Spring Boot API into a relational database.

---

## Run (frontend)

**Need:** Node.js 20+, Google Maps API key (Maps JavaScript API + Places API New)

```bash
cp .env.example .env
# set VITE_GOOGLE_MAPS_API_KEY

npm install
npm run dev
```

App: http://localhost:5173/

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |

---

## Run (optional favourites API)

```bash
cd backend
mvn spring-boot:run
```

- Base URL: `http://localhost:8081/api`
- Default DB: H2 file (`backend/data/`)
- MySQL: `mvn spring-boot:run -Dspring-boot.run.profiles=mysql`  
  (schema: `backend/sql/schema-mysql.sql`)

| Method | Path |
|--------|------|
| `GET` | `/api/favorites` |
| `POST` | `/api/favorites` |
| `DELETE` | `/api/favorites/{placeId}` |

Frontend runs fine without the backend. Favourites UI appears when the API is up.

---

## Stack

| Area | Choice |
|------|--------|
| UI | React, TypeScript, Vite, Material UI |
| State | Redux Toolkit + Thunk |
| Maps | Google Maps JS + Places Autocomplete (New) |
| Optional API | Spring Boot 3, JPA |
| Optional DB | H2 / MySQL |

---

## Structure

```
src/
  app/                 # store, typed hooks
  features/
    places/            # autocomplete, map, search history, slice, thunks
    favorites/         # optional API + favourites list
  components/layout/
  pages/
  theme/
  config/
backend/               # optional Spring Boot favourites API
```

---

## Notes

- Search history lives in Redux for the session (clears on refresh).
- Favourites are stored in the DB and survive refresh when the API is running.
- Keep the API key in `.env` only — do not commit it.
- Local key restriction example: `http://localhost:5173/*`
