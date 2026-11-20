
import { useState } from 'react'
import './Contacto.css'

function Contacto({ usuario }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    motivo: 'Reporte',
    mensaje: ''
  })

  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  function manejarCambio(e) {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value
    })

    setEnviado(false)
  }

  async function manejarEnvio(e) {
    e.preventDefault()

    setCargando(true)
    setEnviado(false)
    setError('')

    try {
      const respuesta = await fetch('http://localhost:3000/api/contacto', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formulario)
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo enviar el mensaje.')
      }

      setEnviado(true)

      setFormulario({
        nombre: '',
        correo: '',
        motivo: 'Reporte',
        mensaje: ''
      })

    } catch (error) {
      setError(error.message || 'No se pudo conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="seccion-contacto" id="contacto">
      <div className="contenido-contacto">

        <h2>Contáctanos ✉️</h2>

        <p className="texto-contacto">
          ¿Tienes alguna duda, sugerencia o reporte?
          ¡Te leemos! En LoreAI queremos escucharte.
        </p>

        <form
          className="formulario-contacto"
          onSubmit={manejarEnvio}
        >

          {usuario ? (
            <div className="datos-contacto">
              <p>
                <strong>Nombre:</strong> {usuario.usuario}
              </p>

              <p>
                <strong>Correo:</strong> {usuario.correo}
              </p>

              <small>
                Usaremos los datos de tu cuenta para responderte.
              </small>
            </div>
          ) : (
            <>
              <label htmlFor="nombre-contacto">Nombre</label>

              <input
                id="nombre-contacto"
                type="text"
                name="nombre"
                placeholder="¿Cómo te llamas?"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
              />

              <label htmlFor="correo-contacto">
                Correo electrónico
              </label>

              <input
                id="correo-contacto"
                type="email"
                name="correo"
                placeholder="ejemplo@correo.com"
                value={formulario.correo}
                onChange={manejarCambio}
                required
              />
            </>
          )}

          <label htmlFor="motivo-contacto">Motivo</label>

          <select
            id="motivo-contacto"
            name="motivo"
            value={formulario.motivo}
            onChange={manejarCambio}
            required
          >
            <option value="Reporte">Reporte</option>
            <option value="Consulta">Consulta</option>
            <option value="Sugerencia">Sugerencia</option>
            <option value="Otro">Otro</option>
          </select>

          <label htmlFor="mensaje-contacto">Mensaje</label>

          <textarea
            id="mensaje-contacto"
            name="mensaje"
            placeholder="Escribe tu mensaje aquí..."
            value={formulario.mensaje}
            onChange={manejarCambio}
            required
          />

          {error && (
            <p className="error-contacto">{error}</p>
          )}

          {enviado && (
            <p className="exito-contacto">
              ¡Tu mensaje fue enviado correctamente! ⭐
            </p>
          )}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar mensaje ✨'}
          </button>

        </form>
      </div>
    </section>
  )
}

export default Contacto
