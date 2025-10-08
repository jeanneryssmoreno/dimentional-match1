/**
 * Servicio de almacenamiento para el juego
 * Developer 2 - Sprint 3
 * 
 * Funciones de bajo nivel para interactuar con localStorage
 * Complementa useGamePersistence con utilidades adicionales
 */

/**
 * Claves de almacenamiento
 */
export const STORAGE_KEYS = {
  LEVEL_PROGRESS: 'memoryGame_levelProgress',
  CURRENT_SESSION: 'memoryGame_currentSession',
  PLAYER_PREFERENCES: 'memoryGame_preferences',
  GAME_HISTORY: 'memoryGame_history',
  STATISTICS: 'memoryGame_statistics',
  ACHIEVEMENTS: 'memoryGame_achievements',
  THEME: 'theme' // Dark/Light mode
};

/**
 * Guarda un valor en localStorage
 * @param {string} key - Clave de almacenamiento
 * @param {any} value - Valor a guardar
 * @returns {boolean} - True si se guardó correctamente
 */
export function saveToStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    return false;
  }
}

/**
 * Lee un valor de localStorage
 * @param {string} key - Clave de almacenamiento
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} - Valor leído o defaultValue
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error loading from storage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Elimina un valor de localStorage
 * @param {string} key - Clave de almacenamiento
 * @returns {boolean} - True si se eliminó correctamente
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error);
    return false;
  }
}

/**
 * Verifica si existe una clave en localStorage
 * @param {string} key - Clave de almacenamiento
 * @returns {boolean} - True si existe
 */
export function existsInStorage(key) {
  return localStorage.getItem(key) !== null;
}

/**
 * Limpia todos los datos del juego
 * @returns {boolean} - True si se limpió correctamente
 */
export function clearGameStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.THEME) { // Mantener preferencia de tema
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing game storage:', error);
    return false;
  }
}

/**
 * Obtiene el tamaño usado en localStorage (aproximado)
 * @returns {Object} - Tamaño en bytes y KB
 */
export function getStorageSize() {
  let totalSize = 0;
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length + key.length;
      }
    });

    return {
      bytes: totalSize,
      kilobytes: (totalSize / 1024).toFixed(2),
      megabytes: (totalSize / 1024 / 1024).toFixed(4)
    };
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return { bytes: 0, kilobytes: '0', megabytes: '0' };
  }
}

/**
 * Exporta todos los datos del juego
 * @returns {Object} - Objeto con todos los datos
 */
export function exportAllData() {
  const data = {};
  
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const value = loadFromStorage(key);
    if (value !== null) {
      data[name] = value;
    }
  });

  return {
    ...data,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
}

/**
 * Importa datos del juego
 * @param {Object} data - Objeto con los datos a importar
 * @returns {Object} - Resultado de la importación
 */
export function importAllData(data) {
  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  if (!data || typeof data !== 'object') {
    return { ...results, error: 'Invalid data format' };
  }

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (data[name] !== undefined) {
      const saved = saveToStorage(key, data[name]);
      if (saved) {
        results.success.push(name);
      } else {
        results.failed.push(name);
      }
    } else {
      results.skipped.push(name);
    }
  });

  return results;
}

/**
 * Crea un backup de los datos actuales
 * @returns {string} - JSON string del backup
 */
export function createBackup() {
  const data = exportAllData();
  return JSON.stringify(data, null, 2);
}

/**
 * Restaura desde un backup
 * @param {string} backupJson - JSON string del backup
 * @returns {Object} - Resultado de la restauración
 */
export function restoreFromBackup(backupJson) {
  try {
    const data = JSON.parse(backupJson);
    return importAllData(data);
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return { error: error.message };
  }
}

/**
 * Descarga un backup como archivo
 * @param {string} filename - Nombre del archivo
 */
export function downloadBackup(filename = 'memory-game-backup.json') {
  try {
    const backup = createBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading backup:', error);
    return false;
  }
}

/**
 * Guarda el progreso de un nivel específico
 * @param {string} theme - ID del tema
 * @param {number} level - Número del nivel
 * @param {Object} result - Resultado del juego
 * @returns {boolean} - True si se guardó correctamente
 */
export function saveGameProgress(theme, level, result) {
  try {
    const key = `${STORAGE_KEYS.LEVEL_PROGRESS}_${theme}_${level}`;
    return saveToStorage(key, {
      ...result,
      savedAt: Date.now()
    });
  } catch (error) {
    console.error('Error saving game progress:', error);
    return false;
  }
}

/**
 * Carga el progreso de un nivel específico
 * @param {string} theme - ID del tema
 * @param {number} level - Número del nivel
 * @returns {Object|null} - Progreso o null
 */
export function loadGameProgress(theme, level) {
  try {
    const key = `${STORAGE_KEYS.LEVEL_PROGRESS}_${theme}_${level}`;
    return loadFromStorage(key, null);
  } catch (error) {
    console.error('Error loading game progress:', error);
    return null;
  }
}

/**
 * Obtiene la mejor puntuación de un nivel
 * @param {string} theme - ID del tema
 * @param {number} level - Número del nivel
 * @returns {number} - Mejor puntuación o 0
 */
export function getBestScore(theme, level) {
  const progress = loadGameProgress(theme, level);
  return progress?.bestScore || 0;
}

/**
 * Obtiene estadísticas del jugador
 * @returns {Object} - Estadísticas generales
 */
export function getPlayerStats() {
  return loadFromStorage(STORAGE_KEYS.STATISTICS, {
    totalGamesPlayed: 0,
    totalGamesWon: 0,
    totalScore: 0,
    favoriteTheme: null
  });
}

/**
 * Limpia el progreso de todos los niveles
 * @returns {boolean} - True si se limpió correctamente
 */
export function clearProgress() {
  try {
    removeFromStorage(STORAGE_KEYS.LEVEL_PROGRESS);
    return true;
  } catch (error) {
    console.error('Error clearing progress:', error);
    return false;
  }
}

/**
 * Verifica el espacio disponible en localStorage
 * @returns {boolean} - True si hay espacio disponible
 */
export function hasStorageSpace() {
  try {
    const testKey = '__storage_test__';
    const testValue = 'x'.repeat(1024); // 1KB test
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage may be full:', error);
    return false;
  }
}

/**
 * Migra datos de una versión anterior (si es necesario)
 * @param {string} fromVersion - Versión origen
 * @param {string} toVersion - Versión destino
 * @returns {boolean} - True si se migró correctamente
 */
export function migrateData(fromVersion, toVersion) {
  console.log(`Migrating data from ${fromVersion} to ${toVersion}`);
  // Implementar lógica de migración si es necesario en el futuro
  return true;
}

// Exportar funciones útiles
export default {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  existsInStorage,
  clearGameStorage,
  getStorageSize,
  exportAllData,
  importAllData,
  createBackup,
  restoreFromBackup,
  downloadBackup,
  saveGameProgress,
  loadGameProgress,
  getBestScore,
  getPlayerStats,
  clearProgress,
  hasStorageSpace,
  migrateData,
  STORAGE_KEYS
};

