/**
 * Hook de persistencia para el estado de la sesión del juego
 * Developer 2 - Sprint 3
 * 
 * Maneja:
 * - Sesión actual (tema, nivel)
 * - Preferencias del jugador
 * - Historial de partidas recientes
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  CURRENT_SESSION: 'memoryGame_currentSession',
  PLAYER_PREFERENCES: 'memoryGame_preferences',
  GAME_HISTORY: 'memoryGame_history',
  STATISTICS: 'memoryGame_statistics'
};

// Configuración por defecto
const DEFAULT_PREFERENCES = {
  soundEnabled: true,
  musicEnabled: false,
  showHints: true,
  animationSpeed: 'normal', // slow, normal, fast
  difficultyPreference: 'medium'
};

const DEFAULT_STATISTICS = {
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  totalGamesLost: 0,
  totalScore: 0,
  totalTimePlayd: 0,
  favoriteTheme: null,
  lastPlayedDate: null
};

/**
 * Hook principal de persistencia
 */
export function useGamePersistence() {
  const [currentSession, setCurrentSession] = useState(null);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [statistics, setStatistics] = useState(DEFAULT_STATISTICS);
  const [gameHistory, setGameHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    loadAllData();
  }, []);

  // Guardar automáticamente cuando cambien los datos
  useEffect(() => {
    if (isLoaded) {
      saveAllData();
    }
  }, [currentSession, preferences, statistics, gameHistory, isLoaded]);

  /**
   * Carga todos los datos del localStorage
   */
  const loadAllData = useCallback(() => {
    try {
      // Cargar sesión actual
      const sessionData = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      if (sessionData) {
        setCurrentSession(JSON.parse(sessionData));
      }

      // Cargar preferencias
      const prefsData = localStorage.getItem(STORAGE_KEYS.PLAYER_PREFERENCES);
      if (prefsData) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(prefsData) });
      }

      // Cargar estadísticas
      const statsData = localStorage.getItem(STORAGE_KEYS.STATISTICS);
      if (statsData) {
        setStatistics({ ...DEFAULT_STATISTICS, ...JSON.parse(statsData) });
      }

      // Cargar historial (solo últimas 50 partidas)
      const historyData = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
      if (historyData) {
        const history = JSON.parse(historyData);
        setGameHistory(history.slice(0, 50));
      }
    } catch (error) {
      console.warn('Error loading game data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Guarda todos los datos en localStorage
   */
  const saveAllData = useCallback(() => {
    try {
      if (currentSession) {
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_SESSION,
          JSON.stringify(currentSession)
        );
      }

      localStorage.setItem(
        STORAGE_KEYS.PLAYER_PREFERENCES,
        JSON.stringify(preferences)
      );

      localStorage.setItem(
        STORAGE_KEYS.STATISTICS,
        JSON.stringify(statistics)
      );

      localStorage.setItem(
        STORAGE_KEYS.GAME_HISTORY,
        JSON.stringify(gameHistory.slice(0, 50))
      );
    } catch (error) {
      console.warn('Error saving game data:', error);
    }
  }, [currentSession, preferences, statistics, gameHistory]);

  /**
   * Inicia una nueva sesión de juego
   */
  const startSession = useCallback((theme, level = 1) => {
    const session = {
      theme,
      level,
      startedAt: Date.now(),
      lastSavedAt: Date.now()
    };
    setCurrentSession(session);
    return session;
  }, []);

  /**
   * Actualiza la sesión actual
   */
  const updateSession = useCallback((updates) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        lastSavedAt: Date.now()
      };
    });
  }, []);

  /**
   * Finaliza la sesión actual
   */
  const endSession = useCallback(() => {
    setCurrentSession(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }, []);

  /**
   * Guarda el resultado de una partida
   */
  const saveGameResult = useCallback((gameResult) => {
    const {
      theme,
      level,
      completed,
      score,
      accuracy,
      timeUsed,
      moves
    } = gameResult;

    // Actualizar estadísticas generales
    setStatistics(prev => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalGamesWon: completed ? prev.totalGamesWon + 1 : prev.totalGamesWon,
      totalGamesLost: !completed ? prev.totalGamesLost + 1 : prev.totalGamesLost,
      totalScore: prev.totalScore + (score || 0),
      totalTimePlayd: prev.totalTimePlayd + (timeUsed || 0),
      favoriteTheme: theme, // Simplificado - podría ser más complejo
      lastPlayedDate: Date.now()
    }));

    // Agregar al historial
    const historyEntry = {
      id: Date.now(),
      theme,
      level,
      completed,
      score,
      accuracy,
      timeUsed,
      moves,
      date: Date.now()
    };

    setGameHistory(prev => [historyEntry, ...prev].slice(0, 50));

    return historyEntry;
  }, []);

  /**
   * Actualiza una preferencia específica
   */
  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  /**
   * Actualiza múltiples preferencias
   */
  const updatePreferences = useCallback((updates) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Resetea todas las preferencias
   */
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  /**
   * Obtiene el historial de un tema específico
   */
  const getThemeHistory = useCallback((theme) => {
    return gameHistory.filter(entry => entry.theme === theme);
  }, [gameHistory]);

  /**
   * Obtiene el historial de un nivel específico
   */
  const getLevelHistory = useCallback((level) => {
    return gameHistory.filter(entry => entry.level === level);
  }, [gameHistory]);

  /**
   * Obtiene estadísticas por tema
   */
  const getThemeStatistics = useCallback((theme) => {
    const themeGames = gameHistory.filter(entry => entry.theme === theme);
    
    if (themeGames.length === 0) {
      return {
        gamesPlayed: 0,
        gamesWon: 0,
        winRate: 0,
        averageScore: 0,
        bestScore: 0
      };
    }

    const gamesWon = themeGames.filter(g => g.completed).length;
    const totalScore = themeGames.reduce((sum, g) => sum + (g.score || 0), 0);
    const bestScore = Math.max(...themeGames.map(g => g.score || 0));

    return {
      gamesPlayed: themeGames.length,
      gamesWon,
      winRate: Math.round((gamesWon / themeGames.length) * 100),
      averageScore: Math.round(totalScore / themeGames.length),
      bestScore
    };
  }, [gameHistory]);

  /**
   * Limpia el historial antiguo (más de 30 días)
   */
  const cleanOldHistory = useCallback(() => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    setGameHistory(prev => prev.filter(entry => entry.date > thirtyDaysAgo));
  }, []);

  /**
   * Resetea todas las estadísticas
   */
  const resetStatistics = useCallback(() => {
    setStatistics(DEFAULT_STATISTICS);
  }, []);

  /**
   * Limpia todos los datos
   */
  const clearAllData = useCallback(() => {
    setCurrentSession(null);
    setPreferences(DEFAULT_PREFERENCES);
    setStatistics(DEFAULT_STATISTICS);
    setGameHistory([]);
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }, []);

  /**
   * Exporta todos los datos (para backup)
   */
  const exportData = useCallback(() => {
    return {
      currentSession,
      preferences,
      statistics,
      gameHistory,
      exportedAt: Date.now()
    };
  }, [currentSession, preferences, statistics, gameHistory]);

  /**
   * Importa datos (desde backup)
   */
  const importData = useCallback((data) => {
    try {
      if (data.currentSession) setCurrentSession(data.currentSession);
      if (data.preferences) setPreferences({ ...DEFAULT_PREFERENCES, ...data.preferences });
      if (data.statistics) setStatistics({ ...DEFAULT_STATISTICS, ...data.statistics });
      if (data.gameHistory) setGameHistory(data.gameHistory);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, []);

  return {
    // Estado
    currentSession,
    preferences,
    statistics,
    gameHistory,
    isLoaded,

    // Funciones de sesión
    startSession,
    updateSession,
    endSession,

    // Funciones de juego
    saveGameResult,

    // Funciones de preferencias
    updatePreference,
    updatePreferences,
    resetPreferences,

    // Funciones de historial
    getThemeHistory,
    getLevelHistory,
    getThemeStatistics,
    cleanOldHistory,

    // Funciones de estadísticas
    resetStatistics,

    // Funciones de gestión
    clearAllData,
    exportData,
    importData,
    saveAllData,
    loadAllData,

    // Valores computados
    winRate: statistics.totalGamesPlayed > 0 
      ? Math.round((statistics.totalGamesWon / statistics.totalGamesPlayed) * 100) 
      : 0,
    averageScore: statistics.totalGamesPlayed > 0
      ? Math.round(statistics.totalScore / statistics.totalGamesPlayed)
      : 0,
    recentGames: gameHistory.slice(0, 10),
    hasActiveSession: currentSession !== null
  };
}

