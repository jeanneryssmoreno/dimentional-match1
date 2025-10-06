/**
 * Hook para obtener personajes de Star Wars
 */

import { useQuery } from '@tanstack/react-query';
import { starWarsService } from '../services/starWarsService.js';
import { getRandomStarWarsCharacters, adaptStarWarsCharacter } from '../adapters/starWarsAdapter.js';

/**
 * Hook para obtener personajes de Star Wars
 * @param {number} count - Número de personajes a obtener
 * @param {number} page - Página a consultar
 * @returns {Object} Query result con personajes normalizados
 */
export function useStarWarsCharacters(count = 8, page = 1) {
  return useQuery({
    queryKey: ['starWarsCharacters', count, page],
    queryFn: async () => {
      const data = await starWarsService.getPeople(page);
      return getRandomStarWarsCharacters(data, count);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook para obtener un personaje específico de Star Wars
 * @param {number} id - ID del personaje
 * @returns {Object} Query result con personaje normalizado
 */
export function useStarWarsCharacter(id) {
  return useQuery({
    queryKey: ['starWarsCharacter', id],
    queryFn: async () => {
      const character = await starWarsService.getPersonById(id);
      return adaptStarWarsCharacter(character);
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  });
}
