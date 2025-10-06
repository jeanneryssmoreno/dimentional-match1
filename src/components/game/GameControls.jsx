/**
 * Componente de controles del juego
 */

import React from 'react';
import { GAME_STATES } from '../../types/game.js';

/**
 * Componente de controles del juego
 */
const GameControls = ({ 
  gameState, 
  onStart, 
  onRestart, 
  onPause, 
  isLoading = false 
}) => {
  const { status } = gameState;

  // Botón principal basado en el estado del juego
  const renderPrimaryButton = () => {
    if (isLoading) {
      return (
        <button
          disabled
          className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Cargando...
        </button>
      );
    }

    switch (status) {
      case GAME_STATES.IDLE:
        return (
          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Iniciar Juego
          </button>
        );

      case GAME_STATES.PLAYING:
        return (
          <button
            onClick={onPause}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pausar
          </button>
        );

      case GAME_STATES.PAUSED:
        return (
          <button
            onClick={onPause}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Continuar
          </button>
        );

      case GAME_STATES.COMPLETED:
      case GAME_STATES.GAME_OVER:
        return (
          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Nuevo Juego
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
      {/* Botón principal */}
      {renderPrimaryButton()}

      {/* Botón de reinicio (solo si el juego está activo) */}
      {(status === GAME_STATES.PLAYING || status === GAME_STATES.PAUSED) && (
        <button
          onClick={onRestart}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reiniciar
        </button>
      )}

      {/* Indicador de estado */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        <span className="capitalize">{getStatusText(status)}</span>
      </div>
    </div>
  );
};

/**
 * Obtiene el color del indicador de estado
 */
function getStatusColor(status) {
  switch (status) {
    case GAME_STATES.IDLE:
      return 'bg-gray-400';
    case GAME_STATES.PLAYING:
      return 'bg-green-400 animate-pulse';
    case GAME_STATES.PAUSED:
      return 'bg-yellow-400';
    case GAME_STATES.COMPLETED:
      return 'bg-blue-400';
    case GAME_STATES.GAME_OVER:
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
}

/**
 * Obtiene el texto del estado
 */
function getStatusText(status) {
  switch (status) {
    case GAME_STATES.IDLE:
      return 'Listo para jugar';
    case GAME_STATES.PLAYING:
      return 'Jugando';
    case GAME_STATES.PAUSED:
      return 'Pausado';
    case GAME_STATES.COMPLETED:
      return 'Completado';
    case GAME_STATES.GAME_OVER:
      return 'Tiempo agotado';
    default:
      return 'Desconocido';
  }
}

export default GameControls;
