# VedaAI

VedaAI is a classroom assignment and question-paper generation platform for teachers. It includes assignment management, group views, a reusable content library, PDF-ready question papers, and a teacher toolkit powered by Gemini when an API key is available.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Zustand
- Backend: Node.js, Express, TypeScript, Socket.IO
- Queue: BullMQ with Redis
- Database: MongoDB
- Generation: Google Gemini API with deterministic local fallback

## Project Structure

```text
VedaAI/
├── backend/
│   ├── src/
│   │   ├── api/                  # Express routes
│   │   ├── application/          # generation prompts and services
│   │   ├── config/               # environment and logger setup
│   │   ├── domain/               # shared backend types and schemas
│   │   ├── infrastructure/       # MongoDB, Redis, queue, websocket
│   │   ├── server.ts             # API entrypoint
│   │   └── worker.ts             # BullMQ worker entrypoint
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js app routes
│   │   ├── components/           # UI, layout, form, output components
│   │   ├── features/             # Zustand stores
│   │   ├── hooks/                # assignment, generation, socket hooks
│   │   ├── lib/                  # constants, validation, utilities
│   │   ├── services/             # API and local fallback services
│   │   └── types/                # frontend TypeScript types
│   ├── package.json
│   └── tailwind.config.ts
├── docker-compose.yml            # local MongoDB and Redis
├── package.json                  # workspace scripts
├── package-lock.json
└── .env.example
```

## Prerequisites

- Node.js 20 or newer
- npm
- Docker Desktop, or separate MongoDB and Redis instances
- Gemini API key for live generation

## Environment Setup

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
DEFAULT_SCHOOL_NAME=Delhi Public School, Sector-4, Bokaro
DEFAULT_TEACHER_NAME=Vaibhav Porwal
```

For local frontend-only fallback behavior, the app can still create deterministic papers if the backend is unavailable.

## Install

```bash
npm install
```

## Run Locally

Start MongoDB and Redis:

```bash
docker compose up -d
```

Start frontend, backend, and worker together:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Backend health check:

```text
http://localhost:4000/health
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

Workspace-specific scripts:

```bash
npm run dev --workspace frontend
npm run dev --workspace backend
npm run worker --workspace backend
npm run build --workspace frontend
npm run build --workspace backend
```

## Deployment

Recommended free setup for a demo or small personal project:

- Frontend: Vercel
- Backend API and worker: Render free web service
- Database: MongoDB Atlas M0 free cluster
- Redis: Upstash Redis free tier

This keeps the Next.js frontend on the platform best suited for it, while the backend stays as a normal Node process. On free hosting, expect cold starts and usage limits.

### Frontend on Vercel

1. Import the GitHub repository in Vercel.
2. Set the root directory to `frontend`.
3. Build command: `npm run build`
4. Output is handled automatically by Vercel.
5. Add environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url
```

### Backend on Render

Create a Web Service from the same GitHub repository.

Recommended settings:

```text
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start & npm run start:worker
```

Add environment variables:

```env
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-url
MONGODB_URI=your_mongodb_atlas_connection_string
REDIS_URL=your_upstash_redis_url
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
DEFAULT_SCHOOL_NAME=Your School Name
DEFAULT_TEACHER_NAME=Vaibhav Porwal
```

After Render gives you a backend URL, update the Vercel frontend environment variables and redeploy the frontend.

## Notes

- The red Next.js development indicator appears only in local dev mode and is hidden in the app CSS for cleaner previews. It does not appear in production builds.
- PDF export uses the browser print dialog with print-specific CSS so only the question paper is printed.
- Profile and school settings are stored in browser local storage and are used in the header, sidebar, generated paper display, and local paper generation.
- Do not commit `.env`, `.env.local`, `node_modules`, `.next`, `dist`, or generated cache files.

