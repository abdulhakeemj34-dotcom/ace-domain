type AiChatSuccess = {
  ok: true;
  reply: string;
};

type AiChatFailure = {
  error: string;
  ok: false;
};

export type AiChatResult = AiChatSuccess | AiChatFailure;

type AiChatResponseBody = {
  error?: unknown;
  reply?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readJson(response: Response): Promise<AiChatResponseBody | null> {
  try {
    const data = await response.json() as unknown;
    return isRecord(data) ? data : null;
  } catch {
    return null;
  }
}

function safeError(value: unknown, fallback: string) {
  const message = typeof value === 'string' ? value.trim() : '';

  if (!message) {
    return fallback;
  }

  const normalized = message.toLowerCase();

  if (
    normalized.includes('openai_api_key') ||
    normalized.includes('backend environment') ||
    normalized.includes('api key')
  ) {
    return 'Ace AI is not fully configured yet. Please try again later.';
  }

  if (
    normalized.includes('insufficient_quota') ||
    normalized.includes('quota') ||
    normalized.includes('rate limit') ||
    normalized.includes('too many requests')
  ) {
    return 'Ace AI is temporarily limited. Please try again later.';
  }

  return message;
}

export async function sendAiChatMessage(message: string): Promise<AiChatResult> {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return { error: 'Type a message for Ace AI first.', ok: false };
  }

  try {
    const response = await fetch('/api/ai-chat', {
      body: JSON.stringify({ message: trimmedMessage }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    });
    const data = await readJson(response);

    if (!response.ok) {
      return {
        error: safeError(data?.error, 'Ace AI is unavailable right now. Please try again later.'),
        ok: false
      };
    }

    if (typeof data?.reply !== 'string' || !data.reply.trim()) {
      return { error: 'Ace AI did not return a reply. Please try again.', ok: false };
    }

    return { ok: true, reply: data.reply.trim() };
  } catch {
    return { error: 'Connection issue. Try Ace AI again when your network is stable.', ok: false };
  }
}
