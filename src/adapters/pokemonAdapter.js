/**
 * Adaptador para normalizar datos de Pokemon API
 */

import { THEMES } from '../types/character.js';

/**
 * Convierte un Pokemon al contrato unificado
 * @param {Object} pokemon - Pokemon de la API
 * @returns {Object} Personaje normalizado
 */
export function adaptPokemonCharacter(pokemon) {
  // Obtener imagen de mejor calidad disponible
  const image = pokemon.sprites?.other?.['official-artwork']?.front_default ||
                pokemon.sprites?.other?.dream_world?.front_default ||
                pokemon.sprites?.front_default ||
                '';

  return {
    id: `pk_${pokemon.id}`,
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    image: image,
    theme: THEMES.POKEMON,
    originalData: {
      height: pokemon.height,
      weight: pokemon.weight,
      base_experience: pokemon.base_experience,
      types: pokemon.types?.map(type => type.type.name) || [],
      abilities: pokemon.abilities?.map(ability => ability.ability.name) || [],
      stats: pokemon.stats?.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
      }, {}) || {}
    }
  };
}

/**
 * Convierte múltiples Pokemon
 * @param {Object[]} pokemonList - Array de Pokemon
 * @returns {Object[]} Array de personajes normalizados
 */
export function adaptPokemonCharacters(pokemonList) {
  if (!Array.isArray(pokemonList)) {
    return [];
  }

  return pokemonList
    .filter(pokemon => 
      pokemon && 
      pokemon.name && 
      (pokemon.sprites?.front_default || 
       pokemon.sprites?.other?.['official-artwork']?.front_default)
    )
    .map(adaptPokemonCharacter);
}

/**
 * Obtiene Pokemon aleatorios para el juego
 * @param {Object[]} pokemonList - Array de Pokemon de la API
 * @param {number} count - Número de Pokemon a obtener
 * @returns {Object[]} Array de personajes normalizados
 */
export function getRandomPokemonCharacters(pokemonList, count = 8) {
  const adaptedPokemon = adaptPokemonCharacters(pokemonList);
  
  // Mezclar array y tomar los primeros 'count' elementos
  const shuffled = adaptedPokemon.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
