/**
 * Componente integrado de juego con sistema de niveles
 */

import React, { useState } from 'react';
import { GameProvider } from '../../contexts/GameContext.jsx';
import { useLevelProgress } from '../../hooks/useLevelProgress.js';
import { THEMES } from '../../types/character.js';
import LevelSelector from '../levels/LevelSelector.jsx';
import GameBoard from './GameBoard.jsx';
import LevelTransition from '../levels/LevelTransition.jsx';

/**
 * Estados del componente integrado
 */
const GAME_STATES = {
  LEVEL_SELECT: 'level_select',
  PLAYING: 'playing',
  LEVEL_COMPLETE: 'level_complete',
  GAME_OVER: 'game_over'
};

/**
 * Componente principal integrado
 */
const LevelGame = () => {
  const {
    playerProgress,
    updateLevelProgress,
    getLevelStats
  } = useLevelProgress();

  const [gameState, setGameState] = useState(GAME_STATES.LEVEL_SELECT);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentTheme, setCurrentTheme] = useState(THEMES.RICK_MORTY);
  const [lastGameResult, setLastGameResult] = useState(null);

  /**
   * Maneja la selección de nivel desde LevelSelector
   */
  const handleLevelSelect = (levelId) => {
    setCurrentLevel(levelId);
    setGameState(GAME_STATES.PLAYING);
  };

  /**
   * Maneja la finalización del juego desde GameBoard
   */
  const handleGameComplete = (gameResult) => {
    // Si el usuario hizo clic en "Siguiente nivel"
    if (gameResult.advanceToNext && gameResult.level < 5) {
      const nextLevel = gameResult.level + 1;
      setCurrentLevel(nextLevel);
      setGameState(GAME_STATES.PLAYING);
      setLastGameResult(null);
      return;
    }

    // Actualizar progreso del nivel
    updateLevelProgress(currentLevel, gameResult);

    // Guardar resultado para la transición
    setLastGameResult(gameResult);

    if (gameResult.completed) {
      setGameState(GAME_STATES.LEVEL_COMPLETE);
    } else {
      setGameState(GAME_STATES.GAME_OVER);
    }
  };

  /**
   * Maneja la transición al siguiente nivel
   */
  const handleContinueToNext = (nextLevel) => {
    setCurrentLevel(nextLevel);
    setGameState(GAME_STATES.PLAYING);
    setLastGameResult(null);
  };

  /**
   * Maneja repetir el nivel actual
   */
  const handleReplayLevel = (levelId) => {
    setCurrentLevel(levelId);
    setGameState(GAME_STATES.PLAYING);
    setLastGameResult(null);
  };

  /**
   * Maneja volver al selector de niveles
   */
  const handleBackToLevelSelect = () => {
    setGameState(GAME_STATES.LEVEL_SELECT);
    setLastGameResult(null);
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Selector de niveles */}
        {gameState === GAME_STATES.LEVEL_SELECT && (
          <div className="py-8">
            <LevelSelector
              onLevelSelect={handleLevelSelect}
              currentLevel={currentLevel}
              playerProgress={playerProgress}
            />
          </div>
        )}

        {/* Juego activo */}
        {gameState === GAME_STATES.PLAYING && (
          <GameBoard
            theme={currentTheme}
            level={currentLevel}
            onGameComplete={handleGameComplete}
          />
        )}

        {/* Transición de nivel completado */}
        {gameState === GAME_STATES.LEVEL_COMPLETE && lastGameResult && (
          <LevelTransition
            currentLevel={currentLevel}
            nextLevel={currentLevel < 5 ? currentLevel + 1 : null}
            gameResult={lastGameResult}
            onContinue={handleContinueToNext}
            onReplay={handleReplayLevel}
            onSelectLevel={handleBackToLevelSelect}
          />
        )}

        {/* Transición de game over */}
        {gameState === GAME_STATES.GAME_OVER && lastGameResult && (
          <LevelTransition
            currentLevel={currentLevel}
            nextLevel={null}
            gameResult={lastGameResult}
            onContinue={handleBackToLevelSelect}
            onReplay={handleReplayLevel}
            onSelectLevel={handleBackToLevelSelect}
          />
        )}
      </div>
    </GameProvider>
  );
};

/**
 * Componente wrapper para testing
 */
const LevelGameTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 Memory Game - Nivel Completo
          </h1>
          <p className="text-gray-600">
            Prueba completa del juego con sistema de niveles integrado
          </p>
        </div>

        {/* Información del sistema */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🆕 Nueva Versión - Sistema de Niveles Integrado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Funcionalidades Nuevas:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>✓ Sistema de progresión entre niveles</li>
                <li>✓ Desbloqueo basado en rendimiento</li>
                <li>✓ Estadísticas persistentes</li>
                <li>✓ Logros y badges automáticos</li>
                <li>✓ Transiciones animadas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Cómo Probar:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>1. Selecciona un nivel disponible</li>
                <li>2. Juega y completa el nivel</li>
                <li>3. Usa "Siguiente Nivel" para progresar</li>
                <li>4. Observa el progreso guardado</li>
                <li>5. Intenta niveles bloqueados</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Componente integrado */}
        <LevelGame />

        {/* Información adicional de testing */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            ✅ Integración Completa
          </h3>
          <p className="text-sm text-green-700 mb-4">
            Este componente integra completamente el sistema de niveles con la lógica del juego existente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded">
              <div className="font-medium text-gray-800">GameContext</div>
              <div className="text-xs text-gray-600">Estado global del juego</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="font-medium text-gray-800">Level Progress</div>
              <div className="text-xs text-gray-600">Sistema de niveles</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="font-medium text-gray-800">GameBoard</div>
              <div className="text-xs text-gray-600">Tablero del juego</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelGameTest;
