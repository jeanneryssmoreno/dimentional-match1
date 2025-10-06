/**
 * Componente de prueba para verificar integración de APIs
 * Este componente se puede usar temporalmente para probar las APIs
 */

import React, { useState } from 'react';
import { useGameCharacters } from '../../hooks/useGameCharacters.js';
import { THEMES } from '../../types/character.js';

const ApiTestComponent = () => {
  const [selectedTheme, setSelectedTheme] = useState(THEMES.RICK_MORTY);
  const [characterCount, setCharacterCount] = useState(8);

  const { data: characters, isLoading, error, isError } = useGameCharacters(selectedTheme, characterCount);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleCountChange = (count) => {
    setCharacterCount(count);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">Cargando personajes...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Error al cargar personajes:</strong>
        <span className="block sm:inline"> {error?.message || 'Error desconocido'}</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Prueba de Integración de APIs</h2>
      
      {/* Controles */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tema:</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(THEMES).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTheme === theme
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Número de personajes:</label>
          <div className="flex gap-2">
            {[4, 6, 8, 10, 12, 16].map((count) => (
              <button
                key={count}
                onClick={() => handleCountChange(count)}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  characterCount === count
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Personajes cargados: {characters?.length || 0} / {characterCount}
        </h3>
        <p className="text-sm text-gray-600">Tema: {selectedTheme}</p>
      </div>

      {/* Grid de personajes */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {characters?.map((character, index) => (
          <div key={character.id} className="bg-white rounded-lg shadow-md p-4 text-center">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-32 object-cover rounded-lg mb-2"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
              }}
            />
            <h4 className="font-medium text-sm truncate" title={character.name}>
              {character.name}
            </h4>
            <p className="text-xs text-gray-500 capitalize">{character.theme}</p>
            <p className="text-xs text-gray-400">ID: {character.id}</p>
          </div>
        ))}
      </div>

      {/* Información de debug */}
      <details className="mt-8">
        <summary className="cursor-pointer font-medium text-gray-700">
          Información de Debug (Click para expandir)
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
          {JSON.stringify({ selectedTheme, characterCount, charactersLoaded: characters?.length }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default ApiTestComponent;
