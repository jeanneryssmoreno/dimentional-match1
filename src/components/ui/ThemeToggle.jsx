/**
 * Componente flotante para cambiar entre tema claro y oscuro
 */

import useTheme from "../../contexts/useTheme";

export default function ThemeToggle({ className = "", position = "fixed" }) {
  const { theme, toggleTheme } = useTheme();
  
  const handleToggle = () => {
    console.log('🖱️ Botón clickeado - Tema actual:', theme);
    toggleTheme();
  };

  const baseClasses = position === "fixed" 
    ? "fixed top-20 right-4 z-50" 
    : "absolute top-4 right-4";
  
  return (
    <button
      onClick={handleToggle}
      className={`${baseClasses} px-3 py-2 rounded-full bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 text-white text-sm border border-gray-600 dark:border-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
      aria-label="Toggle dark/light mode"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
