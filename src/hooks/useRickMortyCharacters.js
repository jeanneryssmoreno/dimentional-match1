/**
 * Hook para obtener personajes de Rick and Morty
 */

import { useQuery } from '@tanstack/react-query';
import { rickMortyService } from '../services/rickMortyService.js';
import { getRandomRickMortyCharacters, adaptRickMortyCharacter } from '../adapters/rickMortyAdapter.js';

/**
 * Hook para obtener personajes de Rick and Morty
 * @param {number} count - Número de personajes a obtener
 * @param {number} page - Página a consultar
 * @param {Object} options - Opciones adicionales para useQuery
 * @returns {Object} Query result con personajes normalizados
 */
export function useRickMortyCharacters(count = 8, page = 1, options = {}) {
  return useQuery({
    queryKey: ['rickMortyCharacters', count, page],
    queryFn: async () => {
      const data = await rickMortyService.getCharacters(page);
      return getRandomRickMortyCharacters(data, count);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

/**
 * Hook para obtener un personaje específico de Rick and Morty
 * @param {number} id - ID del personaje
 * @returns {Object} Query result con personaje normalizado
 */
export function useRickMortyCharacter(id) {
  return useQuery({
    queryKey: ['rickMortyCharacter', id],
    queryFn: async () => {
      const character = await rickMortyService.getCharacterById(id);
      return adaptRickMortyCharacter(character);
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  });
}
