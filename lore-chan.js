
const launcher = document.getElementById("lore-launcher");
const chat = document.getElementById("lore-chat");
const closeButton = document.getElementById("lore-close");
const minimizeButton = document.getElementById("lore-minimize");
const expandButton = document.getElementById("lore-expand");
const form = document.getElementById("lore-form");
const input = document.getElementById("lore-input");
const messages = document.getElementById("lore-messages");

let saludoMostrado = false;

function agregarMensaje(texto, tipo) {
  const burbuja = document.createElement("div");
  burbuja.className = `lore-bubble lore-${tipo}`;
  burbuja.textContent = texto;
  messages.appendChild(burbuja);
  messages.scrollTop = messages.scrollHeight;
}

function abrirChat() {
  chat.hidden = false;
  launcher.hidden = true;

  if (!saludoMostrado) {
    agregarMensaje(
      "¡Hola, estrellita! Soy Lore-Chan y soy la mascota de LoreAI. Siempre estoy encantada de guiar nuevas estrellitas... ¡Inicia sesión para que podamos conocernos mejor!",
      "bot"
    );
    saludoMostrado = true;
  }
}

launcher.addEventListener("click", abrirChat);

closeButton.addEventListener("click", () => {
  chat.hidden = true;
  chat.classList.remove("lore-minimized", "lore-expanded");
  launcher.hidden = false;
});

minimizeButton.addEventListener("click", () => {
  chat.classList.toggle("lore-minimized");
});

expandButton.addEventListener("click", () => {
  chat.classList.toggle("lore-expanded");
  chat.classList.remove("lore-minimized");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const texto = input.value.trim();
  if (!texto) return;

  agregarMensaje(texto, "user");
  input.value = "";

  const mensaje = texto.toLowerCase();
  let respuesta = "";

  if (/\b(hola|holi|buenas|saludos)\b/.test(mensaje)) {
    respuesta = "¡Holiii, estrellita! ⭐ ¿Qué te gustaría descubrir de LoreAI?";
  } else if (mensaje.includes("qué es loreai") || mensaje.includes("que es loreai")) {
    respuesta = "LoreAI es un espacio en desarrollo dedicado a la lectura y la escritura. ¡Queremos que las personas compartan sus historias y creatividad!";
  } else if (mensaje.includes("escribir") || mensaje.includes("historia")) {
    respuesta = "¡Las historias empiezan con una idea! Puedes visitar la Consola de LoreAI para explorar las herramientas disponibles.";
  } else if (mensaje.includes("libro") || mensaje.includes("recomienda")) {
    respuesta = "¡Me encantaría ayudarte a descubrir tu próxima lectura! Las recomendaciones personalizadas serán una función futura de LoreAI.";
  } else if (mensaje.includes("iniciar sesión") || mensaje.includes("iniciar sesion") || mensaje.includes("cuenta") || mensaje.includes("perfil")) {
    respuesta = "¡Buena idea, estrellita! La experiencia personalizada estará disponible cuando el sistema de cuentas esté implementado.";
  } else if (mensaje.includes("ayuda")) {
    respuesta = "¡Estoy aquí para orientarte! Puedes preguntarme qué es LoreAI, cómo empezar a escribir o qué funciones están previstas.";
  } else {
    respuesta = "¡Ups, estrellita! Todavía soy una versión básica y no sé responder a todo. Prueba preguntándome qué es LoreAI o cómo empezar a escribir. ⭐";
  }

  agregarMensaje(respuesta, "bot");
});

