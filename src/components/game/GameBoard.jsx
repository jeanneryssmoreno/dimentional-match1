/**
 * Componente principal del tablero de juego
 */

import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic.js';
import { useGameTimer } from '../../hooks/useGameTimer.js';
import { useGameStats } from '../../hooks/useGameStats.js';
import { CARD_STATES, GAME_STATES } from '../../types/game.js';
import GameCard from './GameCard.jsx';
import GameControls from './GameControls.jsx';
import GameStats from './GameStats.jsx';
import GameTimer from './GameTimer.jsx';

/**
 * Componente del tablero de juego
 */
const GameBoard = ({ theme, level = 1 }) => {
  const {
    gameState,
    cards,
    isLoading,
    isGameActive,
    isGameComplete,
    isGameOver,
    handleCardClick,
    startNewGame,
    restartGame,
    togglePause,
    error
  } = useGameLogic(theme, level);

  const {
    formattedTime,
    timePercentage,
    isCritical,
    isWarning,
    toggleTimer
  } = useGameTimer();

  const {
    basicStats,
    progress,
    performance,
    getFormattedStats
  } = useGameStats();

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando personajes...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Error al cargar el juego</h3>
          <p className="mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Calcular grid columns basado en el número de cartas
  const getGridCols = (cardCount) => {
    if (cardCount <= 8) return 'grid-cols-4';
    if (cardCount <= 12) return 'grid-cols-4 md:grid-cols-6';
    return 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8';
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header del juego */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Nivel {level} - {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </h2>
            <p className="text-gray-600">
              Encuentra {basicStats.totalPairs} pares de cartas
            </p>
          </div>
          
          {/* Timer */}
          <GameTimer
            time={formattedTime}
            percentage={timePercentage}
            isCritical={isCritical}
            isWarning={isWarning}
            isActive={isGameActive}
            onToggle={toggleTimer}
          />
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{basicStats.matchedPairs}/{basicStats.totalPairs} pares</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controles del juego */}
      <GameControls
        gameState={gameState}
        onStart={startNewGame}
        onRestart={restartGame}
        onPause={togglePause}
        isLoading={isLoading}
      />

      {/* Estadísticas rápidas */}
      <GameStats
        stats={getFormattedStats()}
        performance={performance}
        className="mb-6"
      />

      {/* Tablero de cartas */}
      <div className="mb-6">
        <div className={`grid ${getGridCols(cards.length)} gap-3 md:gap-4`}>
          {cards.map((card) => (
            <GameCard
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              disabled={!isGameActive || card.state === CARD_STATES.MATCHED}
              className="aspect-square"
            />
          ))}
        </div>
      </div>

      {/* Mensajes de estado */}
      {gameState.status === GAME_STATES.IDLE && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">
            ¡Presiona "Iniciar Juego" para comenzar!
          </p>
        </div>
      )}

      {gameState.status === GAME_STATES.PAUSED && (
        <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-lg text-yellow-800 mb-4">
            Juego pausado
          </p>
          <button
            onClick={togglePause}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Continuar
          </button>
        </div>
      )}

      {isGameComplete && (
        <div className="text-center py-8 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            ¡Felicidades! 🎉
          </h3>
          <p className="text-lg text-green-700 mb-4">
            Completaste el nivel {level} con {basicStats.score} puntos
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={restartGame}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Jugar de nuevo
            </button>
            {level < 5 && (
              <button
                onClick={() => {/* Lógica para siguiente nivel */}}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Siguiente nivel
              </button>
            )}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="text-center py-8 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-2xl font-bold text-red-800 mb-2">
            ¡Tiempo agotado! ⏰
          </h3>
          <p className="text-lg text-red-700 mb-4">
            Encontraste {basicStats.matchedPairs} de {basicStats.totalPairs} pares
          </p>
          <button
            onClick={restartGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
