
import { useEffect, useState } from 'react'
import './Admin.css'

function Admin({ usuario, alVolver }) {
  const [autorizado, setAutorizado] = useState(false)
  const [comprobando, setComprobando] = useState(true)
  const [error, setError] = useState('')
const [usuarios, setUsuarios] = useState([])
const [cargandoUsuarios, setCargandoUsuarios] = useState(true)
const [busquedaUsuario, setBusquedaUsuario] = useState('')
const [mostrarUsuarios, setMostrarUsuarios] = useState(false)
const [mostrarHistorias, setMostrarHistorias] = useState(false)
const [historias, setHistorias] = useState([])
const [cargandoHistorias, setCargandoHistorias] = useState(true)
const [errorHistorias, setErrorHistorias] = useState('')
const [mensajes, setMensajes] = useState([])
const [cargandoMensajes, setCargandoMensajes] = useState(true)
const [errorMensajes, setErrorMensajes] = useState('')
const [mostrarMensajes, setMostrarMensajes] = useState(false)
const [respuestas, setRespuestas] = useState({})
const [enviandoRespuesta, setEnviandoRespuesta] = useState(false)
const [bandejaActiva, setBandejaActiva] = useState('entrada')
const [carpetaActiva, setCarpetaActiva] = useState(null)

async function responderMensaje(id) {
  const texto = respuestas[id]?.trim()

  if (!texto) {
    return
  }

  setEnviandoRespuesta(true)

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/admin/mensajes/${id}/responder`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ respuesta: texto })
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'No se pudo enviar la respuesta.')
    }

    setMensajes(mensajesActuales =>
      mensajesActuales.map(mensaje =>
        mensaje.id === id
          ? {
              ...mensaje,
              respuestas: [
                ...(mensaje.respuestas || []),
                datos.respuesta
              ]
            }
          : mensaje
      )
    )

    setRespuestas(actuales => ({
      ...actuales,
      [id]: ''
    }))

  } catch (error) {
    alert(error.message)
  } finally {
    setEnviandoRespuesta(false)
  }
}

async function actualizarMensaje(id, cambios) {
  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/admin/mensajes/${id}/estado`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cambios)
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.mensaje || 'No se pudo actualizar el mensaje.'
      )
    }

    setMensajes(actuales =>
      actuales.map(mensaje =>
        mensaje.id === id
          ? { ...mensaje, ...datos.mensajeActualizado }
          : mensaje
      )
    )

  } catch (error) {
    alert(error.message)
  }
}

async function marcarRespuestasComoLeidas(id) {
  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/admin/mensajes/${id}/estado`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          marcarRespuestasLeidas: true
        })
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.mensaje || 'No se pudieron marcar las respuestas como leídas.'
      )
    }

    setMensajes(actuales =>
      actuales.map(mensaje =>
        mensaje.id === id
          ? { ...mensaje, ...datos.mensajeActualizado }
          : mensaje
      )
    )

  } catch (error) {
    alert(error.message)
  }
}

const mensajesFiltrados = mensajes.filter(mensaje =>
  bandejaActiva === 'archivados'
    ? mensaje.archivado === true
    : mensaje.archivado !== true
)

const mensajesAgrupados = mensajesFiltrados.reduce((grupos, mensaje) => {
  const clave = mensaje.usuarioId
    ? `usuario-${mensaje.usuarioId}`
    : `visitante-${mensaje.correo?.toLowerCase().trim() || mensaje.nombre}`

  if (!grupos[clave]) {
    grupos[clave] = {
      clave,
      nombre: mensaje.nombre,
      correo: mensaje.correo,
      usuarioId: mensaje.usuarioId,
      mensajes: []
    }
  }

  grupos[clave].mensajes.push(mensaje)

  return grupos
}, {})

const usuariosFiltrados = usuarios.filter(cuenta => {
  const busqueda = busquedaUsuario.toLowerCase()

  return (
    cuenta.usuario?.toLowerCase().includes(busqueda) ||
    cuenta.correo?.toLowerCase().includes(busqueda) ||
    cuenta.nombrePublico?.toLowerCase().includes(busqueda)
  )
})

  useEffect(() => {
    async function verificarAcceso() {
      try {
        const respuesta = await fetch(
          'http://localhost:3000/api/admin/verificar',
          { credentials: 'include' }
        )

        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error(
            datos.error || 'No tienes autorización.'
          )
        }

        setAutorizado(true)
        const respuestaUsuarios = await fetch(
  'http://localhost:3000/api/admin/usuarios',
  { credentials: 'include' }
)

const datosUsuarios = await respuestaUsuarios.json()

if (!respuestaUsuarios.ok) {
  throw new Error(
    datosUsuarios.error || 'No se pudieron cargar los usuarios.'
  )
}

setUsuarios(datosUsuarios)
const respuestaHistorias = await fetch(
  'http://localhost:3000/api/admin/historias',
  { credentials: 'include' }
)

const datosHistorias = await respuestaHistorias.json()

if (!respuestaHistorias.ok) {
  throw new Error(
    datosHistorias.error || 'No se pudieron cargar las historias.'
  )
}

setHistorias(datosHistorias)

const respuestaMensajes = await fetch(
  'http://localhost:3000/api/admin/mensajes',
  { credentials: 'include' }
)

const datosMensajes = await respuestaMensajes.json()

if (!respuestaMensajes.ok) {
  throw new Error(
    datosMensajes.mensaje || 'No se pudieron cargar los mensajes.'
  )
}

setMensajes(datosMensajes)

      } catch (err) {
        setError(err.message)
      } finally {
  setCargandoHistorias(false)
  setCargandoUsuarios(false)
  setCargandoMensajes(false)
  setComprobando(false)
}
    }


    verificarAcceso()
  }, [])

  if (comprobando) {
    return <div className="admin-cargando">
      Verificando permisos administrativos... ✨
    </div>
  }

  if (!autorizado) {
    return (
      <div className="admin-error">
        <h2>Acceso denegado</h2>
        <p>{error}</p>
        <button onClick={alVolver}>Volver a LoreAI</button>
      </div>
    )
  }

  return (
    <main className="panel-admin">
      <header className="admin-encabezado">
        <div>
          <p>LOREAI · ADMINISTRACIÓN</p>
          <h1>Panel de administración ⭐</h1>
          <span>Bienvenida, {usuario?.usuario}</span>
        </div>

        <button onClick={alVolver}>
          Volver a LoreAI
        </button>
      </header>

      <section className="admin-contenido">
        <h2>Centro de control</h2>
        <p>
          Desde aquí podrás supervisar y administrar
          los contenidos y usuarios de LoreAI.
        </p>

        <div className="admin-modulos">
          <article
  className="admin-modulo"
  onClick={() => setMostrarUsuarios(!mostrarUsuarios)}
>
  <h3>👥 Usuarios</h3>
  <p>Gestión de cuentas y permisos.</p>
  <span> {mostrarUsuarios ? 'Cerrar sección ↑' : 'Administrar →'} </span>
</article>

          <article
  className="admin-modulo"
  onClick={() => setMostrarHistorias(!mostrarHistorias)}
>
  <h3>📚 Historias</h3>
  <p>Supervisión de publicaciones.</p>
  <span>
    {mostrarHistorias ? 'Cerrar sección ↑' : 'Administrar →'}
  </span>
</article>

          <article
  className="admin-tarjeta"
  onClick={() => setMostrarMensajes(!mostrarMensajes)}
>
  <h3>✉️ Mensajes</h3>
  <p>Consulta los mensajes recibidos mediante el formulario de contacto.</p>
</article>

</div>

        {mostrarUsuarios && (

<section className="admin-usuarios">

<input
  type="text"
  placeholder="Buscar usuario o correo..."
  value={busquedaUsuario}
  onChange={e => setBusquedaUsuario(e.target.value)}
  className="admin-buscador"
/>

  <h2>👥 Usuarios registrados</h2>

  {cargandoUsuarios ? (
    <p>Cargando usuarios...</p>
  ) : usuariosFiltrados.length === 0 ? (
    <p>Todavía no hay usuarios registrados.</p>
  ) : (
    <div className="admin-lista-usuarios">
      {usuariosFiltrados.map(cuenta => (
        <article key={cuenta.id} className="admin-usuario">
          <h3>{cuenta.nombrePublico}</h3>
          <p><strong>Usuario:</strong> {cuenta.usuario}</p>
          <p><strong>Correo:</strong> {cuenta.correo}</p>
          <p><strong>Rol:</strong> {cuenta.rol}</p>
          <p>
            <strong>Registro:</strong>{' '}
            {cuenta.fechaRegistro
              ? new Date(cuenta.fechaRegistro).toLocaleDateString()
              : 'No disponible'}
          </p>
        </article>
      ))}
    </div>
  )}
</section>

)}

{mostrarHistorias && (
  <section className="admin-usuarios">
    <h2>📚 Historias de LoreAI</h2>

    {cargandoHistorias ? (
      <p>Cargando historias...</p>
    ) : historias.length === 0 ? (
      <p>Todavía no hay historias registradas.</p>
    ) : (
      <div className="admin-lista-usuarios">
        {historias.map(historia => (
          <article key={historia.id} className="admin-usuario">
            <h3>{historia.titulo || 'Sin título'}</h3>
            <p><strong>Autor:</strong> {historia.creador}</p>
            <p><strong>Género:</strong> {historia.genero || 'No especificado'}</p>
            <p>
              <strong>Estado:</strong>{' '}
              {historia.enPapelera ? 'En papelera' : 'Registrada'}
            </p>
          </article>
        ))}
      </div>
    )}
  </section>
)}

{mostrarMensajes && (
  <section className="admin-usuarios">
    <h2>✉️ Centro de mensajes</h2>

<div className="admin-bandejas">
  <button
    onClick={() => setBandejaActiva('entrada')}
    className={bandejaActiva === 'entrada' ? 'activo' : ''}
  >
    📥 Bandeja de entrada
  </button>

  <button
    onClick={() => setBandejaActiva('archivados')}
    className={bandejaActiva === 'archivados' ? 'activo' : ''}
  >
    🗄️ Archivados
  </button>
</div>

    {cargandoMensajes ? (
      <p>Cargando mensajes...</p>
    ) : errorMensajes ? (
      <p>{errorMensajes}</p>
    ) : mensajesFiltrados.length === 0 ? (
  <p>
    {bandejaActiva === 'archivados'
      ? 'No hay mensajes archivados.'
      : 'No tienes mensajes nuevos en la bandeja de entrada.'}
  </p>
) : (
  <div className="admin-lista-usuarios">
   
{Object.values(mensajesAgrupados).map(grupo => (
  <article key={grupo.clave} className="admin-carpeta">

    <button
      className="admin-carpeta-boton"
      onClick={() => {
  const abrir = carpetaActiva !== grupo.clave

  setCarpetaActiva(abrir ? grupo.clave : null)

  if (abrir) {
    grupo.mensajes.forEach(mensaje => {
      const tienePendientes = (mensaje.respuestas || []).some(
        respuesta =>
          respuesta.remitente === 'usuario' &&
          respuesta.leidaPorAdmin === false
      )

      if (tienePendientes) {
        marcarRespuestasComoLeidas(mensaje.id)
      }
    })
  }
}}
    >
      📁 {grupo.nombre} — {grupo.mensajes.length} mensaje(s)

{grupo.mensajes.some(mensaje =>
  (mensaje.respuestas || []).some(respuesta =>
    respuesta.remitente === 'usuario' &&
    respuesta.leidaPorAdmin === false
  )
) && (
  <span
    className="admin-esferita-roja"
    aria-label="Respuestas nuevas"
  />
)}

{carpetaActiva === grupo.clave ? ' ▲' : ' ▼'}
    </button>

    {carpetaActiva === grupo.clave && (
      <div className="admin-mensajes-carpeta">

        {grupo.mensajes.map(mensaje => (
          <article key={mensaje.id} className="admin-usuario">

            <h3>{mensaje.motivo}</h3>

            <p><strong>Nombre:</strong> {mensaje.nombre}</p>
            <p><strong>Correo:</strong> {mensaje.correo}</p>

            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(mensaje.fecha).toLocaleString()}
            </p>

            <p><strong>Mensaje:</strong></p>
            <p>{mensaje.mensaje}</p>

            <div className="admin-acciones-mensaje">
              <p>
                <strong>Estado:</strong>{' '}
                {mensaje.estado === 'atendido'
                  ? '✅ Atendido'
                  : '🕒 Pendiente'}
              </p>

              <button
                onClick={() =>
                  actualizarMensaje(mensaje.id, {
                    estado: mensaje.estado === 'atendido'
                      ? 'pendiente'
                      : 'atendido'
                  })
                }
              >
                {mensaje.estado === 'atendido'
                  ? 'Marcar como pendiente'
                  : 'Marcar como atendido'}
              </button>

              <button
                onClick={() =>
                  actualizarMensaje(mensaje.id, {
                    archivado: !mensaje.archivado
                  })
                }
              >
                {mensaje.archivado
                  ? 'Recuperar mensaje'
                  : 'Archivar mensaje'}
              </button>
            </div>

            <hr />

            <h4>💬 Respuestas de LoreAI</h4>

            {mensaje.respuestas?.length > 0 ? (
              mensaje.respuestas.map(respuesta => (
                <div key={respuesta.id}>
                  <p>{respuesta.respuesta}</p>
                  <small>
                    {new Date(respuesta.fecha).toLocaleString()}
                  </small>
                </div>
              ))
            ) : (
              <p>Todavía no hay respuestas.</p>
            )}

            <textarea
              placeholder="Escribe tu respuesta..."
              value={respuestas[mensaje.id] || ''}
              onChange={e =>
                setRespuestas(actuales => ({
                  ...actuales,
                  [mensaje.id]: e.target.value
                }))
              }
            />

            <button
              onClick={() => responderMensaje(mensaje.id)}
              disabled={
                enviandoRespuesta || !respuestas[mensaje.id]?.trim()
              }
            >
              {enviandoRespuesta
                ? 'Enviando...'
                : 'Enviar respuesta'}
            </button>

          </article>
        ))}

      </div>
    )}

  </article>
))}

      </div>
    )}
  </section>
)}

      </section>

    </main>
  )
}

export default Admin
