# PickleReserve

PickleReserve is a pickleball court reservation app. The repository contains a Vue 3 single-page frontend and a Laravel API backend.

## Features in the codebase

- Admin sign-in backed by Laravel Sanctum bearer tokens.
- Admin dashboard, court management, customer list, reservations, notifications, and settings screens.
- Public court listing, court availability, and booking flow.
- SQLite configuration for local development; Laravel also includes MySQL and PostgreSQL connection configurations.
- Laravel migrations, a court/test-user seeder, backend feature tests, and Playwright browser tests.

Public account registration is disabled by the backend. Create administrator accounts with the Artisan command below.

## Application structure

```text
.
├── backend/                  Laravel API, migrations, tests, and configuration
├── public/                   Frontend static assets
├── src/
│   ├── components/
│   │   ├── admin/            Admin chat and notification components
│   │   ├── auth/             Login form, inputs, and login visual
│   │   ├── booking/          Court information, schedule, confirmation, and chat
│   │   ├── dashboard/        Shared data table
│   │   └── ui/               Shared cards, logo, statistics, and status badge
│   ├── router/               Vue Router routes and admin navigation guard
│   ├── services/             API client, auth, logout, and admin preferences
│   └── views/
│       ├── admin/            Dashboard, courts, customers, reservations, settings
│       ├── auth/             Login and registration-disabled screens
│       └── user/             Court booking and booking form
├── tests/                    Playwright browser tests
├── package.json              Frontend scripts and dependencies
└── playwright.config.ts      Browser test configuration
```

### Frontend routes

| Route | Screen | Access |
|---|---|---|
| `/` | Redirects to `/login` | Public |
| `/login` | Admin login | Public |
| `/register` | Registration-disabled message | Public |
| `/book` | Court information and availability | Public |
| `/booking-form` | Booking details and confirmation | Public |
| `/dashboard` | Court administration | Admin |
| `/admin` | Admin dashboard | Admin |
| `/reservations` | Reservation management | Admin |
| `/customers` | Customer list | Admin |
| `/settings` | Admin settings | Admin |

The router checks for an `ADMIN` user and a stored token before displaying admin routes. Backend authorization is enforced separately by Laravel middleware.

### Main components

- `src/components/booking/BookingSchedule.vue` — court/date/slot availability UI.
- `src/components/booking/BookingConfirmationSheet.vue` and `BookingSummary.vue` — booking confirmation and summary.
- `src/components/admin/AdminChatWidget.vue` and `AdminNotificationCenter.vue` — admin-side chat and notifications.
- `src/components/dashboard/DataTable.vue` — shared data table.
- `src/components/ui/` — shared logo, card, stat-card, and status-badge components.
- `src/services/api.js` — Axios API client, bearer-token header, and short-lived GET response cache.
- `src/services/auth.js` and `logout.js` — client-side authentication state and logout helpers.

## UI flow and text wireframes

These are descriptions of the implemented screens, not separate design mockup files.

### Public booking

```text
Court booking (/book)
┌─────────────────────────────────────┐
│ PickleReserve navigation            │
│ Court details / photos / about      │
│ Date selector                       │
│ Available time slots                │
│ Booking summary → Reserve           │
└─────────────────────────────────────┘
                  │
                  ▼
Booking form (/booking-form)
┌─────────────────────────────────────┐
│ Selected court and time             │
│ Customer contact details            │
│ Payment method / notes              │
│ Confirm & Pay                       │
└─────────────────────────────────────┘
```

### Admin

```text
Admin sign-in (/login)
        │
        ▼
Admin dashboard (/admin)
  ├── Court administration (/dashboard)
  ├── Reservations (/reservations)
  ├── Customers (/customers)
  └── Settings (/settings)
```

The pages are implemented in `src/views/`; layout and styling are in the Vue components and `src/assets/`.

## Database schema

Schema is maintained by Laravel migrations in `backend/database/migrations/`. Run migrations to create or update the database; do not edit the database file by hand.

### Application tables

| Table | Main columns | Relationships / purpose |
|---|---|---|
| `users` | `id`, `name`, unique `email`, `password`, `email_verified_at`, `role` (default `CUSTOMER`), nullable `phone`, timestamps | Admin and customer accounts. Passwords are hashed by the model. |
| `courts` | `id`, `name`, nullable `description`, `price_per_hour`, `is_active` (default `true`), timestamps | Court inventory and hourly price. |
| `bookings` | `id`, `court_id`, customer name/email/phone, `start_time`, `end_time`, `total_price`, `payment_method`, `status`, nullable `notes`, timestamps | Belongs to a court; deleting a court cascades to its bookings. Status defaults to `Pending`; payment method defaults to `Pay at venue`. |
| `personal_access_tokens` | Sanctum token fields including polymorphic `tokenable`, unique token hash, abilities, expiry, timestamps | API bearer-token authentication. |

The booking migrations add indexes on `created_at` and `(status, created_at)` for admin queries and notifications.

Laravel also creates framework tables for password-reset tokens, sessions, cache and cache locks, and queued/failed jobs.

### Seed data

`php artisan db:seed` creates any missing courts named Court 1–3. Newly created courts are active, have the description `Silica sand`, and are priced at 350/hour; existing courts with those names are left in place. The seeder also creates a factory-generated user at `test@example.com` if missing. That seeded user is **not** an admin; admin login requires an `ADMIN` account.

## Requirements

- Node.js `^22.18.0` or `>=24.12.0` (as declared in `package.json`).
- PHP `^8.3` and Composer.
- PHP PDO SQLite extension for the default local database.

## Local setup

Run these commands from the repository root.

### 1. Start the Laravel API

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
New-Item -ItemType File -Path database/database.sqlite -Force
php artisan migrate --seed
php artisan app:create-admin "Admin Name" admin@example.com
php artisan serve
```

The admin command prompts for a password and confirmation. The API is served at `http://127.0.0.1:8000` by default.

If `.env` already exists, keep it and do not overwrite it with the example. The example uses SQLite. Configure `DB_CONNECTION` and the corresponding credentials in `backend/.env` if using another database.

### 2. Start the Vue frontend

In a second terminal, from the repository root:

```powershell
npm install
npm run dev
```

Vite prints the local frontend URL (normally `http://localhost:5173`). The API client defaults to `http://<current-browser-host>:8000/api`. To set a different API base URL, define `VITE_API_URL`, including `/api`, before starting or building the frontend; for example:

```powershell
$env:VITE_API_URL = "http://127.0.0.1:8000/api"
npm run dev
```

## Tests and production build

Frontend production build:

```powershell
npm run build
```

Backend tests (from `backend/`):

```powershell
php artisan test
```

Browser tests (from the repository root; install the Playwright Chromium browser once if needed):

```powershell
npx playwright install chromium
npx playwright test
```

The Playwright configuration starts the Vite development server and uses Chromium at a 1366 × 768 viewport.

## Deployment

The repository does not define a hosting provider, production domain, production CORS origin, or deployment automation. Configure these for your chosen host before going live:

1. Deploy the Laravel `backend/` application on a PHP 8.3+ host with Composer and a supported production database. Point the web server document root at `backend/public`, not the repository root.
2. Set production environment values in the host's secret/configuration manager. At minimum, set a unique `APP_KEY`, `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, database credentials, and any required session/cache/queue settings. Never commit the production `.env`.
3. Run `composer install --no-dev --optimize-autoloader` in `backend/`, then run `php artisan migrate --force`. Back up the database before applying production migrations.
4. Create the first admin account using `php artisan app:create-admin "Admin Name" admin@example.com` on the server.
5. Configure `backend/config/cors.php` to allow the exact production frontend origin. Its current allowed origins are for local development; do not assume production browser requests will work until this is changed.
6. Build the frontend with `VITE_API_URL` set to the HTTPS API URL ending in `/api`, then publish the generated `dist/` files to a static host or web server. The host must route SPA paths such as `/reservations` back to `index.html`.
7. Serve both frontend and API over HTTPS, verify the production API CORS settings, and test admin login, court availability, and booking submission before opening the site to users.

The app's `/register` screen and API endpoint both report that public registration is disabled. Create accounts through the server-side admin command or an explicitly approved future account-management workflow.
