import { useState, useEffect } from 'react'
import './App.css'
import LoreChat from './components/LoreChat'
import Acceso from './components/Acceso'
import Perfil from './components/Perfil'
import Consola from './pages/Consola'
import CrearHistoria from './pages/CrearHistoria'
import LectorHistoria from './pages/LectorHistoria'
import PerfilPublico from './components/PerfilPublico'
import EditorHistoria from './pages/EditorHistoria'
import CrearCapitulo from './pages/CrearCapitulo'
import SigueLeyendo from "./components/SigueLeyendo";
import RecomendadoParaTi from "./components/RecomendadoParaTi";
import LeerHistoria from './pages/LeerHistoria'
import HistoriasPopulares from './components/HistoriasPopulares'
import Contacto from './components/Contacto'
import Admin from './pages/Admin'

function App() {
  const generos = [
  'Acción', 'Aventura', 'Ciencia ficción', 'Comedia',
  'Drama', 'Fantasía', 'Misterio', 'Romance',
  'Terror', 'Suspenso', 'Slice of Life', 'Histórico'
];

function abrirAcceso() {
  setMenuAbierto(false)

  if (usuarioActual) {
    setMostrarPerfil(true)
  } else {
    setMostrarAcceso(true)
  }
}
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [bienvenidaActiva, setBienvenidaActiva] = useState(false)
const [mostrarAcceso, setMostrarAcceso] = useState(false)
const [destinoDespuesAcceso, setDestinoDespuesAcceso] = useState(null)
const [mostrarConsola, setMostrarConsola] = useState(false)
const [mostrarAdmin, setMostrarAdmin] = useState(false)
const [mostrarCrearHistoria, setMostrarCrearHistoria] = useState(false)
const [mostrarEditorHistoria, setMostrarEditorHistoria] = useState(false)
const [mostrarLector, setMostrarLector] = useState(false)
const [historiaSeleccionadaId, setHistoriaSeleccionadaId] = useState(null)
const [capituloSeleccionadoId, setCapituloSeleccionadoId] = useState(null)
const [mostrarLeerHistoria, setMostrarLeerHistoria] = useState(false)
const [historiaEnEdicionId, setHistoriaEnEdicionId] = useState(null)
const [mostrarPerfilPublico, setMostrarPerfilPublico] = useState(false)
const [usuarioPerfilPublicoId, setUsuarioPerfilPublicoId] = useState(null)
const [errorVideo, setErrorVideo] = useState(false)
const [usuarioActual, setUsuarioActual] = useState(null)
const [notificacionesSinLeer, setNotificacionesSinLeer] = useState([])
function actualizarNotificaciones(datos) {
  setNotificacionesSinLeer(datos)
}
const [comprobandoSesion, setComprobandoSesion] = useState(true)
const [mostrarCrearCapitulo, setMostrarCrearCapitulo] = useState(false)
const [capituloEnEdicionId, setCapituloEnEdicionId] = useState(null)
const [mostrarBuscador, setMostrarBuscador] = useState(false);
const [terminoBusqueda, setTerminoBusqueda] = useState("");
const [tipoBusqueda, setTipoBusqueda] = useState("titulo");
const [generoSeleccionado, setGeneroSeleccionado] = useState("");

const [mostrarPerfil, setMostrarPerfil] = useState(
  sessionStorage.getItem('pantallaLoreAI') === 'perfil'
)

 async function cerrarSesion() {
  try {
    const respuesta = await fetch(
      'http://localhost:3000/api/usuarios/logout',
      {
        method: 'POST',
        credentials: 'include'
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo cerrar la sesión.')
    }

    setUsuarioActual(null)
    setNotificacionesSinLeer([])
    setMostrarPerfil(false)
    setMostrarPerfilPublico(false)
    setMostrarLector(false)
    setMostrarConsola(false)
    setMostrarCrearHistoria(false)
    setMostrarAcceso(false)
    setHistoriaSeleccionadaId(null)
    setUsuarioPerfilPublicoId(null)
    setBienvenidaActiva(false)

  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    alert(error.message)
  }
}

useEffect(() => {
  if (mostrarPerfil) {
    sessionStorage.setItem('pantallaLoreAI', 'perfil')
  } else {
    sessionStorage.removeItem('pantallaLoreAI')
  }
}, [mostrarPerfil])

useEffect(() => {
  async function comprobarSesion() {
    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/usuarios/sesion',
        {
          credentials: 'include'
        }
      )

      if (!respuesta.ok) {
        setUsuarioActual(null)
        return
      }

      const datos = await respuesta.json()

      if (datos.autenticado) {
        setUsuarioActual(datos.usuario)
      } else {
        setUsuarioActual(null)
      }

    } catch (error) {
      console.error('Error al comprobar la sesión:', error)
      setUsuarioActual(null)

    } finally {
      setComprobandoSesion(false)
    }
  }

  comprobarSesion()
}, [])

async function marcarNotificacionesComoLeidas() {
  try {
    const respuesta = await fetch(
      'http://localhost:3000/api/notificaciones/leer',
      {
        method: 'PATCH',
        credentials: 'include'
      }
    )

    if (!respuesta.ok) {
      throw new Error('No se pudieron marcar las notificaciones como leídas.')
    }

    setNotificacionesSinLeer(prev =>
  prev.map(notificacion => ({
    ...notificacion,
    leida: true
  }))
)

  } catch (error) {
    console.error('Error al marcar notificaciones:', error)
  }
}

useEffect(() => {
  if (!usuarioActual) {
    setNotificacionesSinLeer([])
    return
  }

  let activo = true

  async function cargarNotificaciones() {
    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/notificaciones',
        {
          credentials: 'include',
          cache: 'no-store'
        }
      )

      if (!respuesta.ok) {
        throw new Error('No se pudieron cargar las notificaciones.')
      }

      const datos = await respuesta.json()

      if (activo) {
        setNotificacionesSinLeer(datos)
      }

    } catch (error) {
      console.error('Error al cargar notificaciones:', error)
    }
  }

  cargarNotificaciones()

  const intervalo = setInterval(cargarNotificaciones, 5000)

  return () => {
    activo = false
    clearInterval(intervalo)
  }

}, [usuarioActual])

console.log('Usuario actual:', usuarioActual)
console.log('Comprobando sesión:', comprobandoSesion)
console.log('Estado de notificaciones:', notificacionesSinLeer)
 console.log(
  '¿Debe aparecer el indicador?',
  notificacionesSinLeer.some(notificacion => !notificacion.leida)
)


  return (
  <>
    {/* PANTALLA DE BIENVENIDA */}

    {bienvenidaActiva && (
      <section className="pantalla-bienvenida">

        <video
          autoPlay
          playsInline
          onEnded={() => {
            setBienvenidaActiva(false)
            setMostrarAcceso(true)
          }}
          onError={() => setErrorVideo(true)}
        >
          <source
    src={`${import.meta.env.BASE_URL}videos/Bienvenido.mp4`}
    type="video/mp4"
  />

        </video>

        <button
          className="omitir-bienvenida"
          type="button"
          onClick={() => {
            setBienvenidaActiva(false)
            setMostrarAcceso(true)
          }}
        >
          Omitir introducción
        </button>

        {errorVideo && (
          <p className="error-video">
            No pudimos reproducir la bienvenida.
            Puedes continuar sin verla.
          </p>
        )}

      </section>
    )}

    
{mostrarPerfil && comprobandoSesion ? (

  <div className="cargando-perfil">
    Cargando tu perfil... ✨
  </div>

) : mostrarPerfil && usuarioActual ? (

  <Perfil
    usuario={usuarioActual}
    notificacionesSinLeer={notificacionesSinLeer}
        alLeerNotificaciones={marcarNotificacionesComoLeidas}
        alActualizarNotificaciones={actualizarNotificaciones}
    alVolver={() => {
  setMostrarPerfil(false)

  setTimeout(() => {
    document.getElementById('explorar')?.scrollIntoView({
      behavior: 'smooth'
    })
  }, 100)
}}
alEditarHistoria={(id) => {
  setHistoriaEnEdicionId(id)
  setMostrarPerfil(false)
  setMostrarEditorHistoria(true)
}}
    alActualizarUsuario={setUsuarioActual}
    alCerrarSesion={cerrarSesion}
    alAbrirConsola={() => {
  setMostrarPerfil(false)
  setMostrarConsola(true)
}}
  />

  ) : mostrarAdmin && usuarioActual?.rol === 'admin' ? (

  <Admin
    usuario={usuarioActual}
    alVolver={() => setMostrarAdmin(false)}
  />

) : mostrarPerfilPublico ? (

  <PerfilPublico
    usuarioId={usuarioPerfilPublicoId}
    alVolver={() => {
      setMostrarPerfilPublico(false)
      setMostrarLector(true)
    }}
  />

) : mostrarLector ? (

  <LectorHistoria
    historiaId={historiaSeleccionadaId}
    alVolver={() => {
      setMostrarLector(false)
      setMostrarConsola(true)
    }}
    alVerAutor={(autorId) => {
      if (usuarioActual && usuarioActual.id === autorId) {
        setMostrarPerfil(true)
        setMostrarLector(false)
      } else {
        setUsuarioPerfilPublicoId(autorId)
        setMostrarPerfilPublico(true)
        setMostrarLector(false)
      }
    }}
  />

) : mostrarConsola && usuarioActual ? (

  <Consola
    usuario={usuarioActual}
    alVolver={() => setMostrarConsola(false)}
      alAbrirPerfil={() => {
    setMostrarConsola(false)
    setMostrarPerfil(true)
  }}
    alCrearHistoria={() => {
      setMostrarConsola(false)
      setMostrarCrearHistoria(true)
    }}
    alVerHistoria={(id) => {
      setHistoriaSeleccionadaId(id)
      setMostrarConsola(false)
      setMostrarLector(true)
    }}
    alEditarHistoria={(id) => {
  setHistoriaEnEdicionId(id)
  setMostrarConsola(false)
  setMostrarEditorHistoria(true)
}}
    alAbrirLoreChat={() => {}}
  />

  ) : mostrarCrearCapitulo ? (

  <CrearCapitulo
    historiaId={historiaEnEdicionId}
    capituloIdInicial={capituloEnEdicionId}
    alVolver={() => {
      setMostrarCrearCapitulo(false)
      setCapituloEnEdicionId(null)
    }}
  />

) : mostrarEditorHistoria ? (



  <EditorHistoria
    historiaId={historiaEnEdicionId}
    alVolver={() => {
      setMostrarEditorHistoria(false)
      setMostrarConsola(true)
    }}
    alCrearCapitulo={() => {
  setCapituloEnEdicionId(null)
  setMostrarCrearCapitulo(true)
}}
alEditarCapitulo={(id) => {
  setCapituloEnEdicionId(id)
  setMostrarCrearCapitulo(true)
}}
  />

) : mostrarCrearHistoria ? (

  <CrearHistoria
    alVolver={() => {
      setMostrarCrearHistoria(false)
      setMostrarEditorHistoria(false)
setHistoriaEnEdicionId(null)
      setMostrarConsola(true)
    }}
  />

) : (

  <main className="inicio-loreai">
      
      {/* ENCABEZADO */}
      <header className="encabezado-loreai">
        <nav className="nav-loreai">

          <a
            href="#inicio"
            className="logo-loreai"
            onClick={() => setMenuAbierto(false)}
          >
            <img
              src={`${import.meta.env.BASE_URL}Logo-LoreAI.png`}
              alt="LoreAI"
            />
          </a>

          {/* BOTÓN DE MENÚ PARA CELULARES */}
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls="enlaces-loreai"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? "✕" : "☰"}
          </button>

          {/* ENLACES DE NAVEGACIÓN */}
<div
  className={`enlaces-loreai ${menuAbierto ? "abierto" : ""}`}
  id="enlaces-loreai"
>
  <a href="#inicio" onClick={() => setMenuAbierto(false)}>
    INICIO
  </a>

  <a
  href="#explorar"
  onClick={() => {
    setMenuAbierto(false);
    setMostrarBuscador(true);
  }}
>
  EXPLORAR
</a>

  <button
  type="button"
  onClick={abrirAcceso}
  disabled={comprobandoSesion}
>
  {usuarioActual ? (
    <>
      MI PERFIL

      {notificacionesSinLeer?.some(notificacion => !notificacion.leida) && (
  <span className="indicador-notificacion-home" />
)}
    </>
  ) : (
    'INICIAR SESIÓN'
  )}
</button>

{usuarioActual?.rol === 'admin' && (
  <button
    type="button"
    onClick={() => {
      setMenuAbierto(false)
      setMostrarPerfil(false)
      setMostrarAdmin(true)
    }}
  >
    ADMINISTRACIÓN ⭐
  </button>
)}

  <button
  type="button"
  onClick={() => {
    setMenuAbierto(false)

    if (usuarioActual) {
      setMostrarConsola(true)
    } else {
      setDestinoDespuesAcceso('consola')
      setMostrarAcceso(true)
    }
  }}
>
  CONSOLA
</button>

</div>

        </nav>
      </header>


      {/* PORTADA PRINCIPAL */}
      <section className="portada" id="inicio">

        <div className="portada-contenido">

          <div className="portada-texto">
            <p className="portada-etiqueta">
              TU PRÓXIMA HISTORIA COMIENZA AQUÍ
            </p>

            <h1>
              Bienvenido a LoreAI, estrellita ✨
            </h1>

            <p className="portada-descripcion">
              Quédate a leer, imaginar y escribir con nosotros.
            </p>

            <p className="portada-slogan">
              Encontramos la estrella y la ayudamos a brillar.
            </p>

           <button
  id="comenzar"
  type="button"
  onClick={() => setBienvenidaActiva(true)}
>
  Comenzar a escribir   
</button>
          </div>

          <div className="portada-mascota">
            <img src={`${import.meta.env.BASE_URL}La-Lore-chan.png`} />
          </div>

        </div>
      </section>

      {/* HISTORIAS PARA DESCUBRIR */}
      <section className="historias" id="explorar">

  <h2>Un universo de historias te espera ✨</h2>

  <p>Encuentra tu próxima lectura favorita.</p>

  {/* Decoración turquesa */}
  <div className="barra-explorar"></div>

  <nav className="navegacion-explorar">
  <button onClick={() => {
    setMostrarBuscador(true);
    document.getElementById("area-buscador")?.scrollIntoView({ behavior: "smooth" });
  }}>
    BUSCADOR
  </button>

  {usuarioActual && (
    <>
      <button onClick={() => document.getElementById("sigue-leyendo")?.scrollIntoView({ behavior: "smooth" })}>
        SIGUE LEYENDO
      </button>

      <button onClick={() => document.getElementById("recomendado")?.scrollIntoView({ behavior: "smooth" })}>
        RECOMENDADO PARA TI
      </button>
    </>
  )}

  <button onClick={() => document.getElementById("populares")?.scrollIntoView({ behavior: "smooth" })}>
    HISTORIAS POPULARES
  </button>

  <button onClick={() => document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" })}>
    OFERTAS
  </button>

  <button onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}>
    CONTACTO
  </button>
</nav>

  {/* Botón para abrir el buscador */}
  <button id="area-buscador" className="boton-abrir-buscador"
    onClick={() => setMostrarBuscador(!mostrarBuscador)}
  >
    {mostrarBuscador ? "CERRAR BUSCADOR" : "EXPLORAR HISTORIAS ✨"}
  </button>

  {/* BUSCADOR */}
  {mostrarBuscador && (
    <div className="buscador-explorar" id="buscador">

      <input
        type="text"
        placeholder={`Buscar por ${tipoBusqueda}...`}
        value={terminoBusqueda}
        onChange={(e) => setTerminoBusqueda(e.target.value)}
      />

      <select
        value={generoSeleccionado}
        onChange={(e) => setGeneroSeleccionado(e.target.value)}
      >
        <option value="">Todos los géneros</option>

        {generos.map((genero) => (
          <option key={genero} value={genero}>
            {genero}
          </option>
        ))}
      </select>

      <div className="modos-busqueda">
        <span>BUSCAR POR:</span>

        <button
          className={tipoBusqueda === "titulo" ? "activo" : ""}
          onClick={() => setTipoBusqueda("titulo")}
        >
          TÍTULO
        </button>

        <button
          className={tipoBusqueda === "autor" ? "activo" : ""}
          onClick={() => setTipoBusqueda("autor")}
        >
          AUTOR
        </button>

        <button
          className={tipoBusqueda === "etiquetas" ? "activo" : ""}
          onClick={() => setTipoBusqueda("etiquetas")}
        >
          ETIQUETAS
        </button>
      </div>

      <button
        className="boton-buscar"
        onClick={() => console.log("Búsqueda:", {
          terminoBusqueda,
          tipoBusqueda,
          generoSeleccionado
        })}
      >
        BUSCAR ✨
      </button>
    </div>
  )}

  {/* SIGUE LEYENDO */}
  {usuarioActual && (
  <>
    <div id="sigue-leyendo">
  <SigueLeyendo />
</div>

   <div id="recomendado">
  <RecomendadoParaTi />
</div>
  </>
)}

{/* HISTORIAS POPULARES */}
<div id="populares">
  <HistoriasPopulares />
</div>

  {/* OFERTAS */}
  <div className="seccion-ofertas" id="ofertas">
  <h2>Ofertas en historias de paga ✨</h2>

  <p className="texto-ofertas">
    ¡Tu apoyo a la comunidad también tiene recompensa!
  </p>

  <div className="contenedor-ofertas">

    <article className="tarjeta-oferta">
      <span className="descuento">30% OFF</span>
      <h3>¡Corre la voz!</h3>
      <p>Recomienda LoreAI a otras personas y descubre una recompensa especial.</p>
      <span className="etiqueta-oferta">Por recomendar LoreAI</span>
    </article>

    <article className="tarjeta-oferta">
      <span className="descuento">10% OFF</span>
      <h3>¡Comparte historias!</h3>
      <p>Comparte los enlaces de tus historias favoritas y apoya a sus autores.</p>
      <span className="etiqueta-oferta">Por compartir historias</span>
    </article>

    <article className="tarjeta-oferta">
      <span className="descuento">15% OFF</span>
      <h3>¡Apoya a tus autores!</h3>
      <p>Disfruta de una recompensa en historias de tus autores favoritos.</p>
      <span className="etiqueta-oferta">Autores favoritos</span>
    </article>

  </div>

  <p className="aviso-ofertas">
    *Promociones ilustrativas de demostración. No representan descuentos activos.
  </p>



<article className="tarjeta-oferta tarjeta-monetizacion">
  <img
    src={`${import.meta.env.BASE_URL}Historia%20pagada.png`}
  />

  <div className="contenido-monetizacion">
    <span className="etiqueta-oferta">Historias pagadas ✍️</span>
    <h3>¿Tu sueño es ganar dinero como escritor?</h3>
    <p>
      ¡Trabajemos juntos! Convierte tus historias originales
      en proyectos de pago y permite que tus lectores apoyen tu talento.
    </p>
    <span className="etiqueta-oferta">
      Ve a Mi Consola y crea historias pagadas.
    </span>
  </div>
</article>

<article className="tarjeta-oferta tarjeta-monetizacion">
 <img src={`${import.meta.env.BASE_URL}Historia%20con%20anuncios.png`}
    alt="Pantalla de anuncios y monedas"
    className="imagen-monetizacion"
  />

  <div className="contenido-monetizacion">
    <span className="etiqueta-oferta">Historias con anuncios ⭐</span>
    <h3>¿Quieres generar ingresos de otra manera?</h3>
    <p>
      ¿Prefieres no depender de historias pagadas?
      Prueba permitir anuncios en tus historias y descubre
      otra forma de monetizar tus creaciones.
    </p>
    <span className="etiqueta-oferta">
      Explora las opciones de monetización.
    </span>
  </div>
</article>


</div>

</section>

{/* FORMULARIO DE CONTACTO */}
<div id="contacto">
  <Contacto usuario={usuarioActual} />
</div>

<footer className="pie-loreai">
  2026 LoreAI · Encontramos la estrella y la ayudamos a brillar.
</footer>

{mostrarAcceso && (
  <Acceso
    alCerrar={() => setMostrarAcceso(false)}
    alIniciarSesion={(usuario) => {
      setUsuarioActual(usuario)

      if (destinoDespuesAcceso === 'consola') {
        setMostrarConsola(true)
      }

      setDestinoDespuesAcceso(null)
      setMostrarAcceso(false)
    }}
  />
)}

</main>

)}


{/* ASISTENTE LORE-CHAN */}
{!mostrarAdmin && (
  <div className={mostrarAcceso || bienvenidaActiva ? 'chat-bloqueado' : ''}>
    <LoreChat
      usuario={usuarioActual}
      historiaId={mostrarEditorHistoria ? historiaEnEdicionId : null}
      pantalla={
        mostrarCrearHistoria ? 'crear' :
        mostrarConsola ? 'consola' :
        mostrarPerfil ? 'perfil' :
        'inicio'
      }
    />
  </div>
)}
  </>
  )
}

export default App

