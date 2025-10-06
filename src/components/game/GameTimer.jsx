/**
 * Componente del timer del juego
 */

import React from 'react';

/**
 * Componente del timer
 */
const GameTimer = ({ 
  time, 
  percentage, 
  isCritical = false, 
  isWarning = false, 
  isActive = false,
  onToggle 
}) => {
  // Clases CSS dinámicas para el timer
  const timerClasses = [
    'flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300',
    isCritical && 'border-red-400 bg-red-50 text-red-800',
    isWarning && !isCritical && 'border-yellow-400 bg-yellow-50 text-yellow-800',
    !isWarning && !isCritical && 'border-gray-300 bg-white text-gray-800'
  ].filter(Boolean).join(' ');

  // Color de la barra de progreso
  const getProgressColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={timerClasses}>
      {/* Icono del timer */}
      <div className="flex-shrink-0">
        {isActive ? (
          <svg 
            className={`w-6 h-6 ${isCritical ? 'animate-pulse' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* Información del tiempo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">
            {isCritical ? '¡Tiempo crítico!' : isWarning ? 'Tiempo limitado' : 'Tiempo restante'}
          </span>
          <span className="text-lg font-bold font-mono">
            {time}
          </span>
        </div>

        {/* Barra de progreso del tiempo */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
            style={{ width: `${Math.max(0, percentage)}%` }}
          />
        </div>
      </div>

      {/* Botón de pausa/play (opcional) */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
          title={isActive ? 'Pausar' : 'Continuar'}
        >
          {isActive ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}

      {/* Indicador de estado crítico */}
      {isCritical && (
        <div className="flex-shrink-0">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
};

export default GameTimer;
