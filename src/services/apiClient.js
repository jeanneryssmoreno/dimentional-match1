/**
 * Cliente base para APIs externas
 * Maneja configuración común y manejo de errores
 */

const API_ENDPOINTS = {
  RICK_MORTY: 'https://rickandmortyapi.com/api',
  STAR_WARS: 'https://swapi.dev/api',
  GAME_OF_THRONES: 'https://thronesapi.com/api/v2',
  POKEMON: 'https://pokeapi.co/api/v2'
};

/**
 * Cliente HTTP genérico con manejo de errores
 */
export const apiClient = {
  async get(url, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

export { API_ENDPOINTS };
