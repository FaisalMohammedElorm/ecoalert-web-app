# EcoAlert — Environmental Reporting Platform

EcoAlert is a citizen-driven environmental reporting platform. Citizens report hazards —
illegal dumping, overflowing bins, blocked drains, flooding, water and air pollution, bush
fires, illegal mining, tree cutting, and other environmental issues — with a photo and a GPS
pin. Environmental officers review, assign, and resolve them. Administrators oversee users,
categories, and district-wide analytics. Flooding is one category among many — this is a
general-purpose environmental reporting system, not a flood-specific tool.

## Project structure

```
EcoAlert-Environmental-Platform/
├── frontend/           Next.js 14 + TypeScript + Tailwind — citizen/officer/admin web app
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── backend/            Express + TypeScript + MongoDB — REST API
│   ├── src/
│   │   ├── config/ controllers/ middleware/ models/ routes/ services/ validators/ utils/ types/
│   ├── tests/
│   ├── docs/API.md
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docs/
│   └── ARCHITECTURE.md
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md            (this file)
```

## Quick start — Docker (recommended)

```bash
cp .env.example .env   # fill in JWT secrets at minimum
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/v1 (health check at `/api/v1/health`)
- MongoDB: persisted in the `mongodb_data` volume

## Quick start — local (no Docker)

Requires Node 20+ and a MongoDB instance (local or Atlas).

```bash
# Backend
cd backend
npm install
cp .env.example .env       # set MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET at minimum
npm run dev                 # http://localhost:5000

# Frontend, in a second terminal
cd frontend
npm install
cp .env.example .env.local
npm run dev                  # http://localhost:3000
```

## Creating the first admin account

Every registration defaults to `citizen`. There is no admin account out of the box — run this
once against your backend to create one:

```bash
cd backend
ADMIN_NAME="Your Name" ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SomeStrongPass1 npm run seed:admin
```

Safe to re-run — it's a no-op if an admin already exists. If a user with that email already
exists, it promotes them to admin instead of erroring.

## Environment variables

| Variable | Where | Required | Notes |
| --- | --- | --- | --- |
| `MONGODB_URI` | backend | ✅ | Local: `mongodb://localhost:27017/ecoalert`. Atlas: `mongodb+srv://<user>:<password>@<cluster-host>/ecoalert?retryWrites=true&w=majority&appName=<app-name>` — include a database name in the path, Atlas's generated string omits one by default |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | backend | ✅ | long random strings, must differ from each other |
| `CLIENT_URL` | backend | ✅ | used for CORS + links in emails, e.g. `http://localhost:3000` |
| `CLOUDINARY_*` | backend | optional | image upload no-ops gracefully without it (reports still create, just without images) |
| `EMAIL_*` | backend | optional | email sends no-op with a warning log if unset |
| `NEXT_PUBLIC_API_URL` | frontend | ✅ | e.g. `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_MAP_API_KEY` | frontend | optional | unused by the Leaflet/OSM map picker; reserved if you swap to Google Maps |

Full lists with defaults: `backend/.env.example`, `frontend/.env.example`.

## Commands

| | Frontend | Backend |
| --- | --- | --- |
| Dev server | `npm run dev` | `npm run dev` |
| Production build | `npm run build` | `npm run build` |
| Start production build | `npm run start` | `npm run start` |
| Lint | `npm run lint` | `npm run lint` |
| Tests | `npm test` (Vitest) | `npm test` (Jest) |

## Docker

```bash
docker compose up --build      # all three services
docker compose down            # stop
docker compose down -v         # stop and wipe the Mongo volume
```

Each service also has a standalone `Dockerfile` if you want to build/deploy them independently.

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — system diagram, DB schema, folder structure rationale, future AI/IoT extension points
- [`backend/docs/API.md`](./backend/docs/API.md) — full REST API reference with request/response examples
- [`frontend/README.md`](./frontend/README.md) / [`backend/README.md`](./backend/README.md) — service-specific detail

## Known limitations

- **Connecting to MongoDB Atlas requires your IP to be whitelisted.** In Atlas, go to
  Network Access and add your machine's IP (or `0.0.0.0/0` to allow from anywhere, fine for
  development). Without this, the server will log `Could not connect to any servers in your
  MongoDB Atlas cluster` and exit — this is Atlas rejecting the connection, not a bug in the
  app; `connectDatabase()` is designed to fail loudly and exit rather than start in a broken
  state.

- **Email and image upload are optional at runtime.** Without `EMAIL_*` / `CLOUDINARY_*`
  configured, those features no-op gracefully (logged as warnings) rather than failing —
  intentional for easy local evaluation, but set them for production use.
- **Backend tests need a `mongod` binary.** `mongodb-memory-server` downloads one on first run;
  in fully offline/network-restricted environments, pre-seed the binary cache or set
  `MONGOMS_SYSTEM_BINARY` to a locally installed `mongod`.
- **SMS/push notifications and AI image classification are architected for but not implemented**
  (see `docs/ARCHITECTURE.md` → "Future-ready extension points") — the current notification and
  report-image pipelines are built so adding either is additive, not a rewrite.
- **No per-user notification channel preferences** — everyone gets in-app + email; there's no
  opt-out UI.
- **No geographic/radius filtering on reports** — status, category, severity, search, sorting
  (by newest/oldest or severity rank), and pagination are all wired; filtering by distance from
  a point is not.
