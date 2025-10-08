/**
 * Componente de prueba para el sistema de niveles
 */

import React, { useState } from 'react';
import { useLevelProgress } from '../../hooks/useLevelProgress.js';
import LevelSelector from './LevelSelector.jsx';
import LevelTransition from './LevelTransition.jsx';
import { getAllLevels, UNLOCK_STATUS } from '../../types/levels.js';

/**
 * Componente de testing para el sistema de niveles
 */
const LevelSystemTest = () => {
  const {
    playerProgress,
    overallProgress,
    updateLevelProgress,
    resetAllProgress,
    getLevelStats,
    checkNewAchievements
  } = useLevelProgress();

  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showTransition, setShowTransition] = useState(false);
  const [mockGameResult, setMockGameResult] = useState(null);
  const [testMode, setTestMode] = useState('selector'); // 'selector' | 'transition'

  const allLevels = getAllLevels();

  // Simular completar un nivel
  const simulateGameCompletion = (levelId, resultType = 'perfect') => {
    const level = allLevels.find(l => l.id === levelId);
    if (!level) return;

    let mockResult;
    
    switch (resultType) {
      case 'perfect':
        mockResult = {
          completed: true,
          score: level.rewards.perfectBonus,
          accuracy: 100,
          timeUsed: Math.floor(level.time * 0.3), // Usó solo 30% del tiempo
          moves: level.pairs * 2, // Movimientos perfectos
          baseScore: level.rewards.baseScore,
          timeBonusScore: level.rewards.timeBonus,
          streakBonusScore: 500,
          isNewRecord: true
        };
        break;
      
      case 'good':
        mockResult = {
          completed: true,
          score: Math.floor(level.rewards.baseScore * 1.5),
          accuracy: 85,
          timeUsed: Math.floor(level.time * 0.6),
          moves: Math.floor(level.pairs * 2.5),
          baseScore: level.rewards.baseScore,
          timeBonusScore: Math.floor(level.rewards.timeBonus * 0.4),
          streakBonusScore: 200,
          isNewRecord: false
        };
        break;
      
      case 'failed':
        mockResult = {
          completed: false,
          score: Math.floor(level.rewards.baseScore * 0.3),
          accuracy: 45,
          timeUsed: level.time, // Se agotó el tiempo
          moves: Math.floor(level.pairs * 4),
          baseScore: Math.floor(level.rewards.baseScore * 0.3),
          timeBonusScore: 0,
          streakBonusScore: 0,
          isNewRecord: false
        };
        break;
      
      default:
        return;
    }

    // Actualizar progreso
    updateLevelProgress(levelId, mockResult);
    
    // Mostrar transición
    setMockGameResult(mockResult);
    setShowTransition(true);

    // Verificar logros
    const newAchievements = checkNewAchievements();
    if (newAchievements.length > 0) {
      console.log('🏆 Nuevos logros desbloqueados:', newAchievements);
    }
  };

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    console.log(`🎮 Nivel seleccionado: ${levelId}`);
  };

  const handleTransitionContinue = (nextLevel) => {
    setShowTransition(false);
    setSelectedLevel(nextLevel);
    setTestMode('selector');
  };

  const handleTransitionReplay = (levelId) => {
    setShowTransition(false);
    setSelectedLevel(levelId);
    setTestMode('selector');
  };

  const handleTransitionSelectLevel = () => {
    setShowTransition(false);
    setTestMode('selector');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 Level System - Testing
          </h1>
          <p className="text-gray-600">
            Prueba completa del sistema de niveles y progresión
          </p>
        </div>

        {/* Controles de testing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🧪 Controles de Prueba
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Selector de modo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modo de Prueba:
              </label>
              <select
                value={testMode}
                onChange={(e) => setTestMode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="selector">Level Selector</option>
                <option value="transition">Level Transition</option>
              </select>
            </div>

            {/* Selector de nivel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel Actual:
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {allLevels.map(level => (
                  <option key={level.id} value={level.id}>
                    Nivel {level.id}: {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botones de simulación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Simular Resultado:
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => simulateGameCompletion(selectedLevel, 'perfect')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-2 rounded transition-colors"
                  title="Simular resultado perfecto"
                >
                  ⭐
                </button>
                <button
                  onClick={() => simulateGameCompletion(selectedLevel, 'good')}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-2 rounded transition-colors"
                  title="Simular resultado bueno"
                >
                  ✅
                </button>
                <button
                  onClick={() => simulateGameCompletion(selectedLevel, 'failed')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-2 rounded transition-colors"
                  title="Simular fallo"
                >
                  ❌
                </button>
              </div>
            </div>

            {/* Reset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resetear:
              </label>
              <button
                onClick={resetAllProgress}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                🔄 Reset Todo
              </button>
            </div>
          </div>

          {/* Información de progreso actual */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Estado Actual del Progreso</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Completados:</span>
                <span className="font-bold ml-2">{overallProgress.completedLevels}/5</span>
              </div>
              <div>
                <span className="text-gray-600">Perfectos:</span>
                <span className="font-bold ml-2">{overallProgress.perfectLevels}/5</span>
              </div>
              <div>
                <span className="text-gray-600">Puntuación Total:</span>
                <span className="font-bold ml-2">{overallProgress.totalScore.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Progreso:</span>
                <span className="font-bold ml-2">{overallProgress.completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Componente de prueba */}
        {testMode === 'selector' && (
          <LevelSelector
            onLevelSelect={handleLevelSelect}
            currentLevel={selectedLevel}
            playerProgress={playerProgress}
          />
        )}

        {testMode === 'transition' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Vista Previa de Level Transition
            </h3>
            <p className="text-gray-600 mb-4">
              Haz clic en "Mostrar Transición" para ver el componente de transición con datos de prueba.
            </p>
            <button
              onClick={() => {
                setMockGameResult({
                  completed: true,
                  score: 2500,
                  accuracy: 95,
                  timeUsed: 45,
                  moves: 12,
                  baseScore: 1000,
                  timeBonusScore: 800,
                  streakBonusScore: 700
                });
                setShowTransition(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
            >
              📱 Mostrar Transición
            </button>
          </div>
        )}

        {/* Información de debugging */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🔍 Funcionalidades a Probar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Level Selector:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>✓ Visualización de niveles con estados</li>
                <li>✓ Indicadores de progreso por nivel</li>
                <li>✓ Sistema de desbloqueo progresivo</li>
                <li>✓ Resumen de progreso general</li>
                <li>✓ Detalles de nivel seleccionado</li>
                <li>✓ Logros y badges dinámicos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Level Transition:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>✓ Animaciones de entrada</li>
                <li>✓ Rating de rendimiento con estrellas</li>
                <li>✓ Desglose detallado de puntuación</li>
                <li>✓ Información del siguiente nivel</li>
                <li>✓ Detección de nivel final</li>
                <li>✓ Botones de acción contextuales</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Transición modal */}
        {showTransition && mockGameResult && (
          <LevelTransition
            currentLevel={selectedLevel}
            nextLevel={selectedLevel < 5 ? selectedLevel + 1 : null}
            gameResult={mockGameResult}
            onContinue={handleTransitionContinue}
            onReplay={handleTransitionReplay}
            onSelectLevel={handleTransitionSelectLevel}
          />
        )}
      </div>
    </div>
  );
};

export default LevelSystemTest;
