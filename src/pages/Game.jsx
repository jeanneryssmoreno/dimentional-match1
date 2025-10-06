/**
 * Página del Juego
 * Placeholder que se integrará con GameBoard de Developer 3 en Sprint 3
 */

import { useParams, useNavigate } from 'react-router-dom';
import { THEME_LIST } from '../constants/themes';
import Button from '../components/ui/Button';

export default function Game() {
  const { theme } = useParams();
  const navigate = useNavigate();
  
  const selectedTheme = THEME_LIST.find(t => t.id === theme);
  
  const handleBackToHome = () => {
    navigate('/');
  };

  const handleStartGame = () => {
    // En Sprint 3, esto navegará a la página con GameBoard de Developer 3
    navigate(`/game-test?theme=${theme}&level=1`);
  };

  return (
    <div className="max-w-7xl mx-auto text-center">
      {/* Header del Juego */}
      <div className="mb-12">
        <div className="text-6xl mb-4">{selectedTheme?.icon}</div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {selectedTheme?.name}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Preparando el tablero de juego...
        </p>
      </div>

      {/* Placeholder del Tablero */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mb-8">
        <div className="text-8xl mb-6">🎮</div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Tablero del Juego
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          El tablero interactivo ya está implementado por Developer 3. 
          Esta página se integrará con el componente GameBoard en el Sprint 3.
        </p>
        
        {/* Información del Tema */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Información del Tema Seleccionado:
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Nombre:</strong> {selectedTheme?.name}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Descripción:</strong> {selectedTheme?.description}
              </p>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>API:</strong> {selectedTheme?.api || 'Combinación de APIs'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>ID del Tema:</strong> {theme}
              </p>
            </div>
          </div>
        </div>

        {/* Próximas Funcionalidades */}
        <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-green-800 dark:text-green-400 mb-2">
              ✅ Ya Implementado (Developer 3)
            </h5>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Tablero interactivo con cartas</li>
              <li>• Lógica del juego de memoria</li>
              <li>• Sistema de niveles y timer</li>
              <li>• Integración con APIs reales</li>
              <li>• Sistema de puntuación y rachas</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">
              🔜 Sprint 3 (Integración)
            </h5>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• Integrar GameBoard aquí</li>
              <li>• Conectar con GameContext</li>
              <li>• Navegación entre niveles</li>
              <li>• Pantallas de victoria/derrota</li>
            </ul>
          </div>
        </div>

        {/* Botón de Prueba */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={handleStartGame}
            size="large"
            variant="primary"
          >
            🎮 Probar Juego (GameTest)
          </Button>
        </div>
      </div>

      {/* Botón Volver */}
      <Button 
        onClick={handleBackToHome}
        variant="outline"
        size="large"
      >
        ← Volver al Home
      </Button>
    </div>
  );
}