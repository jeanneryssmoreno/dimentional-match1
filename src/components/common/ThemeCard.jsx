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
      className="p-0 border-2 border-transparent hover:border-blue-500 overflow-hidden group"
    >
      {/* Imagen de fondo con overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={theme.image} 
          alt={theme.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay con gradiente del tema */}
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.color} opacity-40 group-hover:opacity-30 transition-opacity duration-300`}></div>
      </div>
      
      {/* Contenido de la tarjeta */}
      <div className="p-6 text-center bg-white dark:bg-gray-800">
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

