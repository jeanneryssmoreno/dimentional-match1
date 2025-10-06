/**
 * Tipos y interfaces para el contrato unificado de personajes
 */

/**
 * Temas disponibles en el juego
 */
export const THEMES = {
  RICK_MORTY: 'rickandmorty',
  STAR_WARS: 'starwars',
  GAME_OF_THRONES: 'gameofthrones',
  POKEMON: 'pokemon',
  MIXED: 'mixed'
};

/**
 * Contrato unificado para todos los personajes
 * @typedef {Object} Character
 * @property {string} id - ID único del personaje
 * @property {string} name - Nombre del personaje
 * @property {string} image - URL de la imagen del personaje
 * @property {string} theme - Tema al que pertenece el personaje
 * @property {Object} [originalData] - Datos originales de la API (opcional)
 */

/**
 * Validador para el contrato Character
 * @param {Object} character - Objeto a validar
 * @returns {boolean} True si es válido
 */
export function isValidCharacter(character) {
  return (
    character &&
    typeof character.id === 'string' &&
    typeof character.name === 'string' &&
    typeof character.image === 'string' &&
    Object.values(THEMES).includes(character.theme)
  );
}

/**
 * Configuración de niveles del juego
 */
export const GAME_LEVELS = {
  1: { cards: 8, time: 120 },
  2: { cards: 10, time: 105 },
  3: { cards: 12, time: 90 },
  4: { cards: 14, time: 75 },
  5: { cards: 16, time: 60 }
};
