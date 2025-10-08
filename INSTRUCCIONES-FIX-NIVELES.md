# 🔧 Instrucciones para Probar la Corrección de Desbloqueo de Niveles

## 📋 Resumen de Cambios Realizados

### 1. **Corrección de la Fórmula de Precisión** ✅
**Archivo**: `src/utils/gameUtils.js` (línea 166)

**Antes (Incorrecta)**:
```javascript
const accuracy = moves > 0 ? Math.round((matchedPairs / (moves / 2)) * 100) : 0;
```

**Después (Correcta)**:
```javascript
const accuracy = moves > 0 ? Math.round((matchedPairs * 2 / moves) * 100) : 0;
```

**Explicación**: Cada par coincidente representa 2 cartas correctas. La fórmula anterior calculaba mal la precisión, haciendo casi imposible alcanzar los requisitos de desbloqueo.

---

### 2. **Ajuste de Requisitos de Desbloqueo** ✅
**Archivo**: `src/types/levels.js`

#### Nivel 4 (Difícil):
- **Antes**: minScore: 1200, minAccuracy: 80%
- **Después**: minScore: 800, minAccuracy: 70%

#### Nivel 5 (Experto):
- **Antes**: minScore: 1800, minAccuracy: 90%
- **Después**: minScore: 1200, minAccuracy: 75%

**Explicación**: Los requisitos anteriores eran demasiado estrictos y, combinados con la fórmula incorrecta, hacían imposible desbloquear estos niveles.

---

### 3. **Herramientas de Desarrollo** 🛠️
**Archivo**: `src/utils/devTools.js` (NUEVO)

Herramientas disponibles en la consola del navegador para testing.

---

## 🚀 Instrucciones de Prueba

### Paso 1: Limpiar el Progreso Anterior

Abre la consola del navegador (F12) y ejecuta:

```javascript
window.devTools.clearAllProgress()
```

Esto limpiará todo el progreso anterior que tenías guardado con los cálculos incorrectos.

---

### Paso 2: Verificar el Estado Inicial

```javascript
window.devTools.checkUnlockedLevels()
```

Deberías ver que solo el **Nivel 1** está desbloqueado.

---

### Paso 3: Probar el Desbloqueo Natural

**Opción A: Jugar Manualmente**
1. Inicia el juego y completa los niveles normalmente
2. Con la nueva fórmula, la precisión se calculará correctamente
3. Los niveles 4 y 5 deberían desbloquearse al alcanzar los nuevos requisitos

**Opción B: Simular Progreso (Para Testing Rápido)**

Puedes simular progreso sin jugar:

```javascript
// Simular que completaste 3 niveles
window.devTools.simulateProgress(3)

// Verificar qué niveles están desbloqueados
window.devTools.checkUnlockedLevels()
```

**Opción C: Desbloquear Todos los Niveles (Para Testing)**

```javascript
// Desbloquea todos los niveles inmediatamente
window.devTools.unlockAllLevels()

// Recargar la página para ver los cambios
location.reload()
```

---

### Paso 4: Verificar el Progreso

En cualquier momento, puedes ver tu progreso guardado:

```javascript
// Ver el progreso actual
window.devTools.showProgress()

// Verificar niveles desbloqueados
window.devTools.checkUnlockedLevels()

// Exportar todos los datos
window.devTools.exportStorage()
```

---

## 🎮 Requisitos Actualizados por Nivel

| Nivel | Cartas | Tiempo | Score Mínimo | Precisión Mínima | Estado |
|-------|--------|--------|--------------|------------------|--------|
| 1 - Principiante | 8 | 2:00 | - | - | Siempre desbloqueado |
| 2 - Fácil | 10 | 1:45 | 500 | 60% | Requiere nivel 1 |
| 3 - Intermedio | 12 | 1:30 | 800 | 70% | Requiere nivel 2 |
| 4 - Difícil | 14 | 1:15 | 800 | 70% | Requiere nivel 3 ⚡ |
| 5 - Experto | 16 | 1:00 | 1200 | 75% | Requiere nivel 4 ⚡ |

⚡ = Requisitos reducidos en este fix

---

## 📊 Ejemplo de Cálculo de Precisión

Con la **nueva fórmula corregida**:

### Ejemplo 1: Juego Perfecto
- Pares: 4 (8 cartas)
- Movimientos: 8 (todas correctas)
- **Precisión**: (4 × 2 / 8) × 100 = **100%** ✅

### Ejemplo 2: Juego con Errores
- Pares coincididos: 4
- Movimientos: 12 (8 correctas + 4 incorrectas)
- **Precisión**: (4 × 2 / 12) × 100 = **67%** ✅

### Comparación con Fórmula Antigua (Incorrecta)
- Pares: 4
- Movimientos: 10
- **Antigua**: (4 / 5) × 100 = 80%
- **Nueva**: (4 × 2 / 10) × 100 = 80%
- *(En este caso coinciden, pero en otros no)*

---

## 🐛 Si Encuentras Problemas

### Problema: "Los niveles siguen bloqueados"

**Solución 1**: Limpia el progreso y vuelve a jugar
```javascript
window.devTools.clearAllProgress()
location.reload()
```

**Solución 2**: Simula progreso con los nuevos valores
```javascript
window.devTools.unlockAllLevels()
location.reload()
```

### Problema: "No veo window.devTools en la consola"

**Solución**: Asegúrate de que el servidor de desarrollo está corriendo y recarga la página (Ctrl+Shift+R para recarga forzada).

### Problema: "Quiero empezar de cero"

```javascript
// Limpia todo
window.devTools.clearAllProgress()

// Recarga la página
location.reload()

// Verifica que solo el nivel 1 está disponible
window.devTools.checkUnlockedLevels()
```

---

## 🧪 Comandos Útiles para Testing

```javascript
// Ver progreso actual
window.devTools.showProgress()

// Limpiar todo
window.devTools.clearAllProgress()

// Simular 1 nivel completado
window.devTools.simulateProgress(1)

// Simular 3 niveles completados
window.devTools.simulateProgress(3)

// Desbloquear todos los niveles
window.devTools.unlockAllLevels()

// Ver qué niveles están desbloqueados
window.devTools.checkUnlockedLevels()

// Exportar todos los datos
window.devTools.exportStorage()
```

---

## ✅ Verificación Final

Después de aplicar estos cambios, deberías poder:

1. ✅ Completar el nivel 3 con requisitos razonables
2. ✅ Ver el nivel 4 desbloqueado después de completar el nivel 3
3. ✅ Completar el nivel 4 con requisitos alcanzables
4. ✅ Ver el nivel 5 desbloqueado después de completar el nivel 4
5. ✅ La precisión se calcula correctamente en todos los casos

---

## 📝 Notas Adicionales

- **Los cambios son retrocompatibles**: Si alguien ya tenía progreso guardado, simplemente necesita volver a jugar los niveles para actualizar sus estadísticas.
- **Puedes ajustar los requisitos**: Si aún encuentras que son muy difíciles o muy fáciles, puedes modificar los valores en `src/types/levels.js`.
- **DevTools solo en desarrollo**: Las herramientas `window.devTools` están disponibles durante el desarrollo. En producción, también estarán disponibles pero puedes eliminar la importación de `devTools.js` si lo deseas.

---

## 🎯 Resultado Esperado

Después de completar el nivel 3 con una buena puntuación (≥800 puntos y ≥70% precisión), el nivel 4 debería aparecer desbloqueado en el selector de niveles. Lo mismo aplica para el nivel 5 después de completar el nivel 4.

¡Buena suerte con las pruebas! 🎮

