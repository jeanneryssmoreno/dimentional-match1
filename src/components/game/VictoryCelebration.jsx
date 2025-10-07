/**
 * Componente de celebración de victoria con efectos de cotillón
 */

import React, { useEffect, useState } from 'react';

const VictoryCelebration = ({ 
  isVisible, 
  playerName = "¡CAMPEÓN!", 
  score, 
  onClose 
}) => {
  const [confetti, setConfetti] = useState([]);
  const [fireworks, setFireworks] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Generar confetti
      const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      }));
      setConfetti(confettiPieces);

      // Generar fuegos artificiales
      const fireworksArray = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 40 + 30,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
        delay: i * 300
      }));
      setFireworks(fireworksArray);

      // Limpiar después de la animación
      const timer = setTimeout(() => {
        setConfetti([]);
        setFireworks([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) translateX(0px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--random-x, 0px)) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes confettiRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fireworkExplode {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes fireworkParticle {
          0% {
            transform: translateX(0px) translateY(0px);
            opacity: 1;
          }
          100% {
            transform: translateX(var(--particle-x, 60px)) translateY(var(--particle-y, -60px));
            opacity: 0;
          }
        }
        
        @keyframes lightRay {
          0%, 100% {
            opacity: 0.1;
            transform: scaleY(0.8);
          }
          50% {
            opacity: 0.3;
            transform: scaleY(1.2);
          }
        }
        
        .confetti-piece {
          animation: confettiFall 3s linear infinite;
        }
        
        .firework-particle {
          animation: fireworkParticle 1.5s ease-out forwards;
        }
        
        .firework-center {
          animation: fireworkExplode 1s ease-out forwards;
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-hidden">
        {/* Confetti */}
        {confetti.map(piece => (
          <div
            key={piece.id}
            className="absolute confetti-piece"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              backgroundColor: piece.color,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              '--random-x': `${piece.speedX * 20}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}

        {/* Fuegos artificiales */}
        {fireworks.map(firework => (
          <div
            key={firework.id}
            className="absolute"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
              animationDelay: `${firework.delay}ms`
            }}
          >
            {/* Centro del fuego artificial */}
            <div
              className="absolute w-4 h-4 rounded-full firework-center"
              style={{
                backgroundColor: firework.color,
                animationDelay: `${firework.delay}ms`
              }}
            />
            
            {/* Partículas del fuego artificial */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const distance = 60;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full firework-particle"
                  style={{
                    backgroundColor: firework.color,
                    '--particle-x': `${x}px`,
                    '--particle-y': `${y}px`,
                    animationDelay: `${firework.delay + 200}ms`
                  }}
                />
              );
            })}
          </div>
        ))}

        {/* Contenido principal */}
        <div className="relative z-10 text-center animate-pulse">
          {/* Corona del ganador */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="text-8xl animate-bounce">👑</div>
              <div className="absolute inset-0 animate-ping">
                <div className="w-full h-full bg-yellow-400 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-6 animate-pulse leading-tight">
            {playerName}
          </h1>

          {/* Subtítulo épico */}
          <div className="mb-8">
            <p className="text-3xl md:text-4xl font-bold text-white mb-4 animate-bounce">
              🎉 ¡VICTORIA ÉPICA! 🎉
            </p>
            <p className="text-xl md:text-2xl text-yellow-300 font-semibold">
              ¡Has conquistado el juego de memoria!
            </p>
          </div>

          {/* Puntuación */}
          {score && (
            <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 inline-block animate-pulse">
              <p className="text-2xl md:text-3xl font-black text-white">
                PUNTUACIÓN FINAL
              </p>
              <p className="text-4xl md:text-6xl font-black text-yellow-300">
                {score.toLocaleString()}
              </p>
              <p className="text-lg text-white opacity-90">puntos</p>
            </div>
          )}

          {/* Efectos de texto animado */}
          <div className="mb-8">
            <div className="flex justify-center gap-4 text-4xl">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🏆</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🎉</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🏅</span>
            </div>
          </div>

          {/* Botón de continuar */}
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-black py-4 px-8 rounded-2xl text-xl transform hover:scale-110 transition-all duration-300 shadow-2xl animate-pulse"
          >
            ¡CONTINUAR LA AVENTURA!
          </button>
        </div>

        {/* Rayos de luz de fondo */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-20"
              style={{
                width: '2px',
                height: '100%',
                left: `${12.5 * (i + 1)}%`,
                animation: `lightRay 2s linear infinite`,
                animationDelay: `${i * 0.25}s`,
                transformOrigin: 'center bottom',
                transform: `rotate(${i * 45}deg)`
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default VictoryCelebration;
