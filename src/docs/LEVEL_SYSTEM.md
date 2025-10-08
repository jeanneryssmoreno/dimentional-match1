# Level System Feature - Sistema Avanzado de Niveles

## 📋 Resumen

Esta feature implementa un sistema completo de niveles y progresión para el juego de memoria dimensional, incluyendo desbloqueos progresivos, estadísticas detalladas, logros y transiciones fluidas entre niveles.

## 🏗️ Arquitectura

### Estructura de Archivos

```
src/
├── types/
│   └── levels.js                    # Configuración y tipos de niveles
├── hooks/
│   └── useLevelProgress.js          # Hook para manejo de progreso
├── components/levels/
│   ├── LevelSelector.jsx            # Selector principal de niveles
│   ├── LevelCard.jsx                # Carta individual de nivel
│   ├── ProgressSummary.jsx          # Resumen de progreso general
│   ├── LevelTransition.jsx          # Transición entre niveles
│   └── LevelSystemTest.jsx          # Componente de testing
└── docs/
    └── LEVEL_SYSTEM.md              # Esta documentación
```

## 🎯 Componentes Principales

### 1. Sistema de Configuración de Niveles (`levels.js`)

**Responsabilidad**: Definir la configuración completa de cada nivel.

**Configuración por nivel**:
- **Metadatos**: ID, nombre, descripción, dificultad
- **Mecánicas**: Pares, cartas, tiempo límite
- **Requisitos**: Nivel anterior, puntuación mínima, precisión mínima
- **Recompensas**: Puntos base, bonus de tiempo, bonus perfecto
- **Características especiales**: Pistas disponibles, barajeo especial (nivel 5)
- **Tema visual**: Colores personalizados por nivel

### 2. Hook de Progreso (`useLevelProgress.js`)

**Responsabilidad**: Manejar el estado y persistencia del progreso del jugador.

**Funcionalidades**:
- Persistencia automática en localStorage
- Actualización de estadísticas por nivel
- Detección de nuevos récords
- Sistema de logros dinámico
- Cálculo de progreso general
- Funciones de reset y limpieza

### 3. LevelSelector Component

**Responsabilidad**: Interfaz principal para selección de niveles.

**Características**:
- Grid responsivo de cartas de nivel
- Indicadores visuales de estado (bloqueado, disponible, completado, perfecto)
- Resumen de progreso expandible
- Detalles completos del nivel seleccionado
- Sistema de logros y badges
- Información de requisitos y recompensas

### 4. LevelCard Component

**Responsabilidad**: Representación visual individual de cada nivel.

**Estados visuales**:
- **Bloqueado**: Overlay gris con candado
- **Disponible**: Colores normales, interactivo
- **Completado**: Borde verde, checkmark
- **Perfecto**: Borde dorado, estrella, efecto de brillo

### 5. LevelTransition Component

**Responsabilidad**: Pantalla de transición al completar un nivel.

**Funcionalidades**:
- Animaciones de entrada suaves
- Rating de rendimiento con estrellas
- Desglose detallado de puntuación
- Información del siguiente nivel
- Botones contextuales (continuar, repetir, seleccionar)
- Detección automática del nivel final

## 🎮 Sistema de Niveles

### Configuración de Dificultad

| Nivel | Nombre | Pares | Tiempo | Dificultad | Pistas | Requisitos |
|-------|--------|-------|--------|------------|--------|------------|
| 1 | Principiante | 4 | 120s | Easy | 3 | Ninguno |
| 2 | Fácil | 5 | 105s | Easy | 2 | Nivel 1 + 500pts + 60% |
| 3 | Intermedio | 6 | 90s | Medium | 1 | Nivel 2 + 800pts + 70% |
| 4 | Difícil | 7 | 75s | Hard | 0 | Nivel 3 + 1200pts + 80% |
| 5 | Experto | 8 | 60s | Expert | 0 | Nivel 4 + 1800pts + 90% |

### Sistema de Desbloqueo

```javascript
// Requisitos para desbloquear un nivel
unlockRequirements: {
  previousLevel: number,    // Nivel anterior completado
  minScore: number,         // Puntuación mínima requerida
  minAccuracy: number       // Precisión mínima requerida
}
```

### Estados de Nivel

- **LOCKED**: Nivel bloqueado (requisitos no cumplidos)
- **AVAILABLE**: Nivel disponible para jugar
- **COMPLETED**: Nivel completado
- **PERFECT**: Nivel completado con puntuación perfecta

## 🏆 Sistema de Logros

### Logros Automáticos

- **🎯 Primer Nivel**: Completar el primer nivel
- **🔥 En Racha**: Completar 3 niveles
- **⭐ Perfeccionista**: Primer nivel con puntuación perfecta
- **👑 Completista**: Completar todos los niveles
- **🏆 Maestro Absoluto**: Todos los niveles con puntuación perfecta

### Cálculo de Rating

```javascript
// Fórmula de rating de rendimiento
performanceScore = (accuracy * 0.4) + (timeEfficiency * 0.3) + (gameProgress * 0.3)

// Rangos de rating
90+ → Maestro (5 estrellas)
75+ → Experto (4 estrellas)
60+ → Avanzado (3 estrellas)
40+ → Intermedio (2 estrellas)
<40 → Principiante (1 estrella)
```

## 💾 Persistencia de Datos

### Estructura de Progreso

```javascript
playerProgress = {
  [levelId]: {
    completed: boolean,
    attempts: number,
    bestScore: number,
    bestAccuracy: number,
    bestTime: number,
    bestMoves: number,
    totalScore: number,
    totalTime: number,
    firstCompletedAt: timestamp,
    lastPlayedAt: timestamp
  }
}
```

### Auto-guardado

- **Trigger**: Cada actualización de progreso
- **Storage**: localStorage con clave `memoryGame_levelProgress`
- **Backup**: Manejo de errores con fallback
- **Limpieza**: Reset manual disponible

## 🎨 Temas Visuales por Nivel

Cada nivel tiene su propio esquema de colores:

- **Nivel 1**: Azul (principiante, confiable)
- **Nivel 2**: Verde (progreso, crecimiento)
- **Nivel 3**: Naranja (desafío moderado)
- **Nivel 4**: Rojo (dificultad alta)
- **Nivel 5**: Púrpura (maestría, élite)

## 🔧 Integración con GameContext

### Nuevas Acciones

```javascript
GAME_ACTIONS = {
  // ... acciones existentes
  ADVANCE_LEVEL: 'ADVANCE_LEVEL',        // Avanzar al siguiente nivel
  SET_LEVEL_PROGRESS: 'SET_LEVEL_PROGRESS' // Actualizar progreso
}
```

### Funciones Integradas

- `advanceLevel()`: Progresión automática al siguiente nivel
- `updateLevelProgress()`: Actualización de estadísticas
- `getLevelConfig()`: Obtener configuración desde `levels.js`

## 🧪 Testing

### LevelSystemTest Component

**Funcionalidades de prueba**:
- Selector de modo (LevelSelector / LevelTransition)
- Simulación de resultados (perfecto, bueno, fallido)
- Reset completo de progreso
- Vista en tiempo real del estado
- Controles de debugging

### Casos de Prueba Recomendados

1. **Desbloqueo progresivo**: Verificar que los niveles se desbloqueen correctamente
2. **Persistencia**: Recargar página y verificar que el progreso se mantiene
3. **Logros**: Probar activación de diferentes logros
4. **Transiciones**: Verificar animaciones y flujo entre niveles
5. **Estados visuales**: Comprobar todos los estados de las cartas de nivel
6. **Responsive**: Probar en diferentes tamaños de pantalla
7. **Accesibilidad**: Navegación por teclado y lectores de pantalla

## 🚀 Próximas Mejoras

### Funcionalidades Futuras

- **Modo Desafío**: Niveles especiales con mecánicas únicas
- **Temporadas**: Eventos limitados con recompensas especiales
- **Multijugador**: Competencia entre jugadores
- **Customización**: Temas personalizables por nivel
- **Estadísticas Avanzadas**: Gráficos de progreso temporal
- **Exportar/Importar**: Backup y sincronización de progreso

### Optimizaciones Técnicas

- **Lazy Loading**: Cargar componentes bajo demanda
- **Memoización**: Optimizar re-renders con React.memo
- **Animaciones**: Transiciones más fluidas con Framer Motion
- **PWA**: Funcionalidad offline completa
- **Analytics**: Tracking de métricas de juego

## 📚 Dependencias

### Internas
- `GameContext` - Integración con lógica del juego
- `useGameCharacters` - Carga de personajes por tema
- `gameUtils` - Utilidades compartidas

### Externas
- React 18+ (Hooks, Context)
- TailwindCSS (Estilos responsivos)
- localStorage API (Persistencia)

## 🔗 Rutas de Testing

- **`/level-test`** - Componente completo de testing
- **Funcionalidades**:
  - Selector de niveles interactivo
  - Simulación de resultados
  - Vista previa de transiciones
  - Controles de debugging
  - Reset de progreso

## 📊 Métricas de Rendimiento

### KPIs del Sistema

- **Tiempo de carga**: < 100ms para cambio de nivel
- **Persistencia**: 100% confiable en localStorage
- **Responsive**: Funcional en pantallas 320px+
- **Accesibilidad**: WCAG 2.1 AA compliant
- **Animaciones**: 60fps en transiciones

La arquitectura está diseñada para ser modular, extensible y fácil de mantener, permitiendo futuras mejoras sin afectar el código existente.
