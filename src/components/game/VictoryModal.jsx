/**
 * Modal de Victoria - Muestra resultados al completar un nivel
 * Developer 2 - Sprint 3
 */

import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const VictoryModal = ({ 
  isOpen, 
  onClose, 
  gameResult, 
  onNextLevel, 
  onRetry,
  onBackToHome,
  isLastLevel = false,
  canGoToNextLevel = true,
  nextLevelRequirements = null,
  currentScore = 0,
  currentAccuracy = 0
}) => {
  if (!gameResult) return null;

  const {
    score = 0,
    accuracy = 0,
    timeUsed = 0,
    moves = 0,
    matchedPairs = 0,
    totalPairs = 0,
    level = 1,
    timeBonusScore = 0,
    streakBonusScore = 0,
    baseScore = 0
  } = gameResult;

  // Calcular calificación con estrellas
  const getStarRating = () => {
    if (accuracy === 100) return 3;
    if (accuracy >= 80) return 2;
    return 1;
  };

  const stars = getStarRating();

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title=""
      size="large"
    >
      <div className="text-center py-6">
        {/* Título de Victoria */}
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {isLastLevel ? '¡Juego Completado!' : '¡Nivel Completado!'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isLastLevel 
              ? '¡Has completado todos los niveles!' 
              : `Nivel ${level} superado`
            }
          </p>
        </div>

        {/* Estrellas */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((star) => (
            <div
              key={star}
              className={`text-5xl ${
                star <= stars ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              ⭐
            </div>
          ))}
        </div>

        {/* Puntuación Principal */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6">
          <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
            {score.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Puntos Totales
          </div>
        </div>

        {/* Estadísticas Detalladas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {accuracy}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Precisión
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatTime(timeUsed)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Tiempo
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {moves}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Movimientos
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {matchedPairs}/{totalPairs}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Pares
            </div>
          </div>
        </div>

        {/* Desglose de Puntuación */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
            Desglose de Puntuación
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Puntuación Base:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">+{baseScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Bonus de Tiempo:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">+{timeBonusScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Bonus de Racha:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">+{streakBonusScore}</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between font-bold">
              <span className="text-gray-800 dark:text-gray-200">Total:</span>
              <span className="text-green-600 dark:text-green-400">{score}</span>
            </div>
          </div>
        </div>

        {/* Mensaje de requisitos no cumplidos */}
        {!isLastLevel && onNextLevel && !canGoToNextLevel && nextLevelRequirements && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔒</div>
              <div className="flex-1">
                <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">
                  Siguiente Nivel Bloqueado
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                  Para desbloquear el siguiente nivel necesitas cumplir estos requisitos:
                </p>
                <div className="space-y-2">
                  {/* Requisito de puntuación */}
                  {nextLevelRequirements.minScore > 0 && (
                    <div className={`flex items-center gap-2 text-sm ${
                      currentScore >= nextLevelRequirements.minScore
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}>
                      <span className="text-lg">
                        {currentScore >= nextLevelRequirements.minScore ? '✅' : '❌'}
                      </span>
                      <span className="font-medium">
                        Puntuación mínima: {nextLevelRequirements.minScore.toLocaleString()}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        (Tienes: {currentScore.toLocaleString()})
                      </span>
                    </div>
                  )}
                  
                  {/* Requisito de precisión */}
                  {nextLevelRequirements.minAccuracy > 0 && (
                    <div className={`flex items-center gap-2 text-sm ${
                      currentAccuracy >= nextLevelRequirements.minAccuracy
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}>
                      <span className="text-lg">
                        {currentAccuracy >= nextLevelRequirements.minAccuracy ? '✅' : '❌'}
                      </span>
                      <span className="font-medium">
                        Precisión mínima: {nextLevelRequirements.minAccuracy}%
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        (Tienes: {currentAccuracy}%)
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-medium">
                  💡 Intenta jugar de nuevo para mejorar tu puntuación
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isLastLevel && onNextLevel && (
            <Button
              onClick={onNextLevel}
              variant="primary"
              size="large"
              className={
                canGoToNextLevel
                  ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                  : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50"
              }
              disabled={!canGoToNextLevel}
            >
              {canGoToNextLevel ? '➡️ Siguiente Nivel' : '🔒 Nivel Bloqueado'}
            </Button>
          )}
          
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="large"
            >
              🔄 Jugar de Nuevo
            </Button>
          )}

          <Button
            onClick={onBackToHome}
            variant="outline"
            size="large"
          >
            🏠 Menú Principal
          </Button>
        </div>

        {/* Mensaje especial para último nivel */}
        {isLastLevel && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
              🏆 ¡Felicidades! Has demostrado ser un maestro de la memoria
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VictoryModal;

