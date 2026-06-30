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
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export async function sendAiChatMessage(message: string): Promise<AiChatResult> {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return { error: 'Type a message for Ace Domain AI first.', ok: false };
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
        error: safeError(data?.error, 'Ace Domain AI is not available right now. Please try again soon.'),
        ok: false
      };
    }

    if (typeof data?.reply !== 'string' || !data.reply.trim()) {
      return { error: 'Ace Domain AI did not return a reply. Please try again.', ok: false };
    }

    return { ok: true, reply: data.reply.trim() };
  } catch {
    return { error: 'Network error. Check your connection and try Ace Domain AI again.', ok: false };
  }
}
