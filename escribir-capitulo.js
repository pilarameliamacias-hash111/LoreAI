
import { Editor } from "https://esm.sh/@tiptap/core@2.11.5";
import StarterKit from "https://esm.sh/@tiptap/starter-kit@2.11.5";
import TextAlign from "https://esm.sh/@tiptap/extension-text-align@2.11.5";

const API_URL = "http://localhost:3000/api/historias";

const parametros = new URLSearchParams(window.location.search);

const historiaId = parametros.get("id");
let capituloId = parametros.get("capituloId");

let editor = null;
let historiaActual = null;
let guardando = false;

const nombreObra = document.getElementById("nombre-obra");
const tituloCapitulo = document.getElementById("titulo-capitulo");
const contadorPalabras = document.getElementById("contador-palabras");
const estadoCapitulo = document.getElementById("estado-capitulo");

const botonGuardar = document.getElementById("guardar-capitulo");
const botonVolver = document.getElementById("volver-historia");


// API

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


// SESIÓN

async function comprobarSesion() {

    const respuesta = await fetch(
        "http://localhost:3000/api/usuarios/sesion",
        { credentials: "include" }
    );

    if (!respuesta.ok) {
        window.location.replace("index.html");
        return false;
    }

    return true;

}


// CARGAR HISTORIA

async function cargarHistoria() {

    if (!historiaId) {
        throw new Error("No se indicó la historia que quieres escribir.");
    }

    const historias = await solicitarAPI(API_URL);

    historiaActual = historias.find(
        historia => String(historia.id) === historiaId
    );

    if (!historiaActual) {
        throw new Error("No encontramos esta historia.");
    }

    nombreObra.textContent = historiaActual.titulo;

    botonVolver.href =
        "editar-historia.html?id=" + encodeURIComponent(historiaId);

}


// CREAR EDITOR

function crearEditor(contenidoInicial = "") {

    editor = new Editor({

        element: document.querySelector("#editor-texto"),

        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"]
            })
        ],

        content: contenidoInicial,

        onUpdate: actualizarContador,

        onSelectionUpdate: actualizarBarraFormato

    });

    actualizarContador();

}


// CONTADOR DE PALABRAS

function actualizarContador() {

    if (!editor) return;

    const texto = editor.getText().trim();

    const palabras = texto
        ? texto.split(/\s+/).length
        : 0;

    contadorPalabras.textContent =
        palabras + (palabras === 1 ? " palabra" : " palabras");

    estadoCapitulo.textContent = "Borrador";

}


// BARRA DE FORMATO

function actualizarBarraFormato() {

    // La barra flotante se añadirá en el siguiente ajuste visual.

}


// ABRIR CAPÍTULO EXISTENTE O NUEVO

async function prepararCapitulo() {

    if (!capituloId) {

        crearEditor();

        return;

    }

    const capitulos = await solicitarAPI(
        API_URL + "/" + encodeURIComponent(historiaId) + "/capitulos"
    );

    const capitulo = capitulos.find(
        item => String(item.id) === capituloId
    );

    if (!capitulo) {
        throw new Error("No encontramos este capítulo.");
    }

    tituloCapitulo.value = capitulo.titulo || "";

    const contenido = capitulo.contenido || "";

    // Compatibilidad inicial con capítulos de texto sin formato.
    const contenidoHTML = contenido.trim().startsWith("<")
        ? contenido
        : contenido
            ? "<p>" + escaparHTML(contenido).replace(/\n/g, "<br>") + "</p>"
            : "";

    crearEditor(contenidoHTML);

}


// PROTEGER TEXTO ANTIGUO

function escaparHTML(texto) {

    return texto.replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caracter]);

}


// GUARDAR CAPÍTULO

async function guardarCapitulo() {

    if (guardando || !editor) return;

    const titulo = tituloCapitulo.value.trim();
    const contenido = editor.getHTML();

    if (!titulo) {
        alert("¡El capítulo necesita un título!");
        tituloCapitulo.focus();
        return;
    }

    const datos = {
        titulo,
        contenido
    };

    guardando = true;
    botonGuardar.disabled = true;

    try {

        if (capituloId) {

            await solicitarAPI(
                API_URL + "/" + encodeURIComponent(historiaId) +
                "/capitulos/" + encodeURIComponent(capituloId),
                {
                    method: "PUT",
                    body: JSON.stringify(datos)
                }
            );

        } else {

            const nuevoCapitulo = await solicitarAPI(
                API_URL + "/" + encodeURIComponent(historiaId) +
                "/capitulos",
                {
                    method: "POST",
                    body: JSON.stringify(datos)
                }
            );

            if (nuevoCapitulo && nuevoCapitulo.id) {

    capituloId = nuevoCapitulo.id;

    const nuevaURL = new URL(window.location.href);

    nuevaURL.searchParams.set("capituloId", capituloId);

    window.history.replaceState({}, "", nuevaURL);

}

        }

        estadoCapitulo.textContent = "Guardado";
        alert("¡Capítulo guardado correctamente! ✨");

    } catch (error) {

        alert("No se pudo guardar: " + error.message);

    } finally {

        guardando = false;
        botonGuardar.disabled = false;

    }

}

botonGuardar.addEventListener("click", guardarCapitulo);


// MENÚ DE TRES PUNTOS

const botonMenu = document.getElementById("boton-menu");
const opcionesMenu = document.getElementById("opciones-menu");

botonMenu.addEventListener("click", () => {

    opcionesMenu.hidden = !opcionesMenu.hidden;

});


// ACCIONES TODAVÍA PENDIENTES

document.getElementById("vista-previa").addEventListener("click", () => {
    alert("La vista previa llegará en la siguiente etapa.");
});

document.getElementById("publicar-capitulo").addEventListener("click", () => {
    alert("La publicación llegará en la siguiente etapa.");
});

document.getElementById("programar-capitulo").addEventListener("click", () => {
    alert("La programación llegará en la siguiente etapa.");
});

document.getElementById("eliminar-capitulo").addEventListener("click", async () => {

    if (!capituloId) {
        alert("Este capítulo todavía no está guardado.");
        return;
    }

    const confirmar = confirm("¿Seguro que quieres eliminar este capítulo?");

    if (!confirmar) return;

    try {

        await solicitarAPI(
            API_URL + "/" + encodeURIComponent(historiaId) +
            "/capitulos/" + encodeURIComponent(capituloId),
            { method: "DELETE" }
        );

        window.location.href =
            "editar-historia.html?id=" + encodeURIComponent(historiaId);

    } catch (error) {

        alert("No se pudo eliminar: " + error.message);

    }

});


// INICIAR

(async function iniciar() {

    try {

        const autenticado = await comprobarSesion();

        if (!autenticado) return;

        await cargarHistoria();
        await prepararCapitulo();

    } catch (error) {

        console.error(error);
        alert("No pudimos abrir el editor: " + error.message);

    }

})();
