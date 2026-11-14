
import { useState } from 'react'
import './Contacto.css'

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    motivo: 'Reporte',
    mensaje: ''
  })

  const [enviado, setEnviado] = useState(false)

  function manejarCambio(e) {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value
    })

    setEnviado(false)
  }

  function manejarEnvio(e) {
    e.preventDefault()

    // Demostración: no envía ni almacena información.
    setEnviado(true)

    setFormulario({
      nombre: '',
      correo: '',
      motivo: 'Reporte',
      mensaje: ''
    })
  }

  return (
    <section className="seccion-contacto" id="contacto">
      <div className="contenido-contacto">

        <h2>¡Estamos para escucharte! ✨</h2>

        <p className="texto-contacto">
          ¿Encontraste algún problema, tienes una sugerencia
          o quieres compartir algo con nosotros?
          ¡Tu opinión ayuda a LoreAI a crecer!
        </p>

        <form className="formulario-contacto" onSubmit={manejarEnvio}>

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

          <label htmlFor="correo-contacto">Correo electrónico</label>
          <input
            id="correo-contacto"
            type="email"
            name="correo"
            placeholder="ejemplo@correo.com"
            value={formulario.correo}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="motivo-contacto">Motivo del mensaje</label>
          <select
            id="motivo-contacto"
            name="motivo"
            value={formulario.motivo}
            onChange={manejarCambio}
          >
            <option value="Reporte">Reportar un problema</option>
            <option value="Sugerencia">Enviar una sugerencia</option>
            <option value="Consulta">Realizar una consulta</option>
            <option value="Otro">Otro motivo</option>
          </select>

          <label htmlFor="mensaje-contacto">Tu mensaje</label>
          <textarea
            id="mensaje-contacto"
            name="mensaje"
            placeholder="Cuéntanos cómo podemos ayudarte..."
            rows="5"
            value={formulario.mensaje}
            onChange={manejarCambio}
            required
          />

          <button type="submit">
            Enviar mensaje ✨
          </button>

          {enviado && (
            <p className="confirmacion-contacto" role="status">
              ¡Gracias por comunicarte con LoreAI! ✨
              Esta es una demostración: tu mensaje no ha sido enviado.
            </p>
          )}

        
        </form>

        {/* REDES SOCIALES Y CORREO */}
        <div className="redes-contacto">

          <h3>También puedes encontrarnos en ✨</h3>

          <div className="correo-contacto">
            <span className="icono-contacto">✉</span>
            <div>
              <strong>Correo electrónico</strong>
              <p>contacto@loreai.example</p>
            </div>
          </div>

          <div className="lista-redes-contacto">

            <div className="red-social">
              <span>◎</span>
              <div>
                <strong>Instagram</strong>
                <p>@loreai.oficial</p>
              </div>
            </div>

            <div className="red-social">
              <span>𝕏</span>
              <div>
                <strong>X</strong>
                <p>@LoreAI</p>
              </div>
            </div>

            <div className="red-social">
              <span>♪</span>
              <div>
                <strong>TikTok</strong>
                <p>@loreai.oficial</p>
              </div>
            </div>

            <div className="red-social">
              <span>f</span>
              <div>
                <strong>Facebook</strong>
                <p>LoreAI Oficial</p>
              </div>
            </div>

          </div>

          <p className="aviso-redes">
            *Correo y cuentas ilustrativas de demostración.
          </p>

        </div>

      </div>
    </section>

  )
}

export default Contacto
