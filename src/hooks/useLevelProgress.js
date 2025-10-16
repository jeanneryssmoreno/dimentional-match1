/**
 * Hook para manejar el progreso de niveles y persistencia
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getAllLevels, 
  getLevelUnlockStatus, 
  calculateOverallProgress,
  getNextAvailableLevel,
  UNLOCK_STATUS 
} from '../types/levels.js';

const STORAGE_KEY = 'memoryGame_levelProgress';

/**
 * Hook para manejar el progreso de niveles
 * @returns {Object} Estado y funciones del progreso
 */
export function useLevelProgress() {
  const [playerProgress, setPlayerProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Cargar progreso desde localStorage al inicializar
  useEffect(() => {
    loadProgress();
  }, []);

  // Guardar progreso automáticamente cuando cambie
  useEffect(() => {
    if (!isLoading) {
      saveProgress();
    }
  }, [playerProgress, isLoading]);

  /**
   * Carga el progreso desde localStorage
   */
  const loadProgress = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setPlayerProgress(parsed);
      }
    } catch (error) {
      console.warn('Error loading level progress:', error);
      setPlayerProgress({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Guarda el progreso en localStorage
   */
  const saveProgress = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerProgress));
    } catch (error) {
      console.warn('Error saving level progress:', error);
    }
  }, [playerProgress]);

  /**
   * Actualiza el progreso de un nivel específico
   * @param {number} levelId - ID del nivel
   * @param {Object} gameResult - Resultado del juego
   */
  const updateLevelProgress = useCallback((levelId, gameResult) => {
    const {
      completed,
      score,
      accuracy,
      timeUsed,
      moves,
      isNewRecord = false
    } = gameResult;

    setPlayerProgress(prev => {
      const currentProgress = prev[levelId] || {
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
      };

      const newProgress = {
        ...currentProgress,
        attempts: currentProgress.attempts + 1,
        totalScore: currentProgress.totalScore + (score || 0),
        totalTime: currentProgress.totalTime + (timeUsed || 0),
        lastPlayedAt: Date.now()
      };

      // Actualizar si el nivel fue completado
      if (completed) {
        newProgress.completed = true;
        if (!currentProgress.firstCompletedAt) {
          newProgress.firstCompletedAt = Date.now();
        }

        // Actualizar mejores marcas
        if (score > currentProgress.bestScore) {
          newProgress.bestScore = score;
        }
        if (accuracy > currentProgress.bestAccuracy) {
          newProgress.bestAccuracy = accuracy;
        }
        if (timeUsed < currentProgress.bestTime) {
          newProgress.bestTime = timeUsed;
        }
        if (moves < currentProgress.bestMoves) {
          newProgress.bestMoves = moves;
        }
      }

      return {
        ...prev,
        [levelId]: newProgress
      };
    });

    // Trigger evento personalizado para notificar cambios
    window.dispatchEvent(new CustomEvent('levelProgressUpdated', {
      detail: { levelId, gameResult, isNewRecord }
    }));
  }, []);

  /**
   * Resetea el progreso de un nivel específico
   * @param {number} levelId - ID del nivel
   */
  const resetLevelProgress = useCallback((levelId) => {
    setPlayerProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[levelId];
      return newProgress;
    });
  }, []);

  /**
   * Resetea todo el progreso
   */
  const resetAllProgress = useCallback(() => {
    setPlayerProgress({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Error clearing progress:', error);
    }
  }, []);

  /**
   * Obtiene estadísticas de un nivel específico
   * @param {number} levelId - ID del nivel
   * @returns {Object} Estadísticas del nivel
   */
  const getLevelStats = useCallback((levelId) => {
    const progress = playerProgress[levelId];
    if (!progress) {
      return {
        attempts: 0,
        completed: false,
        bestScore: 0,
        bestAccuracy: 0,
        averageScore: 0,
        averageTime: 0,
        status: UNLOCK_STATUS.LOCKED
      };
    }

    return {
      ...progress,
      averageScore: progress.attempts > 0 ? Math.round(progress.totalScore / progress.attempts) : 0,
      averageTime: progress.attempts > 0 ? Math.round(progress.totalTime / progress.attempts) : 0,
      status: getLevelUnlockStatus(levelId, playerProgress)
    };
  }, [playerProgress]);

  /**
   * Verifica si hay nuevos logros desbloqueados
   * @returns {Array} Array de logros nuevos
   */
  const checkNewAchievements = useCallback(() => {
    const overall = calculateOverallProgress(playerProgress);
    const achievements = [];

    // Logro: Primer nivel completado
    if (overall.completedLevels === 1 && !localStorage.getItem('achievement_firstLevel')) {
      achievements.push({
        id: 'firstLevel',
        title: '🎯 Primer Nivel',
        description: 'Completaste tu primer nivel',
        type: 'milestone'
      });
      localStorage.setItem('achievement_firstLevel', 'true');
    }

    // Logro: Mitad del camino
    if (overall.completedLevels >= 3 && !localStorage.getItem('achievement_halfway')) {
      achievements.push({
        id: 'halfway',
        title: '🔥 En Racha',
        description: 'Completaste 3 niveles',
        type: 'progress'
      });
      localStorage.setItem('achievement_halfway', 'true');
    }

    // Logro: Primer nivel perfecto
    if (overall.perfectLevels === 1 && !localStorage.getItem('achievement_firstPerfect')) {
      achievements.push({
        id: 'firstPerfect',
        title: '⭐ Perfeccionista',
        description: 'Completaste un nivel con puntuación perfecta',
        type: 'skill'
      });
      localStorage.setItem('achievement_firstPerfect', 'true');
    }

    // Logro: Todos los niveles completados
    if (overall.completedLevels === 5 && !localStorage.getItem('achievement_allLevels')) {
      achievements.push({
        id: 'allLevels',
        title: '👑 Completista',
        description: 'Completaste todos los niveles',
        type: 'completion'
      });
      localStorage.setItem('achievement_allLevels', 'true');
    }

    // Logro: Maestro absoluto
    if (overall.perfectLevels === 5 && !localStorage.getItem('achievement_masterAll')) {
      achievements.push({
        id: 'masterAll',
        title: '🏆 Maestro Absoluto',
        description: 'Completaste todos los niveles con puntuación perfecta',
        type: 'mastery'
      });
      localStorage.setItem('achievement_masterAll', 'true');
    }

    return achievements;
  }, [playerProgress]);

  // Calcular estadísticas generales
  const overallProgress = calculateOverallProgress(playerProgress);
  const nextLevel = getNextAvailableLevel(playerProgress);
  const allLevels = getAllLevels();

  return {
    // Estado
    playerProgress,
    overallProgress,
    isLoading,
    
    // Información útil
    nextLevel,
    allLevels,
    
    // Funciones
    updateLevelProgress,
    resetLevelProgress,
    resetAllProgress,
    getLevelStats,
    checkNewAchievements,
    loadProgress,
    saveProgress,
    
    // Funciones de utilidad
    isLevelUnlocked: (levelId) => getLevelUnlockStatus(levelId, playerProgress) !== UNLOCK_STATUS.LOCKED,
    getLevelStatus: (levelId) => getLevelUnlockStatus(levelId, playerProgress),
    
    // Estadísticas rápidas
    totalLevelsCompleted: overallProgress.completedLevels,
    totalScore: overallProgress.totalScore,
    completionPercentage: overallProgress.completionPercentage
  };
}
