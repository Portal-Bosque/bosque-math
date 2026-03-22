import { NextResponse } from 'next/server';
import type { TutorResponse } from '@/lib/types';

// ---------------------------------------------------------------------------
// POST /api/tutor — AI tutor endpoint using Google Gemini
// ---------------------------------------------------------------------------

interface TutorRequest {
  messages: Array<{ role: string; content: string }>;
  tutoriaId: string;
  phase: string;
  studentName: string;
  studentAge: number;
  tutoriaTitle?: string;
  tutoriaConcept?: string;
  phaseInstructions?: string;
}

const FALLBACK_RESPONSES: Record<string, TutorResponse> = {
  explain: {
    message: '¡Mirá las fichas del bosque! Cada una tiene puntitos que nos ayudan a contar. 🌿',
    action: 'explain',
    showTiles: true,
    tileConfig: { numbers: [3, 2], target: 5 },
  },
  ask_question: {
    message: '¿Cuántas bellotas juntó la ardilla? Contá despacio. 🐿️',
    action: 'ask_question',
    options: [
      { text: '3', value: 3 },
      { text: '4', value: 4, correct: true },
      { text: '5', value: 5 },
    ],
  },
  give_feedback: {
    message: '¡Pensaste muy bien! Seguí así, cada intento te hace más fuerte. 💪🌱',
    action: 'give_feedback',
  },
  celebrate: {
    message: '¡Muy bien! Como un pájaro que encuentra su camino entre los árboles. 🦉✨',
    action: 'celebrate',
    waitSeconds: 2,
  },
  hint: {
    message: 'Probá usar las fichas para armar el número. Empezá con las más grandes. 🌳',
    action: 'hint',
    showTiles: true,
  },
  transition: {
    message: '¡Genial! Ahora vamos a practicar un poquito más. ¿Listo? 🚀',
    action: 'transition',
    nextPhase: true,
  },
};

function buildSystemPrompt(req: TutorRequest): string {
  const titulo = req.tutoriaTitle ?? 'Lección';
  const concepto = req.tutoriaConcept ?? 'Matemáticas';
  const instrucciones = req.phaseInstructions ?? 'Guía al estudiante paso a paso.';

  return `Eres Bosquito 🦉, un búho sabio del bosque que enseña matemáticas.
Lección: ${titulo} — ${concepto}
Edad del estudiante: ${req.studentAge} años
Nombre del estudiante: ${req.studentName}

CONTEXTO DE LA LECCIÓN:
${instrucciones}

FASE ACTUAL: ${req.phase}

REGLAS:
1. Máximo 2 oraciones por mensaje
2. Español rioplatense, simple y cálido
3. Usá metáforas del bosque (bellotas, animales, árboles, ríos)
4. Nunca digas "incorrecto", "mal", "no"
5. Celebrá esfuerzo: "pensaste bien", "buen intento"
6. Nunca digas "sos inteligente" o "qué genio"
7. Hacé preguntas, no des respuestas
8. NUNCA muestres la respuesta directa
9. Respondé SIEMPRE en JSON válido con esta estructura:
{"message": "tu mensaje", "action": "explain|ask_question|give_feedback|transition|celebrate|hint|simplify", "options": [{"text": "opción", "correct": bool, "value": num}], "showTiles": bool, "tileConfig": {"numbers": [num], "target": num}, "waitSeconds": num, "nextPhase": bool}

ACCIONES DISPONIBLES:
- explain: explicar un concepto
- ask_question: hacer una pregunta con opciones
- give_feedback: dar feedback sobre una respuesta
- transition: pasar a la siguiente fase
- celebrate: celebrar un logro
- hint: dar una pista
- simplify: simplificar el problema actual

Solo incluí los campos que necesités. "message" y "action" son obligatorios.`;
}

function parseTutorResponse(raw: string): TutorResponse | null {
  try {
    // Try to extract JSON from the response (model might wrap it in markdown)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as TutorResponse;
    // Validate required fields
    if (!parsed.message || !parsed.action) return null;
    const validActions = [
      'explain',
      'ask_question',
      'give_feedback',
      'transition',
      'celebrate',
      'hint',
      'simplify',
    ];
    if (!validActions.includes(parsed.action)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TutorRequest;
    const { messages, phase } = body;

    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
      console.error('[tutor] GOOGLE_AI_API_KEY not set');
      const fallback = FALLBACK_RESPONSES[phase === 'exploracion' ? 'explain' : 'ask_question'];
      return NextResponse.json(fallback ?? FALLBACK_RESPONSES.explain);
    }

    const systemPrompt = buildSystemPrompt(body);

    // Build Gemini API request
    const geminiMessages = [
      { role: 'user' as const, parts: [{ text: systemPrompt }] },
      { role: 'model' as const, parts: [{ text: 'Entendido. Soy Bosquito 🦉 y voy a responder siempre en JSON válido siguiendo las reglas.' }] },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: m.content }],
      })),
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('[tutor] Gemini API error:', geminiResponse.status, errText);
      const fallback = FALLBACK_RESPONSES[phase === 'exploracion' ? 'explain' : 'ask_question'];
      return NextResponse.json(fallback ?? FALLBACK_RESPONSES.explain);
    }

    const geminiData = (await geminiResponse.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      console.error('[tutor] No text in Gemini response');
      return NextResponse.json(FALLBACK_RESPONSES.explain);
    }

    const parsed = parseTutorResponse(rawText);
    if (!parsed) {
      console.error('[tutor] Failed to parse response:', rawText);
      return NextResponse.json(FALLBACK_RESPONSES.explain);
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[tutor] Unexpected error:', err);
    return NextResponse.json(FALLBACK_RESPONSES.explain);
  }
}
