/**
 * Servicio para Star Wars API (SWAPI)
 * https://swapi.dev/documentation
 */

import { apiClient, API_ENDPOINTS } from './apiClient.js';

export const starWarsService = {
  /**
   * Obtiene personajes de Star Wars
   * @param {number} page - Página a obtener (default: 1)
   * @returns {Promise} Datos de personajes
   */
  async getPeople(page = 1) {
    const url = `${API_ENDPOINTS.STAR_WARS}/people?page=${page}`;
    return await apiClient.get(url);
  },

  /**
   * Obtiene un personaje específico por ID
   * @param {number} id - ID del personaje
   * @returns {Promise} Datos del personaje
   */
  async getPersonById(id) {
    const url = `${API_ENDPOINTS.STAR_WARS}/people/${id}`;
    return await apiClient.get(url);
  },

  /**
   * Obtiene información adicional de una URL
   * @param {string} url - URL completa del recurso
   * @returns {Promise} Datos del recurso
   */
  async getByUrl(url) {
    return await apiClient.get(url);
  }
};
