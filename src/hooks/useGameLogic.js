/**
 * Hook personalizado para la lógica del juego de memoria
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { useGameCharacters } from './useGameCharacters.js';
import { 
  createGameCards, 
  generateGameStats, 
  saveGameState, 
  loadGameState,
  clearSavedGameState 
} from '../utils/gameUtils.js';
import { getLevelConfig, GAME_STATES } from '../types/game.js';

/**
 * Hook principal para la lógica del juego
 * @param {string} theme - Tema seleccionado
 * @param {number} level - Nivel del juego
 * @returns {Object} Funciones y estado del juego
 */
export function useGameLogic(theme, level = 1) {
  const {
    gameState,
    initGame,
    startGame,
    pauseGame,
    resumeGame,
    revealCard,
    resetGame,
    isGameActive,
    isGameComplete,
    isGameOver,
    canRevealCards,
    progress
  } = useGame();

  const levelConfig = getLevelConfig(level);
  const requiredCharacters = levelConfig.pairs;

  // Obtener personajes de la API
  const { 
    data: characters, 
    isLoading: isLoadingCharacters, 
    error: charactersError 
  } = useGameCharacters(theme, requiredCharacters);

  // Inicializar juego cuando los personajes estén listos
  const initializeGame = useCallback(async () => {
    if (characters && characters.length >= requiredCharacters) {
      const gameCards = createGameCards(characters, requiredCharacters);
      initGame(level, theme, gameCards);
    }
  }, [characters, requiredCharacters, level, theme, initGame]);

  // Auto-inicializar cuando los datos estén listos
  useEffect(() => {
    if (characters && gameState.status === GAME_STATES.IDLE) {
      initializeGame();
    }
  }, [characters, gameState.status, initializeGame]);

  // Manejar click en carta
  const handleCardClick = useCallback((cardId) => {
    if (canRevealCards && gameState.status === GAME_STATES.PLAYING) {
      const card = gameState.cards.find(c => c.id === cardId);
      if (card && card.state === 'hidden') {
        revealCard(cardId);
      }
    }
  }, [canRevealCards, gameState.status, gameState.cards, revealCard]);

  // Iniciar nuevo juego
  const startNewGame = useCallback(async () => {
    await initializeGame();
    startGame();
  }, [initializeGame, startGame]);

  // Reiniciar juego actual
  const restartGame = useCallback(() => {
    resetGame();
    setTimeout(() => {
      initializeGame();
    }, 100);
  }, [resetGame, initializeGame]);

  // Pausar/reanudar juego
  const togglePause = useCallback(() => {
    if (gameState.status === GAME_STATES.PLAYING) {
      pauseGame();
    } else if (gameState.status === GAME_STATES.PAUSED) {
      resumeGame();
    }
  }, [gameState.status, pauseGame, resumeGame]);

  // Estadísticas del juego
  const gameStats = useMemo(() => {
    return generateGameStats(gameState);
  }, [gameState]);

  // Persistencia del estado
  const saveGame = useCallback(() => {
    if (gameState.status !== GAME_STATES.IDLE) {
      saveGameState(gameState);
    }
  }, [gameState]);

  const loadGame = useCallback(() => {
    const savedState = loadGameState();
    if (savedState) {
      // Implementar lógica para restaurar estado guardado
      // Por ahora, solo limpiamos el estado guardado
      clearSavedGameState();
    }
  }, []);

  // Auto-guardar progreso
  useEffect(() => {
    if (isGameActive) {
      const autoSaveInterval = setInterval(saveGame, 30000); // Guardar cada 30 segundos
      return () => clearInterval(autoSaveInterval);
    }
  }, [isGameActive, saveGame]);

  // Limpiar estado guardado al completar o perder
  useEffect(() => {
    if (isGameComplete || isGameOver) {
      clearSavedGameState();
    }
  }, [isGameComplete, isGameOver]);

  // Estado de carga
  const isLoading = isLoadingCharacters || !characters;

  // Información del nivel actual
  const levelInfo = useMemo(() => ({
    ...levelConfig,
    number: level,
    totalCards: levelConfig.pairs * 2
  }), [levelConfig, level]);

  return {
    // Estado del juego
    gameState,
    gameStats,
    levelInfo,
    progress,
    
    // Estados booleanos
    isLoading,
    isGameActive,
    isGameComplete,
    isGameOver,
    canRevealCards,
    
    // Errores
    error: charactersError,
    
    // Acciones
    handleCardClick,
    startNewGame,
    restartGame,
    togglePause,
    saveGame,
    loadGame,
    
    // Datos
    characters: characters || [],
    cards: gameState.cards || []
  };
}
