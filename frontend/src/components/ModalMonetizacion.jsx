
import { useState } from 'react'
import './ModalMonetizacion.css'

function ModalMonetizacion({ tipo, alCerrar, alAceptar }) {
  const [acepto, setAcepto] = useState(false)

  const esPaga = tipo === 'paga'

  return (
    <div className="fondo-modal-monetizacion">
      <section
        className="modal-monetizacion"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-monetizacion"
      >
        <button
          type="button"
          className="cerrar-monetizacion"
          onClick={alCerrar}
          aria-label="Cerrar"
        >
          ×
        </button>

        <span className="icono-monetizacion">
          {esPaga ? '✧' : '◈'}
        </span>

        <h2 id="titulo-monetizacion">
          {esPaga ? 'Historia de paga' : 'Aceptar anuncios'}
        </h2>

        {esPaga ? (
          <>
            <p>
              Convierte tu creatividad en una oportunidad para generar
              ingresos. Permite que tus lectores compren capítulos de tu obra.
            </p>

            <div className="resumen-monetizacion">
              <strong>Distribución de ingresos</strong>
              <p>90 % para el autor</p>
              <p>10 % para LoreAI</p>
            </div>

            <p>
              Como política de LoreAI, los primeros tres capítulos de tu
              historia serán gratuitos para los lectores.
            </p>
          </>
        ) : (
          <>
            <p>
              Permite que LoreAI incorpore anuncios de patrocinadores en
              determinados espacios de tu obra.
            </p>

            <div className="resumen-monetizacion">
              <strong>Distribución de ingresos publicitarios</strong>
              <p>5 % para el autor</p>
              <p>95 % para LoreAI</p>
            </div>

            <p>
              Los anuncios deberán estar identificados y no modificarán
              el contenido original de tu historia.
            </p>
          </>
        )}

        <div className="condiciones-monetizacion">
          <strong>Términos y condiciones de demostración</strong>

          <ul>
            <li>La participación en esta modalidad es voluntaria.</li>
            <li>El autor conserva los derechos de su obra.</li>
            <li>La distribución de ingresos será la indicada anteriormente.</li>
            <li>Esta función todavía no está habilitada comercialmente.</li>
          </ul>
        </div>

        <label className="aceptacion-monetizacion">
          <input
            type="checkbox"
            checked={acepto}
            onChange={e => setAcepto(e.target.checked)}
          />

          <span>
            He leído y acepto estas condiciones de demostración.
          </span>
        </label>

        <button
          type="button"
          className="boton-aceptar-monetizacion"
          disabled={!acepto}
          onClick={alAceptar}
        >
          ACEPTAR (DEMOSTRACIÓN)
        </button>

        <button
          type="button"
          className="boton-cancelar-monetizacion"
          onClick={alCerrar}
        >
          CANCELAR
        </button>

        <small className="aviso-monetizacion">
          Simulación académica. No constituye un contrato ni activa
          transacciones comerciales.
        </small>
      </section>
    </div>
  )
}

export default ModalMonetizacion
