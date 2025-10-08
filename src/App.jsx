/**
 * Componente principal de la aplicación
 * Integra GameProvider de Developer 3 con las rutas del Sprint 2
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Game from './pages/Game';
import ApiTestComponent from './components/common/ApiTestComponent';
import GameTest from './components/game/GameTest';
import LevelGameTest from './components/game/LevelGame';

// Crear instancia del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GameProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Rutas Sprint 2 - Developer 2 */}
                <Route path="/" element={<Home />} />
                <Route path="/game/:theme" element={<Game />} />
                
                {/* Rutas de Developer 3 (mantener para testing) */}
                <Route path="/api-test" element={<ApiTestComponent />} />
                <Route path="/game-test" element={<GameTest />} />
                <Route path="/level-test" element={<LevelGameTest />} />
                <Route path="/level-game" element={<LevelGameTest />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </GameProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;