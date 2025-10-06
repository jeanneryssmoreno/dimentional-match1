/**
 * Adaptador para normalizar datos de Star Wars API (SWAPI)
 */

import { THEMES } from '../types/character.js';

/**
 * Genera URL de imagen para personajes de Star Wars
 * SWAPI no incluye imágenes, usamos un servicio externo
 * @param {string} url - URL del personaje en SWAPI
 * @returns {string} URL de imagen
 */
function generateStarWarsImage(url) {
  // Extraer ID del personaje de la URL
  const match = url.match(/\/people\/(\d+)\//);
  const id = match ? match[1] : '1';
  
  // Usar servicio de imágenes de Star Wars
  return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
}

/**
 * Convierte un personaje de Star Wars al contrato unificado
 * @param {Object} starWarsCharacter - Personaje de SWAPI
 * @returns {Object} Personaje normalizado
 */
export function adaptStarWarsCharacter(starWarsCharacter) {
  const id = starWarsCharacter.url.match(/\/people\/(\d+)\//)?.[1] || '1';
  
  return {
    id: `sw_${id}`,
    name: starWarsCharacter.name,
    image: generateStarWarsImage(starWarsCharacter.url),
    theme: THEMES.STAR_WARS,
    originalData: {
      height: starWarsCharacter.height,
      mass: starWarsCharacter.mass,
      hair_color: starWarsCharacter.hair_color,
      skin_color: starWarsCharacter.skin_color,
      eye_color: starWarsCharacter.eye_color,
      birth_year: starWarsCharacter.birth_year,
      gender: starWarsCharacter.gender,
      homeworld: starWarsCharacter.homeworld,
      species: starWarsCharacter.species
    }
  };
}

/**
 * Convierte múltiples personajes de Star Wars
 * @param {Object[]} characters - Array de personajes de Star Wars
 * @returns {Object[]} Array de personajes normalizados
 */
export function adaptStarWarsCharacters(characters) {
  if (!Array.isArray(characters)) {
    return [];
  }

  return characters
    .filter(character => character && character.name)
    .map(adaptStarWarsCharacter);
}

/**
 * Obtiene personajes aleatorios para el juego
 * @param {Object} apiResponse - Respuesta de la API
 * @param {number} count - Número de personajes a obtener
 * @returns {Object[]} Array de personajes normalizados
 */
export function getRandomStarWarsCharacters(apiResponse, count = 8) {
  const characters = adaptStarWarsCharacters(apiResponse.results || []);
  
  // Mezclar array y tomar los primeros 'count' elementos
  const shuffled = characters.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
