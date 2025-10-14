/**
 * Utilidades para la lógica del juego de memoria
 */

import { CARD_STATES } from '../types/game.js';

/**
 * Baraja un array usando el algoritmo Fisher-Yates
 * @param {Array} array - Array a barajar
 * @returns {Array} Array barajado
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Crea cartas del juego a partir de personajes
 * @param {Array} characters - Array de personajes de la API
 * @param {number} pairs - Número de pares a crear
 * @returns {Array} Array de cartas del juego
 */
export function createGameCards(characters, pairs) {
  if (!Array.isArray(characters) || characters.length === 0) {
    return [];
  }

  // Tomar solo los personajes necesarios
  const selectedCharacters = characters.slice(0, pairs);
  
  // Crear pares de cartas
  const cards = [];
  selectedCharacters.forEach((character, index) => {
    // Primera carta del par
    cards.push({
      id: `${character.id}_1`,
      characterId: character.id,
      name: character.name,
      image: character.image,
      theme: character.theme,
      state: CARD_STATES.HIDDEN,
      pairId: index,
      position: -1, // Se asignará después del barajeo
      originalData: character.originalData
    });

    // Segunda carta del par
    cards.push({
      id: `${character.id}_2`,
      characterId: character.id,
      name: character.name,
      image: character.image,
      theme: character.theme,
      state: CARD_STATES.HIDDEN,
      pairId: index,
      position: -1, // Se asignará después del barajeo
      originalData: character.originalData
    });
  });

  // Barajar las cartas
  const shuffledCards = shuffleArray(cards);

  // Asignar posiciones
  return shuffledCards.map((card, index) => ({
    ...card,
    position: index
  }));
}

/**
 * Verifica si dos cartas forman un par
 * @param {Object} card1 - Primera carta
 * @param {Object} card2 - Segunda carta
 * @returns {boolean} True si forman un par
 */
export function areCardsMatching(card1, card2) {
  return card1 && card2 && card1.pairId === card2.pairId && card1.id !== card2.id;
}

/**
 * Obtiene las cartas que pueden ser reveladas
 * @param {Array} cards - Array de cartas
 * @returns {Array} Cartas que pueden ser reveladas
 */
export function getRevealableCards(cards) {
  return cards.filter(card => card.state === CARD_STATES.HIDDEN);
}

/**
 * Obtiene las cartas actualmente reveladas
 * @param {Array} cards - Array de cartas
 * @returns {Array} Cartas reveladas
 */
export function getRevealedCards(cards) {
  return cards.filter(card => card.state === CARD_STATES.REVEALED);
}

/**
 * Obtiene las cartas ya emparejadas
 * @param {Array} cards - Array de cartas
 * @returns {Array} Cartas emparejadas
 */
export function getMatchedCards(cards) {
  return cards.filter(card => card.state === CARD_STATES.MATCHED);
}

/**
 * Calcula el progreso del juego
 * @param {Array} cards - Array de cartas
 * @param {number} totalPairs - Total de pares en el juego
 * @returns {Object} Información del progreso
 */
export function calculateGameProgress(cards, totalPairs) {
  const matchedCards = getMatchedCards(cards);
  const matchedPairs = matchedCards.length / 2;
  const progress = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;

  return {
    matchedPairs,
    totalPairs,
    progress: Math.round(progress),
    isComplete: matchedPairs === totalPairs,
    remainingPairs: totalPairs - matchedPairs
  };
}

/**
 * Formatea el tiempo en formato MM:SS
 * @param {number} seconds - Tiempo en segundos
 * @returns {string} Tiempo formateado
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Obtiene el estado del timer (normal, warning, critical)
 * @param {number} timeRemaining - Tiempo restante
 * @param {number} totalTime - Tiempo total del nivel
 * @returns {string} Estado del timer
 */
export function getTimerStatus(timeRemaining, totalTime) {
  const percentage = (timeRemaining / totalTime) * 100;
  
  if (percentage <= 10) return 'critical';
  if (percentage <= 25) return 'warning';
  return 'normal';
}

/**
 * Genera estadísticas del juego
 * @param {Object} gameState - Estado actual del juego
 * @returns {Object} Estadísticas del juego
 */
export function generateGameStats(gameState) {
  const { moves, matchedPairs, totalPairs, score, timeRemaining, level } = gameState;
  
  // Fórmula corregida: cada par coincidente = 2 cartas correctas, dividido por el total de cartas reveladas (moves)
  const accuracy = moves > 0 ? Math.round((matchedPairs * 2 / moves) * 100) : 0;
  const efficiency = totalPairs > 0 ? Math.round((matchedPairs / totalPairs) * 100) : 0;
  
  return {
    moves,
    matchedPairs,
    totalPairs,
    score,
    timeRemaining,
    level,
    accuracy: Math.min(accuracy, 100), // Cap at 100%
    efficiency,
    timeUsed: gameState.startTime ? Math.floor((Date.now() - gameState.startTime) / 1000) : 0
  };
}

/**
 * Valida si una carta puede ser revelada
 * @param {Object} card - Carta a validar
 * @param {Array} revealedCards - Cartas actualmente reveladas
 * @returns {boolean} True si puede ser revelada
 */
export function canRevealCard(card, revealedCards) {
  return (
    card &&
    card.state === CARD_STATES.HIDDEN &&
    revealedCards.length < 2 &&
    !revealedCards.find(revealedCard => revealedCard.id === card.id)
  );
}

/**
 * Obtiene sugerencias para el jugador (modo ayuda)
 * @param {Array} cards - Array de cartas
 * @returns {Array} Array de sugerencias
 */
export function getGameHints(cards) {
  const revealedCards = getRevealedCards(cards);
  const hiddenCards = getRevealableCards(cards);
  
  // Si hay una carta revelada, buscar su par
  if (revealedCards.length === 1) {
    const revealedCard = revealedCards[0];
    const matchingCard = hiddenCards.find(card => 
      card.pairId === revealedCard.pairId && card.id !== revealedCard.id
    );
    
    if (matchingCard) {
      return [{
        type: 'match',
        message: `Busca la carta que hace par con ${revealedCard.name}`,
        cardId: matchingCard.id
      }];
    }
  }
  
  // Sugerencias generales
  return [{
    type: 'general',
    message: `Quedan ${hiddenCards.length} cartas por revelar`,
    cardId: null
  }];
}

/**
 * Persiste el estado del juego en localStorage
 * @param {Object} gameState - Estado del juego
 * @param {string} key - Clave para localStorage
 */
export function saveGameState(gameState, key = 'memoryGameState') {
  try {
    const serializedState = JSON.stringify({
      ...gameState,
      startTime: gameState.startTime ? gameState.startTime : null
    });
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.warn('No se pudo guardar el estado del juego:', error);
  }
}

/**
 * Carga el estado del juego desde localStorage
 * @param {string} key - Clave de localStorage
 * @returns {Object|null} Estado del juego o null si no existe
 */
export function loadGameState(key = 'memoryGameState') {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState) {
      return JSON.parse(serializedState);
    }
  } catch (error) {
    console.warn('No se pudo cargar el estado del juego:', error);
  }
  return null;
}

/**
 * Limpia el estado guardado del juego
 * @param {string} key - Clave de localStorage
 */
export function clearSavedGameState(key = 'memoryGameState') {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('No se pudo limpiar el estado guardado:', error);
  }
}
