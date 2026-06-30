import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import aiChatHandler from './api/ai-chat.ts';

function aceAiDevApi(mode: string): Plugin {
  return {
    name: 'ace-ai-dev-api',
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), '');

      if (!process.env.OPENAI_API_KEY && env.OPENAI_API_KEY) {
        process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
      }

      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split('?')[0];

        if (pathname !== '/api/ai-chat') {
          next();
          return;
        }

        try {
          await aiChatHandler(request, response);
        } catch {
          response.statusCode = 500;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ error: 'Local Ace AI endpoint failed. Please try again.' }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), aceAiDevApi(mode)]
}));
