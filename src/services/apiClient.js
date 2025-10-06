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
      console.log(`🔄 Fetching: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...options.headers
        },
        mode: 'cors', // Explicitly set CORS mode
        ...options
      });

      console.log(`📡 Response status: ${response.status} for ${url}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Data received from ${url}:`, data?.length ? `${data.length} items` : 'Single item');
      
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${url}:`, error);
      
      // Provide more specific error information
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to reach ${url}. Check your internet connection or API availability.`);
      }
      
      throw error;
    }
  }
};

export { API_ENDPOINTS };
