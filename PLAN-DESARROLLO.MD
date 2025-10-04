# Plan de Desarrollo: Juego de Memoria App

## 📋 Información del Proyecto

**Objetivo Principal:** Aplicación de juego de memoria con 5 temas diferentes usando APIs externas.

**Stack Tecnológico:**

- React + Vite
- Tailwind CSS
- TanStack Query (React Query)
- Clean Code, YAGNI, KISS principles

## 🎯 Funcionalidades Principales

### 1. Temas del Juego

- Rick and Morty API
- Star Wars API (SWAPI)
- Game of Thrones (thronesapi.com)
- Pokemon (pokeapi.co)
- Tema mixto (combinación de los 4 anteriores)

### 2. Mecánicas del Juego

- **Niveles:** 5 niveles progresivos
- **Cartas por nivel:**
  - Nivel 1: 8 cartas (120 segundos)
  - Nivel 2: 10 cartas (105 segundos)
  - Nivel 3: 12 cartas (90 segundos)
  - Nivel 4: 14 cartas (75 segundos)
  - Nivel 5: 16 cartas (60 segundos)
- **Timer:** Decrece 15 segundos por nivel
- **Barajeo especial:** En el último nivel, las cartas se barajan al hacer match

### 3. Características Adicionales

- Dark Mode / Light Mode
- Multijugador (máximo 2 jugadores)
- Animaciones de match (brillo de estrellas - opcional)
- Botón reset (voltea y barajea cartas)

## 👥 Asignación de Tareas por Desarrollador

### 🔵 Developer 1: Arquitectura Base y Configuración

**Responsabilidades:**

- Configuración inicial del proyecto (Vite + React + Tailwind)
- Estructura de carpetas y arquitectura del proyecto
- Configuración de TanStack Query
- Componentes base y layout principal
- Sistema de rutas
- Configuración de Dark/Light Mode

**Features asignadas:**

- `feature/project-setup`
- `feature/base-architecture`
- `feature/theme-system`
- `feature/routing-system`

**Entregables:**

- Proyecto configurado y funcional
- Componentes Layout, Header, Footer
- Context para manejo de temas
- Estructura de carpetas definida

---

### 🟢 Developer 2: Home y Sistema de Navegación

**Responsabilidades:**

- Página Home con selección de temas
- Modal de reglas del juego
- Navegación entre pantallas
- Componentes de UI reutilizables
- Sistema de estados globales del juego

**Features asignadas:**

- `feature/home-page`
- `feature/game-rules-modal`
- `feature/navigation-system`
- `feature/ui-components`

**Entregables:**

- Página Home con 5 temas
- Modal de reglas interactivo
- Componentes Button, Card, Modal
- Context para estado del juego

---

### 🟡 Developer 3: Lógica del Juego y APIs

**Responsabilidades:**

- Integración con las 4 APIs externas
- **Normalización de contratos de APIs** (estructura unificada de datos)
- Lógica del juego de memoria
- Sistema de niveles y progresión
- Manejo de cartas y matches
- Sistema de timer

**Features asignadas:**

- `feature/api-integration`
- `feature/api-normalization`
- `feature/game-logic`
- `feature/level-system`
- `feature/timer-system`

**Entregables:**

- Hooks para consumo de APIs
- **Adaptadores/Mappers para normalización de datos de APIs**
- **Interfaz común para todos los temas** (Character, image, name, id)
- Lógica de juego completa
- Sistema de niveles funcional
- Timer con decrementación automática

---

### 🟠 Developer 4: Multijugador y Animaciones

**Responsabilidades:**

- Sistema multijugador (2 jugadores)
- Animaciones de cartas (flip, match, barajeo)
- Efectos visuales y sonoros
- Sistema de puntuación
- Funcionalidad de reset

**Features asignadas:**

- `feature/multiplayer-system`
- `feature/card-animations`
- `feature/visual-effects`
- `feature/reset-functionality`

**Entregables:**

- Sistema multijugador funcional
- Animaciones fluidas de cartas
- Efectos de match y transiciones
- Botón reset con funcionalidad completa

## 📅 Cronograma de Desarrollo

### Sprint 1 (Semana 1-2)

- **Developer 1:** Configuración base y arquitectura
- **Developer 2:** Diseño de Home y componentes UI
- **Developer 3:** Investigación de APIs y estructura de datos
- **Developer 4:** Prototipo de animaciones básicas

### Sprint 2 (Semana 3-4)

- **Developer 1:** Sistema de temas y layout responsive
- **Developer 2:** Modal de reglas y navegación
- **Developer 3:** Integración de APIs, normalización de contratos y lógica básica del juego
- **Developer 4:** Sistema multijugador básico

### Sprint 3 (Semana 5-6)

- **Developer 1:** Optimizaciones y refactoring
- **Developer 2:** Estados globales y persistencia
- **Developer 3:** Sistema de niveles y timer
- **Developer 4:** Animaciones avanzadas y efectos

### Sprint 4 (Semana 7-8)

- **Todos:** Integración final, testing y pulido
- **Todos:** Documentación y deployment

## 🔧 Estructura de Carpetas Propuesta

```
src/
├── components/
│   ├── common/          # Componentes reutilizables
│   ├── game/           # Componentes específicos del juego
│   ├── ui/             # Componentes de interfaz
│   └── layout/         # Componentes de layout
├── hooks/              # Custom hooks
├── services/           # Servicios para APIs
├── contexts/           # Contexts de React
├── utils/              # Utilidades y helpers
├── constants/          # Constantes del proyecto
├── types/              # Tipos de TypeScript (si se usa)
└── styles/             # Estilos globales
```

## 📋 Criterios de Aceptación

### Funcionalidades Mínimas Viables (MVP)

- [x] Selección de tema desde Home
- [x] Modal de reglas funcional
- [x] Juego básico con 5 niveles
- [x] Timer decreciente por nivel
- [x] Sistema de matches
- [x] Dark/Light mode
- [x] Responsive design

### Funcionalidades Avanzadas

- [x] Multijugador (2 jugadores)
- [x] Animaciones de cartas
- [x] Efectos visuales de match
- [x] Barajeo en último nivel
- [x] Sistema de reset

## 🚀 Consideraciones Técnicas

### Normalización de APIs

- **Contrato unificado** para todos los temas:
  ```typescript
  interface Character {
    id: string;
    name: string;
    image: string;
    theme: "rickandmorty" | "starwars" | "gameofthrones" | "pokemon" | "mixed";
  }
  ```
- **Adaptadores por API** para transformar datos específicos al contrato común
- **Mappers centralizados** para mantener consistencia
- **Fallbacks** para datos faltantes o errores de API

### Performance

- Lazy loading de componentes
- Optimización de re-renders
- Caching de datos de APIs
- Normalización de datos para evitar transformaciones repetitivas

### Escalabilidad

- Código modular y reutilizable
- Fácil adición de nuevos niveles
- Estructura preparada para nuevos temas
- Adaptadores extensibles para nuevas APIs

### Calidad de Código

- Principios SOLID
- Clean Code practices
- YAGNI y KISS principles
- Testing unitario (opcional)

## 📝 Notas Adicionales

- Mantener comunicación constante entre desarrolladores
- Code reviews obligatorios antes de merge
- Documentar decisiones técnicas importantes
- Seguir convenciones de naming establecidas
- Priorizar funcionalidad sobre perfección visual en MVP

-
