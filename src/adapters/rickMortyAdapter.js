/**
 * Adaptador para normalizar datos de Rick and Morty API
 */

import { THEMES } from '../types/character.js';

/**
 * Convierte un personaje de Rick and Morty al contrato unificado
 * @param {Object} rickMortyCharacter - Personaje de la API de Rick and Morty
 * @returns {Object} Personaje normalizado
 */
export function adaptRickMortyCharacter(rickMortyCharacter) {
  return {
    id: `rm_${rickMortyCharacter.id}`,
    name: rickMortyCharacter.name,
    image: rickMortyCharacter.image,
    theme: THEMES.RICK_MORTY,
    originalData: {
      status: rickMortyCharacter.status,
      species: rickMortyCharacter.species,
      gender: rickMortyCharacter.gender,
      origin: rickMortyCharacter.origin,
      location: rickMortyCharacter.location
    }
  };
}

/**
 * Convierte múltiples personajes de Rick and Morty
 * @param {Object[]} characters - Array de personajes de Rick and Morty
 * @returns {Object[]} Array de personajes normalizados
 */
export function adaptRickMortyCharacters(characters) {
  if (!Array.isArray(characters)) {
    return [];
  }

  return characters
    .filter(character => character && character.image) // Filtrar personajes sin imagen
    .map(adaptRickMortyCharacter);
}

/**
 * Obtiene personajes aleatorios para el juego
 * @param {Object} apiResponse - Respuesta de la API
 * @param {number} count - Número de personajes a obtener
 * @returns {Object[]} Array de personajes normalizados
 */
export function getRandomRickMortyCharacters(apiResponse, count = 8) {
  const characters = adaptRickMortyCharacters(apiResponse.results || []);
  
  // Mezclar array y tomar los primeros 'count' elementos
  const shuffled = characters.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
