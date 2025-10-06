/**
 * Hook para manejar estadísticas del juego
 */

import { useMemo, useCallback } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { generateGameStats, calculateGameProgress } from '../utils/gameUtils.js';
import { getLevelConfig } from '../types/game.js';

/**
 * Hook para estadísticas del juego
 * @returns {Object} Estadísticas y métricas del juego
 */
export function useGameStats() {
  const { gameState } = useGame();

  // Estadísticas básicas del juego
  const basicStats = useMemo(() => {
    return generateGameStats(gameState);
  }, [gameState]);

  // Progreso del juego
  const progress = useMemo(() => {
    return calculateGameProgress(gameState.cards, gameState.totalPairs);
  }, [gameState.cards, gameState.totalPairs]);

  // Configuración del nivel actual
  const levelConfig = useMemo(() => {
    return getLevelConfig(gameState.level);
  }, [gameState.level]);

  // Métricas avanzadas
  const advancedMetrics = useMemo(() => {
    const { moves, matchedPairs, timeRemaining, startTime } = gameState;
    const totalTime = levelConfig.time;
    const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    
    // Precisión (porcentaje de movimientos exitosos)
    const accuracy = moves > 0 ? Math.round((matchedPairs / (moves / 2)) * 100) : 0;
    
    // Eficiencia temporal (qué tan rápido se están encontrando los pares)
    const timeEfficiency = timeElapsed > 0 ? Math.round((matchedPairs / timeElapsed) * 60) : 0; // pares por minuto
    
    // Velocidad promedio por movimiento
    const avgTimePerMove = moves > 0 && timeElapsed > 0 ? Math.round(timeElapsed / moves) : 0;
    
    // Puntuación por minuto
    const scorePerMinute = timeElapsed > 0 ? Math.round((gameState.score / timeElapsed) * 60) : 0;
    
    // Porcentaje de tiempo utilizado
    const timeUsagePercentage = totalTime > 0 ? Math.round(((totalTime - timeRemaining) / totalTime) * 100) : 0;
    
    return {
      accuracy: Math.min(accuracy, 100), // Cap at 100%
      timeEfficiency,
      avgTimePerMove,
      scorePerMinute,
      timeUsagePercentage,
      timeElapsed
    };
  }, [gameState, levelConfig]);

  // Rendimiento del jugador
  const performance = useMemo(() => {
    const { accuracy, timeEfficiency } = advancedMetrics;
    const { progress: gameProgress } = progress;
    
    let rating = 'Principiante';
    let stars = 1;
    
    // Calcular rating basado en múltiples métricas
    const performanceScore = (accuracy * 0.4) + (timeEfficiency * 0.3) + (gameProgress * 0.3);
    
    if (performanceScore >= 90) {
      rating = 'Maestro';
      stars = 5;
    } else if (performanceScore >= 75) {
      rating = 'Experto';
      stars = 4;
    } else if (performanceScore >= 60) {
      rating = 'Avanzado';
      stars = 3;
    } else if (performanceScore >= 40) {
      rating = 'Intermedio';
      stars = 2;
    }
    
    return {
      rating,
      stars,
      score: Math.round(performanceScore)
    };
  }, [advancedMetrics, progress]);

  // Comparación con nivel anterior (si existe)
  const levelComparison = useMemo(() => {
    // Aquí se podría implementar lógica para comparar con estadísticas previas
    // Por ahora retornamos valores por defecto
    return {
      scoreImprovement: 0,
      timeImprovement: 0,
      accuracyImprovement: 0
    };
  }, []);

  // Obtener estadísticas formateadas para mostrar
  const getFormattedStats = useCallback(() => {
    return {
      'Movimientos': basicStats.moves,
      'Pares encontrados': `${basicStats.matchedPairs}/${basicStats.totalPairs}`,
      'Puntuación': basicStats.score.toLocaleString(),
      'Precisión': `${advancedMetrics.accuracy}%`,
      'Tiempo transcurrido': `${Math.floor(advancedMetrics.timeElapsed / 60)}:${(advancedMetrics.timeElapsed % 60).toString().padStart(2, '0')}`,
      'Racha actual': gameState.streak,
      'Nivel': `${basicStats.level} - ${levelConfig.name}`
    };
  }, [basicStats, advancedMetrics, gameState.streak, levelConfig]);

  // Obtener estadísticas para el final del juego
  const getFinalStats = useCallback(() => {
    const isCompleted = progress.isComplete;
    const timeBonus = isCompleted ? gameState.timeRemaining * 10 : 0;
    const finalScore = gameState.score + timeBonus;
    
    return {
      completed: isCompleted,
      finalScore,
      timeBonus,
      totalMoves: basicStats.moves,
      accuracy: advancedMetrics.accuracy,
      timeElapsed: advancedMetrics.timeElapsed,
      performance,
      level: gameState.level,
      theme: gameState.theme
    };
  }, [progress, gameState, basicStats, advancedMetrics, performance]);

  // Verificar si se alcanzó un nuevo récord
  const checkNewRecord = useCallback(() => {
    // Aquí se implementaría la lógica para verificar récords
    // Por ahora retornamos false
    return {
      isNewRecord: false,
      recordType: null, // 'score', 'time', 'accuracy'
      previousRecord: null,
      newRecord: null
    };
  }, []);

  return {
    // Estadísticas básicas
    basicStats,
    progress,
    levelConfig,
    
    // Métricas avanzadas
    advancedMetrics,
    performance,
    levelComparison,
    
    // Funciones utilitarias
    getFormattedStats,
    getFinalStats,
    checkNewRecord,
    
    // Estados calculados
    isPerformingWell: performance.stars >= 3,
    needsImprovement: advancedMetrics.accuracy < 50,
    isSpeedRun: advancedMetrics.timeEfficiency > 30,
    isPerfectGame: advancedMetrics.accuracy === 100 && progress.isComplete
  };
}
