
import { useEffect, useState } from 'react'
import './Consola.css'

function Consola({
  usuario,
  alVolver,
  alAbrirPerfil,
  alCrearHistoria,
  alVerHistoria, 
  alEditarHistoria
}) {
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({
    obras: true,
    borradores: false,
    colaboraciones: false
  })

  const [historias, setHistorias] = useState([])
const [cargandoHistorias, setCargandoHistorias] = useState(true)
const [errorHistorias, setErrorHistorias] = useState('')
const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null)
const [vistaModal, setVistaModal] = useState('opciones')
const [papeleraAbierta, setPapeleraAbierta] = useState(false)
const [categoriaPapelera, setCategoriaPapelera] = useState("historias");
const [historiasPapelera, setHistoriasPapelera] = useState([]);
const [historiaSeleccionadaPapelera, setHistoriaSeleccionadaPapelera] = useState(null);
const [capitulosPapelera, setCapitulosPapelera] = useState([]);
const [capituloSeleccionadoPapelera, setCapituloSeleccionadoPapelera] = useState(null);
const [cargandoPapelera, setCargandoPapelera] = useState(false);
const [errorPapelera, setErrorPapelera] = useState("");

async function probarPapeleraCapitulos() {
    try {
        const respuesta = await fetch(
            "http://localhost:3000/api/papelera/capitulos",
            {
                credentials: "include"
            }
        );

        const datos = await respuesta.json();

        console.log("PRUEBA DE PAPELERA DE CAPÍTULOS:", datos);

    } catch (error) {
        console.error("Error al probar la papelera:", error);
    }
}

useEffect(() => {
  if (!usuario?.id) {
    setHistorias([]);
    setCargandoHistorias(false);
    return;
  }

  async function cargarMisHistorias() {
    setCargandoHistorias(true);
    setErrorHistorias('');

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/historias',
        { credentials: 'include' }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || 'No se pudieron cargar tus historias.'
        );
      }

      setHistorias(datos);

    } catch (error) {
      console.error('Error al cargar historias:', error);
      setErrorHistorias(error.message);

    } finally {
      setCargandoHistorias(false);
    }
  }

  cargarMisHistorias();
}, [usuario?.id]);

useEffect(() => {
  console.log("PAPELERA ABIERTA:", papeleraAbierta);
    if (!papeleraAbierta) return;

    const cargarPapelera = async () => {
        setCargandoPapelera(true);
        setErrorPapelera("");

        try {
            const respuesta = await fetch(
                "http://localhost:3000/api/papelera",
                { credentials: "include" }
            );

console.log("RESPUESTA PAPELERA:", respuesta.status);

            if (!respuesta.ok) {
                throw new Error("No se pudo cargar la papelera.");
            }

            const datos = await respuesta.json();

console.log("DATOS PAPELERA:", datos);

            setHistoriasPapelera(datos);
            const respuestaCapitulos = await fetch(
    "http://localhost:3000/api/papelera/capitulos",
    { credentials: "include" }
);

if (!respuestaCapitulos.ok) {
    throw new Error("No se pudieron cargar los capítulos eliminados.");
}

const datosCapitulos = await respuestaCapitulos.json();
setCapitulosPapelera(datosCapitulos);
        } catch (error) {
            console.error("Error al cargar papelera:", error);
            setErrorPapelera(error.message);
        } finally {
            setCargandoPapelera(false);
        }
    };

    
    cargarPapelera();
}, [papeleraAbierta]);

async function restaurarHistoria() {
  if (!historiaSeleccionadaPapelera) return;

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/papelera/${historiaSeleccionadaPapelera}/restaurar`,
      {
        method: 'POST',
        credentials: 'include'
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo restaurar la historia.');
    }

    setHistoriasPapelera(lista =>
      lista.filter(h => h.id !== historiaSeleccionadaPapelera)
    );
    setHistoriaSeleccionadaPapelera(null);

    // Actualizamos también las historias de Mi Consola.
    const respuestaHistorias = await fetch(
      'http://localhost:3000/api/historias',
      { credentials: 'include' }
    );

    if (respuestaHistorias.ok) {
      const historiasActualizadas = await respuestaHistorias.json();
      setHistorias(historiasActualizadas);
    }

  } catch (error) {
    console.error('Error al restaurar historia:', error);
    alert(error.message);
  }
}


async function eliminarDefinitivamente() {
  if (!historiaSeleccionadaPapelera) return;

  const confirmar = window.confirm(
    '¿Eliminar esta historia definitivamente? Esta acción no se puede deshacer.'
  );

  if (!confirmar) return;

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/papelera/${historiaSeleccionadaPapelera}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo eliminar la historia.');
    }

    setHistoriasPapelera(lista =>
      lista.filter(h => h.id !== historiaSeleccionadaPapelera)
    );
    setHistoriaSeleccionadaPapelera(null);

  } catch (error) {
    console.error('Error al eliminar historia:', error);
    alert(error.message);
  }
}

async function restaurarCapitulo() {
    if (!capituloSeleccionadoPapelera) return;

    const capitulo = capituloSeleccionadoPapelera;

    try {
        const respuesta = await fetch(
            `http://localhost:3000/api/historias/${capitulo.historiaId}/capitulos/${capitulo.id}/restaurar`,
            {
                method: "POST",
                credentials: "include"
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo restaurar el capítulo.");
        }

        setCapitulosPapelera(lista =>
            lista.filter(c => c.id !== capitulo.id || c.historiaId !== capitulo.historiaId)
        );

        setCapituloSeleccionadoPapelera(null);

    } catch (error) {
        console.error("Error al restaurar capítulo:", error);
        alert(error.message);
    }
}

async function eliminarCapituloDefinitivamente() {
    if (!capituloSeleccionadoPapelera) return;

    const capitulo = capituloSeleccionadoPapelera;

    const confirmar = window.confirm(
        "¿Eliminar este capítulo definitivamente? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    try {
        const respuesta = await fetch(
            `http://localhost:3000/api/historias/${capitulo.historiaId}/capitulos/papelera/${capitulo.id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo eliminar el capítulo.");
        }

        setCapitulosPapelera(lista =>
            lista.filter(c => c.id !== capitulo.id || c.historiaId !== capitulo.historiaId)
        );

        setCapituloSeleccionadoPapelera(null);

    } catch (error) {
        console.error("Error al eliminar capítulo:", error);
        alert(error.message);
    }
}

  function alternarSeccion(seccion) {
    setSeccionesAbiertas(actual => ({
      ...actual,
      [seccion]: !actual[seccion]
    }))
  }

  function irASeccion(seccion) {
    setSeccionesAbiertas(actual => ({
      ...actual,
      [seccion]: true
    }))

    document.getElementById(`seccion-${seccion}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (papeleraAbierta) {
  return (
    <main className="pagina-consola pagina-papelera">

      <header className="encabezado-consola">
        <button
          type="button"
          className="boton-volver-papelera"
          onClick={() => setPapeleraAbierta(false)}
        >
          ← VOLVER
        </button>
      </header>

      <section className="titulo-papelera">
        <h1>PAPELERA</h1>

        <div className="aviso-papelera">
          La papelera se vacía en 30 días. Si quieres recuperar
          algo, estás a tiempo, podría convertirse en un agujero
          negro y habrás perdido los elementos.
        </div>
      </section>

      <nav className="categorias-papelera">
    <button
        type="button"
        className={categoriaPapelera === "historias" ? "categoria-activa" : ""}
        onClick={() => {
            setCategoriaPapelera("historias");
            setHistoriaSeleccionadaPapelera(null);
            setCapituloSeleccionadoPapelera(null);
        }}
    >
        HISTORIAS
    </button>

    <button
        type="button"
        className={categoriaPapelera === "capitulos" ? "categoria-activa" : ""}
        onClick={() => {
            setCategoriaPapelera("capitulos");
            setHistoriaSeleccionadaPapelera(null);
            setCapituloSeleccionadoPapelera(null);
        }}
    >
        CAPÍTULOS
    </button>
</nav>

     
<section className="contenido-papelera">
    {cargandoPapelera ? (
        <p>Cargando papelera...</p>
    ) : errorPapelera ? (
        <p className="mensaje-papelera-vacia">
            {errorPapelera}
        </p>
    ) : categoriaPapelera === "historias" ? (
        <>
            {historiasPapelera.length === 0 ? (
                <p className="mensaje-papelera-vacia">
                    No hay historias en la papelera.
                </p>
            ) : (
                <div className="lista-papelera">
                    {historiasPapelera.map(historia => (
                        <article
                            className={`elemento-papelera ${
                                historiaSeleccionadaPapelera === historia.id
                                    ? "seleccionado"
                                    : ""
                            }`}
                            key={historia.id}
                            onClick={() =>
                                setHistoriaSeleccionadaPapelera(
                                    historiaSeleccionadaPapelera === historia.id
                                        ? null
                                        : historia.id
                                )
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setHistoriaSeleccionadaPapelera(
                                        historiaSeleccionadaPapelera === historia.id
                                            ? null
                                            : historia.id
                                    );
                                }
                            }}
                        >
                            {historia.portada && (
                                <img
                                    src={historia.portada}
                                    alt=""
                                    className="imagen-elemento-papelera"
                                />
                            )}

                            <div>
                                <h3>{historia.titulo}</h3>
                                <p>
                                    {historia.estado === "borrador"
                                        ? "Borrador"
                                        : "Historia"}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {historiaSeleccionadaPapelera && (
                <div className="acciones-papelera">
                    <button type="button" onClick={restaurarHistoria}>
                        ↶ RESTAURAR
                    </button>

                    <button
                        type="button"
                        className="boton-eliminar-editor"
                        onClick={eliminarDefinitivamente}
                    >
                        ELIMINAR DEFINITIVAMENTE
                    </button>
                </div>
            )}
        </>
    ) : (
        <>
            {capitulosPapelera.length === 0 ? (
                <p className="mensaje-papelera-vacia">
                    No hay capítulos en la papelera.
                </p>
            ) : (
                <div className="lista-papelera">
                    {capitulosPapelera.map(capitulo => (
                        <article
                            key={`${capitulo.historiaId}-${capitulo.id}`}
                            className={`elemento-papelera ${
                                capituloSeleccionadoPapelera?.id === capitulo.id &&
                                capituloSeleccionadoPapelera?.historiaId === capitulo.historiaId
                                    ? "seleccionado"
                                    : ""
                            }`}
                            onClick={() =>
                                setCapituloSeleccionadoPapelera(
                                    capituloSeleccionadoPapelera?.id === capitulo.id &&
                                    capituloSeleccionadoPapelera?.historiaId === capitulo.historiaId
                                        ? null
                                        : capitulo
                                )
                            }
                            role="button"
                            tabIndex={0}
                        >
                            <div>
                                <h3>{capitulo.titulo}</h3>
                                <p>Capítulo de: {capitulo.historiaTitulo}</p>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {capituloSeleccionadoPapelera && (
                <div className="acciones-papelera">
                    <button type="button" onClick={restaurarCapitulo}>
                        ↶ RESTAURAR
                    </button>

                    <button
                        type="button"
                        className="boton-eliminar-editor"
                        onClick={eliminarCapituloDefinitivamente}
                    >
                        ELIMINAR DEFINITIVAMENTE
                    </button>
                </div>
            )}
        </>
    )}
</section>
</main>
 )
 }
  return (
    <main className="pagina-consola">
      <header className="encabezado-consola">
        <a href="#" className="logo-consola" onClick={alVolver}>
          <img src="/Logo-LoreAI.png" alt="LoreAI" />
        </a>

        <div className="acciones-encabezado-consola">
  <button type="button" onClick={alVolver}>
    SALIR
  </button>

  <button type="button" onClick={alAbrirPerfil}>
    MI PERFIL
  </button>
</div>

      </header>

      <section className="titulo-consola">
        <h1>MI CONSOLA</h1>
        <p>Tu espacio para crear, compartir y organizar historias.</p>
      </section>

      <nav className="navegacion-consola">
  <div className="acciones-creacion-consola">
    <button type="button" onClick={alCrearHistoria}>
      ✦ CREAR
    </button>

    <button
      type="button"
      onClick={() => setPapeleraAbierta(true)}
    >
      ♲ PAPELERA
    </button>


  </div>

        <div className="botones-secciones-consola">
          <button type="button" onClick={() => irASeccion('borradores')}>
            BORRADORES
          </button>
          <button type="button" onClick={() => irASeccion('obras')}>
            OBRAS
          </button>
          <button type="button" onClick={() => irASeccion('colaboraciones')}>
            COLABORACIONES
          </button>
        </div>
      </nav>

      <div className="contenido-consola">
        <section id="seccion-obras" className="bloque-consola">
          <button
            className="titulo-seccion-consola"
            type="button"
            onClick={() => alternarSeccion('obras')}
          >
            <span>OBRAS</span>
            <span>{seccionesAbiertas.obras ? '−' : '+'}</span>
          </button>

          {seccionesAbiertas.obras && (
            <div className="contenido-seccion-consola">
              <p>Aquí aparecerán tus historias publicadas.</p>
              <p className="mensaje-vacio-consola">
                Todavía no tienes obras publicadas. ¡Tu primera historia
                puede comenzar hoy!
              </p>
            </div>
          )}
        </section>

        <section id="seccion-borradores" className="bloque-consola">
          <button
            className="titulo-seccion-consola"
            type="button"
            onClick={() => alternarSeccion('borradores')}
          >
            <span>BORRADORES</span>
            <span>{seccionesAbiertas.borradores ? '−' : '+'}</span>
          </button>

          {seccionesAbiertas.borradores && (
  <div className="contenido-seccion-consola">
    <p>Aquí estarán las historias que todavía no has publicado.</p>

    {cargandoHistorias ? (
      <p>Cargando tus historias...</p>

    ) : errorHistorias ? (
      <p className="mensaje-vacio-consola">
        {errorHistorias}
      </p>

    ) : historias.filter(historia => historia.estado === 'borrador').length === 0 ? (
      <p className="mensaje-vacio-consola">
        No tienes borradores por ahora.
      </p>

    ) : (
      <div className="lista-borradores">
        {historias
          .filter(historia => historia.estado === 'borrador')
          .map(historia => (
            <article
  className="tarjeta-borrador"
  key={historia.id}
  onClick={() => {
    setHistoriaSeleccionada(historia)
    setVistaModal('opciones')
  }}
>
              {historia.portada && (
                <img
                  src={historia.portada}
                  alt={`Portada de ${historia.titulo}`}
                  className="portada-borrador"
                />
              )}

              <div className="informacion-borrador">
                <h3>{historia.titulo}</h3>

                <p>{historia.descripcion}</p>

                <div className="etiquetas-borrador">
                  {(historia.etiquetas || []).map(etiqueta => (
                    <span key={etiqueta}>{etiqueta}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
      </div>
    )}
  </div>
)}
        </section>

        <section id="seccion-colaboraciones" className="bloque-consola">
          <button
            className="titulo-seccion-consola"
            type="button"
            onClick={() => alternarSeccion('colaboraciones')}
          >
            <span>COLABORACIONES</span>
            <span>{seccionesAbiertas.colaboraciones ? '−' : '+'}</span>
          </button>

          {seccionesAbiertas.colaboraciones && (
            <div className="contenido-seccion-consola">
              <p>Aquí aparecerán las historias que creas con otras personas.</p>
              <p className="mensaje-vacio-consola">
                Todavía no participas en colaboraciones.
              </p>
            </div>
          )}
        </section>

        <section className="bloque-colaboradores">
          <h2>COLABORADORES</h2>
          <p>Aquí encontrarás a las personas con quienes compartes proyectos.</p>
          <p className="mensaje-vacio-consola">
            Aún no tienes colaboradores.
          </p>
        </section>
      </div>


      <footer className="pie-consola">
        2026 LoreAI · Encontramos la estrella y la ayudamos a brillar.
      </footer>

      {historiaSeleccionada && (
  <div
    className="fondo-modal-historia"
    onClick={() => {
      setHistoriaSeleccionada(null)
      setVistaModal('opciones')
    }}
  >
    <div
      className="modal-historia"
      onClick={evento => evento.stopPropagation()}
    >
      <button
        type="button"
        className="cerrar-modal-historia"
        onClick={() => {
          setHistoriaSeleccionada(null)
          setVistaModal('opciones')
        }}
      >
        ×
      </button>

      {vistaModal === 'opciones' ? (
        <>
          <h2>{historiaSeleccionada.titulo}</h2>

          {historiaSeleccionada.portada && (
            <img
              src={historiaSeleccionada.portada}
              alt={`Portada de ${historiaSeleccionada.titulo}`}
              className="portada-modal-historia"
            />
          )}

          <p>{historiaSeleccionada.descripcion}</p>

          <div className="botones-modal-historia">
            <button
  type="button"
  onClick={() => {
    const id = historiaSeleccionada.id
    setHistoriaSeleccionada(null)
    alVerHistoria(id)
  }}
>
  VER COMO LECTOR
</button>

            <button
  type="button"
  onClick={() => {
    const id = historiaSeleccionada.id
    setHistoriaSeleccionada(null)
    alEditarHistoria(id)
  }}
>
  EDITAR
</button>

          </div>
        </>
      ) : vistaModal === 'lector' ? (
        <>
          <h2>{historiaSeleccionada.titulo}</h2>

          <p>
            {historiaSeleccionada.descripcion}
          </p>

          {(!historiaSeleccionada.capitulos ||
            historiaSeleccionada.capitulos.length === 0) ? (
            <p className="mensaje-lector-vacio">
              Esta historia está vacía, no es posible leer.
            </p>
          ) : (
            <p>
              Esta historia tiene capítulos disponibles.
              La lectura completa estará disponible en la siguiente etapa.
            </p>
          )}

          <button
            type="button"
            onClick={() => setVistaModal('opciones')}
          >
            VOLVER
          </button>
        </>
      ) : (
        <>
          <h2>Editar historia</h2>
          <p>
            Aquí abriremos el editor de
            «{historiaSeleccionada.titulo}».
          </p>

          <button
            type="button"
            onClick={() => setVistaModal('opciones')}
          >
            VOLVER
          </button>
        </>
      )}
    </div>
  </div>
)}

    </main>
  )
}

export default Consola
