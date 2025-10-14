
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic.js';
import { useGameTimer } from '../../hooks/useGameTimer.js';
import { useGameStats } from '../../hooks/useGameStats.js';
import { useSoundEffects } from '../../hooks/useSoundEffects.js';
import { CARD_STATES, GAME_STATES } from '../../types/game.js';
import GameCard from './GameCard.jsx';
import GameControls from './GameControls.jsx';
import GameStats from './GameStats.jsx';
import GameTimer from './GameTimer.jsx';
import WinnerMessage from './WinnerMessage.jsx';
import ScoreDisplay from './ScoreDisplay.jsx';

/**
 * Componente del tablero de juego
 */
/**
 * Componente del tablero de juego
 */
const GameBoard = ({ theme, level = 1, onGameComplete }) => {
  const [showWinnerMessage, setShowWinnerMessage] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla para ajustar grid responsivo
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const {
    gameState,
    cards,
    isLoading,
    isGameActive,
    isGameComplete,
    isGameOver,
    handleCardClick,
    startNewGame,
    restartGame,
    togglePause,
    shuffleCards,
    error
  } = useGameLogic(theme, level);

  const {
    formattedTime,
    timePercentage,
    isCritical,
    isWarning,
    toggleTimer
  } = useGameTimer();

  const {
    basicStats,
    progress,
  } = useGameStats();


  const { playVictorySound, playShuffleSound } = useSoundEffects();

  // Activar audio con interacción del usuario
  const enableAudio = () => {
    setAudioEnabled(true);
    // Crear un contexto de audio para activarlo
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (error) {
      console.warn('No se pudo activar el audio:', error);
    }
  };

  // Mostrar mensaje de victoria
  useEffect(() => {
    if (isGameComplete) {
      setShowWinnerMessage(true);
      if (audioEnabled) {
        playVictorySound();
      }
    }
  }, [isGameComplete, playVictorySound, audioEnabled]);

  // Reproducir sonido de barajeo cuando se inicia
  useEffect(() => {
    if (gameState.isShuffling && audioEnabled) {
      playShuffleSound();
    }
  }, [gameState.isShuffling, playShuffleSound, audioEnabled]);

  const handleWinnerMessageClose = () => {
    setShowWinnerMessage(false);
  };

  // Notificar cuando el juego termine

  // Ref para evitar múltiples llamadas a onGameComplete
  const hasNotifiedCompletion = useRef(false);

  // Resetear la bandera cuando cambie el nivel

  useEffect(() => {
    hasNotifiedCompletion.current = false;
  }, [level, theme]);

  // Notificar cuando el juego termine (solo una vez por nivel)
  useEffect(() => {
    if ((isGameComplete || isGameOver) && onGameComplete && !hasNotifiedCompletion.current) {
      hasNotifiedCompletion.current = true; // Marcar que ya se notificó
      
      const gameResult = {
        completed: isGameComplete,
        score: basicStats.score,
        accuracy: basicStats.accuracy,
        timeUsed: gameState.startTime ? Math.floor((Date.now() - gameState.startTime) / 1000) : 0,
        moves: basicStats.moves,
        matchedPairs: basicStats.matchedPairs,
        totalPairs: basicStats.totalPairs,
        level: level,
        theme: theme,
        timeBonusScore: Math.floor(basicStats.score * 0.2), // Ejemplo de cálculo
        streakBonusScore: Math.floor(basicStats.score * 0.1), // Ejemplo de cálculo
        baseScore: basicStats.score
      };

      onGameComplete(gameResult);
    }
  }, [isGameComplete, isGameOver, onGameComplete, basicStats, gameState.startTime, level, theme]);

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando personajes...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Error al cargar el juego</h3>
          <p className="mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Calcular número óptimo de columnas basado en el número de cartas
  const getOptimalCols = (cardCount) => {
    // Encontrar todos los divisores del número de cartas
    const divisors = [];
    for (let i = 1; i <= cardCount; i++) {
      if (cardCount % i === 0) {
        divisors.push(i);
      }
    }
    
    // Buscar el divisor ideal entre 4 y 8 (buen balance visual)
    for (let ideal = 4; ideal <= 8; ideal++) {
      if (divisors.includes(ideal)) {
        return ideal;
      }
    }
    
    // Si no hay divisor entre 4-8, buscar entre 3-10
    for (let i = 3; i <= 10; i++) {
      if (divisors.includes(i)) {
        return i;
      }
    }
    
    // Último recurso: usar 4 (estándar)
    return 4;
  };

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

      <div className="relative z-10 max-w-6xl mx-auto p-4">
        {/* Header del juego */}
        <div className="mb-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          {/* Fila superior: Información y controles */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Información del nivel y pares - lado a lado */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 flex-1">
              {/* Lado izquierdo: Nivel y tema */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">
                  Nivel {level} - {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </h2>
              </div>
              
              {/* Lado derecho: Objetivo de pares */}
              <div className="flex-1 text-left sm:text-right">
                <p className="text-lg font-semibold text-white/90">
                  Encuentra {basicStats.totalPairs} pares de cartas
                </p>
              </div>
            </div>
            
            {/* Controles del lado derecho */}
            <div className="flex items-center gap-4">
              {/* Botón de control del juego (Iniciar/Pausar/Continuar) */}
              <div className="flex items-center gap-2">
                {gameState.status === GAME_STATES.IDLE && (
                  <button
                    onClick={startNewGame}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Iniciar Juego
                  </button>
                )}
                {gameState.status === GAME_STATES.PLAYING && (
                  <button
                    onClick={togglePause}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Pausar
                  </button>
                )}
                {gameState.status === GAME_STATES.PAUSED && (
                  <button
                    onClick={togglePause}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Continuar
                  </button>
                )}
                {(gameState.status === GAME_STATES.COMPLETED || gameState.status === GAME_STATES.GAME_OVER) && (
                  <button
                    onClick={startNewGame}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Nuevo Juego
                  </button>
                )}
              </div>
              
              {/* Botón de activación de audio */}
              {!audioEnabled && (
                <button
                  onClick={enableAudio}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🔊 Activar Sonido
                </button>
              )}
              
              {/* Timer */}
              <GameTimer
                time={formattedTime}
                percentage={timePercentage}
                isCritical={isCritical}
                isWarning={isWarning}
                isActive={isGameActive}
                onToggle={toggleTimer}
              />
            </div>
          </div>

          {/* Fila inferior: Barra de progreso y botones de acción */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Barra de progreso - ancho limitado */}
            <div className="flex-1">
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span className="font-semibold">Progreso</span>
                <span className="font-semibold">{basicStats.matchedPairs}/{basicStats.totalPairs} pares ({Math.round(progress.progress)}%)</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>

            {/* Botones de acción: Barajear y Reiniciar */}
            {(isGameActive || isGameComplete || isGameOver) && (
              <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                {/* Botón de barajeo */}
                {isGameActive && (
                  <button
                    onClick={shuffleCards}
                    disabled={gameState.isShuffling}
                    className={`px-4 py-2 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                      gameState.isShuffling
                        ? 'bg-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/30'
                    }`}
                  >
                    {gameState.isShuffling ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Barajeando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="text-lg">🔀</span>
                        <span className="text-sm">Barajear</span>
                      </span>
                    )}
                  </button>
                )}

                {/* Botón de reiniciar */}
                {(gameState.status === GAME_STATES.PLAYING || gameState.status === GAME_STATES.PAUSED) && (
                  <button
                    onClick={restartGame}
                    disabled={gameState.isShuffling}
                    className={`px-4 py-2 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                      gameState.isShuffling
                        ? 'bg-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-red-500/30'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Reiniciar</span>
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tablero de cartas */}
        <div className="mb-6 relative bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          {/* Overlay durante barajeo */}
          {gameState.isShuffling && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-xl z-10 animate-pulse"></div>
          )}
          
          <div 
            className={`grid gap-3 md:gap-4 relative ${
              gameState.isShuffling ? 'shuffle-wave' : ''
            }`}
            style={{
              gridTemplateColumns: isMobile 
                ? `repeat(${Math.min(getOptimalCols(cards.length), 4)}, minmax(0, 1fr))` 
                : `repeat(${getOptimalCols(cards.length)}, minmax(0, 1fr))`
            }}
          >
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`transform transition-all duration-700 ${
                  gameState.isShuffling 
                    ? `shuffle-animation shuffle-glow` 
                    : ''
                }`}
                style={{
                  animationDelay: gameState.isShuffling ? `${index * 0.1}s` : '0s',
                  zIndex: gameState.isShuffling ? 1000 + index : 1,
                  position: 'relative'
                }}
              >
                <GameCard
                  card={card}
                  onClick={() => handleCardClick(card.id)}
                  disabled={!isGameActive || card.state === CARD_STATES.MATCHED}
                  isShuffling={gameState.isShuffling}
                  audioEnabled={audioEnabled}
                  className="aspect-square"
                />
                
                {/* Efecto de partículas durante barajeo */}
                {gameState.isShuffling && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.05}s` }}></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.07}s` }}></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.09}s` }}></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.11}s` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Mensaje de barajeo mejorado */}
          {gameState.isShuffling && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-12 py-8 rounded-3xl shadow-2xl transform animate-bounce">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-2 w-16 h-16 border-4 border-yellow-300 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                    </div>
                  </div>
                  <h3 className="text-4xl font-black mb-4 animate-pulse">🔀 ¡BARAJEANDO!</h3>
                  <p className="text-xl opacity-90 mb-6">Las cartas están volando y cambiando de posición...</p>
                  <div className="flex justify-center gap-3 mb-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div 
                        key={i}
                        className="w-4 h-4 bg-white rounded-full animate-bounce" 
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-lg font-bold animate-pulse">¡Prepárate para el nuevo desafío!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sistema de puntuación avanzado - Desplegable */}
        <div className="mb-6">
          <button
            onClick={() => setShowScoreDetails(!showScoreDetails)}
            className="w-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-t-2xl px-6 py-4 flex items-center justify-between text-white hover:bg-black/40 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <span className="text-lg font-bold">Puntuación y Estadísticas</span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                {basicStats.score} pts
              </span>
            </div>
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${showScoreDetails ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Contenido desplegable */}
          <div 
            className={`overflow-hidden transition-all duration-300 ${
              showScoreDetails ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-black/30 backdrop-blur-sm border border-t-0 border-white/10 rounded-b-2xl p-4">
              <ScoreDisplay
                score={basicStats.score}
                moves={basicStats.moves}
                matchedPairs={basicStats.matchedPairs}
                totalPairs={basicStats.totalPairs}
                timeBonus={Math.floor(basicStats.score * 0.2)}
                streakBonus={Math.floor(basicStats.score * 0.1)}
                accuracy={basicStats.accuracy}
                className="bg-transparent border-0"
              />
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {gameState.status === GAME_STATES.IDLE && (
          <div className="text-center py-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10">
            <p className="text-lg text-white/80 mb-4">
              ¡Presiona "Iniciar Juego" para comenzar!
            </p>
          </div>
        )}

        {gameState.status === GAME_STATES.PAUSED && (
          <div className="text-center py-8 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl">
            <p className="text-lg text-yellow-200 mb-4">
              Juego pausado
            </p>
            <button
              onClick={togglePause}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {isGameComplete && (
          <div className="text-center py-8 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl">
            <h3 className="text-2xl font-bold text-green-200 mb-2">
              ¡Felicidades! 🎉
            </h3>
            <p className="text-lg text-green-300 mb-4">
              Completaste el nivel {level} con {basicStats.score} puntos
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={restartGame}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Jugar de nuevo
              </button>
              {level < 5 && onGameComplete && (
                <button
                  onClick={() => {
                    // Llamar al callback para indicar que se quiere avanzar
                    if (onGameComplete) {
                      onGameComplete({
                        completed: true,
                        advanceToNext: true,
                        level: level
                      });
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Siguiente nivel
                </button>
              )}
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="text-center py-8 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl">
            <h3 className="text-2xl font-bold text-red-200 mb-2">
              ¡Tiempo agotado! ⏰
            </h3>
            <p className="text-lg text-red-300 mb-4">
              Encontraste {basicStats.matchedPairs} de {basicStats.totalPairs} pares
            </p>
            <button
              onClick={restartGame}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
        
        {/* Mensaje de Victoria Simple */}
        <WinnerMessage
          isVisible={showWinnerMessage}
          onClose={handleWinnerMessageClose}
        />
      </div>
    </div>
  );
};

export default GameBoard;
