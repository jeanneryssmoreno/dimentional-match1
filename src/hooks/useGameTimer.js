/**
 * Hook para manejar el timer del juego
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import { formatTime, getTimerStatus } from '../utils/gameUtils.js';
import { TIMER_CONFIG, GAME_STATES } from '../types/game.js';

/**
 * Hook para el timer del juego
 * @returns {Object} Estado y funciones del timer
 */
export function useGameTimer() {
  const { gameState, pauseGame, resumeGame } = useGame();
  
  const {
    timeRemaining,
    isTimerActive,
    status: gameStatus
  } = gameState;

  // Formatear tiempo restante
  const formattedTime = useMemo(() => {
    return formatTime(timeRemaining);
  }, [timeRemaining]);

  // Estado del timer (normal, warning, critical)
  const timerStatus = useMemo(() => {
    const levelConfig = { time: 120 }; // Default, should get from level config
    return getTimerStatus(timeRemaining, levelConfig.time);
  }, [timeRemaining]);

  // Porcentaje de tiempo restante
  const timePercentage = useMemo(() => {
    const levelConfig = { time: 120 }; // Default, should get from level config
    return Math.max(0, (timeRemaining / levelConfig.time) * 100);
  }, [timeRemaining]);

  // Verificar si el tiempo está en estado crítico
  const isCritical = useMemo(() => {
    return timeRemaining <= TIMER_CONFIG.CRITICAL_THRESHOLD;
  }, [timeRemaining]);

  // Verificar si el tiempo está en estado de advertencia
  const isWarning = useMemo(() => {
    return timeRemaining <= TIMER_CONFIG.WARNING_THRESHOLD && timeRemaining > TIMER_CONFIG.CRITICAL_THRESHOLD;
  }, [timeRemaining]);

  // Pausar timer
  const pauseTimer = useCallback(() => {
    if (gameStatus === GAME_STATES.PLAYING) {
      pauseGame();
    }
  }, [gameStatus, pauseGame]);

  // Reanudar timer
  const resumeTimer = useCallback(() => {
    if (gameStatus === GAME_STATES.PAUSED) {
      resumeGame();
    }
  }, [gameStatus, resumeGame]);

  // Toggle pause/resume
  const toggleTimer = useCallback(() => {
    if (isTimerActive) {
      pauseTimer();
    } else if (gameStatus === GAME_STATES.PAUSED) {
      resumeTimer();
    }
  }, [isTimerActive, gameStatus, pauseTimer, resumeTimer]);

  // Efectos de sonido/notificaciones para estados críticos
  useEffect(() => {
    if (isCritical && isTimerActive) {
      // Aquí se podría agregar un sonido de alerta
      console.warn('⚠️ Tiempo crítico:', formattedTime);
    } else if (isWarning && isTimerActive) {
      // Aquí se podría agregar un sonido de advertencia
      console.warn('⏰ Advertencia de tiempo:', formattedTime);
    }
  }, [isCritical, isWarning, isTimerActive, formattedTime]);

  return {
    // Tiempo
    timeRemaining,
    formattedTime,
    timePercentage,
    
    // Estados
    isTimerActive,
    isCritical,
    isWarning,
    timerStatus,
    
    // Acciones
    pauseTimer,
    resumeTimer,
    toggleTimer,
    
    // Configuración
    warningThreshold: TIMER_CONFIG.WARNING_THRESHOLD,
    criticalThreshold: TIMER_CONFIG.CRITICAL_THRESHOLD
  };
}
