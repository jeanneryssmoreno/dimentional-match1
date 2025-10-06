/**
 * Adaptador para normalizar datos de Game of Thrones API
 */

import { THEMES } from '../types/character.js';

/**
 * Convierte un personaje de Game of Thrones al contrato unificado
 * @param {Object} gotCharacter - Personaje de Game of Thrones API
 * @returns {Object} Personaje normalizado
 */
export function adaptGameOfThronesCharacter(gotCharacter) {
  return {
    id: `got_${gotCharacter.id}`,
    name: gotCharacter.fullName || gotCharacter.firstName || 'Unknown',
    image: gotCharacter.imageUrl || gotCharacter.image || '',
    theme: THEMES.GAME_OF_THRONES,
    originalData: {
      firstName: gotCharacter.firstName,
      lastName: gotCharacter.lastName,
      fullName: gotCharacter.fullName,
      title: gotCharacter.title,
      family: gotCharacter.family
    }
  };
}

/**
 * Convierte múltiples personajes de Game of Thrones
 * @param {Object[]} characters - Array de personajes de Game of Thrones
 * @returns {Object[]} Array de personajes normalizados
 */
export function adaptGameOfThronesCharacters(characters) {
  if (!Array.isArray(characters)) {
    return [];
  }

  return characters
    .filter(character => 
      character && 
      (character.fullName || character.firstName) &&
      (character.imageUrl || character.image)
    )
    .map(adaptGameOfThronesCharacter);
}

/**
 * Obtiene personajes aleatorios para el juego
 * @param {Object[]} characters - Array de personajes de la API
 * @param {number} count - Número de personajes a obtener
 * @returns {Object[]} Array de personajes normalizados
 */
export function getRandomGameOfThronesCharacters(characters, count = 8) {
  const adaptedCharacters = adaptGameOfThronesCharacters(characters);
  
  // Mezclar array y tomar los primeros 'count' elementos
  const shuffled = adaptedCharacters.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
