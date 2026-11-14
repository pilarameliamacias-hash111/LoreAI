
import { useState } from 'react'
import './CrearHistoria.css'
import ModalMonetizacion from '../components/ModalMonetizacion'

const categorias = [
  'Historia original',
  'Fanfic',
  'Basado en hechos reales',
  'Guía o instructivo',
  'Artístico',
  'Otro'
]

const generos = [
  'Acción', 'Aventura', 'Ciencia ficción', 'Comedia',
  'Drama', 'Fantasía', 'Misterio', 'Romance',
  'Terror', 'Suspenso', 'Slice of Life', 'Histórico'
]

const publicos = [
  'Infantil', 'Juvenil', 'Joven adulto', 'Adulto', 'Todo público'
]

function CrearHistoria({ alVolver }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [etiquetas, setEtiquetas] = useState([])
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [genero, setGenero] = useState('')
  const [generoSecundario, setGeneroSecundario] = useState('')
  const [publico, setPublico] = useState('')
  const [categoria, setCategoria] = useState('')
  const [colaborando, setColaborando] = useState(false)
  const [portada, setPortada] = useState(null)
  const [mostrarExito, setMostrarExito] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState({})
  const [modalMonetizacion, setModalMonetizacion] = useState(null)

const [monetizacionAceptada, setMonetizacionAceptada] = useState({
  paga: false,
  anuncios: false
})

  function agregarEtiqueta() {
  const etiqueta = nuevaEtiqueta.trim()

  if (!etiqueta || etiquetas.length >= 10) return
  if (etiquetas.some(e => e.toLowerCase() === etiqueta.toLowerCase())) return

  setEtiquetas([...etiquetas, etiqueta])
  setNuevaEtiqueta('')
}

  function eliminarEtiqueta(etiqueta) {
    setEtiquetas(etiquetas.filter(e => e !== etiqueta))
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

  

  
async function guardarHistoria(evento) {
  evento.preventDefault()

  if (guardando) return

  const nuevosErrores = {
    titulo: !titulo.trim(),
    descripcion: !descripcion.trim(),
    genero: !genero,
    generoSecundario: !generoSecundario,
    categoria: !categoria
  }

  setErrores(nuevosErrores)

  const hayErrores = Object.values(nuevosErrores).some(Boolean)

  if (hayErrores) {
    return
  }

  setGuardando(true)

  try {
    const respuesta = await fetch('http://localhost:3000/api/historias', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        etiquetas,
        genero,
        generoSecundario,
        publico,
        categoria,
        colaborando,
        portada: portada || ''
      })
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo guardar la historia.')
    }

    setMostrarExito(true)

  } catch (error) {
    console.error('Error al crear historia:', error)
    alert(error.message || 'No se pudo conectar con LoreAI.')
  } finally {
    setGuardando(false)
  }
}


function cerrarExito() {
  setMostrarExito(false)
  alVolver?.()
}

  return (
    <main className="pagina-crear-historia">

      <header className="encabezado-crear-historia">
        <div className="miniatura-encabezado">
          {portada ? (
            <img src={portada} alt="Portada seleccionada" />
          ) : (
            <span>✦</span>
          )}
        </div>

        <div className="titulo-encabezado-crear">
          <h1>Crea una nueva historia</h1>
          <p>Tu próxima aventura comienza aquí.</p>
        </div>

        <button type="button" onClick={alVolver}>
          ← Volver
        </button>
      </header>

      <form
  className="formulario-crear-historia"
  onSubmit={guardarHistoria}
  onKeyDown={e => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
      e.preventDefault()
    }
  }}
>

        <section className="selector-portada">
          <label htmlFor="portada-historia" className="cuadro-portada">
            {portada ? (
              <img src={portada} alt="Portada de la historia" />
            ) : (
              <>
                <span className="icono-portada">＋</span>
                <strong>Agregar portada</strong>
                <small>JPG, PNG o WEBP</small>
              </>
            )}
          </label>

          <input
            id="portada-historia"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={seleccionarPortada}
            hidden
          />

          {portada && (
            <button
              type="button"
              className="quitar-portada"
              onClick={() => setPortada(null)}
            >
              Quitar portada
            </button>
          )}
        </section>

        <section className="caja-detalles-historia">

          <div className="titulo-detalles">
            <h2>DETALLES</h2>

            <label className="interruptor-colaboracion">
              <span>¿Colaborando?</span>
              <input
                type="checkbox"
                checked={colaborando}
                onChange={e => setColaborando(e.target.checked)}
              />
              <span className="pista-interruptor"></span>
            </label>
          </div>

         {/* TÍTULO */}
<div className="campo-historia">
  <label htmlFor="titulo-historia">Título</label>

  <input
    id="titulo-historia"
    type="text"
    placeholder="Escribe el título de tu historia..."
    value={titulo}
    onChange={e => setTitulo(e.target.value)}
    maxLength={100}
  />

  {errores.titulo && (
    <span className="mensaje-campo-obligatorio">
      Campo obligatorio
    </span>
  )}
</div>

{/* DESCRIPCIÓN */}
<div className="campo-historia">
  <label htmlFor="descripcion-historia">Descripción</label>

  <textarea
    id="descripcion-historia"
    placeholder="¿De qué trata tu historia?"
    value={descripcion}
    onChange={e => setDescripcion(e.target.value)}
    maxLength={1000}
    rows={5}
  />

  {errores.descripcion && (
    <span className="mensaje-campo-obligatorio">
      Campo obligatorio
    </span>
  )}

  <small>{descripcion.length}/1000 caracteres</small>
</div>

{/* GÉNERO PRINCIPAL */}
<div className="campo-historia">
  <label htmlFor="genero-principal">Género principal</label>

  <select
    id="genero-principal"
    value={genero}
    onChange={e => setGenero(e.target.value)}
  >
    <option value="">Selecciona un género</option>
    {generos.map(g => <option key={g}>{g}</option>)}
  </select>

  {errores.genero && (
    <span className="mensaje-campo-obligatorio">
      Campo obligatorio
    </span>
  )}
</div>

{/* GÉNERO SECUNDARIO */}
<div className="campo-historia">
  <label htmlFor="genero-secundario">Género secundario</label>

  <select
    id="genero-secundario"
    value={generoSecundario}
    onChange={e => setGeneroSecundario(e.target.value)}
  >
    <option value="">Selecciona un género secundario</option>
    {generos.filter(g => g !== genero).map(g => (
      <option key={g}>{g}</option>
    ))}
  </select>

  {errores.generoSecundario && (
    <span className="mensaje-campo-obligatorio">
      Campo obligatorio
    </span>
  )}
</div>

          <label className="campo-historia">
            Público al que está dirigido
            <select value={publico} onChange={e => setPublico(e.target.value)}>
              <option value="">Selecciona el público</option>
              {publicos.map(p => <option key={p}>{p}</option>)}
            </select>
          </label>

          <label className="campo-editor">
  Categoría

  <select
    value={categoria}
    onChange={e => {
      const nuevaCategoria = e.target.value
      setCategoria(nuevaCategoria)

      if (nuevaCategoria === 'Fanfic') {
        setMonetizacionAceptada(actual => ({
          ...actual,
          paga: false
        }))
        setModalMonetizacion(null)
      }
    }}
    required
  >
    <option value="">Selecciona una categoría</option>
    {categorias.map(c => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>

{errores.categoria && (
  <span className="mensaje-campo-obligatorio">
    Campo obligatorio
  </span>
)}

</label>


<div className="opciones-monetizacion">
  <h2>MONETIZACIÓN</h2>

  <p>
    Elige si deseas participar en alguno de los programas
    de monetización de LoreAI.
  </p>

  {categoria === 'Fanfic' ? (
    <div className="aviso-fanfic-monetizacion">
      <strong>Historia de paga no disponible.</strong>
      <p>
        Tu historia no cumple los requisitos para participar
        en esta modalidad.
      </p>
      <small>
        Las obras basadas en personajes o universos de terceros
        no pueden comercializarse mediante LoreAI.
      </small>
    </div>
  ) : (
    <div className="opcion-monetizacion">
      <div>
        <strong>✧ Historia de paga</strong>
        <p>Ofrece capítulos de acceso pagado.</p>
        <small>90 % autor · 10 % LoreAI</small>
      </div>

      <button
        type="button"
        onClick={() => setModalMonetizacion('paga')}
      >
        {monetizacionAceptada.paga
          ? 'CONDICIONES ACEPTADAS ✓'
          : 'CONFIGURAR'}
      </button>
    </div>
  )}

  <div className="opcion-monetizacion">
    <div>
      <strong>◈ Aceptar anuncios en los capítulos</strong>
      <p>Permite publicidad identificada en tu obra.</p>
      <small>5 % autor · 95 % LoreAI</small>
    </div>

    <button
      type="button"
      onClick={() => setModalMonetizacion('anuncios')}
    >
      {monetizacionAceptada.anuncios
        ? 'CONDICIONES ACEPTADAS ✓'
        : 'CONFIGURAR'}
    </button>
  </div>
</div>


          <button
  type="submit"
  className="boton-guardar-historia"
  disabled={guardando}
>
  {guardando ? 'GUARDANDO...' : 'GUARDAR HISTORIA '}
</button>

        </section>
      </form>

{modalMonetizacion && (
  <ModalMonetizacion
    tipo={modalMonetizacion}
    alCerrar={() => setModalMonetizacion(null)}
    alAceptar={() => {
      setMonetizacionAceptada(actual => ({
        ...actual,
        [modalMonetizacion]: true
      }))
      setModalMonetizacion(null)
    }}
  />
)}

      {mostrarExito && (
        <div className="fondo-modal-exito">
          <section className="modal-exito-historia">
            <button
              type="button"
              className="cerrar-modal-exito"
              onClick={cerrarExito}
              aria-label="Cerrar"
            >
              ×
            </button>

            <span className="icono-exito">✦</span>
            <h2>¡Tu historia fue creada con éxito!</h2>
            <p>¡Mírala en Borradores!</p>
          </section>
        </div>
      )}

    </main>
  )
}

export default CrearHistoria
