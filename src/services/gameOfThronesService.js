/**
 * Servicio para Game of Thrones API
 * https://thronesapi.com/
 */

import { apiClient, API_ENDPOINTS } from './apiClient.js';

export const gameOfThronesService = {
  /**
   * Obtiene todos los personajes de Game of Thrones
   * @returns {Promise} Array de personajes
   */
  async getCharacters() {
    const url = `${API_ENDPOINTS.GAME_OF_THRONES}/Characters`;
    return await apiClient.get(url);
  },

  /**
   * Obtiene un personaje específico por ID
   * @param {number} id - ID del personaje
   * @returns {Promise} Datos del personaje
   */
  async getCharacterById(id) {
    const url = `${API_ENDPOINTS.GAME_OF_THRONES}/Characters/${id}`;
    return await apiClient.get(url);
  },

  /**
   * Obtiene personajes con paginación manual
   * @param {number} limit - Número de personajes a obtener
   * @param {number} offset - Offset para paginación
   * @returns {Promise} Array de personajes
   */
  async getCharactersPaginated(limit = 20, offset = 0) {
    const characters = await this.getCharacters();
    return characters.slice(offset, offset + limit);
  }
};
