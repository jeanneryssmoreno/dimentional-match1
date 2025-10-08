/**
 * Componente de puntuación avanzada con efectos visuales
 */

import React, { useEffect, useState } from 'react';

const ScoreDisplay = ({ 
  score, 
  moves, 
  matchedPairs, 
  totalPairs, 
  timeBonus = 0,
  streakBonus = 0,
  accuracy = 0,
  className = '' 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showScoreIncrease, setShowScoreIncrease] = useState(false);
  const [scoreIncrease, setScoreIncrease] = useState(0);

  // Animar el cambio de puntuación
  useEffect(() => {
    if (score > animatedScore) {
      const difference = score - animatedScore;
      setScoreIncrease(difference);
      setShowScoreIncrease(true);
      
      // Animar incremento gradual
      const duration = 500;
      const steps = 20;
      const increment = difference / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedScore(prev => {
          const newScore = prev + increment;
          return currentStep >= steps ? score : newScore;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setTimeout(() => setShowScoreIncrease(false), 1000);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [score, animatedScore]);

  const progressPercentage = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;
  const accuracyColor = accuracy >= 80 ? 'text-green-500' : accuracy >= 60 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-4 text-white shadow-xl ${className}`}>
      {/* Puntuación principal */}
      <div className="text-center mb-4 relative">
        <h3 className="text-sm font-bold mb-1 opacity-90">PUNTUACIÓN</h3>
        <div className="relative">
          <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {Math.floor(animatedScore).toLocaleString()}
          </div>
          
          {/* Animación de incremento */}
          {showScoreIncrease && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
              <span className="text-green-400 font-bold text-lg">
                +{scoreIncrease.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas en grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {/* Movimientos */}
        <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-lg font-bold text-blue-300">{moves}</div>
          <div className="text-xs opacity-80">Movimientos</div>
        </div>

        {/* Pares encontrados */}
        <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-lg font-bold text-green-300">{matchedPairs}/{totalPairs}</div>
          <div className="text-xs opacity-80">Pares</div>
        </div>

        {/* Precisión */}
        <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
          <div className={`text-lg font-bold ${accuracyColor}`}>{accuracy.toFixed(1)}%</div>
          <div className="text-xs opacity-80">Precisión</div>
        </div>

        {/* Bonus total */}
        <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-lg font-bold text-yellow-300">+{(timeBonus + streakBonus).toLocaleString()}</div>
          <div className="text-xs opacity-80">Bonus</div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="opacity-90">Progreso</span>
          <span className="font-bold">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Efecto de brillo en la barra */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Indicadores de rendimiento */}
      <div className="flex justify-center gap-1">
        {accuracy >= 90 && <span className="text-yellow-300 text-lg" title="Precisión excepcional">🏆</span>}
        {moves <= totalPairs * 1.5 && <span className="text-green-300 text-lg" title="Eficiencia perfecta">⚡</span>}
        {matchedPairs === totalPairs && <span className="text-purple-300 text-lg" title="Juego completado">🎯</span>}
        {timeBonus > 0 && <span className="text-blue-300 text-lg" title="Bonus de tiempo">⏰</span>}
      </div>
    </div>
  );
};

export default ScoreDisplay;
