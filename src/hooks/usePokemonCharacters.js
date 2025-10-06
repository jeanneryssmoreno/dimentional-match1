/**
 * Hook para obtener Pokemon
 */

import { useQuery } from '@tanstack/react-query';
import { pokemonService } from '../services/pokemonService.js';
import { getRandomPokemonCharacters, adaptPokemonCharacter } from '../adapters/pokemonAdapter.js';

/**
 * Hook para obtener Pokemon
 * @param {number} count - Número de Pokemon a obtener
 * @param {number} offset - Offset para paginación
 * @returns {Object} Query result con Pokemon normalizados
 */
export function usePokemonCharacters(count = 8, offset = 0) {
  return useQuery({
    queryKey: ['pokemonCharacters', count, offset],
    queryFn: async () => {
      const pokemonList = await pokemonService.getMultiplePokemonWithDetails(count * 2, offset);
      return getRandomPokemonCharacters(pokemonList, count);
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook para obtener un Pokemon específico
 * @param {string|number} identifier - Nombre o ID del Pokemon
 * @returns {Object} Query result con Pokemon normalizado
 */
export function usePokemonCharacter(identifier) {
  return useQuery({
    queryKey: ['pokemonCharacter', identifier],
    queryFn: async () => {
      const pokemon = await pokemonService.getPokemonDetails(identifier);
      return adaptPokemonCharacter(pokemon);
    },
    enabled: !!identifier,
    staleTime: 15 * 60 * 1000, // 15 minutos
    cacheTime: 60 * 60 * 1000, // 1 hora
  });
}
