/**
 * Componente de carta individual de nivel
 */

import React from 'react';
import { UNLOCK_STATUS } from '../../types/levels.js';

/**
 * Carta de nivel individual
 */
const LevelCard = ({ 
  level, 
  status, 
  isSelected = false, 
  progress = null, 
  onClick 
}) => {
  const isLocked = status === UNLOCK_STATUS.LOCKED;
  const isCompleted = status === UNLOCK_STATUS.COMPLETED || status === UNLOCK_STATUS.PERFECT;
  const isPerfect = status === UNLOCK_STATUS.PERFECT;

  // Clases CSS dinámicas
  const cardClasses = [
    'relative p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer',
    'hover:shadow-lg transform hover:-translate-y-1',
    isLocked && 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60',
    !isLocked && !isSelected && 'bg-white border-gray-200 hover:border-blue-300',
    isSelected && 'bg-blue-50 border-blue-500 shadow-lg',
    isCompleted && !isSelected && 'bg-green-50 border-green-300',
    isPerfect && !isSelected && 'bg-yellow-50 border-yellow-400'
  ].filter(Boolean).join(' ');

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      case 'expert': return '🟣';
      default: return '⚪';
    }
  };

  const getStatusIcon = () => {
    if (isLocked) return '🔒';
    if (isPerfect) return '⭐';
    if (isCompleted) return '✅';
    return '🎮';
  };

  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick(level.id);
    }
  };

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-label={`Nivel ${level.id}: ${level.name}`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Header del nivel */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <h3 className={`text-lg font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
              Nivel {level.id}
            </h3>
            <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
              {level.name}
            </p>
          </div>
        </div>
        <span className="text-xl" title={`Dificultad: ${level.difficulty}`}>
          {getDifficultyIcon(level.difficulty)}
        </span>
      </div>

      {/* Estadísticas del nivel */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className={`text-center p-2 rounded ${isLocked ? 'bg-gray-200' : 'bg-gray-100'}`}>
          <div className={isLocked ? 'text-gray-400' : 'text-gray-600'}>Cartas</div>
          <div className={`font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
            {level.cards}
          </div>
        </div>
        <div className={`text-center p-2 rounded ${isLocked ? 'bg-gray-200' : 'bg-gray-100'}`}>
          <div className={isLocked ? 'text-gray-400' : 'text-gray-600'}>Tiempo</div>
          <div className={`font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
            {Math.floor(level.time / 60)}:{(level.time % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Progreso personal */}
      {progress && !isLocked && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Mejor puntuación</span>
            <span className="text-xs font-bold text-gray-800">
              {progress.bestScore?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Precisión</span>
            <span className="text-xs font-bold text-gray-800">
              {progress.bestAccuracy || 0}%
            </span>
          </div>
        </div>
      )}

      {/* Barra de progreso */}
      {!isLocked && (
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isPerfect ? 'bg-yellow-400' : 
                isCompleted ? 'bg-green-400' : 
                'bg-blue-400'
              }`}
              style={{ 
                width: progress ? 
                  `${Math.min(100, (progress.bestAccuracy || 0))}%` : 
                  '0%' 
              }}
            />
          </div>
        </div>
      )}

      {/* Descripción */}
      <p className={`text-xs ${isLocked ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
        {level.description}
      </p>

      {/* Indicadores especiales */}
      <div className="flex gap-1 mt-3">
        {level.hints?.available && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            💡 {level.hints.maxHints} pistas
          </span>
        )}
        {level.special?.shuffleOnMatch && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
            🔀 Especial
          </span>
        )}
      </div>

      {/* Overlay para niveles bloqueados */}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-10 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-sm font-medium text-gray-600">
              Completa el nivel anterior
            </div>
          </div>
        </div>
      )}

      {/* Efecto de brillo para niveles perfectos */}
      {isPerfect && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 opacity-20 rounded-lg animate-pulse" />
      )}
    </div>
  );
};

export default LevelCard;
