/**
 * Hook para obtener personajes de Game of Thrones
 */

import { useQuery } from '@tanstack/react-query';
import { gameOfThronesService } from '../services/gameOfThronesService.js';
import { getRandomGameOfThronesCharacters, adaptGameOfThronesCharacter } from '../adapters/gameOfThronesAdapter.js';

/**
 * Hook para obtener personajes de Game of Thrones
 * @param {number} count - Número de personajes a obtener
 * @param {Object} options - Opciones adicionales para useQuery
 * @returns {Object} Query result con personajes normalizados
 */
export function useGameOfThronesCharacters(count = 8, options = {}) {
  return useQuery({
    queryKey: ['gameOfThronesCharacters', count],
    queryFn: async () => {
      const characters = await gameOfThronesService.getCharacters();
      return getRandomGameOfThronesCharacters(characters, count);
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (datos más estáticos)
    cacheTime: 30 * 60 * 1000, // 30 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options, // Permitir override de opciones
  });
}

/**
 * Hook para obtener un personaje específico de Game of Thrones
 * @param {number} id - ID del personaje
 * @returns {Object} Query result con personaje normalizado
 */
export function useGameOfThronesCharacter(id) {
  return useQuery({
    queryKey: ['gameOfThronesCharacter', id],
    queryFn: async () => {
      const character = await gameOfThronesService.getCharacterById(id);
      return adaptGameOfThronesCharacter(character);
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutos
    cacheTime: 60 * 60 * 1000, // 1 hora
  });
}
