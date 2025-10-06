/**
 * Hook principal para obtener personajes del juego según el tema seleccionado
 */

import { useQuery } from '@tanstack/react-query';
import { THEMES } from '../types/character.js';
import { useRickMortyCharacters } from './useRickMortyCharacters.js';
import { useStarWarsCharacters } from './useStarWarsCharacters.js';
import { useGameOfThronesCharacters } from './useGameOfThronesCharacters.js';
import { usePokemonCharacters } from './usePokemonCharacters.js';
//
// Servicios para tema mixto
import { rickMortyService } from '../services/rickMortyService.js';
import { starWarsService } from '../services/starWarsService.js';
import { gameOfThronesService } from '../services/gameOfThronesService.js';
import { pokemonService } from '../services/pokemonService.js';

// Adaptadores para tema mixto
import { getRandomRickMortyCharacters } from '../adapters/rickMortyAdapter.js';
import { getRandomStarWarsCharacters } from '../adapters/starWarsAdapter.js';
import { getRandomGameOfThronesCharacters } from '../adapters/gameOfThronesAdapter.js';
import { getRandomPokemonCharacters } from '../adapters/pokemonAdapter.js';

/**
 * Hook principal para obtener personajes según el tema
 * @param {string} theme - Tema seleccionado
 * @param {number} count - Número total de personajes necesarios
 * @returns {Object} Query result con personajes del tema seleccionado
 */
export function useGameCharacters(theme, count = 8) {
  // Para temas individuales, usar hooks específicos con enabled condicional
  const rickMortyQuery = useRickMortyCharacters(
    count, 
    1, 
    { enabled: theme === THEMES.RICK_MORTY }
  );
  
  const starWarsQuery = useStarWarsCharacters(
    count, 
    1, 
    { enabled: theme === THEMES.STAR_WARS }
  );
  
  const gameOfThronesQuery = useGameOfThronesCharacters(
    count, 
    { enabled: theme === THEMES.GAME_OF_THRONES }
  );
  
  const pokemonQuery = usePokemonCharacters(
    count, 
    0, 
    { enabled: theme === THEMES.POKEMON }
  );

  // Para tema mixto, usar query personalizada
  const mixedQuery = useQuery({
    queryKey: ['mixedCharacters', count],
    queryFn: async () => {
      const charactersPerTheme = Math.ceil(count / 4);
      
      try {
        // Obtener personajes de cada API
        const [rickMortyData, starWarsData, gotData, pokemonData] = await Promise.all([
          rickMortyService.getCharacters(1),
          starWarsService.getPeople(1),
          gameOfThronesService.getCharacters(),
          pokemonService.getMultiplePokemonWithDetails(charactersPerTheme * 2, 0)
        ]);

        // Normalizar personajes de cada tema
        const rickMortyChars = getRandomRickMortyCharacters(rickMortyData, charactersPerTheme);
        const starWarsChars = getRandomStarWarsCharacters(starWarsData, charactersPerTheme);
        const gotChars = getRandomGameOfThronesCharacters(gotData, charactersPerTheme);
        const pokemonChars = getRandomPokemonCharacters(pokemonData, charactersPerTheme);

        // Combinar y mezclar todos los personajes
        const allCharacters = [
          ...rickMortyChars,
          ...starWarsChars,
          ...gotChars,
          ...pokemonChars
        ];

        // Mezclar y tomar exactamente 'count' personajes
        const shuffled = allCharacters.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);

      } catch (error) {
        console.error('Error fetching mixed characters:', error);
        throw error;
      }
    },
    enabled: theme === THEMES.MIXED,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
  });

  // Retornar el query apropiado según el tema
  switch (theme) {
    case THEMES.RICK_MORTY:
      return rickMortyQuery;
    case THEMES.STAR_WARS:
      return starWarsQuery;
    case THEMES.GAME_OF_THRONES:
      return gameOfThronesQuery;
    case THEMES.POKEMON:
      return pokemonQuery;
    case THEMES.MIXED:
      return mixedQuery;
    default:
      return {
        data: [],
        isLoading: false,
        error: new Error(`Tema no válido: ${theme}`),
        isError: true
      };
  }
}

/**
 * Hook para precargar personajes de todos los temas
 * Útil para mejorar la experiencia de usuario
 */
export function usePrefetchAllThemes() {
  const rickMortyQuery = useRickMortyCharacters(8, 1);
  const starWarsQuery = useStarWarsCharacters(8, 1);
  const gameOfThronesQuery = useGameOfThronesCharacters(8);
  const pokemonQuery = usePokemonCharacters(8, 0);

  return {
    isLoading: rickMortyQuery.isLoading || starWarsQuery.isLoading || 
               gameOfThronesQuery.isLoading || pokemonQuery.isLoading,
    isError: rickMortyQuery.isError || starWarsQuery.isError || 
             gameOfThronesQuery.isError || pokemonQuery.isError,
    errors: {
      rickMorty: rickMortyQuery.error,
      starWars: starWarsQuery.error,
      gameOfThrones: gameOfThronesQuery.error,
      pokemon: pokemonQuery.error
    }
  };
}
