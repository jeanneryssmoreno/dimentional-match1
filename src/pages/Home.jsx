/**
 * Página Principal - Home
 * Selección de temas con modal de reglas integrado
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEME_LIST } from '../constants/themes';
import ThemeCard from '../components/common/ThemeCard';
import RulesModal from '../components/game/RulesModal';
import Button from '../components/ui/Button';

export default function Home() {
  const [showRules, setShowRules] = useState(false);
  const navigate = useNavigate();

  const handleThemeSelect = (theme) => {
    // Navegar al juego con el tema seleccionado
    navigate(`/game/${theme.id}`);
  };

  const handleShowRules = () => {
    setShowRules(true);
  };

  const handleCloseRules = () => {
    setShowRules(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="text-8xl mb-6">🧠</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dimentional Match
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          ¡Pon a prueba tu memoria con personajes de tus universos favoritos! 
          Encuentra los pares antes de que se acabe el tiempo.
        </p>
        
        {/* Botón de Reglas */}
        <Button 
          onClick={handleShowRules}
          variant="outline"
          size="large"
          className="mb-8"
        >
          📖 Ver Reglas del Juego
        </Button>
      </section>

      {/* Selección de Temas */}
      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
          🎯 Elige tu Universo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {THEME_LIST.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              onSelect={handleThemeSelect}
            />
          ))}
        </div>
      </section>

      {/* Características del Juego */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          ✨ Características
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">5 Niveles</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Desde principiante hasta experto
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Sistema de Rachas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Multiplica tu puntuación
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Puntuación</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Sistema de puntos y bonificaciones
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">5 Temas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Rick & Morty, Star Wars, y más
            </p>
          </div>
        </div>
      </section>

      {/* Modal de Reglas */}
      <RulesModal 
        isOpen={showRules}
        onClose={handleCloseRules}
      />
    </div>
  );
}