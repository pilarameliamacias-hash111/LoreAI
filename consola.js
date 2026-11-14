
const API_URL = "http://localhost:3000/api/historias";


// ELEMENTOS DEL MODAL

const modalHistoria = document.getElementById("modal-historia");
const botonAbrirModal = document.getElementById("abrir-modal-crear");
const botonCerrarModal = document.getElementById("cerrar-modal");
const botonCerrarFondo = document.getElementById("cerrar-modal-fondo");

const tituloEditor = document.getElementById("titulo-editor");

const botonCrear = document.getElementById("crear");
const botonCancelar = document.getElementById("cancelar-edicion");


// CAMPOS DEL FORMULARIO

const campoTitulo = document.getElementById("titulo");
const campoDescripcion = document.getElementById("descripcion");
const campoEtiquetas = document.getElementById("etiquetas");
const listaEtiquetas = document.getElementById("lista-etiquetas");

const campoIdioma = document.getElementById("idioma");
const campoGenero = document.getElementById("genero");
const campoGeneroSecundario = document.getElementById("genero-secundario");
const campoEdad = document.getElementById("edad");

const campoPortadaArchivo = document.getElementById("portada-archivo");
const campoPortadaUrl = document.getElementById("portada-url");


// VARIABLES

let etiquetasActuales = [];
let portadaArchivoActual = "";
let historiasActuales = [];
let idEditando = null;


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
        console.error("No se pudo comprobar la sesión:", error);
        window.location.replace("index.html");
        return false;
    }
}


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

    if (respuesta.status === 204) {
        return null;
    }

    return respuesta.json();
}


// ABRIR Y CERRAR MODAL

function abrirModal() {
    modalHistoria.hidden = false;
    document.body.classList.add("modal-abierto");
    campoTitulo.focus();
}

function cerrarModal() {
    modalHistoria.hidden = true;
    document.body.classList.remove("modal-abierto");
}

botonAbrirModal.addEventListener("click", function() {

    limpiarFormulario();

    tituloEditor.textContent = "Crear una historia nueva ✨";
    botonCrear.textContent = "Crear historia";

    abrirModal();
});

botonCerrarModal.addEventListener("click", cerrarModal);
botonCerrarFondo.addEventListener("click", cerrarModal);

document.addEventListener("keydown", function(evento) {

    if (evento.key === "Escape" && !modalHistoria.hidden) {
        cerrarModal();
    }

});


// ETIQUETAS

function mostrarEtiquetas() {

    listaEtiquetas.innerHTML = "";

    etiquetasActuales.forEach(function(etiqueta, indice) {

        const elemento = document.createElement("span");
        elemento.classList.add("etiqueta");

        const texto = document.createElement("span");
        texto.textContent = etiqueta;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "×";
        boton.classList.add("quitar-etiqueta");

        boton.setAttribute(
            "aria-label",
            "Eliminar etiqueta " + etiqueta
        );

        boton.addEventListener("click", function() {

            etiquetasActuales.splice(indice, 1);
            mostrarEtiquetas();

        });

        elemento.appendChild(texto);
        elemento.appendChild(boton);

        listaEtiquetas.appendChild(elemento);

    });

}


campoEtiquetas.addEventListener("keydown", function(evento) {

    if (evento.key !== "Enter") return;

    evento.preventDefault();

    const nueva = campoEtiquetas.value.trim();

    if (!nueva) return;

    const yaExiste = etiquetasActuales.some(function(etiqueta) {

        return etiqueta.toLowerCase() === nueva.toLowerCase();

    });

    if (yaExiste) {
        campoEtiquetas.value = "";
        return;
    }

    etiquetasActuales.push(nueva);

    campoEtiquetas.value = "";

    mostrarEtiquetas();

});


// PORTADAS

campoPortadaArchivo.addEventListener("change", function() {

    const archivo = campoPortadaArchivo.files[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {

        alert("Selecciona un archivo de imagen.");

        campoPortadaArchivo.value = "";

        return;
    }

    if (archivo.size > 1024 * 1024) {

        alert("La imagen debe pesar 1 MB o menos.");

        campoPortadaArchivo.value = "";

        return;
    }

    const lector = new FileReader();

    lector.onload = function() {

        portadaArchivoActual = lector.result;

        campoPortadaUrl.value = "";

        alert("¡Portada cargada! 🦆✨");

    };

    lector.onerror = function() {

        alert("No pudimos leer la imagen.");

    };

    lector.readAsDataURL(archivo);

});


// CARGAR HISTORIAS DESDE NODE.JS

async function cargarHistorias() {

    historiasActuales = await solicitarAPI(API_URL);

    return historiasActuales;

}


// MOSTRAR BIBLIOTECA

async function mostrarHistorias() {

    const contenedor = document.getElementById("mis-historias");
    const mensajeVacio = document.getElementById("mensaje-vacio");

    try {

        await cargarHistorias();

        contenedor.querySelectorAll("article").forEach(
            articulo => articulo.remove()
        );

        if (historiasActuales.length === 0) {

            mensajeVacio.style.display = "block";

            return;
        }

        mensajeVacio.style.display = "none";

        historiasActuales.forEach(function(historia, indice) {

            const articulo = document.createElement("article");

            articulo.classList.add("tarjeta-historia");


            // PORTADA

            const portada = document.createElement("img");

            if (historia.portada) {

                portada.src = historia.portada;
                portada.alt = "Portada de " + historia.titulo;
                portada.classList.add("portada-historia");

            } else {

                portada.alt = "Esta historia todavía no tiene portada";
                portada.classList.add("portada-historia");
                portada.classList.add("sin-portada");

            }


            // INFORMACIÓN

            const informacion = document.createElement("div");

            informacion.classList.add("informacion-historia");

            const titulo = document.createElement("h3");

            titulo.textContent = historia.titulo;

            const descripcion = document.createElement("p");

            descripcion.textContent =
                historia.descripcion || "Sin descripción todavía.";

            const genero = document.createElement("p");

            genero.textContent = historia.genero
                ? "Género: " + historia.genero
                : "";


            // BOTÓN ABRIR

            const abrir = document.createElement("button");

            abrir.textContent = "Abrir historia 📖";
            abrir.type = "button";
            abrir.classList.add("boton-abrir");

            abrir.addEventListener("click", function() {

                window.location.href =
                    "editar-historia.html?id=" +
                    encodeURIComponent(historia.id);

            });


            // BOTÓN EDITAR

            const editar = document.createElement("button");

            editar.textContent = "Editar ✏️";
            editar.type = "button";
            editar.classList.add("boton-editar");

            editar.dataset.indice = indice;


            // BOTÓN ELIMINAR

            const eliminar = document.createElement("button");

            eliminar.textContent = "Eliminar 🗑️";
            eliminar.type = "button";
            eliminar.classList.add("boton-eliminar");

            eliminar.dataset.indice = indice;


            // ORGANIZAR TARJETA

            const acciones = document.createElement("div");

            acciones.classList.add("acciones-historia");

            acciones.append(
                abrir,
                editar,
                eliminar
            );

            informacion.append(
                titulo,
                descripcion,
                genero,
                acciones
            );

            articulo.append(
                portada,
                informacion
            );

            contenedor.appendChild(articulo);

        });

    } catch (error) {

        console.error(error);

        mensajeVacio.style.display = "block";

        mensajeVacio.textContent =
            "No pudimos conectar con LoreAI. Comprueba que el servidor esté funcionando.";

    }

}


// EDITAR UNA HISTORIA

document.getElementById("mis-historias").addEventListener(
    "click",
    function(evento) {

        if (!evento.target.classList.contains("boton-editar")) {
            return;
        }

        const indice = Number(evento.target.dataset.indice);

        const historia = historiasActuales[indice];

        if (!historia) return;

        idEditando = historia.id;

        campoTitulo.value = historia.titulo || "";
        campoDescripcion.value = historia.descripcion || "";

        etiquetasActuales = [...(historia.etiquetas || [])];

        mostrarEtiquetas();

        campoIdioma.value = historia.idioma || "Español";
        campoGenero.value = historia.genero || "";
        campoGeneroSecundario.value = historia.generoSecundario || "";
        campoEdad.value = historia.edad || "";

        portadaArchivoActual = historia.portada || "";

        campoPortadaUrl.value =
            portadaArchivoActual.startsWith("data:")
                ? ""
                : portadaArchivoActual;

        campoPortadaArchivo.value = "";

        tituloEditor.textContent = "Editar historia ✏️";

        botonCrear.textContent = "Guardar cambios";

        abrirModal();

    }
);


// ELIMINAR UNA HISTORIA

document.getElementById("mis-historias").addEventListener(
    "click",
    async function(evento) {

        if (!evento.target.classList.contains("boton-eliminar")) {
            return;
        }

        const indice = Number(evento.target.dataset.indice);

        const historia = historiasActuales[indice];

        if (!historia) return;

        const confirmar = confirm(
            "¿Seguro que quieres eliminar esta historia? Esta acción no se puede deshacer."
        );

        if (!confirmar) return;

        try {

            await solicitarAPI(
                API_URL + "/" + encodeURIComponent(historia.id),
                { method: "DELETE" }
            );

            await mostrarHistorias();

            alert("La historia se ha eliminado.");

        } catch (error) {

            alert(
                "No se pudo eliminar la historia: " + error.message
            );

        }

    }
);


// CREAR O GUARDAR CAMBIOS

botonCrear.addEventListener("click", async function() {

    const titulo = campoTitulo.value.trim();

    const descripcion = campoDescripcion.value.trim();

    if (!titulo) {

        alert("¡Tu historia necesita un título! ✨");

        campoTitulo.focus();

        return;
    }

    const portada =
        portadaArchivoActual || campoPortadaUrl.value.trim();

    const datos = {

        titulo,

        descripcion,

        etiquetas: [...etiquetasActuales],

        idioma: campoIdioma.value,

        genero: campoGenero.value,

        generoSecundario: campoGeneroSecundario.value,

        edad: campoEdad.value,

        portada

    };

    try {

        if (idEditando !== null) {

            await solicitarAPI(
                API_URL + "/" + encodeURIComponent(idEditando),
                {
                    method: "PUT",
                    body: JSON.stringify(datos)
                }
            );

        } else {

            await solicitarAPI(API_URL, {
                method: "POST",
                body: JSON.stringify(datos)
            });

        }

        limpiarFormulario();

        cerrarModal();

        await mostrarHistorias();

        alert("¡Historia guardada en LoreAI! 💚");

    } catch (error) {

        console.error(error);

        alert(
            "No se pudo guardar la historia: " + error.message
        );

    }

});


// LIMPIAR FORMULARIO

function limpiarFormulario() {

    idEditando = null;

    campoTitulo.value = "";

    campoDescripcion.value = "";

    campoEtiquetas.value = "";

    etiquetasActuales = [];

    mostrarEtiquetas();

    campoIdioma.value = "Español";

    campoGenero.value = "";

    campoGeneroSecundario.value = "";

    campoEdad.value = "";

    portadaArchivoActual = "";

    campoPortadaArchivo.value = "";

    campoPortadaUrl.value = "";

    botonCrear.textContent = "Crear historia";

}


// CANCELAR

botonCancelar.addEventListener("click", function() {

    limpiarFormulario();

    cerrarModal();

});


// CARGA INICIAL

(async function iniciarConsola() {

    const autenticado = await comprobarSesion();

    if (autenticado) {

        await mostrarHistorias();

    }

})();
