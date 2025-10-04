--

# 🌳 Plan de Git Flow

## Estructura de Ramas

### Ramas Principales

- **`main`** (producción)

  - Código estable y listo para producción
  - Solo se actualiza mediante merge desde `develop`
  - Cada commit debe estar etiquetado con versión (v1.0.0, v1.1.0, etc.)

- **`develop`** (desarrollo)
  - Rama de integración principal
  - Contiene las últimas funcionalidades desarrolladas
  - Base para crear feature branches

### Ramas de Soporte

#### Feature Branches

- **Nomenclatura**: `feature/[nombre-funcionalidad]`
- **Ejemplos basados en el proyecto**:
  - `feature/project-setup`
  - `feature/api-integration`
  - `feature/multiplayer-system`
  - `feature/card-animations`
- **Origen**: `develop`
- **Destino**: `develop`

#### Release Branches

- **Nomenclatura**: `release/[version]`
- **Ejemplos**: `release/1.0.0`, `release/1.1.0`
- **Origen**: `develop`
- **Destino**: `main` y `develop`

#### Hotfix Branches

- **Nomenclatura**: `hotfix/[descripcion]`
- **Ejemplos**: `hotfix/api-timeout-fix`, `hotfix/memory-leak-patch`
- **Origen**: `main`
- **Destino**: `main` y `develop`

## 🔄 Flujo de Trabajo por Sprint

### Sprint 1: Setup y Arquitectura Base

```bash
# Developer 1: Configuración base
git checkout develop
git pull origin develop
git checkout -b feature/project-setup
# ... desarrollo ...
git add .
git commit -m "feat(setup): configurar vite, react y tailwind"
git push origin feature/project-setup

# Developer 2: Home page
git checkout develop
git pull origin develop
git checkout -b feature/home-page
# ... desarrollo ...
git commit -m "feat(home): crear página principal con selección de temas"

# Developer 3: APIs research
git checkout develop
git pull origin develop
git checkout -b feature/api-research
# ... desarrollo ...
git commit -m "docs(api): investigar y documentar estructura de APIs"

# Developer 4: Animaciones básicas
git checkout develop
git pull origin develop
git checkout -b feature/basic-animations
# ... desarrollo ...
git commit -m "feat(animations): implementar animaciones básicas de cartas"
```

### Integración de Features

```bash
# Después de code review y aprobación
git checkout develop
git pull origin develop
git merge --no-ff feature/project-setup
git merge --no-ff feature/home-page
git merge --no-ff feature/api-research
git merge --no-ff feature/basic-animations

# Limpiar branches locales
git branch -d feature/project-setup
git branch -d feature/home-page
git branch -d feature/api-research
git branch -d feature/basic-animations
```

## 📝 Convenciones de Commits

### Formato Estándar (Conventional Commits)

```
<tipo>(<ámbito>): <descripción>

[cuerpo opcional]

[pie opcional]
```

### Tipos de Commit Específicos del Proyecto

- **`feat`**: Nueva funcionalidad del juego
- **`fix`**: Corrección de bugs
- **`api`**: Cambios relacionados con APIs
- **`ui`**: Cambios en interfaz de usuario
- **`game`**: Lógica específica del juego
- **`perf`**: Mejoras de performance
- **`test`**: Agregar o modificar tests
- **`docs`**: Cambios en documentación
- **`style`**: Cambios de formato
- **`refactor`**: Refactorización de código
- **`chore`**: Tareas de mantenimiento

### Ejemplos por Developer

#### Developer 1 (Arquitectura)

```bash
feat(setup): configurar vite con react y tailwind
feat(theme): implementar sistema de dark/light mode
feat(layout): crear componentes base de layout
chore(config): configurar eslint y prettier
```

#### Developer 2 (Home y Navegación)

```bash
feat(home): crear página de selección de temas
feat(modal): implementar modal de reglas del juego
ui(components): crear componentes Button y Card reutilizables
feat(navigation): implementar sistema de rutas
```

#### Developer 3 (APIs y Lógica)

```bash
api(rickmorty): integrar Rick and Morty API
api(starwars): integrar Star Wars API (SWAPI)
api(pokemon): integrar Pokemon API
feat(normalization): crear adaptadores para normalizar datos de APIs
game(logic): implementar lógica básica del juego de memoria
feat(levels): crear sistema de niveles progresivos
feat(timer): implementar timer con decrementación automática
```

#### Developer 4 (Multijugador y Animaciones)

```bash
feat(multiplayer): implementar sistema de 2 jugadores
feat(animations): crear animaciones de flip de cartas
feat(effects): agregar efectos visuales de match
feat(reset): implementar funcionalidad de reset del juego
perf(animations): optimizar rendimiento de animaciones
```

## 🚀 Configuración del Entorno

### Scripts Actualizados para el Proyecto

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

### Pre-commit Hooks Específicos

```bash
# Instalar dependencias para hooks
npm install --save-dev husky lint-staged prettier

# Configurar hooks
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

### Lint-staged para el Proyecto

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"],
    "*.{js,jsx,ts,tsx}": [
      "npm run test -- --passWithNoTests --findRelatedTests"
    ]
  }
}
```

## 📊 Versionado por Sprints

### Sprint-based Versioning

- **v0.1.0**: Sprint 1 - Setup y arquitectura base
- **v0.2.0**: Sprint 2 - Home, APIs y multijugador básico
- **v0.3.0**: Sprint 3 - Sistema de niveles y animaciones
- **v1.0.0**: Sprint 4 - Versión final integrada

### Release Process por Sprint

```bash
# Al final de cada sprint
git checkout develop
git pull origin develop
git checkout -b release/0.1.0

# Actualizar versión en package.json
npm version patch --no-git-tag-version

# Testing final del sprint
npm run lint
npm run test
npm run build

# Merge a main
git checkout main
git pull origin main
git merge --no-ff release/0.1.0
git tag -a v0.1.0 -m "Sprint 1: Setup y arquitectura base"

# Merge back a develop
git checkout develop
git merge --no-ff release/0.1.0

# Deploy y cleanup
git push origin main develop --tags
git branch -d release/0.1.0
```

## 🔧 Automatización CI/CD

### GitHub Actions para el Juego de Memoria

```yaml
# .github/workflows/ci.yml
name: Memory Game CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Run tests
        run: npm run test

      - name: Build application
        run: npm run build

      - name: Test APIs connectivity
        run: npm run test:api
        env:
          NODE_ENV: test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: echo "Deploy to production server"
```

## 📋 Checklist por Tipo de Feature

### Para Features de API (Developer 3)

- [ ] Verificar conectividad con API externa
- [ ] Implementar manejo de errores y fallbacks
- [ ] Crear adaptador para normalización de datos
- [ ] Agregar tests para el adaptador
- [ ] Documentar estructura de datos normalizada
- [ ] Verificar rate limits de la API

### Para Features de UI (Developer 2)

- [ ] Verificar responsive design
- [ ] Probar en dark/light mode
- [ ] Validar accesibilidad (a11y)
- [ ] Comprobar animaciones fluidas
- [ ] Testing en diferentes navegadores
- [ ] Optimizar imágenes y assets

### Para Features de Juego (Developer 3 & 4)

- [ ] Probar lógica en todos los niveles
- [ ] Verificar timer funcionando correctamente
- [ ] Comprobar sistema de matches
- [ ] Testing multijugador
- [ ] Validar reset functionality
- [ ] Performance testing con muchas cartas

### Para Features de Setup (Developer 1)

- [ ] Verificar build process
- [ ] Comprobar hot reload en desarrollo
- [ ] Validar configuración de linting
- [ ] Testing de configuración de temas
- [ ] Verificar estructura de carpetas
- [ ] Documentar decisiones arquitectónicas

## 🎯 Milestones del Proyecto

### Milestone 1: Foundation (Semana 1-2)

- [x] Proyecto configurado
- [ ] Estructura base implementada
- [ ] Temas básicos funcionando
- [ ] Home page operativa

### Milestone 2: Core Features (Semana 3-4)

- [ ] 4 APIs integradas y normalizadas
- [ ] Lógica de juego completa
- [ ] Sistema multijugador básico
- [ ] Modal de reglas funcional

### Milestone 3: Advanced Features (Semana 5-6)

- [ ] Sistema de niveles completo
- [ ] Timer implementado
- [ ] Animaciones fluidas
- [ ] Reset functionality

### Milestone 4: Polish & Deploy (Semana 7-8)

- [ ] Testing completo
- [ ] Performance optimizada
- [ ] Documentación finalizada
- [ ] Deployment automatizado

---

**Última actualización**: Octubre 2025
**Versión del documento**: 2.0
**Responsable**: Equipo de Desarrollo del Juego de Memoria
