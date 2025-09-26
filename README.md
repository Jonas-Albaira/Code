Setup Instructions
Prerequisites

Node.js 20+ (LTS)

npm or pnpm

PostgreSQL 14+ (local or Docker)

1) Clone & Install
git clone https://github.com/Jonas-Albaira/Code.git
cd Code
npm install         # or: pnpm install

2) Environment Variables

Create apps/api/.env:

# API
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000

# Auth
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# DB (Postgres)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/turbovets


Create apps/dashboard/.env (or environment.ts equivalent):

NG_APP_API_URL=http://localhost:3000

3) Start a local Postgres (optional via Docker)
docker run --name turbovets-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=turbovets -p 5432:5432 -d postgres:14

4) DB Migrations / Seed (if available)
# Example commands (adjust to your ORM tooling if different)
npx nx run api:migrate
npx nx run api:seed

5) Run the stack
# Start backend (NestJS)
npx nx serve api        # http://localhost:3000

# Start frontend (Angular)
npx nx serve dashboard  # http://localhost:4200

6) Tests
npx nx test api
npx nx test dashboard
npx nx test auth
npx nx test data
