import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './database/connection';

async function startServer() {
  // Connect to database if accessible
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`[API] AXIVON LEARN REST API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`[API] Health check available at: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`\n[API] Received ${signal}. Initiating graceful shutdown...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('[API] Server terminated cleanly.');
      process.exit(0);
    });

    // Force shutdown after 10s timeout
    setTimeout(() => {
      console.error('[API] Forced termination timeout exceeded.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();
