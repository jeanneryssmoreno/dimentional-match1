/**
 * Tipos y constantes para la lógica del juego de memoria
 */

/**
 * Estados posibles del juego
 */
export const GAME_STATES = {
  IDLE: 'idle',           // Juego no iniciado
  PLAYING: 'playing',     // Juego en progreso
  PAUSED: 'paused',       // Juego pausado
  COMPLETED: 'completed', // Juego completado exitosamente
  GAME_OVER: 'game_over'  // Tiempo agotado
};

/**
 * Estados de las cartas
 */
export const CARD_STATES = {
  HIDDEN: 'hidden',       // Carta boca abajo
  REVEALED: 'revealed',   // Carta boca arriba (temporal)
  MATCHED: 'matched',     // Carta emparejada (permanente)
  DISABLED: 'disabled'    // Carta deshabilitada
};

/**
 * Configuración de niveles del juego
 */
export const GAME_LEVELS = {
  1: { 
    pairs: 4,      // 8 cartas total
    time: 120,     // 2 minutos
    name: 'Principiante'
  },
  2: { 
    pairs: 5,      // 10 cartas total
    time: 105,     // 1:45
    name: 'Fácil'
  },
  3: { 
    pairs: 6,      // 12 cartas total
    time: 90,      // 1:30
    name: 'Intermedio'
  },
  4: { 
    pairs: 7,      // 14 cartas total
    time: 75,      // 1:15
    name: 'Difícil'
  },
  5: { 
    pairs: 8,      // 16 cartas total
    time: 60,      // 1 minuto
    name: 'Experto'
  }
};

/**
 * Configuración de puntuación
 */
export const SCORING_CONFIG = {
  MATCH_BASE_POINTS: 100,
  TIME_BONUS_MULTIPLIER: 2,
  STREAK_MULTIPLIER: 1.5,
  LEVEL_MULTIPLIER: {
    1: 1.0,
    2: 1.2,
    3: 1.5,
    4: 1.8,
    5: 2.0
  }
};

/**
 * Configuración del timer
 */
export const TIMER_CONFIG = {
  UPDATE_INTERVAL: 1000, // 1 segundo
  WARNING_THRESHOLD: 30, // Advertencia cuando quedan 30 segundos
  CRITICAL_THRESHOLD: 10 // Crítico cuando quedan 10 segundos
};

/**
 * Estructura de una carta del juego
 * @typedef {Object} GameCard
 * @property {string} id - ID único de la carta
 * @property {string} characterId - ID del personaje original
 * @property {string} name - Nombre del personaje
 * @property {string} image - URL de la imagen
 * @property {string} theme - Tema del personaje
 * @property {string} state - Estado actual de la carta
 * @property {number} pairId - ID del par (mismo para cartas que coinciden)
 * @property {number} position - Posición en el tablero
 */

/**
 * Estado del juego
 * @typedef {Object} GameState
 * @property {string} status - Estado actual del juego
 * @property {number} level - Nivel actual (1-5)
 * @property {string} theme - Tema seleccionado
 * @property {GameCard[]} cards - Array de cartas del juego
 * @property {GameCard[]} revealedCards - Cartas actualmente reveladas
 * @property {number} matchedPairs - Número de pares encontrados
 * @property {number} totalPairs - Total de pares en el nivel
 * @property {number} moves - Número de movimientos realizados
 * @property {number} score - Puntuación actual
 * @property {number} timeRemaining - Tiempo restante en segundos
 * @property {number} startTime - Timestamp de inicio del juego
 * @property {boolean} isTimerActive - Si el timer está corriendo
 * @property {number} streak - Racha de aciertos consecutivos
 */

/**
 * Validador para GameCard
 * @param {Object} card - Carta a validar
 * @returns {boolean} True si es válida
 */
export function isValidGameCard(card) {
  return (
    card &&
    typeof card.id === 'string' &&
    typeof card.characterId === 'string' &&
    typeof card.name === 'string' &&
    typeof card.image === 'string' &&
    typeof card.theme === 'string' &&
    Object.values(CARD_STATES).includes(card.state) &&
    typeof card.pairId === 'number' &&
    typeof card.position === 'number'
  );
}

/**
 * Obtiene la configuración del nivel
 * @param {number} level - Número del nivel
 * @returns {Object} Configuración del nivel
 */
export function getLevelConfig(level) {
  return GAME_LEVELS[level] || GAME_LEVELS[1];
}

/**
 * Calcula la puntuación por match
 * @param {number} level - Nivel actual
 * @param {number} timeRemaining - Tiempo restante
 * @param {number} totalTime - Tiempo total del nivel
 * @param {number} streak - Racha actual
 * @returns {number} Puntos obtenidos
 */
export function calculateMatchScore(level, timeRemaining, totalTime, streak = 1) {
  const basePoints = SCORING_CONFIG.MATCH_BASE_POINTS;
  const levelMultiplier = SCORING_CONFIG.LEVEL_MULTIPLIER[level] || 1.0;
  const timeBonus = Math.floor((timeRemaining / totalTime) * SCORING_CONFIG.TIME_BONUS_MULTIPLIER * basePoints);
  const streakBonus = streak > 1 ? Math.floor(basePoints * SCORING_CONFIG.STREAK_MULTIPLIER * (streak - 1)) : 0;
  
  return Math.floor((basePoints + timeBonus + streakBonus) * levelMultiplier);
}
