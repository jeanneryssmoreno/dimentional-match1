/**
 * Servicio para Rick and Morty API
 * https://rickandmortyapi.com/documentation
 */

import { apiClient, API_ENDPOINTS } from './apiClient.js';

export const rickMortyService = {
  /**
   * Obtiene personajes de Rick and Morty
   * @param {number} page - Página a obtener (default: 1)
   * @returns {Promise} Datos de personajes
   */
  async getCharacters(page = 1) {
    const url = `${API_ENDPOINTS.RICK_MORTY}/character?page=${page}`;
    return await apiClient.get(url);
  },

  /**
   * Obtiene un personaje específico por ID
   * @param {number} id - ID del personaje
   * @returns {Promise} Datos del personaje
   */
  async getCharacterById(id) {
    const url = `${API_ENDPOINTS.RICK_MORTY}/character/${id}`;
    return await apiClient.get(url);
  },

  /**
   * Obtiene múltiples personajes por IDs
   * @param {number[]} ids - Array de IDs
   * @returns {Promise} Array de personajes
   */
  async getMultipleCharacters(ids) {
    const idsString = ids.join(',');
    const url = `${API_ENDPOINTS.RICK_MORTY}/character/${idsString}`;
    return await apiClient.get(url);
  }
};
