// =============================================================================
// Tutoría 1.1 — ¿Cuántos hay? (Subitizing perceptual 1-5)
// =============================================================================

import type { TutoriaConfig } from '../../types';

export const TUTORIA_1_1: TutoriaConfig = {
  tutoriaId: '1.1',
  titulo: '¿Cuántos hay?',
  modulo: 1,
  nivel: 'semilla',
  concepto: 'Subitizing perceptual: reconocer cantidades del 1 al 5 sin contar',
  prerequisitos: [],
  edadTarget: [6, 7],
  duracionMinutos: 10,
  fases: [
    // ─── FASE 1: Exploración ───
    {
      tipo: 'exploracion',
      instruccionesTutor:
        'Presentá el concepto de "ver cuántos hay" sin contar uno por uno. ' +
        'Mostrá grupos de fichas (1 a 5) brevemente y preguntá cuántos hay. ' +
        'Usá metáforas del bosque: "Mirá, hay bellotas en el piso del bosque. ' +
        '¿Cuántas ves?" Celebrá cuando el niño reconoce rápido. ' +
        'Si cuenta uno por uno, decile: "¡Muy bien! Ahora vamos a tratar de verlo todo junto, como una foto."',
      preguntasComprension: [
        {
          pregunta: '¿Cuántas bellotas ves en el piso?',
          opciones: ['1', '2', '3'],
          correcta: 2,
          feedbackCorrecto: '¡Sí! Son 3 bellotas. ¡Las viste rapidísimo! 🌰',
          feedbackIncorrecto:
            'Fijate bien, contá despacio si necesitás. ¿Cuántas bellotas hay?',
        },
        {
          pregunta: 'Un pajarito trajo semillas. ¿Cuántas trajo?',
          opciones: ['2', '4', '5'],
          correcta: 1,
          feedbackCorrecto: '¡Exacto! 4 semillitas trajo el pajarito. 🐦',
          feedbackIncorrecto:
            'Mirá de nuevo las semillitas. ¿Podés ver cuántas hay sin contar una por una?',
        },
        {
          pregunta: '¿Cuántas mariposas están volando?',
          opciones: ['1', '2', '3'],
          correcta: 1,
          feedbackCorrecto: '¡Bien! 2 mariposas volando por el bosque. 🦋',
          feedbackIncorrecto:
            'Mirá con atención. ¿Cuántas mariposas ves?',
        },
        {
          pregunta: '¿Cuántas hojas cayeron del árbol?',
          opciones: ['3', '4', '5'],
          correcta: 2,
          feedbackCorrecto: '¡Genial! 5 hojitas cayeron. ¡Las viste todas! 🍂',
          feedbackIncorrecto:
            'Son bastantes hojitas. Tratá de verlas todas juntas, como una foto.',
        },
      ],
    },
    // ─── FASE 2: Guiada ───
    {
      tipo: 'guiada',
      instruccionesTutor:
        'Ahora conectá la cantidad que ven con el número escrito. ' +
        'Mostrá fichas y al lado el numeral. "Estas 3 fichas se escriben así: 3." ' +
        'Pedile al niño que arrastre fichas para armar la cantidad que le decís. ' +
        'Empezá con cantidades chicas (1-3) y subí gradualmente.',
      preguntasComprension: [
        {
          pregunta: 'Arrastrá fichas para mostrar el número 4',
          opciones: ['Puse 3', 'Puse 4', 'Puse 5'],
          correcta: 1,
          feedbackCorrecto: '¡Perfecto! 4 fichas, como 4 patitas de un gato del bosque. 🐱',
          feedbackIncorrecto: 'Contá las fichas que pusiste. ¿Son 4?',
        },
        {
          pregunta: 'Si ves este número: 2, ¿cuántas fichas necesitás?',
          opciones: ['1 ficha', '2 fichas', '3 fichas'],
          correcta: 1,
          feedbackCorrecto: '¡Eso! 2 fichas, como 2 ojitos. 👀',
          feedbackIncorrecto: 'El número 2 significa que necesitás 2 cositas. ¡Probá de nuevo!',
        },
        {
          pregunta: '¿Qué número va con esta cantidad de fichas? (se muestran 5)',
          opciones: ['3', '4', '5'],
          correcta: 2,
          feedbackCorrecto: '¡Sí! Son 5. Como los 5 deditos de una mano. ✋',
          feedbackIncorrecto: 'Mirá bien cuántas fichas hay. ¿Podés contarlas?',
        },
      ],
      ejerciciosGuiados: [
        { tipo: 'subitizing', fichas: [3], respuesta: 3 },
        { tipo: 'subitizing', fichas: [5], respuesta: 5 },
        { tipo: 'subitizing', fichas: [2], respuesta: 2 },
      ],
    },
    // ─── FASE 3: Ejercicios ───
    {
      tipo: 'ejercicios',
      instruccionesTutor:
        'El niño practica reconociendo cantidades rápido. ' +
        'Mostrá fichas brevemente (1-2 segundos) y pedí que diga cuántas hay. ' +
        'Empezá en nivel 1 (hasta 3) y subí si acumula aciertos. ' +
        'Mezclá con ejercicios de elegir el número correcto.',
      cantidad: 8,
      tipos: ['subitizing', 'multiple_choice'],
      nivelAdaptativo: {
        inicio: 1,
        subirDespuesDe: 3,
        bajarDespuesDe: 2,
      },
    },
  ],
  spacedRepetition: {
    conceptosARepasar: [],
    ejerciciosRepaso: 0,
  },
};
