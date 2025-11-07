# JWT_Task

A minimal full‑stack JWT-authenticated Task app. Backend is Node/Express + MongoDB (Mongoose); frontend is React + Vite with a lightweight UI. Authentication uses JSON Web Tokens sent in the `Authorization: Bearer <token>` header.

## Stack

-   Backend: Node.js, Express, Mongoose, JWT, dotenv, CORS
-   Frontend: React (Vite), Axios, Tailwind (via shadcn UI primitives)
-   Database: MongoDB

## Repository structure

```
backend/
  server.js
  src/
    config/db.js
    controllers/
      auth.controller.js
      task.controller.js
    middleware/
      auth.middleware.js
    models/
      user.model.js
      task.model.js
    routes/
      auth.routes.js
      user.routes.js
      task.routes.js
frontend/
  src/
    pages/
      auth/
        Login.jsx
        SignUp.jsx
      dashboard/
        Dashboard.jsx
    components/
      Task.jsx
      layout/Sidebar.jsx
api.md           # HTTP API reference
SCALING.md       # High-level scalability notes
docs/JWT_Task.postman_collection.json  # Postman collection
```

## Prerequisites

-   Node.js 18+ (or 20+ recommended)
-   A running MongoDB instance (local or Atlas)

## Setup

### 1) Backend

Create `backend/.env` with:

```
PORT=5001
DB_URL=mongodb://localhost:27017/jwt_task
JWT_SECRET=change_me
```

Install and run:

```
cd backend
npm install
npm run dev
```

The API will listen on `http://localhost:5001/api`.

### 2) Frontend

Create `frontend/.env` with:

```
VITE_API_URL=http://localhost:5001/api
```

Install and run:

```
cd frontend
npm install
npm run dev
```

The app will start on the Vite dev server (check terminal for the URL, typically `http://localhost:5173`).

## API

-   Endpoint details and examples: see [`api.md`](./api.md)
-   Postman collection: import [`docs/JWT_Task.postman_collection.json`](./docs/JWT_Task.postman_collection.json)
    -   After Signup/Login, the collection saves the `token` as a collection variable.

Auth basics:

-   Send the JWT in `Authorization: Bearer <token>`
-   Protected routes: `/api/user/*`, `/api/tasks/*`

## Environment variables

Backend (`backend/.env`):

-   `PORT` — API port (default 5001)
-   `DB_URL` — Mongo connection string
-   `JWT_SECRET` — secret for signing/verifying JWTs

Frontend (`frontend/.env`):

-   `VITE_API_URL` — base URL to the backend API (e.g., `http://localhost:5001/api`)

## Development scripts

Backend:

-   `npm run dev` — start API with nodemon

Frontend:

-   `npm run dev` — start Vite dev server
-   `npm run build` — build for production
-   `npm run preview` — preview production build

## Notes

-   CORS is enabled in the backend; update origins if deploying to a different domain.
-   The app uses bearer tokens by default; if you prefer HTTP‑only cookies, adjust the auth controller and client accordingly.

## Scaling

Technical guidance for growing the codebase and infra: see [`SCALING.md`](./SCALING.md).
