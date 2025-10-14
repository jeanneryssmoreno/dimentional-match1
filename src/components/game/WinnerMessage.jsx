/**
 * Componente simple para mostrar mensaje de victoria con confeti
 */

import React, { useEffect, useState } from 'react';

const WinnerMessage = ({ isVisible, onClose }) => {
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Crear 30 piezas de confeti
      const pieces = [];
      for (let i = 0; i < 30; i++) {
        pieces.push({
          id: i,
          left: Math.random() * 100, // Posición horizontal aleatoria (0-100%)
          animationDelay: Math.random() * 3, // Delay aleatorio (0-3s)
          color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#96ceb4'][Math.floor(Math.random() * 6)]
        });
      }
      setConfettiPieces(pieces);

      // Auto-cerrar después de 5 segundos
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      {/* Confeti */}
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 opacity-80"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: piece.color,
            animation: `fall 4s linear infinite`,
            animationDelay: `${piece.animationDelay}s`
          }}
        />
      ))}

      {/* Mensaje principal */}
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-black text-yellow-400 mb-8 animate-bounce">
          ¡HAS GANADO!
        </h1>
        
        <div className="text-4xl mb-8">
          🎉 🏆 🎉
        </div>

        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
        >
          Continuar
        </button>
      </div>

      {/* Estilos CSS para la animación de caída */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WinnerMessage;
