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
    <div className={`relative ${className}`}>
      {/* Efectos de borde neón */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl rounded-3xl animate-pulse"></div>
      
      <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 shadow-xl">
        {/* Header compacto */}
        <div 
          className="p-6 cursor-pointer hover:bg-white/5 transition-colors rounded-t-3xl"
          onClick={onToggleDetails}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Rango del jugador */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 blur-lg rounded-full animate-pulse"></div>
                  <span className="relative text-4xl animate-bounce">{playerRank.icon}</span>
                </div>
                <div>
                  <div className={`text-xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent`}>
                    {playerRank.rank}
                  </div>
                  <div className="text-sm text-white/80 font-semibold">
                    {completedLevels}/{totalLevels} niveles completados
                  </div>
                </div>
              </div>

              {/* Barra de progreso principal */}
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-sm text-white/90 mb-2 font-semibold">
                  <span>🎯 Progreso General</span>
                  <span className="text-yellow-300">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 shadow-lg relative`}
                    style={{ width: `${completionPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Puntuación total */}
              <div className="text-right">
                <div className="text-2xl font-black text-white bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  {totalScore.toLocaleString()}
                </div>
                <div className="text-sm text-white/80 font-semibold">
                  ⭐ Puntos totales
                </div>
              </div>
            </div>

            {/* Indicador de expansión */}
            <div className="ml-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 blur-md rounded-full animate-pulse"></div>
                <svg 
                  className={`relative w-6 h-6 text-white/80 transition-transform duration-300 ${
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
        </div>

        {/* Detalles expandibles */}
        {showDetails && (
          <div className="px-6 pb-6 border-t border-white/10 rounded-b-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {/* Estadística: Niveles completados */}
              <div className="text-center p-4 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl border border-blue-400/20">
                <div className="text-3xl font-black text-blue-300">
                  {completedLevels}
                </div>
                <div className="text-sm text-blue-200 font-semibold">
                  Completados
                </div>
                <div className="text-xs text-blue-300/80">
                  de {totalLevels} totales
                </div>
              </div>

              {/* Estadística: Niveles perfectos */}
              <div className="text-center p-4 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl border border-yellow-400/20">
                <div className="text-3xl font-black text-yellow-300">
                  {perfectLevels}
                </div>
                <div className="text-sm text-yellow-200 font-semibold">
                  Perfectos
                </div>
                <div className="text-xs text-yellow-300/80">
                  {perfectPercentage}% del total
                </div>
              </div>

              {/* Estadística: Puntuación promedio */}
              <div className="text-center p-4 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-green-400/20">
                <div className="text-3xl font-black text-green-300">
                  {averageScore.toLocaleString()}
                </div>
                <div className="text-sm text-green-200 font-semibold">
                  Promedio
                </div>
                <div className="text-xs text-green-300/80">
                  por nivel
                </div>
              </div>

              {/* Estadística: Eficiencia */}
              <div className="text-center p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl border border-purple-400/20">
                <div className="text-3xl font-black text-purple-300">
                  {Math.round((perfectLevels / Math.max(completedLevels, 1)) * 100)}%
                </div>
                <div className="text-sm text-purple-200 font-semibold">
                  Eficiencia
                </div>
                <div className="text-xs text-purple-300/80">
                  perfectos/completados
                </div>
              </div>
            </div>

            {/* Logros y badges */}
            <div className="mt-6">
              <h4 className="text-lg font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="text-xl">🏆</span>
                Logros Desbloqueados
              </h4>
              <div className="flex flex-wrap gap-3">
                {completedLevels >= 1 && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-blue-100 border border-blue-400/30 backdrop-blur-sm">
                    🎯 Primer Nivel
                  </span>
                )}
                {completedLevels >= 3 && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-green-100 border border-green-400/30 backdrop-blur-sm">
                    🔥 En Racha
                  </span>
                )}
                {perfectLevels >= 1 && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-yellow-600/80 to-orange-600/80 text-yellow-100 border border-yellow-400/30 backdrop-blur-sm">
                    ⭐ Perfeccionista
                  </span>
                )}
                {completedLevels === totalLevels && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-purple-100 border border-purple-400/30 backdrop-blur-sm">
                    👑 Completista
                  </span>
                )}
                {perfectLevels === totalLevels && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-yellow-600/80 via-orange-600/80 to-red-600/80 text-yellow-100 border border-yellow-400/30 backdrop-blur-sm animate-pulse">
                    🏆 Maestro Absoluto
                  </span>
                )}
                {completedLevels === 0 && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-gray-600/80 to-slate-600/80 text-gray-100 border border-gray-400/30 backdrop-blur-sm">
                    🎮 ¡Comienza tu aventura!
                  </span>
                )}
              </div>
            </div>

            {/* Próximo objetivo */}
            {completedLevels < totalLevels && (
              <div className="mt-6 relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-lg rounded-2xl animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-blue-400/30">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-md rounded-full animate-pulse"></div>
                      <span className="relative text-2xl">🎯</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-200">
                        Próximo Objetivo
                      </div>
                      <div className="text-sm text-blue-300/90">
                        {completedLevels === 0 
                          ? '¡Completa tu primer nivel para comenzar la aventura!'
                          : `Completa el nivel ${completedLevels + 1} para continuar tu épica travesía`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressSummary;
