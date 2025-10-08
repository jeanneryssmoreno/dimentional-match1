/**
 * Herramientas de desarrollo para testing y debugging
 * Developer 2 - Utilidades de desarrollo
 */

const STORAGE_KEYS = {
  LEVEL_PROGRESS: 'memoryGame_levelProgress',
  CURRENT_SESSION: 'memoryGame_currentSession',
  PLAYER_PREFERENCES: 'memoryGame_preferences',
  GAME_HISTORY: 'memoryGame_history',
  STATISTICS: 'memoryGame_statistics'
};

/**
 * Limpia todo el progreso del juego
 */
export function clearAllProgress() {
  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing ${key}:`, error);
    }
  });
  console.log('✅ Progreso limpiado completamente');
}

/**
 * Muestra el progreso actual en consola
 */
export function showProgress() {
  const progress = localStorage.getItem(STORAGE_KEYS.LEVEL_PROGRESS);
  if (progress) {
    const data = JSON.parse(progress);
    console.log('📊 Progreso actual:', data);
    return data;
  }
  console.log('ℹ️ No hay progreso guardado');
  return null;
}

/**
 * Desbloquea todos los niveles con requisitos mínimos
 */
export function unlockAllLevels() {
  const progress = {
    1: {
      completed: true,
      attempts: 1,
      bestScore: 1000,
      bestAccuracy: 100,
      bestTime: 60,
      bestMoves: 8,
      totalScore: 1000,
      totalTime: 60,
      firstCompletedAt: Date.now(),
      lastPlayedAt: Date.now()
    },
    2: {
      completed: true,
      attempts: 1,
      bestScore: 1500,
      bestAccuracy: 100,
      bestTime: 70,
      bestMoves: 10,
      totalScore: 1500,
      totalTime: 70,
      firstCompletedAt: Date.now(),
      lastPlayedAt: Date.now()
    },
    3: {
      completed: true,
      attempts: 1,
      bestScore: 2000,
      bestAccuracy: 100,
      bestTime: 75,
      bestMoves: 12,
      totalScore: 2000,
      totalTime: 75,
      firstCompletedAt: Date.now(),
      lastPlayedAt: Date.now()
    },
    4: {
      completed: true,
      attempts: 1,
      bestScore: 2500,
      bestAccuracy: 100,
      bestTime: 65,
      bestMoves: 14,
      totalScore: 2500,
      totalTime: 65,
      firstCompletedAt: Date.now(),
      lastPlayedAt: Date.now()
    },
    5: {
      completed: false,
      attempts: 0,
      bestScore: 0,
      bestAccuracy: 0,
      bestTime: Infinity,
      bestMoves: Infinity,
      totalScore: 0,
      totalTime: 0,
      firstCompletedAt: null,
      lastPlayedAt: null
    }
  };

  localStorage.setItem(STORAGE_KEYS.LEVEL_PROGRESS, JSON.stringify(progress));
  console.log('✅ Todos los niveles desbloqueados (1-4 completados, 5 disponible)');
  return progress;
}

/**
 * Simula progreso parcial para testing
 * @param {number} levelsCompleted - Número de niveles a completar (1-5)
 */
export function simulateProgress(levelsCompleted = 3) {
  const progress = {};
  
  for (let i = 1; i <= levelsCompleted; i++) {
    progress[i] = {
      completed: true,
      attempts: 1,
      bestScore: 500 + (i * 300),
      bestAccuracy: 70 + (i * 5),
      bestTime: 60 + (i * 10),
      bestMoves: 8 + (i * 2),
      totalScore: 500 + (i * 300),
      totalTime: 60 + (i * 10),
      firstCompletedAt: Date.now(),
      lastPlayedAt: Date.now()
    };
  }

  localStorage.setItem(STORAGE_KEYS.LEVEL_PROGRESS, JSON.stringify(progress));
  console.log(`✅ Progreso simulado: ${levelsCompleted} nivel(es) completado(s)`);
  console.log('📊 Progreso:', progress);
  return progress;
}

/**
 * Verifica qué niveles están desbloqueados
 */
export function checkUnlockedLevels() {
  const progress = showProgress();
  if (!progress) {
    console.log('ℹ️ Solo el nivel 1 está desbloqueado (sin progreso)');
    return;
  }

  console.log('🔓 Estado de niveles:');
  for (let i = 1; i <= 5; i++) {
    const levelProgress = progress[i];
    if (!levelProgress) {
      console.log(`  Nivel ${i}: ❌ Bloqueado (sin datos)`);
      continue;
    }

    if (levelProgress.completed) {
      console.log(`  Nivel ${i}: ✅ Completado (Score: ${levelProgress.bestScore}, Precisión: ${levelProgress.bestAccuracy}%)`);
    } else if (levelProgress.attempts > 0) {
      console.log(`  Nivel ${i}: 🔓 Disponible (Intentos: ${levelProgress.attempts})`);
    } else {
      console.log(`  Nivel ${i}: 🔓 Disponible`);
    }
  }
}

/**
 * Exporta todo el localStorage a JSON
 */
export function exportStorage() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        data[name] = JSON.parse(item);
      } catch {
        data[name] = item;
      }
    }
  });
  console.log('📦 Datos exportados:', data);
  return data;
}

// Exponer funciones en window para desarrollo
if (typeof window !== 'undefined') {
  window.devTools = {
    clearAllProgress,
    showProgress,
    unlockAllLevels,
    simulateProgress,
    checkUnlockedLevels,
    exportStorage
  };
  
  console.log('🛠️ DevTools cargadas. Usa window.devTools para acceder a:');
  console.log('  - clearAllProgress(): Limpia todo el progreso');
  console.log('  - showProgress(): Muestra el progreso actual');
  console.log('  - unlockAllLevels(): Desbloquea todos los niveles');
  console.log('  - simulateProgress(n): Simula n niveles completados');
  console.log('  - checkUnlockedLevels(): Verifica niveles desbloqueados');
  console.log('  - exportStorage(): Exporta todo el localStorage');
}

