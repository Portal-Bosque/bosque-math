// =============================================================================
// Tutoría 2.1 — Juntamos (Sumar = unir dos grupos)
// =============================================================================

import type { TutoriaConfig } from '../../types';

export const TUTORIA_2_1: TutoriaConfig = {
  tutoriaId: '2.1',
  titulo: 'Juntamos',
  modulo: 2,
  nivel: 'semilla',
  concepto: 'Sumar = unir dos grupos. Introducir el signo + y =',
  prerequisitos: ['1.1', '1.2', '1.3'],
  edadTarget: [6, 7],
  duracionMinutos: 10,
  fases: [
    // ─── FASE 1: Exploración ───
    {
      tipo: 'exploracion',
      instruccionesTutor:
        'Presentá el concepto de sumar como "juntar". Usá metáforas del bosque. ' +
        '"¿Qué pasa si tenés 3 bellotas y encontrás 2 más? ¡Las juntás!" ' +
        'Dejá que el niño arrastre fichas libremente y observá lo que hace. ' +
        'La idea es que descubra que juntar dos grupos da un grupo más grande. ' +
        'No uses la palabra "sumar" todavía, usá "juntar".',
      preguntasComprension: [
        {
          pregunta:
            'Si tenés 3 bellotas y encontrás 2 más, ¿qué hacés con todas?',
          opciones: ['Las junto', 'Las dejo', 'Las tiro'],
          correcta: 0,
          feedbackCorrecto:
            '¡Exacto! Juntar cosas es lo que llamamos SUMAR. 🌰➕🌰',
          feedbackIncorrecto:
            'Pensá: si encontrás más bellotas, ¿no las juntás con las que ya tenés?',
        },
        {
          pregunta:
            'Un conejo tiene 2 zanahorias. Otro conejo le da 1 más. ¿Cuántas tiene ahora?',
          opciones: ['2', '3', '4'],
          correcta: 1,
          feedbackCorrecto: '¡Sí! 2 y 1 más, juntamos y son 3 zanahorias. 🥕',
          feedbackIncorrecto:
            'Juntá las zanahorias: las 2 que tenía y la 1 nueva. ¿Cuántas hay en total?',
        },
        {
          pregunta:
            'Hay 1 pájaro en la rama. Llegan 3 más. ¿Cuántos pájaros hay ahora?',
          opciones: ['3', '4', '5'],
          correcta: 1,
          feedbackCorrecto: '¡Bien! 1 pájaro y 3 más = 4 pájaros en la rama. 🐦',
          feedbackIncorrecto:
            'Empezá con el que ya estaba (1) y sumale los que llegaron (3). ¿Cuántos son?',
        },
        {
          pregunta: 'Cuando juntamos dos grupos de cosas, el grupo nuevo es...',
          opciones: ['Más chiquito', 'Igual', 'Más grande'],
          correcta: 2,
          feedbackCorrecto:
            '¡Eso! Cuando juntamos, siempre tenemos más. Eso es sumar. ✨',
          feedbackIncorrecto:
            'Pensá: si tenés algunas cosas y agregás más, ¿tenés menos o más?',
        },
      ],
    },
    // ─── FASE 2: Guiada ───
    {
      tipo: 'guiada',
      instruccionesTutor:
        'Mostrá cómo escribimos la suma: 3 + 2 = 5. ' +
        'Explicá que + significa "juntar" y = significa "son". ' +
        '"Tres bellotas JUNTAR dos bellotas SON cinco bellotas." ' +
        'Mostrá con fichas: un grupo de 3, un grupo de 2, juntarlos, contar 5. ' +
        'Después pedí que el niño haga lo mismo con otros números.',
      preguntasComprension: [
        {
          pregunta: '¿Qué significa el signo + ?',
          opciones: ['Juntar', 'Separar', 'Nada'],
          correcta: 0,
          feedbackCorrecto: '¡Perfecto! El + significa que juntamos las cosas. ➕',
          feedbackIncorrecto: 'El signo + es como una crucecita que dice "¡juntá todo!"',
        },
        {
          pregunta: '¿Qué significa el signo = ?',
          opciones: ['Más', 'Son / Da', 'Menos'],
          correcta: 1,
          feedbackCorrecto: '¡Sí! El = nos dice cuánto son en total. ¡Es el resultado! ✅',
          feedbackIncorrecto: 'El = es como decir "y eso da..." o "y eso son..."',
        },
        {
          pregunta: '2 + 3 = ... ¿Cuánto da?',
          opciones: ['4', '5', '6'],
          correcta: 1,
          feedbackCorrecto: '¡Genial! 2 juntamos con 3 y son 5. 🎉',
          feedbackIncorrecto:
            'Juntá 2 fichas con 3 fichas. ¿Cuántas tenés en total?',
        },
      ],
      ejerciciosGuiados: [
        {
          tipo: 'fichas_a_ecuacion',
          fichas: [3, 2],
          respuesta: 5,
        },
        {
          tipo: 'ecuacion_a_fichas',
          ecuacion: '2 + 4',
          respuesta: 6,
        },
        {
          tipo: 'fichas_a_ecuacion',
          fichas: [1, 4],
          respuesta: 5,
        },
      ],
    },
    // ─── FASE 3: Ejercicios ───
    {
      tipo: 'ejercicios',
      instruccionesTutor:
        'El niño practica sumas simples hasta 5. ' +
        'Usá variedad: fichas para juntar, elegir el resultado correcto, ' +
        'y escribir la suma a partir de un dibujo. ' +
        'Nivel 1: sumas hasta 5. Nivel 2: sumas hasta 10. Nivel 3: cruzando 10.',
      cantidad: 8,
      tipos: ['suma_directa', 'multiple_choice', 'fichas'],
      nivelAdaptativo: {
        inicio: 1,
        subirDespuesDe: 3,
        bajarDespuesDe: 2,
      },
    },
  ],
  spacedRepetition: {
    conceptosARepasar: ['1.1', '1.5'],
    ejerciciosRepaso: 2,
  },
};
