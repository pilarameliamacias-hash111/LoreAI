
import { useEffect, useState } from 'react'
import './LectorHistoria.css'

function LectorHistoria({ historiaId, alVolver, alVerAutor }) {  
  const [historia, setHistoria] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarIndice, setMostrarIndice] = useState(false)
  const [mostrarOpciones, setMostrarOpciones] = useState(false)

  useEffect(() => {
    async function cargarHistoria() {
      setCargando(true)
      setError('')

      try {
        const respuesta = await fetch(
          `http://localhost:3000/api/historias/${historiaId}`,
          { credentials: 'include' }
        )

        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error(datos.error || 'No se pudo cargar la historia.')
        }

        setHistoria(datos)

      } catch (error) {
        console.error('Error al cargar la historia:', error)
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    cargarHistoria()
  }, [historiaId])

  if (cargando) {
    return <p>Cargando historia...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!historia) {
    return <p>No se encontró esta historia.</p>
  }

  const autor = historia.autor
  const capitulos = historia.capitulos || []

  return (
    <main className="pagina-lector">

      <header className="encabezado-lector">
        <button type="button" onClick={alVolver}>
          ← VOLVER
        </button>

        <img src="/Logo-LoreAI.png" alt="LoreAI" />
      </header>

      <section className="contenido-lector">

        <div className="portada-lector">
          {historia.portada ? (
            <img
              src={historia.portada}
              alt={`Portada de ${historia.titulo}`}
            />
          ) : (
            <div className="portada-sin-imagen">
              ✨ Sin portada
            </div>
          )}
        </div>

        <div className="informacion-lector">

<div className="menu-opciones-lector">

  <button
    type="button"
    className="boton-tres-puntos"
    onClick={() => setMostrarOpciones(!mostrarOpciones)}
    aria-label="Más opciones"
    aria-expanded={mostrarOpciones}
  >
    ⋮
  </button>

  {mostrarOpciones && (
    <div className="desplegable-lector">

      <button type="button">
        <span>▣</span> Guardar en biblioteca
      </button>

      <button type="button">
        <span>↗</span> Compartir
      </button>

      <button type="button">
        <span>♡</span> Agregar a favoritos
      </button>

      <button type="button">
        <span>⚑</span> Denunciar
      </button>

    </div>
  )}

</div>

          <h1>{historia.titulo}</h1>

          <p className="descripcion-lector">
            {historia.descripcion}
          </p>

          <div className="etiquetas-lector">
            {(historia.etiquetas || []).map(etiqueta => (
              <span key={etiqueta}>{etiqueta}</span>
            ))}
          </div>

          <div className="datos-lector">
            {historia.genero && (
              <p><strong>Género:</strong> {historia.genero}</p>
            )}

            {historia.generoSecundario && (
              <p><strong>Género secundario:</strong> {historia.generoSecundario}</p>
            )}

            {historia.publico && (
              <p><strong>Público:</strong> {historia.publico}</p>
            )}

            {historia.categoria && (
              <p><strong>Categoría:</strong> {historia.categoria}</p>
            )}

            <p>
              <strong>Colaborativa:</strong>{' '}
              {historia.colaborando ? 'Sí' : 'No'}
            </p>
          </div>

          <button
    type="button"
    className="boton-autor-lector"
    onClick={() => alVerAutor(autor.id)}
    disabled={!autor}
>

            {autor?.fotoPerfil ? (
              <img src={autor.fotoPerfil} alt="" />
            ) : (
              <span className="avatar-sin-foto">✦</span>
            )}

            <span>
              <small>Escrito por</small>
              <strong>
                {autor?.nombrePublico || autor?.usuario || 'Autor desconocido'}
              </strong>
            </span>
          </button>

          <div className="acciones-lector">

            <button type="button" className="boton-leer">
              LEER
            </button>

            <button
              type="button"
              className="boton-indice"
              onClick={() => setMostrarIndice(!mostrarIndice)}
            >
              {mostrarIndice ? 'CERRAR ÍNDICE' : 'ÍNDICE'}
            </button>

          </div>

          {mostrarIndice && (
            <section className="indice-lector">
              <h2>Índice de capítulos</h2>

              {capitulos.length === 0 ? (
                <p>Esta historia todavía no tiene capítulos.</p>
              ) : (
                <ol>
                  {capitulos.map((capitulo, indice) => (
                    <li key={capitulo.id || indice}>
                      {capitulo.titulo || `Capítulo ${indice + 1}`}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}

        </div>
      </section>

    </main>
  )
}

export default LectorHistoria
