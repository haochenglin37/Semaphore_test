# Semaphore Anon Board

This project is a minimal anonymous forum that uses [Semaphore](https://github.com/semaphore-protocol) to allow users to post to boards anonymously while preventing spam via rate limiting and nullifier checks.

## Project structure

```
semaphore-anon-board/
├─ README.md
├─ .gitignore
├─ .env.example
│
├─ client/
│  ├─ index.html
│  ├─ style.css
│  ├─ tsconfig.json
│  ├─ package.json
│  ├─ public/
│  │  └─ artifacts/
│  │     ├─ semaphore.wasm
│  │     ├─ semaphore.zkey
│  │     └─ semaphore.vkey.json
│  └─ src/
│     ├─ main.ts
│     ├─ api.ts
│     ├─ semaphore.ts
│     └─ storage.ts
│
└─ server/
   ├─ package.json
   ├─ tsconfig.json
   ├─ .env.example
   ├─ prisma/
   │  └─ schema.prisma
   └─ src/
      ├─ index.ts
      ├─ config/
      │  └─ env.ts
      ├─ db/
      │  └─ prismaClient.ts
      ├─ routes/
      │  ├─ boards.ts
      │  └─ posts.ts
      └─ services/
         ├─ groupService.ts
         └─ proofService.ts
```

## Running locally

### Server

```bash
cd server
pnpm install
cp .env.example .env # fill in DATABASE_URL, PORT and CORS_ORIGIN
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev
```

### Client

```bash
cd client
pnpm install
pnpm dev
```

The front-end will be served at `http://localhost:5173` (by default) and the server at `http://localhost:3001`.
