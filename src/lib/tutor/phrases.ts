// Pre-written tutor phrases — Spanish rioplatense, growth mindset focused

export type PhraseCategory =
  | 'celebration'
  | 'motivation'
  | 'transition'
  | 'welcome'
  | 'hint_lesson0'
  | 'hint_lesson1'
  | 'hint_lesson2';

const PHRASES: Record<PhraseCategory, string[]> = {
  celebration: [
    '¡Lo lograste! Pensaste muy bien 🌟',
    '¡Excelente! Me encanta cómo lo resolviste',
    '¡Bien hecho! Cada intento te hace más fuerte',
    '¡Genial! Estás aprendiendo un montón 🎉',
    '¡Así se hace! Tu esfuerzo vale mucho',
    '¡Muy bien! Seguí así que vas re bien',
    '¡Perfecto! Se nota que estás pensando 🧠',
    '¡Bravo! Esa fue una gran jugada',
  ],

  motivation: [
    'No pasa nada, los errores nos ayudan a aprender',
    '¡Buen intento! Estás cada vez más cerca',
    'Tomáte tu tiempo, no hay apuro 🦉',
    'Fijate bien, yo sé que podés',
    'Casi casi... ¡probá de nuevo!',
    'Los mejores matemáticos también se equivocan, ¡seguí intentando!',
    'Mmm, no fue esa, pero vas bien encaminado',
    'Dale, intentá otra vez. ¡Vos podés!',
  ],

  transition: [
    '¿Listo para el siguiente? 🚀',
    '¡Vamos con uno más!',
    'Ahora probemos algo un poquito diferente',
    '¡Seguimos! El próximo es divertido',
    '¿Preparado? ¡Ahí va!',
    'Uno más y sos un crack 💪',
  ],

  welcome: [
    '¡Hola! Soy Bosquito, un búho que ama los números 🦉',
    '¡Bienvenido al bosque de las matemáticas! 🌲',
    '¡Qué bueno verte! ¿Listo para jugar con números?',
    '¡Hola de nuevo! Me alegra que hayas vuelto 🌟',
  ],

  hint_lesson0: [
    'Mirá bien los puntitos, ¿cuántos ves?',
    'No los cuentes uno por uno, tratá de verlos todos juntos',
    '¿Te parece que son muchos o poquitos?',
    'Fijate en la forma que hacen los puntos',
  ],

  hint_lesson1: [
    'Arrastrá las fichas al centro para juntarlas',
    '¿Cuántas fichas tenés de cada lado?',
    'Cuando juntás fichas, ¿cuántas quedan en total?',
    'Probá arrastrar una ficha al espacio de trabajo',
  ],

  hint_lesson2: [
    'Pensá en las fichas... ¿cuántas serían si las juntás?',
    'Podés usar los dedos para contar si querés',
    'Fijate cuánto le falta al primer número para llegar',
    '¿Y si empezás desde el número más grande?',
  ],
};

export function getRandomPhrase(category: PhraseCategory): string {
  const pool = PHRASES[category];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getPhrase(category: PhraseCategory, index: number): string {
  const pool = PHRASES[category];
  return pool[index % pool.length];
}
