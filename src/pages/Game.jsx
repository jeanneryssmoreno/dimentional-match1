/**
 * Página del Juego - Integración completa
 * Developer 2 - Sprint 3
 * 
 * Integra:
 * - GameBoard de Developer 3
 * - Sistema de niveles y progresión
 * - Persistencia de datos
 * - Navegación entre niveles
 * - Modales de victoria/derrota
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { THEME_LIST } from '../constants/themes';
import { useLevelProgress } from '../hooks/useLevelProgress';
import { useGamePersistence } from '../hooks/useGamePersistence';
import GameBoard from '../components/game/GameBoard';
import VictoryModal from '../components/game/VictoryModal';
import GameOverModal from '../components/game/GameOverModal';
import LevelSelector from '../components/levels/LevelSelector';
import Button from '../components/ui/Button';

// Estados de la pantalla
const SCREEN_STATES = {
  LEVEL_SELECT: 'level_select',
  PLAYING: 'playing',
  VICTORY: 'victory',
  GAME_OVER: 'game_over'
};

export default function Game() {
  const { theme: themeId } = useParams();
  const navigate = useNavigate();
  
  // Hooks de persistencia
  const {
    playerProgress,
    updateLevelProgress,
    getLevelStats,
    isLevelUnlocked
  } = useLevelProgress();

  const {
    currentSession,
    startSession,
    updateSession,
    endSession,
    saveGameResult
  } = useGamePersistence();

  // Estado local
  const [screenState, setScreenState] = useState(SCREEN_STATES.LEVEL_SELECT);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lastGameResult, setLastGameResult] = useState(null);
  const [showLevelSelector, setShowLevelSelector] = useState(true);

  // Buscar el tema seleccionado
  const selectedTheme = THEME_LIST.find(t => t.id === themeId);

  // Si el tema no existe, redirigir al home
  useEffect(() => {
    if (!selectedTheme) {
      console.error('Tema no válido:', themeId);
      navigate('/');
    }
  }, [selectedTheme, themeId, navigate]);

  // Iniciar sesión al montar
  useEffect(() => {
    if (selectedTheme) {
      startSession(themeId, currentLevel);
    }

    // Limpiar sesión al desmontar
    return () => {
      endSession();
    };
  }, [themeId]);

  // Actualizar sesión cuando cambie el nivel
  useEffect(() => {
    if (currentSession) {
      updateSession({ level: currentLevel });
    }
  }, [currentLevel, updateSession]);

  /**
   * Maneja la selección de un nivel
   */
  const handleLevelSelect = useCallback((levelId) => {
    // Verificar si el nivel está desbloqueado
    if (!isLevelUnlocked(levelId)) {
      console.warn('Nivel bloqueado:', levelId);
      return;
    }

    setCurrentLevel(levelId);
    setScreenState(SCREEN_STATES.PLAYING);
    setShowLevelSelector(false);
  }, [isLevelUnlocked]);

  /**
   * Maneja la finalización de una partida
   */
  const handleGameComplete = useCallback((gameResult) => {
    const { completed, score, accuracy, timeUsed, moves, matchedPairs, totalPairs } = gameResult;

    // Crear resultado completo
    const fullResult = {
      theme: themeId,
      level: currentLevel,
      completed,
      score: score || 0,
      accuracy: accuracy || 0,
      timeUsed: timeUsed || 0,
      moves: moves || 0,
      matchedPairs: matchedPairs || 0,
      totalPairs: totalPairs || 0,
      timeBonusScore: gameResult.timeBonusScore || 0,
      streakBonusScore: gameResult.streakBonusScore || 0,
      baseScore: gameResult.baseScore || score || 0
    };

    setLastGameResult(fullResult);

    // Guardar en persistencia
    saveGameResult(fullResult);

    // Actualizar progreso de nivel si completó
    if (completed) {
      updateLevelProgress(currentLevel, {
        completed: true,
        score: fullResult.score,
        accuracy: fullResult.accuracy,
        timeUsed: fullResult.timeUsed,
        moves: fullResult.moves
      });
      setScreenState(SCREEN_STATES.VICTORY);
    } else {
      // Actualizar intento fallido
      updateLevelProgress(currentLevel, {
        completed: false,
        score: fullResult.score,
        accuracy: fullResult.accuracy,
        timeUsed: fullResult.timeUsed,
        moves: fullResult.moves
      });
      setScreenState(SCREEN_STATES.GAME_OVER);
    }
  }, [themeId, currentLevel, saveGameResult, updateLevelProgress]);

  /**
   * Volver al home
   */
  const handleBackToHome = useCallback(() => {
    endSession();
    navigate('/');
  }, [navigate, endSession]);

  /**
   * Avanza al siguiente nivel
   */
  const handleNextLevel = useCallback(() => {
    if (currentLevel < 5) {
      const nextLevel = currentLevel + 1;
      // Primero cerrar el modal
      setScreenState(SCREEN_STATES.PLAYING);
      setLastGameResult(null);
      
      // Pequeño delay para asegurar que el modal se cierra antes de cargar el nuevo nivel
      setTimeout(() => {
        setCurrentLevel(nextLevel);
      }, 100);
    } else {
      // Completó todos los niveles
      handleBackToHome();
    }
  }, [currentLevel, handleBackToHome]);

  /**
   * Reintentar el nivel actual
   */
  const handleRetry = useCallback(() => {
    setScreenState(SCREEN_STATES.PLAYING);
    setLastGameResult(null);
  }, []);

  /**
   * Volver al selector de niveles
   */
  const handleBackToLevelSelect = useCallback(() => {
    setScreenState(SCREEN_STATES.LEVEL_SELECT);
    setShowLevelSelector(true);
    setLastGameResult(null);
  }, []);

  // Obtener mejor puntuación del nivel actual
  const currentLevelStats = getLevelStats(currentLevel);
  const bestScore = currentLevelStats.bestScore || 0;

  // Si no hay tema seleccionado, no renderizar nada
  if (!selectedTheme) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header con información del tema */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg">
          <span className="text-3xl">{selectedTheme.icon}</span>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {selectedTheme.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Nivel {currentLevel} de 5
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Niveles */}
      {screenState === SCREEN_STATES.LEVEL_SELECT && showLevelSelector && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Selecciona un Nivel
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Elige el nivel que quieres jugar
            </p>
          </div>

          <LevelSelector
            playerProgress={playerProgress}
            onLevelSelect={handleLevelSelect}
            currentTheme={themeId}
          />

          {/* Botón volver */}
          <div className="text-center mt-8">
            <Button
              onClick={handleBackToHome}
              variant="outline"
              size="large"
            >
              ← Volver al Menú
            </Button>
          </div>
        </div>
      )}

      {/* Tablero de Juego */}
      {screenState === SCREEN_STATES.PLAYING && (
        <div>
          {/* Botón para volver al selector */}
          <div className="max-w-6xl mx-auto mb-4 flex justify-between items-center px-4">
            <Button
              onClick={handleBackToLevelSelect}
              variant="outline"
              size="small"
            >
              ← Cambiar Nivel
            </Button>
            <Button
              onClick={handleBackToHome}
              variant="outline"
              size="small"
            >
              🏠 Menú Principal
            </Button>
          </div>

          <GameBoard
            key={`${themeId}-${currentLevel}`}
            theme={themeId}
            level={currentLevel}
            onGameComplete={handleGameComplete}
          />
        </div>
      )}

      {/* Modal de Victoria */}
      <VictoryModal
        isOpen={screenState === SCREEN_STATES.VICTORY}
        onClose={() => setScreenState(SCREEN_STATES.LEVEL_SELECT)}
        gameResult={lastGameResult}
        onNextLevel={currentLevel < 5 ? handleNextLevel : null}
        onRetry={handleRetry}
        onBackToHome={handleBackToHome}
        isLastLevel={currentLevel === 5}
      />

      {/* Modal de Game Over */}
      <GameOverModal
        isOpen={screenState === SCREEN_STATES.GAME_OVER}
        onClose={() => setScreenState(SCREEN_STATES.LEVEL_SELECT)}
        gameResult={lastGameResult}
        onRetry={handleRetry}
        onBackToHome={handleBackToHome}
        bestScore={bestScore}
      />
    </div>
  );
}
