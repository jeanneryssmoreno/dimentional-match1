/**
 * Componente ThemeCard
 * Tarjeta para seleccionar un tema del juego
 */

import Card from '../ui/Card';

export default function ThemeCard({ theme, onSelect }) {
  return (
    <Card 
      hover 
      onClick={() => onSelect(theme)}
      className="p-6 border-2 border-transparent hover:border-blue-500"
    >
      <div className={`bg-gradient-to-r ${theme.color} text-white p-6 rounded-lg mb-4`}>
        <div className="text-5xl mb-2 text-center">{theme.icon}</div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {theme.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {theme.description}
        </p>
      </div>
    </Card>
  );
}

