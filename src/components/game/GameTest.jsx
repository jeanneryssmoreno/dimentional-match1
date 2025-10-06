/**
 * Componente de prueba para validar la lógica del juego
 */

import React, { useState } from 'react';
import { GameProvider } from '../../contexts/GameContext.jsx';
import { THEMES } from '../../types/character.js';
import GameBoard from './GameBoard.jsx';

/**
 * Componente de prueba del juego
 */
const GameTest = () => {
  const [selectedTheme, setSelectedTheme] = useState(THEMES.RICK_MORTY);
  const [selectedLevel, setSelectedLevel] = useState(1);

  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🧠 Memory Game - Test de Lógica
            </h1>
            <p className="text-gray-600">
              Prueba completa de la lógica del juego de memoria dimensional
            </p>
          </div>

          {/* Controles de configuración */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Configuración de Prueba
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selector de tema */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(THEMES).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTheme === theme
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1).replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de nivel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === level
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Información del nivel seleccionado */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Configuración del Nivel {selectedLevel}:
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Pares:</span>
                  <span className="ml-2 font-medium">
                    {getLevelPairs(selectedLevel)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Cartas totales:</span>
                  <span className="ml-2 font-medium">
                    {getLevelPairs(selectedLevel) * 2}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo:</span>
                  <span className="ml-2 font-medium">
                    {getLevelTime(selectedLevel)}s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tablero del juego */}
          <GameBoard theme={selectedTheme} level={selectedLevel} />

          {/* Información de testing */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🧪 Funcionalidades a Probar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Lógica del Juego:</h4>
                <ul className="space-y-1 text-blue-600">
                  <li>✓ Barajeo aleatorio de cartas</li>
                  <li>✓ Detección de coincidencias</li>
                  <li>✓ Estados de cartas (oculta, revelada, emparejada)</li>
                  <li>✓ Límite de 2 cartas reveladas simultáneamente</li>
                  <li>✓ Auto-ocultación de cartas no coincidentes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Funcionalidades:</h4>
                <ul className="space-y-1 text-blue-600">
                  <li>✓ Timer con decrementación automática</li>
                  <li>✓ Sistema de puntuación dinámico</li>
                  <li>✓ Pausa y reanudación del juego</li>
                  <li>✓ Estadísticas en tiempo real</li>
                  <li>✓ Detección de finalización del juego</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Instrucciones de prueba */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              📋 Instrucciones de Prueba
            </h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p><strong>1. Configuración:</strong> Selecciona diferentes temas y niveles para probar la carga de personajes.</p>
              <p><strong>2. Inicio del juego:</strong> Presiona "Iniciar Juego" y verifica que el timer comience.</p>
              <p><strong>3. Jugabilidad:</strong> Haz clic en las cartas para revelarlas y busca coincidencias.</p>
              <p><strong>4. Pausa:</strong> Usa el botón de pausa para verificar que el timer se detiene.</p>
              <p><strong>5. Estadísticas:</strong> Observa cómo cambian las estadísticas durante el juego.</p>
              <p><strong>6. Finalización:</strong> Completa el juego o deja que se agote el tiempo para probar ambos finales.</p>
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

/**
 * Obtiene el número de pares por nivel
 */
function getLevelPairs(level) {
  const pairs = { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8 };
  return pairs[level] || 4;
}

/**
 * Obtiene el tiempo por nivel
 */
function getLevelTime(level) {
  const times = { 1: 120, 2: 105, 3: 90, 4: 75, 5: 60 };
  return times[level] || 120;
}

export default GameTest;
