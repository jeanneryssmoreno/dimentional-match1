/**
 * Contexto del juego de memoria
 * Maneja todo el estado global del juego
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  GAME_STATES, 
  CARD_STATES, 
  calculateMatchScore,
  TIMER_CONFIG 
} from '../types/game.js';
import { getLevelConfig } from '../types/levels.js';

// Estado inicial del juego
const initialGameState = {
  status: GAME_STATES.IDLE,
  level: 1,
  theme: null,
  cards: [],
  revealedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  moves: 0,
  score: 0,
  timeRemaining: 0,
  startTime: null,
  isTimerActive: false,
  streak: 0
};

// Acciones del reducer
const GAME_ACTIONS = {
  INIT_GAME: 'INIT_GAME',
  START_GAME: 'START_GAME',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  REVEAL_CARD: 'REVEAL_CARD',
  HIDE_CARDS: 'HIDE_CARDS',
  MATCH_CARDS: 'MATCH_CARDS',
  UPDATE_TIMER: 'UPDATE_TIMER',
  COMPLETE_GAME: 'COMPLETE_GAME',
  GAME_OVER: 'GAME_OVER',
  RESET_GAME: 'RESET_GAME',
  RESET_STREAK: 'RESET_STREAK',
  SET_LEVEL: 'SET_LEVEL',
  SET_THEME: 'SET_THEME',
  ADVANCE_LEVEL: 'ADVANCE_LEVEL',
  SET_LEVEL_PROGRESS: 'SET_LEVEL_PROGRESS'
};

/**
 * Reducer para manejar las acciones del juego
 */
function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.INIT_GAME:
      const levelConfig = getLevelConfig(action.level);
      return {
        ...state,
        status: GAME_STATES.IDLE,
        level: action.level,
        theme: action.theme,
        cards: action.cards,
        totalPairs: levelConfig.pairs,
        timeRemaining: levelConfig.time,
        matchedPairs: 0,
        moves: 0,
        score: 0,
        revealedCards: [],
        streak: 0,
        startTime: null,
        isTimerActive: false
      };

    case GAME_ACTIONS.START_GAME:
      return {
        ...state,
        status: GAME_STATES.PLAYING,
        startTime: Date.now(),
        isTimerActive: true
      };

    case GAME_ACTIONS.PAUSE_GAME:
      return {
        ...state,
        status: GAME_STATES.PAUSED,
        isTimerActive: false
      };

    case GAME_ACTIONS.RESUME_GAME:
      return {
        ...state,
        status: GAME_STATES.PLAYING,
        isTimerActive: true
      };

    case GAME_ACTIONS.REVEAL_CARD:
      const cardToReveal = state.cards.find(card => card.id === action.cardId);
      if (!cardToReveal || cardToReveal.state !== CARD_STATES.HIDDEN) {
        return state;
      }

      const updatedCards = state.cards.map(card =>
        card.id === action.cardId 
          ? { ...card, state: CARD_STATES.REVEALED }
          : card
      );

      const newRevealedCards = [...state.revealedCards, cardToReveal];

      return {
        ...state,
        cards: updatedCards,
        revealedCards: newRevealedCards,
        moves: state.moves + 1
      };

    case GAME_ACTIONS.HIDE_CARDS:
      const cardsToHide = state.cards.map(card =>
        action.cardIds.includes(card.id)
          ? { ...card, state: CARD_STATES.HIDDEN }
          : card
      );

      return {
        ...state,
        cards: cardsToHide,
        revealedCards: []
      };

    case GAME_ACTIONS.MATCH_CARDS:
      const matchedCards = state.cards.map(card =>
        action.cardIds.includes(card.id)
          ? { ...card, state: CARD_STATES.MATCHED }
          : card
      );

      const newStreak = state.streak + 1;
      const currentLevelConfig = getLevelConfig(state.level);
      const matchScore = calculateMatchScore(
        state.level, 
        state.timeRemaining, 
        currentLevelConfig.time, 
        newStreak
      );

      const newMatchedPairs = state.matchedPairs + 1;
      const isGameComplete = newMatchedPairs === state.totalPairs;

      return {
        ...state,
        cards: matchedCards,
        revealedCards: [],
        matchedPairs: newMatchedPairs,
        score: state.score + matchScore,
        streak: newStreak,
        status: isGameComplete ? GAME_STATES.COMPLETED : state.status,
        isTimerActive: isGameComplete ? false : state.isTimerActive
      };

    case GAME_ACTIONS.UPDATE_TIMER:
      const newTimeRemaining = Math.max(0, state.timeRemaining - 1);
      const isTimeUp = newTimeRemaining === 0;

      return {
        ...state,
        timeRemaining: newTimeRemaining,
        status: isTimeUp ? GAME_STATES.GAME_OVER : state.status,
        isTimerActive: isTimeUp ? false : state.isTimerActive
      };

    case GAME_ACTIONS.COMPLETE_GAME:
      return {
        ...state,
        status: GAME_STATES.COMPLETED,
        isTimerActive: false
      };

    case GAME_ACTIONS.GAME_OVER:
      return {
        ...state,
        status: GAME_STATES.GAME_OVER,
        isTimerActive: false,
        streak: 0
      };

    case GAME_ACTIONS.RESET_GAME:
      return {
        ...initialGameState,
        level: state.level,
        theme: state.theme
      };

    case GAME_ACTIONS.SET_LEVEL:
      return {
        ...state,
        level: action.level
      };

    case GAME_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.theme
      };

    case GAME_ACTIONS.RESET_STREAK:
      return {
        ...state,
        streak: 0
      };

    case GAME_ACTIONS.ADVANCE_LEVEL:
      const nextLevel = Math.min(state.level + 1, 5);
      const nextLevelConfig = getLevelConfig(nextLevel);
      return {
        ...initialGameState,
        level: nextLevel,
        theme: state.theme,
        timeRemaining: nextLevelConfig.time
      };

    case GAME_ACTIONS.SET_LEVEL_PROGRESS:
      return {
        ...state,
        levelProgress: action.progress
      };

    default:
      return state;
  }
}

// Crear el contexto
const GameContext = createContext();

/**
 * Provider del contexto del juego
 */
export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  // Timer effect
  useEffect(() => {
    let intervalId;

    if (gameState.isTimerActive && gameState.timeRemaining > 0) {
      intervalId = setInterval(() => {
        dispatch({ type: GAME_ACTIONS.UPDATE_TIMER });
      }, TIMER_CONFIG.UPDATE_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameState.isTimerActive, gameState.timeRemaining]);

  // Auto-hide revealed cards after delay
  useEffect(() => {
    if (gameState.revealedCards.length === 2) {
      const [card1, card2] = gameState.revealedCards;
      
      // Check if cards match
      if (card1.pairId === card2.pairId) {
        // Match found - mark as matched
        setTimeout(() => {
          dispatch({ 
            type: GAME_ACTIONS.MATCH_CARDS, 
            cardIds: [card1.id, card2.id] 
          });
        }, 500);
      } else {
        // No match - hide cards and reset streak
        setTimeout(() => {
          dispatch({ 
            type: GAME_ACTIONS.HIDE_CARDS, 
            cardIds: [card1.id, card2.id] 
          });
          // Reset streak on miss
          dispatch({ type: GAME_ACTIONS.RESET_STREAK });
        }, 1000);
      }
    }
  }, [gameState.revealedCards]);

  // Game actions
  const initGame = useCallback((level, theme, cards) => {
    dispatch({ 
      type: GAME_ACTIONS.INIT_GAME, 
      level, 
      theme, 
      cards 
    });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.START_GAME });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.PAUSE_GAME });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.RESUME_GAME });
  }, []);

  const revealCard = useCallback((cardId) => {
    // Only allow revealing if less than 2 cards are revealed and game is playing
    if (gameState.revealedCards.length < 2 && gameState.status === GAME_STATES.PLAYING) {
      dispatch({ type: GAME_ACTIONS.REVEAL_CARD, cardId });
    }
  }, [gameState.revealedCards.length, gameState.status]);

  const resetGame = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.RESET_GAME });
  }, []);

  const setLevel = useCallback((level) => {
    dispatch({ type: GAME_ACTIONS.SET_LEVEL, level });
  }, []);

  const setTheme = useCallback((theme) => {
    dispatch({ type: GAME_ACTIONS.SET_THEME, theme });
  }, []);

  // Context value
  const contextValue = {
    // State
    gameState,
    
    // Actions
    initGame,
    startGame,
    pauseGame,
    resumeGame,
    revealCard,
    resetGame,
    setLevel,
    setTheme,
    
    // Computed values
    isGameActive: gameState.status === GAME_STATES.PLAYING,
    isGameComplete: gameState.status === GAME_STATES.COMPLETED,
    isGameOver: gameState.status === GAME_STATES.GAME_OVER,
    canRevealCards: gameState.revealedCards.length < 2 && gameState.status === GAME_STATES.PLAYING,
    progress: gameState.totalPairs > 0 ? (gameState.matchedPairs / gameState.totalPairs) * 100 : 0
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Hook para usar el contexto del juego
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe ser usado dentro de un GameProvider');
  }
  return context;
}

export { GAME_ACTIONS };
