import useTheme from "../../contexts/useTheme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  
  const handleToggle = () => {
    console.log('🖱️ Botón clickeado - Tema actual:', theme);
    toggleTheme();
  };
  
  return (
    <header className="bg-gray-800 dark:bg-gray-950 text-white py-4 shadow transition-colors duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dimentional Match</h1>
        <button
          onClick={handleToggle}
          className="ml-4 px-3 py-2 rounded bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 text-sm border border-gray-600 dark:border-gray-500 transition-all duration-200"
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </div>
    </header>
  );
}
