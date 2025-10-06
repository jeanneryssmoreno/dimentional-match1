/**
 * Componente selector de niveles con progreso y desbloqueos
 */

import React, { useState, useEffect } from 'react';
import { 
  getAllLevels, 
  getLevelUnlockStatus, 
  calculateOverallProgress,
  UNLOCK_STATUS,
  DIFFICULTIES 
} from '../../types/levels.js';
import LevelCard from './LevelCard.jsx';
import ProgressSummary from './ProgressSummary.jsx';

/**
 * Componente principal del selector de niveles
 */
const LevelSelector = ({ 
  onLevelSelect, 
  currentLevel = 1,
  playerProgress = {},
  className = '' 
}) => {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);
  const [showDetails, setShowDetails] = useState(false);
  
  const allLevels = getAllLevels();
  const overallProgress = calculateOverallProgress(playerProgress);

  // Actualizar nivel seleccionado cuando cambie el prop
  useEffect(() => {
    setSelectedLevel(currentLevel);
  }, [currentLevel]);

  const handleLevelClick = (levelId) => {
    const status = getLevelUnlockStatus(levelId, playerProgress);
    
    if (status !== UNLOCK_STATUS.LOCKED) {
      setSelectedLevel(levelId);
      if (onLevelSelect) {
        onLevelSelect(levelId);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case DIFFICULTIES.EASY:
        return 'text-green-600 bg-green-100';
      case DIFFICULTIES.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case DIFFICULTIES.HARD:
        return 'text-red-600 bg-red-100';
      case DIFFICULTIES.EXPERT:
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Header con progreso general */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Seleccionar Nivel
        </h2>
        <p className="text-gray-600 mb-4">
          Elige tu nivel de dificultad y demuestra tus habilidades
        </p>
        
        <ProgressSummary 
          progress={overallProgress}
          onToggleDetails={() => setShowDetails(!showDetails)}
          showDetails={showDetails}
        />
      </div>

      {/* Grid de niveles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {allLevels.map((level) => {
          const status = getLevelUnlockStatus(level.id, playerProgress);
          const isSelected = selectedLevel === level.id;
          const levelProgress = playerProgress[level.id];
          
          return (
            <LevelCard
              key={level.id}
              level={level}
              status={status}
              isSelected={isSelected}
              progress={levelProgress}
              onClick={() => handleLevelClick(level.id)}
            />
          );
        })}
      </div>

      {/* Detalles del nivel seleccionado */}
      {selectedLevel && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información del nivel */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Nivel {selectedLevel}: {allLevels.find(l => l.id === selectedLevel)?.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getDifficultyColor(allLevels.find(l => l.id === selectedLevel)?.difficulty)
                }`}>
                  {allLevels.find(l => l.id === selectedLevel)?.difficulty.toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                {allLevels.find(l => l.id === selectedLevel)?.description}
              </p>

              {/* Estadísticas del nivel */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Cartas</div>
                  <div className="text-xl font-bold text-gray-800">
                    {allLevels.find(l => l.id === selectedLevel)?.cards}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Tiempo</div>
                  <div className="text-xl font-bold text-gray-800">
                    {Math.floor(allLevels.find(l => l.id === selectedLevel)?.time / 60)}:
                    {(allLevels.find(l => l.id === selectedLevel)?.time % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Pares</div>
                  <div className="text-xl font-bold text-gray-800">
                    {allLevels.find(l => l.id === selectedLevel)?.pairs}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Pistas</div>
                  <div className="text-xl font-bold text-gray-800">
                    {allLevels.find(l => l.id === selectedLevel)?.hints.available 
                      ? allLevels.find(l => l.id === selectedLevel)?.hints.maxHints
                      : 'No'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Progreso y recompensas */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Progreso y Recompensas
              </h4>
              
              {/* Progreso personal */}
              {playerProgress[selectedLevel] && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h5 className="font-medium text-blue-800 mb-2">Tu Mejor Resultado</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600">Puntuación:</span>
                      <span className="font-bold ml-2">
                        {playerProgress[selectedLevel].bestScore?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">Precisión:</span>
                      <span className="font-bold ml-2">
                        {playerProgress[selectedLevel].bestAccuracy || 0}%
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">Tiempo:</span>
                      <span className="font-bold ml-2">
                        {playerProgress[selectedLevel].bestTime 
                          ? `${Math.floor(playerProgress[selectedLevel].bestTime / 60)}:${(playerProgress[selectedLevel].bestTime % 60).toString().padStart(2, '0')}`
                          : '--:--'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">Intentos:</span>
                      <span className="font-bold ml-2">
                        {playerProgress[selectedLevel].attempts || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recompensas */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">Recompensas Posibles</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Puntos base:</span>
                    <span className="font-bold">
                      {allLevels.find(l => l.id === selectedLevel)?.rewards.baseScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Bonus tiempo:</span>
                    <span className="font-bold">
                      hasta {allLevels.find(l => l.id === selectedLevel)?.rewards.timeBonus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Bonus perfecto:</span>
                    <span className="font-bold">
                      {allLevels.find(l => l.id === selectedLevel)?.rewards.perfectBonus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requisitos de desbloqueo */}
              {allLevels.find(l => l.id === selectedLevel)?.unlockRequirements.previousLevel && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h5 className="font-medium text-gray-800 mb-2">Requisitos</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      Completar nivel {allLevels.find(l => l.id === selectedLevel)?.unlockRequirements.previousLevel}
                    </div>
                    <div>
                      Puntuación mínima: {allLevels.find(l => l.id === selectedLevel)?.unlockRequirements.minScore}
                    </div>
                    <div>
                      Precisión mínima: {allLevels.find(l => l.id === selectedLevel)?.unlockRequirements.minAccuracy}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de acción */}
          <div className="mt-6 text-center">
            {getLevelUnlockStatus(selectedLevel, playerProgress) === UNLOCK_STATUS.LOCKED ? (
              <button 
                disabled 
                className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-medium cursor-not-allowed"
              >
                🔒 Nivel Bloqueado
              </button>
            ) : (
              <button 
                onClick={() => onLevelSelect && onLevelSelect(selectedLevel)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {getLevelUnlockStatus(selectedLevel, playerProgress) === UNLOCK_STATUS.COMPLETED 
                  ? '🔄 Jugar de Nuevo' 
                  : '🎮 Jugar Nivel'
                }
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelSelector;
