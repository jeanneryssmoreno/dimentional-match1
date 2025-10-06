# 🐛 Debug: Dark Mode No Funciona

## 📋 Pasos de Verificación Detallados

### **Paso 1: Detener y Reiniciar el Servidor**

```bash
# Detener el servidor (Ctrl+C en la terminal)
# Luego ejecutar:
npm run dev
```

⚠️ **IMPORTANTE:** Asegúrate de que el servidor se detuvo completamente antes de reiniciarlo.

---

### **Paso 2: Abrir DevTools en el Navegador**

1. Abre http://localhost:5173
2. Presiona **F12** (o clic derecho → Inspeccionar)
3. Ve a la pestaña **Console**

---

### **Paso 3: Verificar Mensajes en la Consola**

Al cargar la página, deberías ver estos mensajes:

```
🎨 Cambiando tema a: light
✅ Clases del HTML: light
```

Si NO ves estos mensajes:
- ❌ El ThemeContext no se está inicializando
- ❌ Hay un error en el código (revisa errores en rojo en la consola)

---

### **Paso 4: Inspeccionar el Elemento HTML**

1. En DevTools, ve a la pestaña **Elements** (o Elementos)
2. Busca la primera línea: `<html>`
3. Debe verse así:

```html
<html lang="en" class="light">
```

Si ves solo `<html lang="en">` sin clase:
- ❌ El script del index.html no se ejecutó
- ❌ El ThemeContext no está aplicando las clases

---

### **Paso 5: Hacer Clic en el Botón de Tema**

1. Haz clic en el botón "☀️ Modo Claro" en el header
2. En la consola deberías ver:

```
🖱️ Botón clickeado - Tema actual: light
🔄 Toggle theme ejecutado
➡️ Cambiando de light a dark
🎨 Cambiando tema a: dark
✅ Clases del HTML: dark
```

3. Verifica el elemento `<html>` de nuevo:

```html
<html lang="en" class="dark">
```

---

### **Paso 6: Verificar Cambios Visuales**

Cuando cambias a **dark mode**, deberías ver:

| Elemento | Color en Light | Color en Dark |
|----------|----------------|---------------|
| Fondo principal | Gris claro (#f9fafb) | Gris oscuro (#111827) |
| Header | Gris oscuro (#1f2937) | Negro (#030712) |
| Texto | Negro/Gris oscuro | Blanco/Gris claro |
| Cards | Blanco | Gris oscuro (#1f2937) |

Si los colores NO cambian:
- ❌ Las clases `dark:` de Tailwind no están funcionando
- ❌ Problema con la configuración de Tailwind v4

---

## 🔍 Tests Manuales en la Consola

Abre la consola del navegador y ejecuta estos comandos uno por uno:

### **Test 1: Verificar localStorage**
```javascript
localStorage.getItem('theme')
```
**Resultado esperado:** `"light"` o `"dark"`

### **Test 2: Verificar clase del HTML**
```javascript
document.documentElement.className
```
**Resultado esperado:** `"light"` o `"dark"`

### **Test 3: Cambiar tema manualmente**
```javascript
document.documentElement.className = 'dark'
```
**Resultado esperado:** La página debe cambiar a modo oscuro visualmente

### **Test 4: Cambiar a modo claro manualmente**
```javascript
document.documentElement.className = 'light'
```
**Resultado esperado:** La página debe cambiar a modo claro visualmente

### **Test 5: Verificar estilos computados**
```javascript
getComputedStyle(document.body).backgroundColor
```
- **En light mode:** `rgb(249, 250, 251)` o similar
- **En dark mode:** `rgb(17, 24, 39)` o similar

---

## 🐞 Errores Comunes y Soluciones

### **Error 1: No veo mensajes en la consola**

**Causa:** El ThemeContext no se está ejecutando

**Solución:**
1. Verifica que `src/main.jsx` tenga el `<ThemeProvider>`
2. Ejecuta en la consola:
```javascript
console.log('Test de consola funcionando')
```
Si esto no aparece, la consola no está capturando logs.

---

### **Error 2: El HTML no tiene clase**

**Causa:** El script del index.html no se ejecutó

**Solución:**
1. Verifica que `index.html` tenga el script antes del `</head>`
2. Limpia caché del navegador (Ctrl+Shift+Delete)
3. Recarga con Ctrl+Shift+R (hard reload)

---

### **Error 3: Los colores no cambian aunque la clase sí**

**Causa:** Tailwind no está procesando las clases `dark:`

**Solución:**
1. Verifica que existe `tailwind.config.js` en la raíz del proyecto
2. Verifica que contiene `darkMode: 'class'`
3. Ejecuta en terminal:
```bash
# Detener servidor
# Borrar caché de Vite
rm -rf node_modules/.vite
# Reiniciar
npm run dev
```

---

### **Error 4: El botón no hace nada**

**Causa:** El event handler no está conectado o hay un error

**Solución:**
1. Verifica en la consola si hay errores en rojo
2. Ejecuta en la consola del navegador:
```javascript
// Buscar el botón
const button = document.querySelector('button[aria-label="Toggle dark/light mode"]')
console.log('Botón encontrado:', button)

// Hacer clic programáticamente
button.click()
```

Si esto funciona pero el clic manual no, hay un problema de eventos.

---

### **Error 5: "useTheme must be used within a ThemeProvider"**

**Causa:** El componente que usa useTheme está fuera del ThemeProvider

**Solución:**
1. Verifica que en `src/main.jsx` el orden sea:
```jsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

---

## 🔧 Verificación de Archivos

### **Verificar que estos archivos existen:**

```
✅ index.html (con script de tema)
✅ tailwind.config.js (con darkMode: 'class')
✅ src/index.css (con @variant dark)
✅ src/contexts/ThemeContext.jsx (con console.logs)
✅ src/contexts/useTheme.jsx
✅ src/components/layout/Header.jsx (con botón)
```

### **Verificar contenido de archivos clave:**

#### **index.html debe tener:**
```html
<html lang="en" class="light">
  <head>
    <script>
      (function() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.className = theme;
      })();
    </script>
  </head>
```

#### **tailwind.config.js debe tener:**
```javascript
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
}
```

#### **src/index.css debe tener:**
```css
@import "tailwindcss";
@variant dark (&:is(.dark, .dark *));
```

---

## 📸 Capturas de Referencia

### **Consola esperada:**
```
🎨 Cambiando tema a: light
✅ Clases del HTML: light
```

### **HTML esperado:**
```html
<html lang="en" class="light">
  <head>...</head>
  <body>
    <div id="root">
      <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        ...
      </div>
    </div>
  </body>
</html>
```

---

## 🚨 Si Nada Funciona

Si después de seguir TODOS los pasos anteriores aún no funciona:

1. **Copia y pega en la consola lo siguiente:**
```javascript
// Diagnóstico completo
console.log('=== DIAGNÓSTICO DARK MODE ===');
console.log('Tema en localStorage:', localStorage.getItem('theme'));
console.log('Clase del HTML:', document.documentElement.className);
console.log('Estilo computado del body:', getComputedStyle(document.body).backgroundColor);
console.log('Botón existe:', !!document.querySelector('button[aria-label="Toggle dark/light mode"]'));
console.log('React root:', document.getElementById('root'));
```

2. **Comparte el resultado** de ese comando

3. **Verifica errores en rojo** en la consola y compártelos

---

## ✅ Checklist Final

- [ ] Servidor reiniciado
- [ ] Navegador en http://localhost:5173
- [ ] DevTools abierto (F12)
- [ ] Consola muestra mensajes de tema
- [ ] HTML tiene clase "light" o "dark"
- [ ] Botón de tema es visible y clickeable
- [ ] Al hacer clic, aparecen logs en consola
- [ ] La clase del HTML cambia al hacer clic
- [ ] Los colores de la página cambian visualmente

Si TODOS los checks están ✅ pero no ves cambios visuales, el problema es con Tailwind.

---

**Última actualización:** Octubre 2025  
**Nota:** Si sigues teniendo problemas, comparte los resultados de los tests y cualquier error de la consola.

