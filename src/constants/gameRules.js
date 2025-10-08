/**
 * Constantes y datos de las reglas del juego
 * Adaptado para trabajar con el sistema de Developer 3
 */

import { LEVEL_CONFIG } from '../types/levels';
import { GAME_STATES } from '../types/game';

/**
 * Reglas generales del juego para mostrar en el modal
 */
export const GAME_RULES = {
  title: "¿Cómo jugar?",
  objective: "Encuentra todos los pares de cartas antes de que se acabe el tiempo y avanza por los 5 niveles.",
  
  howToPlay: [
    { 
      icon: "🎯", 
      title: "Selecciona un tema", 
      description: "Elige tu universo favorito para empezar" 
    },
    { 
      icon: "🃏", 
      title: "Voltea las cartas", 
      description: "Haz clic en dos cartas para voltearlas y ver su contenido" 
    },
    { 
      icon: "✨", 
      title: "Encuentra parejas", 
      description: "Si las cartas coinciden, permanecen volteadas" 
    },
    { 
      icon: "🔄", 
      title: "Intenta de nuevo", 
      description: "Si no coinciden, se voltean de nuevo y debes recordar su posición" 
    },
    { 
      icon: "⏱️", 
      title: "Completa a tiempo", 
      description: "Encuentra todos los pares antes de que termine el tiempo" 
    },
    { 
      icon: "🎮", 
      title: "Avanza de nivel", 
      description: "Cada nivel tiene más cartas y menos tiempo" 
    }
  ],
  
  specialFeatures: [
    { 
      icon: "🔀", 
      title: "Barajeo Especial", 
      description: "En el nivel 5, las cartas se barajan después de cada match exitoso" 
    },
    { 
      icon: "🎯", 
      title: "Sistema de Rachas", 
      description: "Consigue rachas de aciertos para multiplicar tu puntuación" 
    },
    { 
      icon: "🏆", 
      title: "Sistema de Puntuación", 
      description: "Gana puntos por cada match, bonos de tiempo y multiplicadores de nivel" 
    }
  ],
  
  scoring: {
    matchPoints: 100,
    timeBonus: "2x por tiempo restante",
    streakBonus: "1.5x por rachas",
    levelMultiplier: "Hasta 2x en nivel experto"
  }
};

/**
 * Obtiene la información de niveles formateada para el modal
 * Usa la configuración de Developer 3 (LEVEL_CONFIG)
 */
export function getGameLevelsForDisplay() {
  return Object.values(LEVEL_CONFIG).map(level => ({
    level: level.id,
    cards: level.cards,
    time: level.time,
    desc: level.description,
    difficulty: getDifficultyLabel(level.difficulty),
    special: level.special ? "Las cartas se barajan después de cada match" : null,
    rewards: level.rewards
  }));
}

/**
 * Obtiene etiqueta de dificultad en español
 */
function getDifficultyLabel(difficulty) {
  const labels = {
    'easy': 'Fácil',
    'medium': 'Medio',
    'hard': 'Difícil',
    'expert': 'Muy Difícil'
  };
  return labels[difficulty] || 'Desconocido';
}

/**
 * Obtiene el color de la etiqueta de dificultad
 */
export function getDifficultyColor(difficulty) {
  const colors = {
    'easy': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'hard': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'expert': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };
  return colors[difficulty] || colors.easy;
}