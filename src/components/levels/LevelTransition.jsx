/**
 * Componente de transición entre niveles
 */

import React, { useState, useEffect } from 'react';
import { getLevelConfig } from '../../types/levels.js';

/**
 * Componente de transición que se muestra al completar un nivel
 */
const LevelTransition = ({ 
  currentLevel,
  nextLevel,
  gameResult,
  onContinue,
  onReplay,
  onSelectLevel,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('entering');

  const currentLevelConfig = getLevelConfig(currentLevel);
  const nextLevelConfig = nextLevel ? getLevelConfig(nextLevel) : null;
  const isLastLevel = currentLevel === 5;

  useEffect(() => {
    // Animación de entrada
    const timer1 = setTimeout(() => setAnimationPhase('showing'), 300);
    const timer2 = setTimeout(() => setShowDetails(true), 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getPerformanceRating = (accuracy, timeBonus) => {
    if (accuracy === 100 && timeBonus > 0.8) return { rating: 'Perfecto', stars: 5, color: 'text-yellow-600' };
    if (accuracy >= 90) return { rating: 'Excelente', stars: 4, color: 'text-green-600' };
    if (accuracy >= 75) return { rating: 'Muy Bueno', stars: 3, color: 'text-blue-600' };
    if (accuracy >= 60) return { rating: 'Bueno', stars: 2, color: 'text-orange-600' };
    return { rating: 'Regular', stars: 1, color: 'text-red-600' };
  };

  const performance = getPerformanceRating(
    gameResult.accuracy || 0, 
    gameResult.timeBonus || 0
  );

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className={`bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-500 ${
        animationPhase === 'entering' ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {gameResult.completed ? '🎉' : '⏰'}
            </div>
            <h2 className="text-2xl font-bold mb-1">
              {gameResult.completed ? '¡Nivel Completado!' : '¡Tiempo Agotado!'}
            </h2>
            <p className="text-blue-100">
              Nivel {currentLevel}: {currentLevelConfig.name}
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          {/* Estadísticas del juego */}
          <div className={`transition-all duration-500 ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            
            {/* Rating de rendimiento */}
            <div className="text-center mb-6">
              <div className={`text-xl font-bold ${performance.color} mb-2`}>
                {performance.rating}
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < performance.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Grid de estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {gameResult.score?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-blue-800">Puntuación</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {gameResult.accuracy || 0}%
                </div>
                <div className="text-sm text-green-800">Precisión</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {gameResult.moves || 0}
                </div>
                <div className="text-sm text-yellow-800">Movimientos</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {gameResult.timeUsed ? 
                    `${Math.floor(gameResult.timeUsed / 60)}:${(gameResult.timeUsed % 60).toString().padStart(2, '0')}` : 
                    '--:--'
                  }
                </div>
                <div className="text-sm text-purple-800">Tiempo</div>
              </div>
            </div>

            {/* Desglose de puntuación */}
            {gameResult.completed && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Desglose de Puntuación</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Puntos base:</span>
                    <span className="font-medium">{gameResult.baseScore || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonus de tiempo:</span>
                    <span className="font-medium">+{gameResult.timeBonusScore || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonus de racha:</span>
                    <span className="font-medium">+{gameResult.streakBonusScore || 0}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total:</span>
                    <span>{gameResult.score?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Información del siguiente nivel */}
            {gameResult.completed && nextLevelConfig && !isLastLevel && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6 border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🚀 Siguiente Nivel Desbloqueado
                </h4>
                <div className="text-sm text-gray-600 mb-3">
                  <strong>Nivel {nextLevel}: {nextLevelConfig.name}</strong>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-gray-800">{nextLevelConfig.cards}</div>
                    <div className="text-gray-600">Cartas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-800">
                      {Math.floor(nextLevelConfig.time / 60)}:{(nextLevelConfig.time % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-gray-600">Tiempo</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-800">{nextLevelConfig.difficulty}</div>
                    <div className="text-gray-600">Dificultad</div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje de finalización */}
            {gameResult.completed && isLastLevel && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-6 border border-yellow-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">👑</div>
                  <h4 className="font-bold text-yellow-800 mb-2">
                    ¡Felicidades! Has completado todos los niveles
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Eres un verdadero maestro del juego de memoria dimensional
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            
            {/* Botón principal */}
            {gameResult.completed && nextLevelConfig && !isLastLevel ? (
              <button
                onClick={() => onContinue && onContinue(nextLevel)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                🚀 Continuar al Nivel {nextLevel}
              </button>
            ) : (
              <button
                onClick={() => onSelectLevel && onSelectLevel()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                📋 Seleccionar Nivel
              </button>
            )}

            {/* Botón de repetir */}
            <button
              onClick={() => onReplay && onReplay(currentLevel)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              🔄 Repetir Nivel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelTransition;
