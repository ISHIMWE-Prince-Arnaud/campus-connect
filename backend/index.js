const express = require('express');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const sanitize = require('mongo-sanitize');
const { connectDb } = require('./utils/db');
const { port, clientOrigin } = require('./utils/config');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');
const { errorHandler } = require('./middleware/error');
const { initSocket } = require('./socket');
const { startWeeklyCycle } = require('./jobs/weeklyCycle');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const questsRoutes = require('./routes/quests');
const chatsRoutes = require('./routes/chats');
const leaderboardRoutes = require('./routes/leaderboard');
const adminRoutes = require('./routes/admin');
const healthRoutes = require('./routes/health');

(async () => {
  await connectDb();

  const app = express();
  const server = http.createServer(app);
  const io = initSocket(server);
  app.set('io', io);

  app.use(helmet());
  app.use(cors({ origin: clientOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));
  app.use((req, _res, next) => {
    // Basic anti-injection sanitation for JSON bodies
    if (req.body && typeof req.body === 'object') {
      req.body = sanitize(req.body);
    }
    next();
  });

  app.use('/api', apiLimiter);
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/posts', postsRoutes);
  app.use('/api/quests', questsRoutes);
  app.use('/api/chats', chatsRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', healthRoutes);

  app.use(errorHandler);

  startWeeklyCycle(io);

  server.listen(port, () => console.log(`Server listening on :${port}`));
})();