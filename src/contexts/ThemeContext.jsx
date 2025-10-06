import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // El tema ya fue establecido en el HTML por el script
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    console.log('🎨 Cambiando tema a:', theme);
    
    // Remover todas las clases de tema
    root.classList.remove('light', 'dark');
    
    // Agregar la clase del tema actual
    root.classList.add(theme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
    
    // Verificar que se aplicó
    console.log('✅ Clases del HTML:', root.className);
  }, [theme]);

  const toggleTheme = () => {
    console.log('🔄 Toggle theme ejecutado');
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('➡️ Cambiando de', prev, 'a', newTheme);
      return newTheme;
    });
  };

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
