
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
    <h2>✉️ Mensajes recibidos</h2>

    {cargandoMensajes ? (
      <p>Cargando mensajes...</p>
    ) : errorMensajes ? (
      <p>{errorMensajes}</p>
    ) : mensajes.length === 0 ? (
      <p>Todavía no has recibido mensajes.</p>
    ) : (
      <div className="admin-lista-usuarios">
        {mensajes.map(mensaje => (
          <article key={mensaje.id} className="admin-usuario">
            <h3>{mensaje.motivo}</h3>

            <p>
              <strong>Nombre:</strong> {mensaje.nombre}
            </p>

            <p>
              <strong>Correo:</strong> {mensaje.correo}
            </p>

            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(mensaje.fecha).toLocaleString()}
            </p>

            <p>
              <strong>Mensaje:</strong>
            </p>

            <p>{mensaje.mensaje}</p>
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
