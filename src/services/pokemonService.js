/**
 * Servicio para Pokemon API
 * https://pokeapi.co/docs/v2
 */

import { apiClient, API_ENDPOINTS } from './apiClient.js';

export const pokemonService = {
  /**
   * Obtiene lista de Pokemon con paginación
   * @param {number} limit - Número de Pokemon a obtener (default: 20)
   * @param {number} offset - Offset para paginación (default: 0)
   * @returns {Promise} Datos de Pokemon
   */
  async getPokemon(limit = 20, offset = 0) {
    const url = `${API_ENDPOINTS.POKEMON}/pokemon?limit=${limit}&offset=${offset}`;
    return await apiClient.get(url);
  },

  /**
   * Obtiene detalles de un Pokemon específico
   * @param {string|number} identifier - Nombre o ID del Pokemon
   * @returns {Promise} Datos detallados del Pokemon
   */
  async getPokemonDetails(identifier) {
    const url = `${API_ENDPOINTS.POKEMON}/pokemon/${identifier}`;
    return await apiClient.get(url);
  },

  /**
   * Obtiene múltiples Pokemon con sus detalles
   * @param {number} count - Número de Pokemon a obtener
   * @param {number} offset - Offset para paginación
   * @returns {Promise} Array de Pokemon con detalles
   */
  async getMultiplePokemonWithDetails(count = 20, offset = 0) {
    const pokemonList = await this.getPokemon(count, offset);
    
    const pokemonWithDetails = await Promise.all(
      pokemonList.results.map(async (pokemon) => {
        return await this.getPokemonDetails(pokemon.name);
      })
    );

    return pokemonWithDetails;
  }
};
