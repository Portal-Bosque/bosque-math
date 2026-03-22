// =============================================================================
// Tutoría 2.3 — Sumas hasta 5 (Fluidez)
// =============================================================================

import type { TutoriaConfig } from '../../types';

export const TUTORIA_2_3: TutoriaConfig = {
  tutoriaId: '2.3',
  titulo: 'Sumas hasta 5',
  modulo: 2,
  nivel: 'semilla',
  concepto: 'Fluidez con todos los facts de suma que dan hasta 5',
  prerequisitos: ['2.1', '2.2'],
  edadTarget: [6, 7],
  duracionMinutos: 10,
  fases: [
    // ─── FASE 1: Exploración ───
    {
      tipo: 'exploracion',
      instruccionesTutor:
        'Recordá con el niño lo que aprendió de juntar/sumar. ' +
        '"Ya sabés juntar cosas. Ahora vamos a practicar para que sea ' +
        'cada vez más rápido. ¡Como un juego de velocidad!" ' +
        'Mostrá todos los facts: 0+1, 0+2... hasta las que dan 5. ' +
        'Usá el frame de 5 (marco con 5 espacios) para visualizar. ' +
        'Dejá que el niño explore llenando el frame de distintas formas.',
      preguntasComprension: [
        {
          pregunta: '¿Cuántas formas hay de llenar 5 con dos grupos?',
          opciones: ['Pocas', 'Muchas', 'Una sola'],
          correcta: 1,
          feedbackCorrecto:
            '¡Sí! Hay muchas formas: 1+4, 2+3, 3+2, 4+1, 5+0... ¡Todas dan 5! 🖐️',
          feedbackIncorrecto:
            'Pensá: 1+4=5, 2+3=5, 3+2=5... ¿Son muchas o pocas formas?',
        },
        {
          pregunta: 'Si pongo 2 fichas en el frame de 5, ¿cuántas faltan?',
          opciones: ['2', '3', '4'],
          correcta: 1,
          feedbackCorrecto: '¡Bien! 2 + 3 = 5. Faltan 3 para llenar el frame. ✨',
          feedbackIncorrecto: 'Contá los espacios vacíos en el frame. El frame tiene 5 lugares.',
        },
        {
          pregunta: '3 + 1 = ...',
          opciones: ['3', '4', '5'],
          correcta: 1,
          feedbackCorrecto: '¡Rápido! 3 + 1 = 4. ¡Vas re bien! ⚡',
          feedbackIncorrecto: 'Tenés 3 y agregás 1 más. ¿Cuántos son?',
        },
        {
          pregunta: '¿Qué suma es más grande: 2+1 o 1+3?',
          opciones: ['2+1', '1+3', 'Son iguales'],
          correcta: 1,
          feedbackCorrecto: '¡Sí! 2+1=3 y 1+3=4. El 4 es más grande. 🎯',
          feedbackIncorrecto: 'Calculá cada una: 2+1=? y 1+3=? ¿Cuál da más?',
        },
      ],
    },
    // ─── FASE 2: Guiada ───
    {
      tipo: 'guiada',
      instruccionesTutor:
        'Practicá con el niño todos los facts de suma hasta 5 usando el frame. ' +
        '"Mirá el frame de 5: si pongo 4 fichas, ¿cuántas faltan para 5?" ' +
        'Mostrá la conexión entre sumar y completar. ' +
        'Después hacé rondas rápidas: mostrá la suma, el niño dice el resultado. ' +
        'Celebrá la velocidad: "¡Cada vez más rápido!"',
      preguntasComprension: [
        {
          pregunta: '1 + 1 = ...',
          opciones: ['1', '2', '3'],
          correcta: 1,
          feedbackCorrecto: '¡Sí! 1 + 1 = 2. ¡Facilísimo! 🏃',
          feedbackIncorrecto: 'Juntá 1 ficha con otra ficha. ¿Cuántas tenés?',
        },
        {
          pregunta: '2 + 2 = ...',
          opciones: ['3', '4', '5'],
          correcta: 1,
          feedbackCorrecto: '¡Dobles! 2 + 2 = 4. Los dobles son fáciles de recordar. 🪞',
          feedbackIncorrecto: 'Son dos pares. 2 y 2 más. ¿Cuántos en total?',
        },
        {
          pregunta: '4 + 1 = ...',
          opciones: ['4', '5', '6'],
          correcta: 1,
          feedbackCorrecto: '¡Perfecto! 4 + 1 = 5. ¡Llenaste la mano! ✋',
          feedbackIncorrecto: 'Tenés 4 y sumás 1 más. El que viene después del 4 es...',
        },
      ],
      ejerciciosGuiados: [
        { tipo: 'suma_directa', ecuacion: '2 + 3', respuesta: 5 },
        { tipo: 'suma_directa', ecuacion: '1 + 2', respuesta: 3 },
        { tipo: 'completar_frame', fichas: [4], respuesta: 1 },
      ],
    },
    // ─── FASE 3: Ejercicios ───
    {
      tipo: 'ejercicios',
      instruccionesTutor:
        'Rondas de práctica rápida. El objetivo es fluidez: ' +
        'que responda los facts hasta 5 en menos de 3 segundos. ' +
        'Mezclá suma directa con opciones múltiples y verdadero/falso. ' +
        'Nivel 1: sumas que dan hasta 3. Nivel 2: sumas que dan hasta 5. ' +
        'Nivel 3: agregar número faltante (? + 2 = 5).',
      cantidad: 8,
      tipos: ['suma_directa', 'multiple_choice', 'verdadero_falso', 'numero_faltante'],
      nivelAdaptativo: {
        inicio: 1,
        subirDespuesDe: 3,
        bajarDespuesDe: 2,
      },
    },
  ],
  spacedRepetition: {
    conceptosARepasar: ['1.1', '2.1'],
    ejerciciosRepaso: 2,
  },
};
