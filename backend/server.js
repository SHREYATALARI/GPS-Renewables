/**
 * GPS Renewables R&D — API entry point.
 * FUTURE: Add WebSocket server, job queue (Bull/BullMQ), rate limiting, helmet, morgan.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import researchRoutes from './routes/research.routes.js';
import activityRoutes from './routes/activity.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import collaborationRoutes from './routes/collaboration.routes.js';
import versionRoutes from './routes/version.routes.js';
import scientificRoutes from './routes/scientific.routes.js';
import { migrateLegacySchemas } from './db/migrateLegacySchemas.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const CORS_ALLOWLIST = ['http://localhost:5173', CLIENT_URL];

app.use(
  cors({
    origin(origin, cb) {
      /** Allow same-origin server-to-server requests with no Origin header */
      if (!origin) return cb(null, true);
      return cb(null, CORS_ALLOWLIST.includes(origin));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'gps-renewables-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/version-history', versionRoutes);
app.use('/api', scientificRoutes);

// FUTURE: Global error handler middleware, 404 handler, request id tracing
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

async function main() {
  
  const uri = process.env.MONGODB_URI;

if (uri) {
  await mongoose.connect(uri);
  console.log('MongoDB connected');
  await migrateLegacySchemas();
} else {
  console.log('MongoDB not configured. Running without database.');
}
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');

  await migrateLegacySchemas();

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });


main().catch((e) => {
  console.error(e);
  process.exit(1);
});
