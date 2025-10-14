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

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { THEME_LIST } from '../constants/themes';
import { useLevelProgress } from '../hooks/useLevelProgress';
import { useGamePersistence } from '../hooks/useGamePersistence';
import { useGame } from '../contexts/GameContext';
import { getLevelConfig, isLevelUnlocked } from '../types/levels';
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
  GAME_OVER: 'game_over',
  LOADING: 'loading'
};

export default function Game() {
  const { theme: themeId } = useParams();
  const navigate = useNavigate();
  
  // Hook del contexto del juego para resetear estado
  const { resetGame } = useGame();
  
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
      
      // 1. Cerrar el modal primero cambiando el estado
      setScreenState(SCREEN_STATES.LEVEL_SELECT);
      
      // 2. Limpiar completamente el resultado anterior
      setLastGameResult(null);
      
      // 3. IMPORTANTE: Resetear el estado del juego en el contexto
      // Esto limpia el estado COMPLETED que causaba el problema
      resetGame();
      
      // 4. Pequeño delay para asegurar que el modal se cierre y los estados se limpien
      setTimeout(() => {
        // 5. Cambiar al estado de loading
        setScreenState(SCREEN_STATES.LOADING);
        
        // 6. Otro delay para mostrar el loading y luego iniciar el juego
        setTimeout(() => {
          setCurrentLevel(nextLevel);
          setScreenState(SCREEN_STATES.PLAYING);
        }, 200);
      }, 100);
    } else {
      // Completó todos los niveles
      handleBackToHome();
    }
  }, [currentLevel, handleBackToHome, resetGame]);

  /**
   * Reintentar el nivel actual
   */
  const handleRetry = useCallback(() => {
    // 1. Limpiar resultado anterior
    setLastGameResult(null);
    
    // 2. IMPORTANTE: Resetear el estado del juego en el contexto
    // Esto limpia el estado COMPLETED que causaba que el modal reapareciera
    resetGame();
    
    // 3. Cambiar a estado de loading
    setScreenState(SCREEN_STATES.LOADING);
    
    // 4. Delay para reiniciar el juego
    setTimeout(() => {
      setScreenState(SCREEN_STATES.PLAYING);
    }, 100);
  }, [resetGame]);

  /**
   * Cerrar modal y volver al selector de niveles
   */
  const handleCloseModal = useCallback(() => {
    setLastGameResult(null);
    setScreenState(SCREEN_STATES.LEVEL_SELECT);
    setShowLevelSelector(true);
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

  /**
   * Valida si el jugador puede acceder al siguiente nivel
   * basándose en los requisitos de puntuación y precisión
   */
  const nextLevelValidation = useMemo(() => {
    // Si no hay resultado o no está en el último nivel
    if (!lastGameResult || currentLevel >= 5) {
      return { canAccess: false, requirements: null, nextLevelConfig: null };
    }

    const nextLevelId = currentLevel + 1;
    const nextLevelConfig = getLevelConfig(nextLevelId);
    
    // Simular el progreso actualizado con el resultado actual del juego
    // Usamos el mejor score entre el actual y los anteriores
    const currentBestScore = Math.max(
      lastGameResult.score || 0,
      playerProgress[currentLevel]?.bestScore || 0
    );
    
    const currentBestAccuracy = Math.max(
      lastGameResult.accuracy || 0,
      playerProgress[currentLevel]?.bestAccuracy || 0
    );

    const simulatedProgress = {
      ...playerProgress,
      [currentLevel]: {
        ...playerProgress[currentLevel],
        completed: true,
        bestScore: currentBestScore,
        bestAccuracy: currentBestAccuracy
      }
    };
    
    // Verificar si el siguiente nivel está desbloqueado
    const canAccess = isLevelUnlocked(nextLevelId, simulatedProgress);
    
    // Obtener requisitos del siguiente nivel
    const requirements = nextLevelConfig.unlockRequirements;
    
    return {
      canAccess,
      requirements,
      nextLevelConfig,
      currentScore: currentBestScore,
      currentAccuracy: currentBestAccuracy
    };
  }, [currentLevel, lastGameResult, playerProgress]);

  // Si no hay tema seleccionado, no renderizar nada
  if (!selectedTheme) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Patrón de fondo tipo juego de memoria */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-2 h-full p-4">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-lg ${
                i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
              } animate-pulse`}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>

      {/* Efectos de partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header con información del tema y botones de navegación */}
        {screenState === SCREEN_STATES.PLAYING && (
          <div className="mb-8 pt-6">
            <div className="max-w-7xl mx-auto px-4">
              {/* Contenedor con efectos visuales mejorados */}
              <div className="relative">
                {/* Efectos de borde neón */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl rounded-3xl animate-pulse"></div>
                
                <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* Botón izquierdo: Cambiar Nivel */}
                    <div className="flex-1">
                      <button
                        onClick={handleBackToLevelSelect}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
                      >
                        ← Cambiar Nivel
                      </button>
                    </div>

                    {/* Título del tema en el centro */}
                    <div className="flex-2 flex justify-center">
                      <div className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-white/20">
                        <span className="text-4xl animate-pulse">{selectedTheme.icon}</span>
                        <div className="text-center">
                          <h2 className="text-2xl font-black text-white bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            {selectedTheme.name}
                          </h2>
                          <p className="text-sm text-white/90 font-semibold">
                            🎯 Nivel {currentLevel} de 5
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botón derecho: Menú Principal */}
                    <div className="flex-1 flex justify-end">
                      <button
                        onClick={handleBackToHome}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
                      >
                        🏠 Menú Principal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header con botón de volver para selector de niveles */}
        {screenState === SCREEN_STATES.LEVEL_SELECT && (
          <div className="mb-8 pt-6">
            <div className="max-w-7xl mx-auto px-4">
              {/* Contenedor con efectos visuales mejorados */}
              <div className="relative">
                {/* Efectos de borde neón */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl rounded-3xl animate-pulse"></div>
                
                <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* Espacio flexible izquierdo */}
                    <div className="flex-1"></div>
                    
                    {/* Título del tema en el centro */}
                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-white/20">
                        <span className="text-4xl animate-pulse">{selectedTheme.icon}</span>
                        <div className="text-center">
                          <h2 className="text-2xl font-black text-white bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            {selectedTheme.name}
                          </h2>
                          <p className="text-sm text-white/90 font-semibold">
                            🎮 Selecciona tu nivel
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botón volver a la derecha */}
                    <div className="flex-1 flex justify-end">
                      <button
                        onClick={handleBackToHome}
                        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
                      >
                        ← Volver al Menú
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header simplificado para estado de carga */}
        {screenState === SCREEN_STATES.LOADING && (
          <div className="mb-8 pt-6">
            <div className="max-w-7xl mx-auto px-4 text-center">
              {/* Contenedor con efectos visuales mejorados */}
              <div className="relative inline-block">
                {/* Efectos de borde neón */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl rounded-3xl animate-pulse"></div>
                
                <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <div className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-white/20">
                    <span className="text-4xl animate-pulse">{selectedTheme.icon}</span>
                    <div className="text-center">
                      <h2 className="text-2xl font-black text-white bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                        {selectedTheme.name}
                      </h2>
                      <p className="text-sm text-white/90 font-semibold">
                        ⚡ Cargando Nivel {currentLevel}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selector de Niveles */}
        {screenState === SCREEN_STATES.LEVEL_SELECT && showLevelSelector && (
          <div className="max-w-7xl mx-auto px-4">
            {/* Contenedor con efectos visuales mejorados */}
            <div className="relative">
              {/* Efectos de borde neón */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl rounded-3xl animate-pulse"></div>
              
              <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
                {/* Patrón de circuito en el fondo */}
                <div className="absolute inset-0 opacity-5">
                  <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="circuit-game" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 0,10 L 10,10 L 10,0 L 20,0 M 10,10 L 10,20 M 10,10 L 20,10" stroke="white" strokeWidth="0.5" fill="none"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circuit-game)"/>
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <LevelSelector
                    playerProgress={playerProgress}
                    onLevelSelect={handleLevelSelect}
                    currentTheme={themeId}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado de Carga */}
        {screenState === SCREEN_STATES.LOADING && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              {/* Contenedor con efectos visuales mejorados */}
              <div className="relative inline-block">
                {/* Efectos de borde neón */}
                <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-xl rounded-full animate-pulse"></div>
                
                <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-6 shadow-2xl"></div>
                  <div className="w-20 h-20 border-4 border-transparent border-t-yellow-400 border-r-orange-500 border-b-pink-500 border-l-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-2xl font-black text-white bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
                    ⚡ Cargando Nivel {currentLevel}...
                  </h3>
                  <p className="text-lg font-semibold text-white/80">
                    Preparando tu aventura épica
                  </p>
                  
                  {/* Barra de progreso animada */}
                  <div className="mt-6 w-48 mx-auto">
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tablero de Juego */}
        {screenState === SCREEN_STATES.PLAYING && (
          <div>
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
          isOpen={screenState === SCREEN_STATES.VICTORY && lastGameResult !== null}
          onClose={handleCloseModal}
          gameResult={lastGameResult}
          onNextLevel={currentLevel < 5 ? handleNextLevel : null}
          onRetry={handleRetry}
          onBackToHome={handleBackToHome}
          isLastLevel={currentLevel === 5}
          canGoToNextLevel={nextLevelValidation.canAccess}
          nextLevelRequirements={nextLevelValidation.requirements}
          currentScore={nextLevelValidation.currentScore}
          currentAccuracy={nextLevelValidation.currentAccuracy}
        />

        {/* Modal de Game Over */}
        <GameOverModal
          isOpen={screenState === SCREEN_STATES.GAME_OVER && lastGameResult !== null}
          onClose={handleCloseModal}
          gameResult={lastGameResult}
          onRetry={handleRetry}
          onBackToHome={handleBackToHome}
          bestScore={bestScore}
        />
      </div>
    </div>
  );
}
