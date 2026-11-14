
const API_URL = "http://localhost:3000/api/historias";

// ELEMENTOS

const tituloHistoria = document.getElementById("titulo-historia");
const descripcionHistoria = document.getElementById("descripcion-historia");
const listaCapitulos = document.getElementById("lista-capitulos");
const botonNuevoCapitulo = document.getElementById("nuevo-capitulo");

// IDENTIFICAR HISTORIA

const parametros = new URLSearchParams(window.location.search);
const historiaId = parametros.get("id");

let historiaActual = null;
let capitulosActuales = [];


// COMUNICACIÓN CON EL BACKEND

async function solicitarAPI(url, opciones = {}) {

    const respuesta = await fetch(url, {
        ...opciones,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...opciones.headers
        }
    });

    if (!respuesta.ok) {

        const error = await respuesta.json().catch(() => ({}));

        throw new Error(
            error.error || "No se pudo completar la operación."
        );

    }

    if (respuesta.status === 204) return null;

    return respuesta.json();

}


// COMPROBAR SESIÓN

async function comprobarSesion() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/usuarios/sesion",
            { credentials: "include" }
        );

        if (!respuesta.ok) {

            window.location.replace("index.html");
            return false;

        }

        return true;

    } catch (error) {

        console.error(error);
        window.location.replace("index.html");

        return false;

    }

}


// CARGAR HISTORIA

async function cargarHistoria() {

    if (!historiaId) {

        alert("No se indicó qué historia quieres abrir.");

        window.location.replace("consola.html");
        return;

    }

    const historias = await solicitarAPI(API_URL);

    historiaActual = historias.find(
        historia => String(historia.id) === historiaId
    );

    if (!historiaActual) {

        alert("No encontramos esta historia.");

        window.location.replace("consola.html");
        return;

    }

    tituloHistoria.textContent = historiaActual.titulo;

    descripcionHistoria.textContent =
        historiaActual.descripcion || "Una historia de LoreAI.";

    await cargarCapitulos();

}


// CARGAR CAPÍTULOS

async function cargarCapitulos() {

    capitulosActuales = await solicitarAPI(
        API_URL + "/" + encodeURIComponent(historiaId) + "/capitulos"
    );

    mostrarCapitulos();

}


// MOSTRAR CAPÍTULOS

function mostrarCapitulos() {

    listaCapitulos.innerHTML = "";

    if (capitulosActuales.length === 0) {

        const mensaje = document.createElement("p");

        mensaje.textContent =
            "Esta historia todavía no tiene capítulos. ¡Es hora de comenzar! ✨";

        listaCapitulos.appendChild(mensaje);

        return;

    }

    capitulosActuales.forEach(function(capitulo, indice) {

        const articulo = document.createElement("article");
        articulo.classList.add("tarjeta-capitulo");

        const titulo = document.createElement("h3");

        titulo.textContent =
            capitulo.titulo || "Capítulo sin título";

        const resumen = document.createElement("p");

        resumen.textContent =
            (capitulo.contenido || "").slice(0, 160) +
            ((capitulo.contenido || "").length > 160 ? "..." : "");

        // BOTÓN ESCRIBIR / EDITAR

        const editar = document.createElement("button");

        editar.type = "button";
        editar.textContent = "Abrir capítulo ✏️";

        editar.addEventListener("click", function() {

            window.location.href =
                "escribir-capitulo.html?id=" +
                encodeURIComponent(historiaId) +
                "&capituloId=" +
                encodeURIComponent(capitulo.id);

        });

        // BOTÓN ELIMINAR

        const eliminar = document.createElement("button");

        eliminar.type = "button";
        eliminar.textContent = "Eliminar 🗑️";

        eliminar.addEventListener("click", async function() {

            const confirmar = confirm(
                "¿Quieres eliminar este capítulo?"
            );

            if (!confirmar) return;

            try {

                await solicitarAPI(
                    API_URL + "/" + encodeURIComponent(historiaId) +
                    "/capitulos/" + encodeURIComponent(capitulo.id),
                    { method: "DELETE" }
                );

                await cargarCapitulos();

            } catch (error) {

                alert("No se pudo eliminar: " + error.message);

            }

        });

        articulo.append(
            titulo,
            resumen,
            editar,
            eliminar
        );

        listaCapitulos.appendChild(articulo);

    });

}


// NUEVO CAPÍTULO

botonNuevoCapitulo.addEventListener("click", function() {

    window.location.href =
        "escribir-capitulo.html?id=" +
        encodeURIComponent(historiaId);

});


// INICIAR

(async function iniciarPagina() {

    const autenticado = await comprobarSesion();

    if (!autenticado) return;

    try {

        await cargarHistoria();

    } catch (error) {

        console.error(error);

        alert("No pudimos cargar la historia: " + error.message);

    }

})();
