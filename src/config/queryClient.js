/**
 * Configuración de TanStack Query Client
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Configuración del QueryClient para el juego de memoria
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuración por defecto para todas las queries
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Configuración para manejo de errores
      onError: (error) => {
        console.error('Query error:', error);
      },
      
      // Refetch en focus para datos críticos del juego
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // Configuración para mutaciones (si las necesitamos más adelante)
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

/**
 * Configuración específica para queries de APIs externas
 */
export const API_QUERY_CONFIG = {
  // Configuración para APIs que cambian frecuentemente
  dynamic: {
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 5 * 60 * 1000, // 5 minutos
  },
  
  // Configuración para APIs más estáticas
  static: {
    staleTime: 15 * 60 * 1000, // 15 minutos
    cacheTime: 60 * 60 * 1000, // 1 hora
  },
  
  // Configuración para el juego (datos críticos)
  game: {
    staleTime: 0, // Siempre fresh para el juego activo
    cacheTime: 30 * 60 * 1000, // 30 minutos en cache
  }
};
