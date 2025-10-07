import React, { useEffect, useState } from 'react';
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
    performance,
    getFormattedStats
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
  useEffect(() => {
    if ((isGameComplete || isGameOver) && onGameComplete) {
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

  // Calcular grid columns basado en el número de cartas
  const getGridCols = (cardCount) => {
    if (cardCount <= 8) return 'grid-cols-4';
    if (cardCount <= 12) return 'grid-cols-4 md:grid-cols-6';
    return 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8';
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Nivel {level} - {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </h2>
              <p className="text-white/80">
                Encuentra {basicStats.totalPairs} pares de cartas
              </p>
            </div>
            
            <div className="flex items-center gap-4">
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

          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Progreso</span>
              <span>{basicStats.matchedPairs}/{basicStats.totalPairs} pares</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controles del juego */}
        <div className="flex flex-wrap gap-4 justify-center mb-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <GameControls
            gameState={gameState}
            onStart={startNewGame}
            onRestart={restartGame}
            onPause={togglePause}
            isLoading={isLoading}
          />
          
          {/* Botón de barajeo épico */}
          {isGameActive && (
            <button
              onClick={shuffleCards}
              disabled={gameState.isShuffling}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-110 ${
                gameState.isShuffling
                  ? 'bg-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-2xl hover:shadow-purple-500/50 animate-pulse'
              }`}
            >
              {gameState.isShuffling ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Barajeando...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <span className="text-2xl animate-bounce">🔀</span>
                  <span className="text-lg">BARAJEAR</span>
                  <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎲</span>
                </span>
              )}
            </button>
          )}

          {/* Botón de RESET más pequeño */}
          {(isGameActive || isGameComplete || isGameOver) && (
            <button
              onClick={() => {
                restartGame();
                // El barajeo automático se ejecutará cuando se inicie el nuevo juego
              }}
              disabled={gameState.isShuffling}
              className={`px-4 py-2 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                gameState.isShuffling
                  ? 'bg-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-red-500/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🔄</span>
                <span className="text-sm">Restablecer Puntos</span>
              </span>
            </button>
          )}
        </div>

        {/* Sistema de puntuación avanzado */}
        <div className="mb-6">
          <ScoreDisplay
            score={basicStats.score}
            moves={basicStats.moves}
            matchedPairs={basicStats.matchedPairs}
            totalPairs={basicStats.totalPairs}
            timeBonus={Math.floor(basicStats.score * 0.2)}
            streakBonus={Math.floor(basicStats.score * 0.1)}
            accuracy={basicStats.accuracy}
            className="bg-black/30 backdrop-blur-sm border border-white/10"
          />
        </div>

        {/* Tablero de cartas */}
        <div className="mb-6 relative bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          {/* Overlay durante barajeo */}
          {gameState.isShuffling && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-xl z-10 animate-pulse"></div>
          )}
          
          <div className={`grid ${getGridCols(cards.length)} gap-3 md:gap-4 relative ${
            gameState.isShuffling ? 'shuffle-wave' : ''
          }`}>
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
