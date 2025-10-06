/**
 * Sistema avanzado de configuración de niveles
 */

/**
 * Configuración detallada de cada nivel
 */
export const LEVEL_CONFIG = {
  1: {
    id: 1,
    name: 'Principiante',
    description: 'Nivel de introducción para familiarizarse con el juego',
    pairs: 4,
    cards: 8,
    time: 120, // 2 minutos
    difficulty: 'easy',
    requiredAccuracy: 0, // Sin requisitos
    unlockRequirements: {
      previousLevel: null,
      minScore: 0,
      minAccuracy: 0
    },
    rewards: {
      baseScore: 100,
      timeBonus: 200,
      perfectBonus: 500
    },
    hints: {
      available: true,
      maxHints: 3,
      cooldown: 10000 // 10 segundos
    },
    theme: {
      backgroundColor: '#f0f9ff',
      primaryColor: '#3b82f6',
      accentColor: '#1d4ed8'
    }
  },
  
  2: {
    id: 2,
    name: 'Fácil',
    description: 'Aumenta la dificultad con más cartas y menos tiempo',
    pairs: 5,
    cards: 10,
    time: 105, // 1:45
    difficulty: 'easy',
    requiredAccuracy: 60,
    unlockRequirements: {
      previousLevel: 1,
      minScore: 500,
      minAccuracy: 60
    },
    rewards: {
      baseScore: 150,
      timeBonus: 250,
      perfectBonus: 750
    },
    hints: {
      available: true,
      maxHints: 2,
      cooldown: 15000 // 15 segundos
    },
    theme: {
      backgroundColor: '#f0fdf4',
      primaryColor: '#22c55e',
      accentColor: '#16a34a'
    }
  },
  
  3: {
    id: 3,
    name: 'Intermedio',
    description: 'Desafío moderado que requiere concentración',
    pairs: 6,
    cards: 12,
    time: 90, // 1:30
    difficulty: 'medium',
    requiredAccuracy: 70,
    unlockRequirements: {
      previousLevel: 2,
      minScore: 800,
      minAccuracy: 70
    },
    rewards: {
      baseScore: 200,
      timeBonus: 300,
      perfectBonus: 1000
    },
    hints: {
      available: true,
      maxHints: 1,
      cooldown: 20000 // 20 segundos
    },
    theme: {
      backgroundColor: '#fffbeb',
      primaryColor: '#f59e0b',
      accentColor: '#d97706'
    }
  },
  
  4: {
    id: 4,
    name: 'Difícil',
    description: 'Para jugadores experimentados que buscan un reto',
    pairs: 7,
    cards: 14,
    time: 75, // 1:15
    difficulty: 'hard',
    requiredAccuracy: 80,
    unlockRequirements: {
      previousLevel: 3,
      minScore: 1200,
      minAccuracy: 80
    },
    rewards: {
      baseScore: 250,
      timeBonus: 400,
      perfectBonus: 1500
    },
    hints: {
      available: false,
      maxHints: 0,
      cooldown: 0
    },
    theme: {
      backgroundColor: '#fef2f2',
      primaryColor: '#ef4444',
      accentColor: '#dc2626'
    }
  },
  
  5: {
    id: 5,
    name: 'Experto',
    description: 'El desafío definitivo para maestros del juego',
    pairs: 8,
    cards: 16,
    time: 60, // 1 minuto
    difficulty: 'expert',
    requiredAccuracy: 90,
    unlockRequirements: {
      previousLevel: 4,
      minScore: 1800,
      minAccuracy: 90
    },
    rewards: {
      baseScore: 300,
      timeBonus: 500,
      perfectBonus: 2000
    },
    hints: {
      available: false,
      maxHints: 0,
      cooldown: 0
    },
    theme: {
      backgroundColor: '#faf5ff',
      primaryColor: '#8b5cf6',
      accentColor: '#7c3aed'
    },
    special: {
      shuffleOnMatch: true, // Barajeo especial en nivel 5
      bonusMultiplier: 2.0
    }
  }
};

/**
 * Dificultades disponibles
 */
export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert'
};

/**
 * Estados de desbloqueo de niveles
 */
export const UNLOCK_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  COMPLETED: 'completed',
  PERFECT: 'perfect' // Completado con puntuación perfecta
};

/**
 * Obtiene la configuración de un nivel
 * @param {number} levelId - ID del nivel
 * @returns {Object} Configuración del nivel
 */
export function getLevelConfig(levelId) {
  return LEVEL_CONFIG[levelId] || LEVEL_CONFIG[1];
}

/**
 * Obtiene todos los niveles disponibles
 * @returns {Array} Array de configuraciones de niveles
 */
export function getAllLevels() {
  return Object.values(LEVEL_CONFIG);
}

/**
 * Verifica si un nivel está desbloqueado
 * @param {number} levelId - ID del nivel a verificar
 * @param {Object} playerProgress - Progreso del jugador
 * @returns {boolean} True si está desbloqueado
 */
export function isLevelUnlocked(levelId, playerProgress = {}) {
  const level = getLevelConfig(levelId);
  
  // El primer nivel siempre está desbloqueado
  if (levelId === 1) return true;
  
  const requirements = level.unlockRequirements;
  const previousLevelProgress = playerProgress[requirements.previousLevel];
  
  if (!previousLevelProgress) return false;
  
  return (
    previousLevelProgress.completed &&
    previousLevelProgress.bestScore >= requirements.minScore &&
    previousLevelProgress.bestAccuracy >= requirements.minAccuracy
  );
}

/**
 * Calcula el estado de desbloqueo de un nivel
 * @param {number} levelId - ID del nivel
 * @param {Object} playerProgress - Progreso del jugador
 * @returns {string} Estado de desbloqueo
 */
export function getLevelUnlockStatus(levelId, playerProgress = {}) {
  if (!isLevelUnlocked(levelId, playerProgress)) {
    return UNLOCK_STATUS.LOCKED;
  }
  
  const levelProgress = playerProgress[levelId];
  if (!levelProgress || !levelProgress.completed) {
    return UNLOCK_STATUS.AVAILABLE;
  }
  
  const level = getLevelConfig(levelId);
  const isPerfect = levelProgress.bestAccuracy === 100 && 
                   levelProgress.bestScore >= level.rewards.perfectBonus;
  
  return isPerfect ? UNLOCK_STATUS.PERFECT : UNLOCK_STATUS.COMPLETED;
}

/**
 * Obtiene el siguiente nivel disponible
 * @param {Object} playerProgress - Progreso del jugador
 * @returns {number|null} ID del siguiente nivel o null si no hay más
 */
export function getNextAvailableLevel(playerProgress = {}) {
  const allLevels = getAllLevels();
  
  for (const level of allLevels) {
    const status = getLevelUnlockStatus(level.id, playerProgress);
    if (status === UNLOCK_STATUS.AVAILABLE) {
      return level.id;
    }
  }
  
  return null; // Todos los niveles completados
}

/**
 * Calcula el progreso total del jugador
 * @param {Object} playerProgress - Progreso del jugador
 * @returns {Object} Estadísticas de progreso
 */
export function calculateOverallProgress(playerProgress = {}) {
  const allLevels = getAllLevels();
  const totalLevels = allLevels.length;
  
  let completedLevels = 0;
  let perfectLevels = 0;
  let totalScore = 0;
  let totalTime = 0;
  
  allLevels.forEach(level => {
    const progress = playerProgress[level.id];
    if (progress && progress.completed) {
      completedLevels++;
      totalScore += progress.bestScore || 0;
      totalTime += progress.bestTime || 0;
      
      if (getLevelUnlockStatus(level.id, playerProgress) === UNLOCK_STATUS.PERFECT) {
        perfectLevels++;
      }
    }
  });
  
  return {
    totalLevels,
    completedLevels,
    perfectLevels,
    completionPercentage: Math.round((completedLevels / totalLevels) * 100),
    perfectPercentage: Math.round((perfectLevels / totalLevels) * 100),
    totalScore,
    totalTime,
    averageScore: completedLevels > 0 ? Math.round(totalScore / completedLevels) : 0
  };
}
