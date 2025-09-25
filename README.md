# CRUDApp — Laravel API & React Frontend

This repository contains a decoupled CRUD solution for managing "Sites" data. The backend (Laravel 12) exposes REST endpoints with Excel-import support, while the frontend (React 18 + Bootstrap) consumes those APIs to deliver a responsive UI.

## Repository Contents

- `backend/`: Laravel 12 project (PHP 8.2+, Composer, artisan, PHPUnit tests).
- `frontend/`: React 18 + Vite SPA (Node.js 18+, npm, Bootstrap styles).
- `AGENTS.md`: contributor guide and coding conventions.
- Root-level configs: `.gitignore`, `package.json`, `package-lock.json` (proxy scripts), `README.md` (this file).

## Quick Start

```bash
# clone and enter the repo
cd CrudApp

# --- backend ---
cd backend
composer install
copy .env.example .env   # or cp on macOS/Linux
php artisan key:generate
# configure DB credentials in backend/.env, then:
php artisan migrate

# --- frontend ---
cd ..
npm install --prefix frontend

# --- run full stack ---
cd backend
composer run dev          # boots Laravel API + queue + logs + React dev server
```

The UI will be available at `http://localhost:5173` and talks to the API on `http://localhost:8000/api`.

## Backend Setup Details

1. Ensure PHP 8.2+, Composer, and MySQL/MariaDB are installed.
2. From `backend/`, run `composer install`.
3. Copy `.env.example` to `.env` and set:
   - `APP_URL`, `APP_ENV`
   - Database credentials (`DB_CONNECTION=mysql`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)
   - CORS origins (`FRONTEND_URLS=http://localhost:5173` for local dev).
4. Generate the Laravel key: `php artisan key:generate`.
5. Prepare the database with `php artisan migrate`.
6. (Optional) run tests: `composer test`.

## Frontend Setup Details

1. Install Node.js 18+ and npm.
2. From the repo root, run `npm install --prefix frontend` (or `cd frontend && npm install`).
3. If you need custom API URLs, copy `frontend/.env.example` to `frontend/.env` and adjust `VITE_API_BASE_URL`.

## Running & Building

- **Dev stack**: `cd backend && composer run dev` (starts API, queue listener, log tail, and Vite dev server).
- **Manual**:
  1. `cd backend && php artisan serve`
  2. `npm run dev --prefix frontend`
- **Production build**:
  ```bash
  npm run build --prefix frontend
  ```
  Serve `frontend/dist` as static assets and deploy Laravel from `backend/public`.

## Testing & Quality

- Backend tests: `cd backend && composer test` (runs PHPUnit feature suite in `backend/tests`).
- Frontend automated tests are not set up yet; add Vitest/React Testing Library as needed.

## Excel Import Workflow

1. Use the "Εισαγωγή Excel" button in the UI.
2. Files are uploaded to `POST /api/sites/import` and processed by `App\Imports\SitesImport`.
3. Responses include import summary and any row-level validation failures.

## Troubleshooting

- **CORS errors**: ensure `FRONTEND_URLS` (and optional `FRONTEND_URL_PATTERNS`) include your frontend origin; run `php artisan config:clear` after editing.
- **Port conflicts**: if Vite selects a different port, update `FRONTEND_URLS` / `VITE_API_BASE_URL` accordingly.
- **Missing dependencies**: rerun `composer install` or `npm install --prefix frontend`.

For contributor guidelines, refer to `AGENTS.md`.
