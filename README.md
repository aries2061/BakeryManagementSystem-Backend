# Bakery Management System Backend

NestJS backend for bakery operations: authentication, branches, inventory, orders, promotions, customers, employees, uploads, and realtime updates.

## Tech Stack
- NestJS + TypeScript
- Supabase (PostgreSQL) for domain data
- MongoDB (Mongoose) for request/action logs
- JWT + Google OAuth2
- Socket.IO gateway for branch-level realtime events

## Prerequisites
- Node.js 20+
- npm 10+
- MongoDB instance
- Supabase project
- Google OAuth credentials

## Environment Setup
1. Copy `.env.example` to `.env`.
2. Fill all required variables.

Required environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `FRONTEND_URL`

MongoDB logging database should use:
- `BakeryManagementSystem_Log` (for example: `mongodb://localhost:27017/BakeryManagementSystem_Log`)

MongoDB logging toggle:
- `ENABLE_MONGODB_LOGGING=true` requires `MONGODB_URI`
- default behavior is disabled when `ENABLE_MONGODB_LOGGING` is not `true`

Optional:
- `FRONTEND_ORIGINS` (comma-separated origin whitelist)
- `PORT` (default `3001`)
- `BLOB_READ_WRITE_TOKEN` (for uploads)

## Run Locally
```bash
npm install
npm run dev
```

## Build and Start
```bash
npm run build
npm run start:prod
```

## Quality Commands
```bash
npm run format
npm run lint
npm run lint:fix
npm test
npm run test:e2e
```

## API Docs
- Swagger UI: `http://localhost:3001/api-docs`

## Deploy on Vercel
1. Import this repository in Vercel.
2. Keep root directory as project root.
3. Ensure `vercel.json` is present (already included).
4. Add all required environment variables in Vercel Project Settings:
	- `MONGODB_URI`
	- `SUPABASE_URL`
	- `SUPABASE_SERVICE_ROLE_KEY`
	- `JWT_SECRET`
	- `GOOGLE_CLIENT_ID`
	- `GOOGLE_CLIENT_SECRET`
	- `GOOGLE_CALLBACK_URL`
	- `FRONTEND_URL`
	- `FRONTEND_ORIGINS`
	- `ENABLE_SWAGGER=false` (recommended in production)
5. Redeploy after setting env vars.

## Deploy on Render
1. Create a new **Web Service** and connect this repository.
2. Render can auto-detect settings from [render.yaml](render.yaml).
3. If setting manually, use:
	- Build Command: `npm ci --include=dev && npm run build`
	- Start Command: `npm run start:prod`
4. Add required environment variables:
	- `MONGODB_URI`
	- `SUPABASE_URL`
	- `SUPABASE_SERVICE_ROLE_KEY`
	- `JWT_SECRET`
	- `GOOGLE_CLIENT_ID`
	- `GOOGLE_CLIENT_SECRET`
	- `GOOGLE_CALLBACK_URL`
	- `FRONTEND_URL`
	- `FRONTEND_ORIGINS`
5. Set OAuth callback to your Render domain, for example:
	- `https://<your-render-service>.onrender.com/auth/google/callback`

## Project Structure
- `src/auth` authentication, strategies, guards
- `src/branches` branch management
- `src/inventory` inventory and stock
- `src/orders` order flow and status
- `src/customers` loyalty and customer data
- `src/promotions` promotion rules
- `src/employees` branch staffing records
- `src/uploads` blob storage uploads
- `src/logging` request/action logging
- `src/gateway` websocket gateway

## Architecture
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for module boundaries and data ownership.

## Database Structure
See [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md).
