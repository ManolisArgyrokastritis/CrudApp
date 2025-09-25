# Repository Guidelines

## Project Structure & Module Organization
Backend code now lives under `backend/` (e.g. `backend/app`, `backend/routes/api.php`, `backend/database`). The React client remains in `frontend/` with source in `frontend/src` and build output in `frontend/dist`. Public assets for the API (storage symlink, favicon) stay in `backend/public`, while compiled frontend assets should be served from the React build.

## Build, Test, and Development Commands
Inside `backend/` run `composer install` and `composer test` for the Laravel suite. Use `npm install` inside `frontend/` to fetch UI dependencies. For local development run `composer run dev` from `backend/` to boot the API (`php artisan serve`), queue listener, log tail, and the React dev server via Vite. To build production bundles call `npm run build` from `frontend/` (or `npm run build --prefix frontend` at the repo root).

## Coding Style & Naming Conventions
PHP sticks to PSR-12 with 4-space indentation; `vendor/bin/pint` formats server code. Follow Laravel conventions for controllers/resources under `App\Http\Controllers\Api`, requests in `App\Http\Requests\Site`, and resources in `App\Http\Resources` (all within `backend/app`). React components use PascalCase filenames under `frontend/src/components`, hooks/state inside `frontend/src/App.jsx`, and rely on Bootstrap utility classes. Prefer descriptive prop names and keep JSX fragments small and reusable.

## Testing Guidelines
API coverage uses PHPUnit 11 with `backend/tests/Feature/SiteApiTest.php` exercising list/create/update/destroy flows. Extend this suite when adding endpoints; use factories (`Database\Factories\SiteFactory`) and `RefreshDatabase`. Frontend tests are not yet scaffolded—add Vitest/React Testing Library if the UI grows. Aim to keep regression coverage around CRUD flows, imports, and pagination.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `refactor:`) so backend and frontend changes stay traceable. Keep backend and frontend updates in the same PR when they depend on each other, but separate unrelated chores. PRs should link Jira/GitHub issues, call out new environment variables (e.g., `FRONTEND_URLS`, `VITE_API_BASE_URL`), and include screenshots or screen recordings for UI tweaks. Mention migration impacts, seeder/backfill steps, and any API contract changes explicitly.

## Security & Configuration Tips
Do not commit `backend/.env`; copy values from `backend/.env.example` and `frontend/.env.example`. Configure CORS origins via `FRONTEND_URLS` so only approved clients hit the API. Sanitise and validate Excel uploads—`SitesImport` already skips blanks and tracks failures, but review summaries before trusting bulk changes. Never run `php artisan config:cache` locally while iterating; reserve it for deployment pipelines.
