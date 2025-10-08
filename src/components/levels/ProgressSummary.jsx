/**
 * Componente de resumen de progreso general
 */

import React from 'react';

/**
 * Resumen del progreso general del jugador
 */
const ProgressSummary = ({ 
  progress, 
  onToggleDetails, 
  showDetails = false,
  className = '' 
}) => {
  const {
    totalLevels,
    completedLevels,
    perfectLevels,
    completionPercentage,
    perfectPercentage,
    totalScore,
    averageScore
  } = progress;

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPlayerRank = (completionPercentage, perfectPercentage) => {
    if (perfectPercentage >= 80) return { rank: 'Maestro', icon: '👑', color: 'text-yellow-600' };
    if (completionPercentage >= 80) return { rank: 'Experto', icon: '🏆', color: 'text-purple-600' };
    if (completionPercentage >= 60) return { rank: 'Avanzado', icon: '🥇', color: 'text-blue-600' };
    if (completionPercentage >= 40) return { rank: 'Intermedio', icon: '🥈', color: 'text-green-600' };
    if (completionPercentage >= 20) return { rank: 'Principiante', icon: '🥉', color: 'text-orange-600' };
    return { rank: 'Novato', icon: '🎮', color: 'text-gray-600' };
  };

  const playerRank = getPlayerRank(completionPercentage, perfectPercentage);

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {/* Header compacto */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleDetails}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Rango del jugador */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{playerRank.icon}</span>
              <div>
                <div className={`font-bold ${playerRank.color}`}>
                  {playerRank.rank}
                </div>
                <div className="text-sm text-gray-600">
                  {completedLevels}/{totalLevels} niveles
                </div>
              </div>
            </div>

            {/* Barra de progreso principal */}
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso General</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(completionPercentage)}`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Puntuación total */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                {totalScore.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Puntos totales
              </div>
            </div>
          </div>

          {/* Indicador de expansión */}
          <div className="ml-4">
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                showDetails ? 'rotate-180' : ''
              }`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {/* Estadística: Niveles completados */}
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {completedLevels}
              </div>
              <div className="text-sm text-blue-800">
                Completados
              </div>
              <div className="text-xs text-blue-600">
                de {totalLevels} totales
              </div>
            </div>

            {/* Estadística: Niveles perfectos */}
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {perfectLevels}
              </div>
              <div className="text-sm text-yellow-800">
                Perfectos
              </div>
              <div className="text-xs text-yellow-600">
                {perfectPercentage}% del total
              </div>
            </div>

            {/* Estadística: Puntuación promedio */}
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {averageScore.toLocaleString()}
              </div>
              <div className="text-sm text-green-800">
                Promedio
              </div>
              <div className="text-xs text-green-600">
                por nivel
              </div>
            </div>

            {/* Estadística: Eficiencia */}
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((perfectLevels / Math.max(completedLevels, 1)) * 100)}%
              </div>
              <div className="text-sm text-purple-800">
                Eficiencia
              </div>
              <div className="text-xs text-purple-600">
                perfectos/completados
              </div>
            </div>
          </div>

          {/* Logros y badges */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Logros Desbloqueados</h4>
            <div className="flex flex-wrap gap-2">
              {completedLevels >= 1 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  🎯 Primer Nivel
                </span>
              )}
              {completedLevels >= 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  🔥 En Racha
                </span>
              )}
              {perfectLevels >= 1 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  ⭐ Perfeccionista
                </span>
              )}
              {completedLevels === totalLevels && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  👑 Completista
                </span>
              )}
              {perfectLevels === totalLevels && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800">
                  🏆 Maestro Absoluto
                </span>
              )}
              {completedLevels === 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  🎮 ¡Comienza tu aventura!
                </span>
              )}
            </div>
          </div>

          {/* Próximo objetivo */}
          {completedLevels < totalLevels && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">🎯</span>
                <div>
                  <div className="text-sm font-medium text-blue-800">
                    Próximo Objetivo
                  </div>
                  <div className="text-xs text-blue-600">
                    {completedLevels === 0 
                      ? 'Completa tu primer nivel para comenzar'
                      : `Completa el nivel ${completedLevels + 1} para continuar tu progreso`
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressSummary;
