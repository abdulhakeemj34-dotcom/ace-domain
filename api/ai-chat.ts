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

type BedrockConverseResponse = {
  output?: {
    message?: {
      content?: Array<{
        text?: string;
      }>;
    };
  };
};

const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_BEDROCK_MODEL_ID = 'amazon.nova-lite-v1:0';
const DEFAULT_BEDROCK_REGION = 'us-east-1';
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const ACE_AI_SYSTEM_PROMPT = 'You are Ace Domain AI for ACE DOMAIN - MEET THE WORLD. Reply clearly, safely, and helpfully for a global social app.';
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

function resolveAiProvider() {
  const requestedProvider = process.env.AI_PROVIDER?.trim().toLowerCase();
  const hasBedrockKey = Boolean(process.env.AWS_BEARER_TOKEN_BEDROCK?.trim());
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY?.trim());

  if (requestedProvider && !['bedrock', 'openai'].includes(requestedProvider)) {
    return {
      error: 'AI_PROVIDER must be set to bedrock or openai.'
    };
  }

  if (requestedProvider === 'bedrock') {
    return hasBedrockKey
      ? { provider: 'bedrock' as const }
      : { error: 'AWS_BEARER_TOKEN_BEDROCK is missing from the backend environment.' };
  }

  if (requestedProvider === 'openai') {
    return hasOpenAIKey
      ? { provider: 'openai' as const }
      : { error: 'OPENAI_API_KEY is missing from the backend environment.' };
  }

  if (hasBedrockKey) {
    return { provider: 'bedrock' as const };
  }

  if (hasOpenAIKey) {
    return { provider: 'openai' as const };
  }

  return {
    error: 'No backend AI provider is configured. Add AWS_BEARER_TOKEN_BEDROCK or OPENAI_API_KEY.'
  };
}

async function requestOpenAI(messages: ClientMessage[], apiKey: string) {
  const openAIResponse = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    body: JSON.stringify({
      messages: [
        {
          content: ACE_AI_SYSTEM_PROMPT,
          role: 'system'
        },
        ...messages
      ],
      model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
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

async function requestBedrock(messages: ClientMessage[], apiKey: string) {
  const region = process.env.BEDROCK_REGION?.trim() || process.env.AWS_REGION?.trim() || DEFAULT_BEDROCK_REGION;
  const modelId = process.env.BEDROCK_MODEL_ID?.trim() || DEFAULT_BEDROCK_MODEL_ID;
  const url = `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/converse`;
  const systemMessages = messages
    .filter((message) => message.role === 'system')
    .map((message) => ({ text: message.content }));
  const conversationMessages = messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      content: [{ text: message.content }],
      role: message.role
    }));

  const bedrockResponse = await fetch(url, {
    body: JSON.stringify({
      inferenceConfig: {
        maxTokens: 900,
        temperature: 0.7
      },
      messages: conversationMessages,
      system: [{ text: ACE_AI_SYSTEM_PROMPT }, ...systemMessages]
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  if (!bedrockResponse.ok) {
    return { error: 'Amazon Bedrock request failed. Please try again later.' };
  }

  const data = await bedrockResponse.json() as BedrockConverseResponse;
  const reply = data.output?.message?.content
    ?.map((item) => item.text?.trim())
    .filter((text): text is string => Boolean(text))
    .join('\n')
    .trim();

  if (!reply) {
    return { error: 'Amazon Bedrock response did not include a reply.' };
  }

  return { reply };
}

export default async function handler(request: RequestWithBody, response: ServerResponse) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Invalid request method. Use POST.' });
    return;
  }

  const provider = resolveAiProvider();

  if (provider.error || !provider.provider) {
    sendJson(response, 500, { error: provider.error ?? 'Ace AI is not configured.' });
    return;
  }

  const body = await readRequestBody(request);
  const normalized = normalizeMessages(body);

  if (normalized.error || !normalized.messages) {
    sendJson(response, 400, { error: normalized.error ?? 'Invalid request body.' });
    return;
  }

  try {
    const apiKey = provider.provider === 'bedrock'
      ? process.env.AWS_BEARER_TOKEN_BEDROCK
      : process.env.OPENAI_API_KEY;
    const result = provider.provider === 'bedrock'
      ? await requestBedrock(normalized.messages, apiKey ?? '')
      : await requestOpenAI(normalized.messages, apiKey ?? '');

    if (result.error || !result.reply) {
      sendJson(response, 502, { error: result.error ?? 'AI provider request failed. Please try again later.' });
      return;
    }

    sendJson(response, 200, { reply: result.reply });
  } catch {
    sendJson(response, 502, { error: 'OpenAI request failed. Please try again later.' });
  }
}
