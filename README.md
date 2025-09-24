# Campus Connect (MERN, JavaScript)

Safe, fun, cross-group interaction via meme wall, gamified quests, points, badges, weekly leaderboards, and structured limited chats.

## Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas (or local MongoDB)
- Ports used: 4000 (server), 5173 (web)

## Quick Start

1) Clone and install
```bash
# In the project root
cd server && npm install && cd ..
cd web && npm install && cd ..
```

2) Configure env
```bash
# Server
# Create server/.env with contents similar to server/.env.example
# Required: MONGO_URI, JWT_SECRET

# Web
# Create web/.env with contents similar to web/.env.example
```

3) Seed demo data
```bash
node seed/seed.js
```

4) Run apps (separate terminals)
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd web
npm run dev
```

5) Open Web
- http://localhost:5173

Demo credentials (after seeding):
- admin / admin123
- user1..user12 / password

## API Overview
- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/posts
- POST /api/posts
- POST /api/posts/:id/react
- POST /api/posts/:id/report
- GET /api/quests/me
- POST /api/quests/:questId/submit
- POST /api/quests/:questId/vote
- GET /api/chats/:chatId
- POST /api/chats/:chatId/message
- GET /api/leaderboard/weekly
- Admin:
  - GET /api/admin/reports
  - POST /api/admin/posts/:id/remove
  - POST /api/admin/posts/:id/restore
  - POST /api/admin/users/:id/penalize

## Testing
Backend:
```bash
cd server
npm test
```

Frontend E2E (minimal):
```bash
cd web
npm run cypress:open
# or
npm run cypress
```

## Docker (Optional)
See docker-compose.yml for local dev with Mongo + hot reload.

## Production Notes
- Configure proper CORS origins and HTTPS termination.
- Set strong JWT_SECRET.
- Use a production MongoDB cluster.
- Consider adding Cloudinary for uploads (stubbed).


