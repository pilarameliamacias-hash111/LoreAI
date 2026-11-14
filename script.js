
const boton = document.getElementById("comenzar");
const bienvenida = document.getElementById("bienvenida");
const cerrar = document.getElementById("cerrar");

const animacionBienvenida = document.getElementById("animacion-bienvenida");
const videoBienvenida = document.getElementById("video-bienvenida");
const botonOmitir = document.getElementById("omitir-animacion");

// Ventanas de acceso
const enlaceConsola = document.getElementById("enlace-consola");
const ventanaAcceso = document.getElementById("acceso-loreai");
const botonAccesoSi = document.getElementById("acceso-si");
const botonAccesoNo = document.getElementById("acceso-no");
const mensajeAcceso = document.getElementById("mensaje-acceso");
const cerrarAcceso = document.getElementById("cerrar-acceso");

// Ventana de inicio de sesión
const ventanaLogin = document.getElementById("login-loreai");
const cerrarLogin = document.getElementById("cerrar-login");
const formularioLogin = document.getElementById("formulario-login");
const mensajeLogin = document.getElementById("mensaje-login");
const volverRegistro = document.getElementById("volver-registro");

// Ventana de registro
const ventanaRegistro = document.getElementById("registro-loreai");
const cerrarRegistro = document.getElementById("cerrar-registro");
const volverAcceso = document.getElementById("volver-acceso");
const formularioRegistro = document.getElementById("formulario-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");

// Mostrar la ventana de acceso
function mostrarVentanaAcceso() {
    animacionBienvenida.hidden = true;
    bienvenida.style.display = "none";
    ventanaAcceso.hidden = false;
    mensajeAcceso.hidden = true;
    botonAccesoSi.hidden = false;
    botonAccesoNo.hidden = false;
}

// Botón "Comenzar a escribir"
boton.addEventListener("click", async function() {
    bienvenida.style.display = "none";
    ventanaAcceso.hidden = true;
    animacionBienvenida.hidden = false;
    videoBienvenida.currentTime = 0;

    try {
        await videoBienvenida.play();
    } catch (error) {
        console.error("No se pudo reproducir el video:", error);
        mostrarVentanaAcceso();
    }
});

// Cuando termina la animación
videoBienvenida.addEventListener("ended", mostrarVentanaAcceso);

// Botón para omitir la animación
botonOmitir.addEventListener("click", function() {
    videoBienvenida.pause();
    videoBienvenida.currentTime = 0;
    mostrarVentanaAcceso();
});

// Cerrar bienvenida
cerrar.addEventListener("click", function() {
    bienvenida.style.display = "none";
});

// Abrir la ventana de acceso desde el menú
function abrirVentanaAcceso(evento) {
    evento.preventDefault();

    ventanaAcceso.hidden = false;
    mensajeAcceso.hidden = true;
    botonAccesoSi.hidden = false;
    botonAccesoNo.hidden = false;
}

// Botón "Consola"
enlaceConsola.addEventListener("click", abrirVentanaAcceso);

// Botón "Iniciar sesión"
const enlaceInicioSesion = document.getElementById("abrir-inicio-sesion");

if (enlaceInicioSesion) {
    enlaceInicioSesion.addEventListener("click", abrirVentanaAcceso);
}

// Abrir inicio de sesión
botonAccesoSi.addEventListener("click", function() {
    ventanaAcceso.hidden = true;
    ventanaLogin.hidden = false;
    mensajeLogin.hidden = true;
});

// Cerrar ventanas
cerrarAcceso.addEventListener("click", function() {
    ventanaAcceso.hidden = true;
});

cerrarLogin.addEventListener("click", function() {
    ventanaLogin.hidden = true;
});

cerrarRegistro.addEventListener("click", function() {
    ventanaRegistro.hidden = true;
});

// Ir al registro desde la ventana de acceso
botonAccesoNo.addEventListener("click", function() {
    ventanaAcceso.hidden = true;
    ventanaRegistro.hidden = false;
    mensajeRegistro.hidden = true;
});

// Volver desde el registro a la ventana de acceso
volverAcceso.addEventListener("click", function() {
    ventanaRegistro.hidden = true;
    ventanaAcceso.hidden = false;
    mensajeAcceso.hidden = true;
});

// Ir al registro desde el inicio de sesión
volverRegistro.addEventListener("click", function() {
    ventanaLogin.hidden = true;
    ventanaRegistro.hidden = false;
    mensajeRegistro.hidden = true;
});

// REGISTRO DE USUARIOS
formularioRegistro.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const usuario = document.getElementById("registro-usuario").value.trim();
    const correo = document.getElementById("registro-correo").value.trim();
    const contrasena = document.getElementById("registro-contrasena").value;

    const botonEnviar = formularioRegistro.querySelector('button[type="submit"]');

    mensajeRegistro.hidden = false;
    mensajeRegistro.textContent = "Creando tu cuenta... ⭐";
    botonEnviar.disabled = true;

    try {
        const respuesta = await fetch("http://localhost:3000/api/usuarios/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                correo: correo,
                contrasena: contrasena
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo crear la cuenta.");
        }

        mensajeRegistro.textContent =
            "¡Cuenta creada correctamente, " + datos.usuario.usuario + "! ⭐";

        formularioRegistro.reset();

    } catch (error) {
        console.error("Error al registrar:", error);

        mensajeRegistro.hidden = false;
        mensajeRegistro.textContent =
            error.message === "Failed to fetch"
                ? "No se pudo conectar con el servidor. Comprueba que esté encendido."
                : error.message;

    } finally {
        botonEnviar.disabled = false;
    }
});

// INICIO DE SESIÓN
formularioLogin.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const identificador = document.getElementById("login-identificador").value.trim();
    const contrasena = document.getElementById("login-contrasena").value;

    const botonEnviar = formularioLogin.querySelector('button[type="submit"]');

    mensajeLogin.hidden = false;
    mensajeLogin.textContent = "Comprobando tus datos... ⭐";
    botonEnviar.disabled = true;

    try {
        const respuesta = await fetch("http://localhost:3000/api/usuarios/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: identificador,
                contrasena: contrasena
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo iniciar sesión.");
        }

        mensajeLogin.textContent =
            "¡Bienvenida/o, " + datos.usuario.usuario + "! ⭐";

        window.location.href = "consola.html";

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        mensajeLogin.hidden = false;
        mensajeLogin.textContent =
            error.message === "Failed to fetch"
                ? "No se pudo conectar con el servidor. Comprueba que esté encendido."
                : error.message;

    } finally {
        botonEnviar.disabled = false;
    }
});

console.log("LoreAI: script.js cargado correctamente ⭐");
document.getElementById("formulario-login").addEventListener("submit", function() {
    console.log("PRUEBA: el formulario sí detectó el envío");
})

