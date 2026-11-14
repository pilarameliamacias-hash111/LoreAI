import { useEffect, useState } from 'react'
import './EditorHistoria.css'
import ModalMonetizacion from '../components/ModalMonetizacion'

const generos = [
  'Acción', 'Aventura', 'Ciencia ficción', 'Comedia',
  'Drama', 'Fantasía', 'Misterio', 'Romance',
  'Terror', 'Suspenso', 'Slice of Life', 'Histórico'
]

const publicos = [
  'Infantil', 'Juvenil', 'Joven adulto', 'Adulto', 'Todo público'
]

const categorias = [
  'Historia original',
  'Fanfic',
  'Basado en hechos reales',
  'Guía o instructivo',
  'Artístico',
  'Otro'
]

function EditorHistoria({
  historiaId,
  alVolver,
  alCrearCapitulo,
  alEditarCapitulo
}) {
  const [historia, setHistoria] = useState(null)
  const [capitulos, setCapitulos] = useState([])
  const [menuCapituloAbierto, setMenuCapituloAbierto] = useState(null)
const [cargandoCapitulos, setCargandoCapitulos] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [pestana, setPestana] = useState('detalles')
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [etiquetas, setEtiquetas] = useState([])
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [genero, setGenero] = useState('')
  const [generoSecundario, setGeneroSecundario] = useState('')
  const [publico, setPublico] = useState('')
  const [categoria, setCategoria] = useState('')
  const [colaborando, setColaborando] = useState(false)
  const [portada, setPortada] = useState('')
  const [estadoHistoria, setEstadoHistoria] = useState('Historia en emisión')
  const [tipoSaga, setTipoSaga] = useState('No')
  const [detalleSaga, setDetalleSaga] = useState('')
  const [mostrarModalSaga, setMostrarModalSaga] = useState(false)
  const [mensajeGuardado, setMensajeGuardado] = useState('')
  const [modalMonetizacion, setModalMonetizacion] = useState(null)
const [anunciosAceptados, setAnunciosAceptados] = useState(false)
  

  useEffect(() => {
    async function cargarHistoria() {
      try {
        setCargando(true)
        setError('')

        const respuesta = await fetch(
          `http://localhost:3000/api/historias/${historiaId}`,
          { credentials: 'include' }
        )

        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error(datos.error || 'No se pudo cargar la historia.')
        }

        const obra = datos.historia || datos
        setHistoria(obra)
        setTitulo(obra.titulo || '')
        setDescripcion(obra.descripcion || '')
        setEtiquetas(obra.etiquetas || [])
        setGenero(obra.genero || '')
        setGeneroSecundario(obra.generoSecundario || '')
        setPublico(obra.publico || '')
        setCategoria(obra.categoria || '')
        setColaborando(Boolean(obra.colaborando))
        setPortada(obra.portada || '')
        setEstadoHistoria(obra.estadoHistoria || 'Historia en emisión')
        setTipoSaga(obra.tipoSaga || 'No')
        setDetalleSaga(obra.detalleSaga || '')

      } catch (error) {
        console.error('Error al cargar historia:', error)
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    if (historiaId) cargarHistoria()
  }, [historiaId])

  async function cargarCapitulos() {
  try {
    setCargandoCapitulos(true)

    const respuesta = await fetch(
      `http://localhost:3000/api/historias/${historiaId}/capitulos`,
      { credentials: 'include' }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudieron cargar los capítulos.')
    }

    setCapitulos(Array.isArray(datos) ? datos : datos.capitulos || [])

  } catch (error) {
    console.error('Error al cargar capítulos:', error)
    setError(error.message)
  } finally {
    setCargandoCapitulos(false)
  }
}

useEffect(() => {
  if (historiaId) cargarCapitulos()
}, [historiaId])

async function eliminarCapitulo(id) {
    
  const confirmar = window.confirm(
    '¿Seguro que quieres eliminar este capítulo?'
  )

  if (!confirmar) return

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/historias/${historiaId}/capitulos/${id}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo eliminar el capítulo.')
    }

    setCapitulos(lista => lista.filter(c => c.id !== id))
    setMenuCapituloAbierto(null)

  } catch (error) {
    console.error('Error al eliminar capítulo:', error)
    alert(error.message)
  }
}


async function cambiarEstadoCapitulo(capitulo) {
  const nuevoEstado =
    capitulo.estado === 'publicado' ? 'borrador' : 'publicado'

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/historias/${historiaId}/capitulos/${capitulo.id}/estado`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo cambiar el estado.')
    }

    setCapitulos(lista =>
      lista.map(c =>
        c.id === capitulo.id
          ? { ...c, estado: nuevoEstado }
          : c
      )
    )

    setMenuCapituloAbierto(null)

    alert(datos.mensaje)

  } catch (error) {
    console.error('Error al cambiar estado:', error)
    alert(error.message)
  }
}


  function agregarEtiqueta() {
    const etiqueta = nuevaEtiqueta.trim()

    if (!etiqueta || etiquetas.length >= 10) return
    if (etiquetas.some(e => e.toLowerCase() === etiqueta.toLowerCase())) return

    setEtiquetas([...etiquetas, etiqueta])
    setNuevaEtiqueta('')
  }

  function seleccionarPortada(evento) {
    const archivo = evento.target.files[0]
    if (!archivo) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
      alert('Selecciona una imagen JPG, PNG o WEBP.')
      return
    }

    if (archivo.size > 1024 * 1024) {
      alert('La portada debe pesar menos de 1 MB.')
      return
    }

    const lector = new FileReader()
    lector.onload = () => setPortada(lector.result)
    lector.readAsDataURL(archivo)
  }

  async function guardarCambios(evento) {
    evento.preventDefault()
    if (guardando) return

    if (!titulo.trim() || !descripcion.trim() || !genero || !generoSecundario) {
      alert('Completa el título, la descripción y los dos géneros.')
      return
    }

    setGuardando(true)

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/historias/${historiaId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            etiquetas,
            genero,
            generoSecundario,
            publico,
            categoria,
            colaborando,
            portada,
            estadoHistoria,
            tipoSaga,
            detalleSaga
          })
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudieron guardar los cambios.')
      }

      setMensajeGuardado('¡Cambios guardados exitosamente! ✨')
setHistoria(datos.historia)

    } catch (error) {
        setMensajeGuardado('')
      console.error('Error al guardar historia:', error)
      alert(error.message || 'No se pudo conectar con LoreAI.')
    } finally {
      setGuardando(false)
    }
  }

  function cancelarCambios() {
    if (window.confirm('¿Quieres salir del editor? Los cambios sin guardar se perderán.')) {
      alVolver?.()
    }
  }

  async function eliminarHistoria() {
  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/historias/${historiaId}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo mover la historia a la papelera.')
    }

    setMostrarModalEliminar(false)
    alVolver?.()

  } catch (error) {
    console.error('Error al eliminar historia:', error)
    alert(error.message)
  }
}

  function cambiarTipoSaga(valor) {
    setTipoSaga(valor)

    if (valor !== 'No') {
      setMostrarModalSaga(true)
    } else {
      setDetalleSaga('')
    }
  }

  if (cargando) {
    return <main className="editor-historia estado-editor">Cargando tu historia... ✨</main>
  }

  if (error || !historia) {
    return (
      <main className="editor-historia estado-editor">
        <p>{error || 'No encontramos esta historia.'}</p>
        <button type="button" onClick={alVolver}>VOLVER A CONSOLA</button>
      </main>
    )
  }

  return (
    <main className="editor-historia">
      <header className="encabezado-editor">
        <button type="button" className="editor-volver" onClick={cancelarCambios}>
          ← VOLVER
        </button>

        <h1>{titulo || 'Historia sin título'}</h1>

        <div className="acciones-editor">
          <button type="button" onClick={cancelarCambios}>CANCELAR</button>
          <button
            type="button"
            className="boton-eliminar-editor"
            onClick={() => setMostrarModalEliminar(true)}
          >
            ELIMINAR
          </button>
          <button
            type="submit"
            form="formulario-editor"
            className="boton-guardar-editor"
            disabled={guardando}
          >
            {guardando ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
          </button>
        </div>
      </header>

      

      <nav className="pestanas-editor">
        <button
          type="button"
          className={pestana === 'detalles' ? 'activa' : ''}
          onClick={() => setPestana('detalles')}
        >
          DETALLES DE HISTORIA
        </button>
        <button
          type="button"
          className={pestana === 'indices' ? 'activa' : ''}
          onClick={() => setPestana('indices')}
        >
          ÍNDICES
        </button>
        <button
          type="button"
          className={pestana === 'notas' ? 'activa' : ''}
          onClick={() => setPestana('notas')}
        >
          NOTAS, RECURSOS Y COMENTARIOS
        </button>
        <button
          type="button"
          className={pestana === 'lore' ? 'activa' : ''}
          onClick={() => setPestana('lore')}
        >
          LORE-CHAN
        </button>
      </nav>

      {pestana === 'detalles' && (
        <form
          id="formulario-editor"
          className="formulario-editor"
          onSubmit={guardarCambios}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
              e.preventDefault()
            }
          }}
        >
          <section className="portada-editor">
            <label htmlFor="portada-editor" className="cuadro-portada-editor">
              {portada ? (
                <img src={portada} alt="Portada de la historia" />
              ) : (
                <span>＋ Agregar portada</span>
              )}
            </label>
            <input
              id="portada-editor"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={seleccionarPortada}
              hidden
            />
            {portada && (
              <button type="button" onClick={() => setPortada('')}>
                Quitar portada
              </button>
            )}
          </section>

          <section className="caja-detalles-editor">
            <div className="titulo-detalles-editor">
              <h2>DETALLES DE HISTORIA</h2>
              <label className="interruptor-editor">
  <span>¿Colaborando?</span>

  <input
    type="checkbox"
    checked={colaborando}
    onChange={e => setColaborando(e.target.checked)}
  />

  <span className="barra-interruptor-editor">
    <span className="circulo-interruptor-editor" />
  </span>
</label>
            </div>

            <label className="campo-editor">
              Título
              <input value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={100} />
            </label>

            <label className="campo-editor">
              Descripción
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                maxLength={1000}
                rows={5}
              />
              <small>{descripcion.length}/1000 caracteres</small>
            </label>

            <div className="campo-editor">
              <label>Etiquetas</label>
              <div className="entrada-etiqueta-editor">
                <input
                  value={nuevaEtiqueta}
                  onChange={e => setNuevaEtiqueta(e.target.value)}
                  placeholder="Agregar una etiqueta..."
                />
                <button type="button" onClick={agregarEtiqueta}>AGREGAR</button>
              </div>
              <div className="etiquetas-editor">
                {etiquetas.map(etiqueta => (
                  <span key={etiqueta}>
                    {etiqueta}
                    <button
                      type="button"
                      aria-label={`Eliminar ${etiqueta}`}
                      onClick={() => setEtiquetas(etiquetas.filter(e => e !== etiqueta))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <label className="campo-editor">
              Género principal
              <select value={genero} onChange={e => setGenero(e.target.value)}>
                <option value="">Selecciona un género</option>
                {generos.map(g => <option key={g}>{g}</option>)}
              </select>
            </label>

            <label className="campo-editor">
              Género secundario
              <select value={generoSecundario} onChange={e => setGeneroSecundario(e.target.value)}>
                <option value="">Selecciona un género secundario</option>
                {generos.filter(g => g !== genero).map(g => <option key={g}>{g}</option>)}
              </select>
            </label>

            <label className="campo-editor">
              Público al que está dirigido
              <select value={publico} onChange={e => setPublico(e.target.value)}>
                <option value="">Selecciona el público</option>
                {publicos.map(p => <option key={p}>{p}</option>)}
              </select>
            </label>

            <label className="campo-editor">
              Categoría
              <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                <option value="">Selecciona una categoría</option>
                {categorias.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>

<div className="opciones-monetizacion">
  <h2>MONETIZACIÓN</h2>

  <p>
    Participa en el programa de anuncios de LoreAI y permite
    la incorporación de publicidad identificada en tu obra.
  </p>

  <div className="opcion-monetizacion">
    <div>
      <strong>◈ Aceptar anuncios en los capítulos</strong>

      <p>
        Permite la incorporación de anuncios de patrocinadores
        en determinados espacios de tu historia.
      </p>

      <small>5 % para el autor · 95 % para LoreAI</small>

      <p>
        La participación está sujeta a las condiciones de
        derechos de autor y a las políticas de LoreAI.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setModalMonetizacion('anuncios')}
    >
      {anunciosAceptados ? 'CONDICIONES ACEPTADAS ✓' : 'CONFIGURAR'}
    </button>
  </div>
</div>

            <div className="campo-editor">
              <label>ESTADO DE HISTORIA</label>
              <select value={estadoHistoria} onChange={e => setEstadoHistoria(e.target.value)}>
                <option>Historia en emisión</option>
                <option>Historia finalizada</option>
                <option>Historia pausada</option>
                <option>Historia cancelada</option>
              </select>
            </div>

            <div className="campo-editor">
              <label>SAGA</label>
              <select value={tipoSaga} onChange={e => cambiarTipoSaga(e.target.value)}>
                <option>No</option>
                <option>Secuela</option>
                <option>Precuela</option>
                <option>Otro</option>
              </select>
              {tipoSaga === 'Otro' && (
                <input
                  className="detalle-saga-editor"
                  value={detalleSaga}
                  onChange={e => setDetalleSaga(e.target.value)}
                  placeholder="Ejemplo: Segundo de trilogía."
                />
              )}
            </div>
          </section>
        </form>
      )}

      {pestana === 'indices' && (
  <section className="panel-editor">
    <h2>ÍNDICES</h2>

    {cargandoCapitulos ? (
      <p>Cargando capítulos...</p>
    ) : capitulos.length === 0 ? (
      <p>Esta historia todavía no tiene capítulos.</p>
    ) : (
      <div className="lista-indice-editor">
        {capitulos.map((capitulo, indice) => (
          <article className="tarjeta-capitulo-indice" key={capitulo.id}>

            <div className="informacion-capitulo-indice">
              <span className="numero-capitulo-indice">
                {indice + 1}.
              </span>

              <div>
                <strong>
                  {capitulo.titulo || `Capítulo ${indice + 1}`}
                </strong>

                <small>
                  {capitulo.estado === 'publicado' ? 'Publicado' : 'Borrador'}
                </small>
              </div>
            </div>

            <div className="menu-capitulo-contenedor">
              <button
                type="button"
                className="boton-menu-capitulo"
                aria-label="Opciones del capítulo"
                aria-expanded={menuCapituloAbierto === capitulo.id}
                onClick={() => setMenuCapituloAbierto(
                  menuCapituloAbierto === capitulo.id ? null : capitulo.id
                )}
              >
                ⋮
              </button>

              {menuCapituloAbierto === capitulo.id && (
                <div className="menu-opciones-capitulo">

                  <button
                    type="button"
                    onClick={() => {
                      setMenuCapituloAbierto(null)
                      alEditarCapitulo?.(capitulo.id)
                    }}
                  >
                    ✎ Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('La vista de lector la conectaremos en el siguiente paso.')}
                  >
                    ◉ Ver como lector
                  </button>

                  
<button
  type="button"
  onClick={() => cambiarEstadoCapitulo(capitulo)}
>
  {capitulo.estado === 'publicado'
    ? '↶ Devolver a borrador'
    : '✧ Publicar'}
</button>


                  <button
                    type="button"
                    className="opcion-eliminar-capitulo"
                    onClick={() => eliminarCapitulo(capitulo.id)}
                  >
                    × Eliminar
                  </button>

                </div>
              )}
            </div>

          </article>
        ))}
      </div>
    )}

    <button
      type="button"
      onClick={() => alCrearCapitulo?.()}
    >
      ＋ CREAR CAPÍTULO NUEVO
    </button>
  </section>
)}

      {pestana === 'notas' && (
        <section className="panel-editor panel-notas-editor">
          <div className="acciones-notas-editor">
            <button type="button" onClick={() => alert('Próximamente: nueva página.')}>NUEVA PÁGINA</button>
            <button type="button" onClick={() => alert('Próximamente: nueva nota.')}>NOTA</button>
            <button type="button" onClick={() => alert('Próximamente: subir recursos.')}>SUBIR RECURSOS</button>
            <button type="button" onClick={() => alert('Próximamente: personalizar tablero.')}>PERSONALIZAR</button>
          </div>
          <div className="tablero-notas-editor">
            <span>Tu espacio de ideas, recursos y comentarios.</span>
          </div>
        </section>
      )}

      {pestana === 'lore' && (
        <section className="panel-editor">
          <h2>LORE-CHAN</h2>
          <p>Este será el espacio donde Lore-Chan guardará información útil para ayudarte con tu historia.</p>
          <p className="aviso-editor">La memoria de Lore-Chan estará disponible en una próxima etapa.</p>
        </section>
      )}

{modalMonetizacion && (
  <ModalMonetizacion
    tipo={modalMonetizacion}
    alCerrar={() => setModalMonetizacion(null)}
    alAceptar={() => {
      setAnunciosAceptados(true)
      setModalMonetizacion(null)
    }}
  />
)}

      {mostrarModalSaga && (
        <div className="fondo-modal-editor" onClick={() => setMostrarModalSaga(false)}>
          <section className="modal-editor" onClick={e => e.stopPropagation()}>
            <h2>En camino a un largo viaje ✨</h2>
            <p>¿Cómo quieres organizar esta historia dentro de una saga?</p>
            <button type="button" onClick={() => {
              setMostrarModalSaga(false)
              alert('Próximamente podrás crear una saga nueva.')
            }}>
              CREAR SAGA NUEVA
            </button>
            <button type="button" onClick={() => {
              setMostrarModalSaga(false)
              alert('Próximamente podrás agregarla a una saga existente.')
            }}>
              AGREGAR A SAGA EXISTENTE
            </button>
            <button type="button" onClick={() => setMostrarModalSaga(false)}>CERRAR</button>
          </section>
        </div>
      )}

      {mostrarModalEliminar && (
  <div
    className="fondo-modal-editor"
    onClick={() => setMostrarModalEliminar(false)}
  >
    <section
      className="modal-editor"
      onClick={e => e.stopPropagation()}
    >
      <h2>¿Estás segura?</h2>

      <p>
        La historia estará en la papelera durante 30 días.
      </p>

      <p>
        Después de ese plazo, podrá eliminarse definitivamente.
      </p>

      <button
        type="button"
        onClick={() => setMostrarModalEliminar(false)}
      >
        CANCELAR
      </button>

      <button
        type="button"
        className="boton-eliminar-editor"
        onClick={eliminarHistoria}
      >
        MOVER A PAPELERA
      </button>
    </section>
  </div>
)}  
    </main>
  )
}

export default EditorHistoria