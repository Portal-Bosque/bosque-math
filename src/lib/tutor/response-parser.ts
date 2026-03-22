// =============================================================================
// Bosque Math v2 — Parse and validate AI tutor responses
// =============================================================================

import type { TutorResponse } from '../types';

const VALID_ACTIONS = [
  'explain',
  'ask_question',
  'give_feedback',
  'transition',
  'celebrate',
  'hint',
  'simplify',
] as const;

const FALLBACK_RESPONSE: TutorResponse = {
  message: '¡Seguimos! Pensá tranquilo, no hay apuro 🦉',
  action: 'explain',
};

/**
 * Parse AI model output into a validated TutorResponse.
 * Handles JSON extraction from markdown code blocks, malformed JSON, etc.
 */
export function parseTutorResponse(raw: string): TutorResponse {
  try {
    // Try to extract JSON from the response (might be wrapped in ```json...```)
    const jsonStr = extractJson(raw);
    const parsed = JSON.parse(jsonStr);

    return validateResponse(parsed);
  } catch {
    // If all parsing fails, try to extract just the message text
    const messageMatch = raw.match(/"message"\s*:\s*"([^"]+)"/);
    if (messageMatch) {
      return {
        message: messageMatch[1],
        action: 'explain',
      };
    }
    return FALLBACK_RESPONSE;
  }
}

function extractJson(raw: string): string {
  // Remove markdown code blocks
  const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Try to find JSON object
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];

  return raw;
}

function validateResponse(parsed: Record<string, unknown>): TutorResponse {
  const response: TutorResponse = {
    message:
      typeof parsed.message === 'string'
        ? parsed.message
        : FALLBACK_RESPONSE.message,
    action: VALID_ACTIONS.includes(parsed.action as typeof VALID_ACTIONS[number])
      ? (parsed.action as TutorResponse['action'])
      : 'explain',
  };

  // Validate options
  if (Array.isArray(parsed.options) && parsed.options.length > 0) {
    response.options = parsed.options
      .filter(
        (o: unknown): o is { text: string; correct?: boolean; value?: number } =>
          typeof o === 'object' && o !== null && typeof (o as Record<string, unknown>).text === 'string',
      )
      .map((o) => ({
        text: o.text,
        ...(typeof o.correct === 'boolean' ? { correct: o.correct } : {}),
        ...(typeof o.value === 'number' ? { value: o.value } : {}),
      }));
  }

  // Validate showTiles
  if (typeof parsed.showTiles === 'boolean') {
    response.showTiles = parsed.showTiles;
  }

  // Validate tileConfig
  if (
    typeof parsed.tileConfig === 'object' &&
    parsed.tileConfig !== null &&
    Array.isArray((parsed.tileConfig as Record<string, unknown>).numbers)
  ) {
    const tc = parsed.tileConfig as { numbers: number[]; target?: number };
    response.tileConfig = {
      numbers: tc.numbers.filter((n): n is number => typeof n === 'number'),
      ...(typeof tc.target === 'number' ? { target: tc.target } : {}),
    };
  }

  // Validate waitSeconds
  if (typeof parsed.waitSeconds === 'number' && parsed.waitSeconds > 0) {
    response.waitSeconds = Math.min(parsed.waitSeconds, 10);
  }

  // Validate nextPhase
  if (typeof parsed.nextPhase === 'boolean') {
    response.nextPhase = parsed.nextPhase;
  }

  return response;
}
