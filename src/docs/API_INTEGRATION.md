# API Integration Feature

## 📋 Resumen

Esta feature implementa la integración completa con las 4 APIs externas requeridas para el juego de memoria:

- **Rick and Morty API** - https://rickandmortyapi.com/api
- **Star Wars API (SWAPI)** - https://swapi.dev/api  
- **Game of Thrones API** - https://thronesapi.com/api/v2
- **Pokemon API** - https://pokeapi.co/api/v2

## 🏗️ Arquitectura

### Servicios (`/services`)
- `apiClient.js` - Cliente HTTP base con manejo de errores
- `rickMortyService.js` - Servicio para Rick and Morty API
- `starWarsService.js` - Servicio para Star Wars API  
- `gameOfThronesService.js` - Servicio para Game of Thrones API
- `pokemonService.js` - Servicio para Pokemon API

### Adaptadores (`/adapters`)
- `rickMortyAdapter.js` - Normaliza datos de Rick and Morty
- `starWarsAdapter.js` - Normaliza datos de Star Wars
- `gameOfThronesAdapter.js` - Normaliza datos de Game of Thrones
- `pokemonAdapter.js` - Normaliza datos de Pokemon

### Hooks (`/hooks`)
- `useRickMortyCharacters.js` - Hook para Rick and Morty
- `useStarWarsCharacters.js` - Hook para Star Wars
- `useGameOfThronesCharacters.js` - Hook para Game of Thrones
- `usePokemonCharacters.js` - Hook para Pokemon
- `useGameCharacters.js` - Hook principal unificado

### Tipos (`/types`)
- `character.js` - Contrato unificado y tipos

### Configuración (`/config`)
- `queryClient.js` - Configuración de TanStack Query

## 🎯 Contrato Unificado

Todos los personajes se normalizan al siguiente contrato:

```javascript
{
  id: string,           // Formato: "rm_1", "sw_1", "got_1", "pk_1"
  name: string,         // Nombre del personaje
  image: string,        // URL de la imagen
  theme: string,        // "rickandmorty" | "starwars" | "gameofthrones" | "pokemon" | "mixed"
  originalData: object  // Datos originales de la API (opcional)
}
```

## 🔧 Uso

### Hook Principal
```javascript
import { useGameCharacters } from './hooks/useGameCharacters.js';
import { THEMES } from './types/character.js';

// Obtener 8 personajes de Rick and Morty
const { data, isLoading, error } = useGameCharacters(THEMES.RICK_MORTY, 8);

// Obtener 12 personajes mixtos
const { data, isLoading, error } = useGameCharacters(THEMES.MIXED, 12);
```

### Hooks Específicos
```javascript
import { useRickMortyCharacters } from './hooks/useRickMortyCharacters.js';

const { data, isLoading, error } = useRickMortyCharacters(8, 1);
```

## 📊 Configuración de Cache

- **Stale Time**: 5-15 minutos según la API
- **Cache Time**: 10-60 minutos según la estabilidad de datos
- **Retry**: 3 intentos con backoff exponencial
- **Refetch**: Solo en reconexión, no en focus

## 🧪 Testing

Usar el componente `ApiTestComponent` para probar la integración:

```javascript
import ApiTestComponent from './components/common/ApiTestComponent.jsx';

// Renderizar en App.jsx temporalmente
<ApiTestComponent />
```

## 🚨 Manejo de Errores

- Fallbacks para imágenes faltantes
- Retry automático con backoff
- Logging de errores en consola
- Estados de error manejados en hooks

## 📈 Performance

- Lazy loading de personajes
- Cache inteligente por tema
- Paginación donde es posible
- Normalización eficiente de datos

## 🔄 Próximos Pasos

1. Integrar con el sistema de niveles
2. Implementar lógica de barajeo
3. Conectar con el estado del juego
4. Optimizar para el tema mixto
