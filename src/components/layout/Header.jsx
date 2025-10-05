import useTheme  from "../../contexts/useTheme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-gray-800 text-white py-4 shadow">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dimentional Match</h1>
        <button
          onClick={toggleTheme}
          className="ml-4 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm border border-gray-600"
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </div>
    </header>
  );
}
