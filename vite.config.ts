import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import aiChatHandler from './api/ai-chat.ts';

const backendEnvKeys = [
  'AI_PROVIDER',
  'AWS_BEARER_TOKEN_BEDROCK',
  'AWS_REGION',
  'BEDROCK_MODEL_ID',
  'BEDROCK_REGION',
  'OPENAI_API_KEY',
  'OPENAI_MODEL'
];

function aceAiDevApi(mode: string): Plugin {
  return {
    name: 'ace-ai-dev-api',
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), '');

      backendEnvKeys.forEach((key) => {
        if (!process.env[key] && env[key]) {
          process.env[key] = env[key];
        }
      });

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
