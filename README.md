# ✨ LoreAI

**Encontramos la estrella y la ayudamos a brillar.**

LoreAI es una plataforma orientada a la lectura y escritura creativa. Su objetivo es acompañar a lectores y escritores mediante herramientas digitales y una asistente virtual llamada **Lore-Chan**.

## 🌟 Características

- **Editor de historias:** creación y edición de historias y capítulos.
- **Mi Consola:** espacio personal para administrar las historias.
- **Perfiles:** registro y acceso de usuarios.
- **Lore-Chan:** asistente virtual que acompaña al usuario y ayuda durante el proceso creativo.
- **Inteligencia artificial local:** integración con Ollama para generar respuestas.

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React | Interfaz de usuario |
| JavaScript | Lógica de la aplicación |
| CSS | Diseño y estilos |
| Node.js | Entorno del servidor |
| Express | Backend y API |
| Ollama | Ejecución local del modelo de IA |

## 🚀 Instalación y ejecución

### Requisitos

- Node.js
- npm
- Ollama

### 1. Instalar las dependencias

Desde la carpeta principal del proyecto, abre una terminal y ejecuta:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configurar el backend

Crea el archivo `backend/.env` y agrega una variable de entorno:

```env
SESSION_SECRET=tu_secreto_aleatorio
```

Utiliza un secreto aleatorio propio. No compartas este archivo públicamente.

### 3. Preparar la inteligencia artificial

Descarga el modelo utilizado por LoreAI:

```bash
ollama pull qwen2.5:0.5b
```

### 4. Iniciar LoreAI

En Windows, ejecuta el archivo:

`INICIAR-LOREAI.bat`

Este archivo inicia los servicios necesarios para ejecutar el proyecto.

Una vez iniciado, abre en tu navegador:

**http://localhost:5173**

## 📌 Estado del proyecto

LoreAI se encuentra en desarrollo. Sus funciones y características pueden cambiar conforme avance su implementación.

## 🎨 Créditos

Proyecto desarrollado por su autora, incluyendo el concepto, diseño, ilustraciones y personaje original Lore-Chan.

---

*LoreAI: la tecnología como herramienta para impulsar la creatividad humana.*