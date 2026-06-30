import type { IncomingMessage, ServerResponse } from 'node:http';

type ChatRole = 'assistant' | 'system' | 'user';

type ClientMessage = {
  content: string;
  role: ChatRole;
};

type ApiResponse = {
  error?: string;
  reply?: string;
};

type RequestWithBody = IncomingMessage & {
  body?: unknown;
};

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const allowedRoles = new Set<ChatRole>(['assistant', 'system', 'user']);

function sendJson(response: ServerResponse, statusCode: number, payload: ApiResponse) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function readRequestBody(request: RequestWithBody) {
  if (request.body !== undefined) {
    if (typeof request.body === 'string') {
      return parseJson(request.body);
    }

    return request.body;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of request as AsyncIterable<Buffer | string>) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim();

  if (!rawBody) {
    return null;
  }

  return parseJson(rawBody);
}

function normalizeMessages(body: unknown): { error?: string; messages?: ClientMessage[] } {
  if (!isRecord(body)) {
    return { error: 'Invalid request body. Send JSON with message or messages.' };
  }

  if (Array.isArray(body.messages)) {
    const messages = body.messages.slice(0, MAX_MESSAGES).map((item): ClientMessage | null => {
      if (!isRecord(item) || typeof item.content !== 'string' || typeof item.role !== 'string') {
        return null;
      }

      const role = item.role as ChatRole;
      const content = item.content.trim().slice(0, MAX_MESSAGE_LENGTH);

      if (!allowedRoles.has(role) || !content) {
        return null;
      }

      return { content, role };
    });

    if (messages.some((message) => message === null)) {
      return { error: 'Invalid messages. Each message needs role and content.' };
    }

    const validMessages = messages.filter((message): message is ClientMessage => message !== null);
    const hasUserMessage = validMessages.some((message) => message.role === 'user' && message.content.length > 0);

    if (!validMessages.length || !hasUserMessage) {
      return { error: 'Empty message. Send at least one user message.' };
    }

    return { messages: validMessages };
  }

  if (typeof body.message !== 'string') {
    return { error: 'Invalid request body. Send JSON with message or messages.' };
  }

  const message = body.message.trim().slice(0, MAX_MESSAGE_LENGTH);

  if (!message) {
    return { error: 'Empty message. Send a non-empty message.' };
  }

  return { messages: [{ content: message, role: 'user' }] };
}

async function requestOpenAI(messages: ClientMessage[], apiKey: string) {
  const openAIResponse = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    body: JSON.stringify({
      messages: [
        {
          content: 'You are Ace Domain AI for ACE DOMAIN - MEET THE WORLD. Reply clearly, safely, and helpfully for a global social app.',
          role: 'system'
        },
        ...messages
      ],
      model: 'gpt-4o-mini',
      temperature: 0.7
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  if (!openAIResponse.ok) {
    return { error: 'OpenAI request failed. Please try again later.' };
  }

  const data = await openAIResponse.json() as OpenAIChatResponse;
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    return { error: 'OpenAI response did not include a reply.' };
  }

  return { reply };
}

export default async function handler(request: RequestWithBody, response: ServerResponse) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Invalid request method. Use POST.' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    sendJson(response, 500, { error: 'OPENAI_API_KEY is missing from the backend environment.' });
    return;
  }

  const body = await readRequestBody(request);
  const normalized = normalizeMessages(body);

  if (normalized.error || !normalized.messages) {
    sendJson(response, 400, { error: normalized.error ?? 'Invalid request body.' });
    return;
  }

  try {
    const result = await requestOpenAI(normalized.messages, apiKey);

    if (result.error || !result.reply) {
      sendJson(response, 502, { error: result.error ?? 'OpenAI request failed. Please try again later.' });
      return;
    }

    sendJson(response, 200, { reply: result.reply });
  } catch {
    sendJson(response, 502, { error: 'OpenAI request failed. Please try again later.' });
  }
}
