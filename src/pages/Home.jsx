/**
 * Página Home
 * Pantalla principal con selección de temas
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeCard from '../components/common/ThemeCard';
import Button from '../components/ui/Button';
import { THEME_LIST } from '../constants/themes';

export default function Home() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const handleStartGame = () => {
    if (selectedTheme) {
      // TODO: Navegación al juego con el tema seleccionado
      console.log('Iniciando juego con tema:', selectedTheme.id);
      // navigate(`/game/${selectedTheme.id}`);
    }
  };

  const handleShowRules = () => {
    // TODO: Mostrar modal de reglas (Sprint 2)
    console.log('Mostrar reglas del juego');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🎮 Juego de Memoria Dimensional
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Pon a prueba tu memoria explorando diferentes universos
        </p>
        
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleShowRules}
            size="large"
          >
            📖 Ver Reglas
          </Button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Selecciona tu Universo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {THEME_LIST.map((theme) => (
            <div
              key={theme.id}
              className={`transform transition-transform ${
                selectedTheme?.id === theme.id ? 'scale-105 ring-4 ring-blue-500 rounded-xl' : ''
              }`}
            >
              <ThemeCard 
                theme={theme} 
                onSelect={handleThemeSelect}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Selected Theme Info */}
      {selectedTheme && (
        <div className="text-center mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700">
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-200">
            Has seleccionado: <span className="font-bold">{selectedTheme.name}</span> {selectedTheme.icon}
          </p>
          <Button 
            onClick={handleStartGame}
            size="large"
            className="px-8"
          >
            🚀 Comenzar Juego
          </Button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
        <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
          ¿Cómo jugar?
        </h4>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="mr-2">🎯</span>
            <span>Selecciona un tema de tu universo favorito</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🃏</span>
            <span>Encuentra todos los pares de cartas antes de que se acabe el tiempo</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">⏱️</span>
            <span>Completa 5 niveles con dificultad creciente</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🏆</span>
            <span>¡Puedes jugar solo o con un amigo!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
