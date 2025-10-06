/**
 * Componente de carta del juego de memoria
 */

import React from 'react';
import { CARD_STATES } from '../../types/game.js';

/**
 * Componente de carta individual
 */
const GameCard = ({ 
  card, 
  onClick, 
  disabled = false, 
  className = '',
  showHint = false 
}) => {
  const isRevealed = card.state === CARD_STATES.REVEALED || card.state === CARD_STATES.MATCHED;
  const isMatched = card.state === CARD_STATES.MATCHED;
  const isHidden = card.state === CARD_STATES.HIDDEN;

  const handleClick = () => {
    if (!disabled && isHidden && onClick) {
      onClick(card.id);
    }
  };

  // Clases CSS dinámicas
  const cardClasses = [
    'relative cursor-pointer transition-all duration-300 transform-gpu',
    'bg-white rounded-lg shadow-md hover:shadow-lg',
    'border-2 border-gray-200',
    className,
    // Estados de la carta
    isMatched && 'border-green-400 bg-green-50',
    isRevealed && !isMatched && 'border-blue-400 bg-blue-50',
    isHidden && !disabled && 'hover:scale-105 hover:border-gray-300',
    disabled && 'cursor-not-allowed opacity-75',
    showHint && 'ring-2 ring-yellow-400 ring-opacity-75'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={isRevealed ? `Carta de ${card.name}` : 'Carta oculta'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Contenido de la carta */}
      <div className="aspect-square p-2 flex flex-col">
        {isRevealed ? (
          // Carta revelada - mostrar imagen y nombre
          <>
            <div className="flex-1 flex items-center justify-center mb-2">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover rounded-md"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-800 truncate" title={card.name}>
                {card.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {card.theme}
              </p>
            </div>
            
            {/* Indicador de match */}
            {isMatched && (
              <div className="absolute top-1 right-1">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </>
        ) : (
          // Carta oculta - mostrar dorso
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center">
              {/* Logo o patrón del dorso */}
              <div className="text-white opacity-75">
                <svg className="w-8 h-8 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Indicador de hint */}
        {showHint && (
          <div className="absolute top-1 left-1">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Efecto de carga para cartas que se están revelando */}
        {card.state === CARD_STATES.REVEALED && (
          <div className="absolute inset-0 bg-blue-200 bg-opacity-50 rounded-lg animate-pulse" />
        )}
      </div>

      {/* Overlay para cartas deshabilitadas */}
      {disabled && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-25 rounded-lg" />
      )}
    </div>
  );
};

export default GameCard;
