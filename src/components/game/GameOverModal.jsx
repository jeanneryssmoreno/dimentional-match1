/**
 * Modal de Game Over - Muestra resultados al perder un nivel
 * Developer 2 - Sprint 3
 */

import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const GameOverModal = ({ 
  isOpen, 
  onClose, 
  gameResult, 
  onRetry, 
  onBackToHome,
  bestScore = 0 
}) => {
  if (!gameResult) return null;

  const {
    score = 0,
    accuracy = 0,
    timeUsed = 0,
    moves = 0,
    matchedPairs = 0,
    totalPairs = 0,
    level = 1
  } = gameResult;

  // Calcular progreso
  const progressPercentage = totalPairs > 0 
    ? Math.round((matchedPairs / totalPairs) * 100) 
    : 0;

  // Mensaje motivacional basado en el progreso
  const getMotivationalMessage = () => {
    if (progressPercentage >= 80) return '¡Casi lo logras! Un poco más de velocidad y lo tendrás.';
    if (progressPercentage >= 50) return '¡Buen intento! Estás a medio camino del éxito.';
    if (progressPercentage >= 30) return 'Necesitas más práctica. ¡No te rindas!';
    return 'Comienza con calma y aumenta la velocidad gradualmente.';
  };

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
        {/* Título de Game Over */}
        <div className="mb-6">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            ¡Tiempo Agotado!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No completaste el Nivel {level} a tiempo
          </p>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Progreso del Nivel</span>
            <span>{matchedPairs}/{totalPairs} pares</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage > 15 && (
                <span className="text-xs font-bold text-white">
                  {progressPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje Motivacional */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-300 font-medium">
            💡 {getMotivationalMessage()}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {score.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Puntos Obtenidos
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {bestScore.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mejor Puntuación
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatTime(timeUsed)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tiempo Jugado
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {moves}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Movimientos
            </div>
          </div>
        </div>

        {/* Comparación con mejor resultado */}
        {bestScore > 0 && score < bestScore && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Necesitas <span className="font-bold text-red-600 dark:text-red-400">
                {(bestScore - score).toLocaleString()}
              </span> puntos más para igualar tu mejor marca
            </p>
          </div>
        )}

        {bestScore > 0 && score >= bestScore && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              🎉 ¡Nuevo récord personal! Aunque no completaste el nivel
            </p>
          </div>
        )}

        {/* Tips para mejorar */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">
            💪 Tips para Mejorar
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>✓ Intenta memorizar la posición de las cartas</li>
            <li>✓ Trabaja de forma sistemática (por filas o columnas)</li>
            <li>✓ No te apresures demasiado al inicio</li>
            <li>✓ Mantén la concentración y evita distracciones</li>
          </ul>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onRetry}
            variant="primary"
            size="large"
            className="bg-red-500 hover:bg-red-600"
          >
            🔄 Intentar de Nuevo
          </Button>

          <Button
            onClick={onBackToHome}
            variant="outline"
            size="large"
          >
            🏠 Menú Principal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GameOverModal;

