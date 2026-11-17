
import { useEffect, useState } from 'react'
import './Admin.css'

function Admin({ usuario, alVolver }) {
  const [autorizado, setAutorizado] = useState(false)
  const [comprobando, setComprobando] = useState(true)
  const [error, setError] = useState('')

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
      } catch (err) {
        setError(err.message)
      } finally {
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
          <article>
            <h3>👥 Usuarios</h3>
            <p>Gestión de cuentas y permisos.</p>
          </article>

          <article>
            <h3>📚 Historias</h3>
            <p>Supervisión de publicaciones.</p>
          </article>

          <article>
            <h3>✉️ Mensajes</h3>
            <p>Consulta de mensajes de contacto.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Admin
