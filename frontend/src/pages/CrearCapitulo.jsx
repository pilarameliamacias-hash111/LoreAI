
import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import './CrearCapitulo.css'
import 'prosemirror-view/style/prosemirror.css'
import ModalMonetizacion from '../components/ModalMonetizacion'

const documentoVacio = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: []
    }
  ]
}

function CrearCapitulo({ historiaId, capituloIdInicial, alVolver }) {
  const [historia, setHistoria] = useState(null)
  const [capitulos, setCapitulos] = useState([])
  const [capituloActual, setCapituloActual] = useState(null)
  const [titulo, setTitulo] = useState('Nuevo capítulo')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [indiceAbierto, setIndiceAbierto] = useState(true)
  const [capitulosPapelera, setCapitulosPapelera] = useState([])
const [papeleraAbierta, setPapeleraAbierta] = useState(false)
const [cargandoPapelera, setCargandoPapelera] = useState(false)   

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: documentoVacio,
    editorProps: {
      attributes: {
        class: 'area-escritura-capitulo',
        spellcheck: 'true'
      }
    }
  })

 
  // Cargar la historia y sus capítulos existentes
  useEffect(() => {
    async function iniciarEditor() {
      try {
        setCargando(true)
        setError('')

        const [respuestaHistoria, respuestaCapitulos] = await Promise.all([
          fetch(`http://localhost:3000/api/historias/${historiaId}`, {
            credentials: 'include'
          }),
          fetch(`http://localhost:3000/api/historias/${historiaId}/capitulos`, {
            credentials: 'include'
          })
        ])

        const datosHistoria = await respuestaHistoria.json()
        const datosCapitulos = await respuestaCapitulos.json()

        if (!respuestaHistoria.ok) {
          throw new Error(datosHistoria.error || 'No se pudo cargar la historia.')
        }

        if (!respuestaCapitulos.ok) {
          throw new Error(datosCapitulos.error || 'No se pudieron cargar los capítulos.')
        }

        const obra = datosHistoria.historia || datosHistoria

        setHistoria(obra)
        setCapitulos(datosCapitulos)

        // Seleccionar el capítulo solicitado o el primero disponible.
const capituloInicial = capituloIdInicial
  ? datosCapitulos.find(c => c.id === capituloIdInicial)
  : datosCapitulos[0]

if (capituloInicial) {
  setCapituloActual(capituloInicial)
} else {
  setCapituloActual(null)
  setTitulo('')
  editor?.commands.setContent(documentoVacio)
}

      } catch (error) {
        console.error('Error al iniciar el editor:', error)
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    if (historiaId && editor) {
      iniciarEditor()
    }
  }, [historiaId, editor, capituloIdInicial])


  
  // Mostrar el contenido del capítulo seleccionado
  useEffect(() => {
    if (!editor) return

    if (!capituloActual) {
      editor.commands.setContent(documentoVacio)
      setTitulo('')
      return
    }

    editor.commands.setContent(
      capituloActual.contenido || documentoVacio
    )

    setTitulo(capituloActual.titulo || '')
  }, [editor, capituloActual])

  // Guardar el capítulo actual
 // Guardar o crear el capítulo actual
async function guardarCapitulo() {
  if (!editor || guardando) return

  if (!titulo.trim()) {
    alert('El capítulo necesita un título.')
    return
  }

  setGuardando(true)
  setMensaje('')
  setError('')

  try {
    const esNuevo = !capituloActual

    const url = esNuevo
      ? `http://localhost:3000/api/historias/${historiaId}/capitulos`
      : `http://localhost:3000/api/historias/${historiaId}/capitulos/${capituloActual.id}`

    const respuesta = await fetch(url, {
      method: esNuevo ? 'POST' : 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: titulo.trim(),
        contenido: editor.getJSON()
      })
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo guardar el capítulo.')
    }

    setCapituloActual(datos)

    setCapitulos(lista => {
      if (esNuevo) {
        return [...lista, datos]
      }

      return lista.map(c =>
        c.id === datos.id ? datos : c
      )
    })

    setMensaje('¡Capítulo guardado correctamente! ✨')

  } catch (error) {
    console.error('Error al guardar capítulo:', error)
    alert(error.message)
  } finally {
    setGuardando(false)
  }
}

  // Crear otro capítulo
  async function crearNuevoCapitulo() {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/historias/${historiaId}/capitulos`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: 'Nuevo capítulo',
            contenido: documentoVacio
          })
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo crear el capítulo.')
      }

      setCapitulos(lista => [...lista, datos])
      setCapituloActual(datos)
      setMensaje('')

    } catch (error) {
      console.error('Error al crear capítulo:', error)
      alert(error.message)
    }
  }

  // CARGAR CAPÍTULOS DE LA PAPELERA
async function cargarPapelera() {
  setCargandoPapelera(true)
  setError('')

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/historias/${historiaId}/capitulos/papelera`,
      {
        credentials: 'include'
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo cargar la papelera.')
    }

    setCapitulosPapelera(datos)

  } catch (error) {
    console.error('Error al cargar la papelera:', error)
    setError(error.message)
  } finally {
    setCargandoPapelera(false)
  }
}

// RESTAURAR CAPÍTULO
async function restaurarCapitulo(capituloId) {
  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/historias/${historiaId}/capitulos/${capituloId}/restaurar`,
      {
        method: 'POST',
        credentials: 'include'
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo restaurar el capítulo.')
    }

    setCapitulosPapelera(lista =>
      lista.filter(c => c.id !== capituloId)
    )

    setCapitulos(lista => [...lista, datos.capitulo])

    setMensaje('¡Capítulo restaurado correctamente! ✨')

  } catch (error) {
    console.error('Error al restaurar capítulo:', error)
    alert(error.message)
  }
}

// ELIMINAR CAPÍTULO DEFINITIVAMENTE
async function eliminarDefinitivamente(capituloId) {
  const confirmar = window.confirm(
    '¿Eliminar definitivamente este capítulo? Esta acción no se puede deshacer.'
  )

  if (!confirmar) return

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/historias/${historiaId}/capitulos/papelera/${capituloId}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo eliminar el capítulo.')
    }

    setCapitulosPapelera(lista =>
      lista.filter(c => c.id !== capituloId)
    )

    setMensaje('Capítulo eliminado definitivamente.')

  } catch (error) {
    console.error('Error al eliminar capítulo definitivamente:', error)
    alert(error.message)
  }
}

  // Eliminar el capítulo seleccionado
  async function eliminarCapitulo() {
    if (!capituloActual) return

    const confirmar = window.confirm(
      '¿Seguro que quieres eliminar este capítulo?'
    )

    if (!confirmar) return

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/historias/${historiaId}/capitulos/${capituloActual.id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo eliminar el capítulo.')
      }

      const restantes = capitulos.filter(
        c => c.id !== capituloActual.id
      )

      setCapitulos(restantes)
      if (papeleraAbierta) {
  cargarPapelera()
}
      setCapituloActual(null)
      setTitulo('')
      editor?.commands.setContent(documentoVacio)
      setMensaje('Capítulo eliminado.')

    } catch (error) {
      console.error('Error al eliminar capítulo:', error)
      alert(error.message)
    }
  }

  if (cargando || !editor) {
    return (
      <main className="crear-capitulo estado-capitulo">
        Preparando tu espacio de escritura... ✨
      </main>
    )
  }

  if (error || !historia) {
    return (
      <main className="crear-capitulo estado-capitulo">
        <p>{error || 'No encontramos esta historia.'}</p>
        <button type="button" onClick={alVolver}>
          VOLVER
        </button>
      </main>
    )
  }

  return (
    <main className="crear-capitulo">

      {/* CABECERA */}
      <header className="cabecera-capitulo">

        <button
          type="button"
          className="volver-capitulo"
          onClick={alVolver}
        >
          ← VOLVER
        </button>

        {historia.portada && (
          <img
            className="miniatura-historia-capitulo"
            src={historia.portada}
            alt="Portada de la historia"
          />
        )}

        <div className="identidad-historia-capitulo">
          <small>ESCRIBIENDO EN</small>
          <h1>{historia.titulo}</h1>
        </div>

        <div className="acciones-capitulo">
          <button type="button" onClick={crearNuevoCapitulo}>
            ＋ NUEVO CAPÍTULO
          </button>

          <button
            type="button"
            className="guardar-capitulo"
            onClick={guardarCapitulo}
            disabled={guardando}
          >
            {guardando ? 'GUARDANDO...' : 'GUARDAR'}
          </button>

          <button
            type="button"
            className="eliminar-capitulo"
            onClick={eliminarCapitulo}
            disabled={!capituloActual}
          >
            BORRAR
          </button>
        </div>
      </header>

      {mensaje && (
  <div className="notificacion-editor">
    <span>{mensaje}</span>

    <button
      onClick={() => setMensaje('')}
      title="Cerrar notificación"
    >
      ×
    </button>
  </div>
)}

      {/* CUERPO DEL EDITOR */}
      <div className="estructura-capitulo">

  

        {/* ÍNDICE */}
        <aside className={`indice-capitulos ${indiceAbierto ? '' : 'indice-cerrado'}`}>

          {/* ACCESO A LA PAPELERA */}
<button
  type="button"
  className="boton-papelera-capitulos"
  onClick={() => {
    const nuevoEstado = !papeleraAbierta
    setPapeleraAbierta(nuevoEstado)

    if (nuevoEstado) {
      cargarPapelera()
    }
  }}
>
  🗑️ PAPELERA DE CAPÍTULOS
  <span>{papeleraAbierta ? '−' : '+'}</span>
</button>

          <button
            type="button"
            className="titulo-indice-capitulo"
            onClick={() => setIndiceAbierto(!indiceAbierto)}
          >
            ÍNDICE DE CAPÍTULOS
            <span>{indiceAbierto ? '−' : '+'}</span>
          </button>

          {indiceAbierto && (
            <div className="lista-capitulos">
              {capitulos.map((capitulo, indice) => (
                <button
                  type="button"
                  key={capitulo.id}
                  className={
                    capituloActual?.id === capitulo.id
                      ? 'capitulo-seleccionado'
                      : ''
                  }
                  onClick={() => setCapituloActual(capitulo)}
                >
                  <strong>{indice + 1}.</strong>
                  <span>{capitulo.titulo}</span>
                </button>
              ))}
            </div>
          )}

          {/* CONTENIDO DE LA PAPELERA */}
          {papeleraAbierta && (
            <div className="lista-papelera-capitulos">
              <h3>CAPÍTULOS ELIMINADOS</h3>

              {cargandoPapelera ? (
                <p>Cargando papelera...</p>
              ) : capitulosPapelera.length === 0 ? (
                <p>La papelera está vacía. ✨</p>
              ) : (
                capitulosPapelera.map(capitulo => (
                  <div
                    className="elemento-papelera-capitulo"
                    key={capitulo.id}
                  >
                    <strong>{capitulo.titulo}</strong>

                    <div className="acciones-papelera-capitulo">
                      <button
                        type="button"
                        onClick={() => restaurarCapitulo(capitulo.id)}
                      >
                        ↶ RESTAURAR
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarDefinitivamente(capitulo.id)}
                      >
                        ✕ ELIMINAR
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </aside>

        {/* ÁREA DE ESCRITURA */}
        <section className="zona-escritura-capitulo">

          <div className="titulo-capitulo-editor">
            <input
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Título del capítulo..."
              maxLength={120}
            />
          </div>

          {/* BARRA DE FORMATO */}
          <div className="barra-formato-capitulo">

            <button
              type="button"
              className={editor.isActive('bold') ? 'formato-activo' : ''}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Negrita"
            >
              <strong>B</strong>
            </button>

            <button
              type="button"
              className={editor.isActive('italic') ? 'formato-activo' : ''}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Cursiva"
            >
              <em>I</em>
            </button>

            <button
              type="button"
              className={editor.isActive('strike') ? 'formato-activo' : ''}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Tachado"
            >
              <s>S</s>
            </button>

            <span className="separador-formato" />

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Alinear a la izquierda"
            >
              ≡
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Centrar"
            >
              ☰
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Alinear a la derecha"
            >
              ≡
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              title="Justificar"
            >
              ▤
            </button>

            <span className="separador-formato" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Lista"
            >
              •
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Lista numerada"
            >
              1.
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              title="Deshacer"
            >
              ↶
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              title="Rehacer"
            >
              ↷
            </button>

          </div>

          <EditorContent editor={editor} />

        </section>

        {/* PANEL LATERAL */}
        <aside className="panel-lateral-capitulo">

          <button type="button">⌕ BUSCAR EN TEXTO</button>
          <button type="button">▧ BUSCAR IMAGEN</button>
          <button type="button">♫ PLAYLIST</button>
          <button type="button">▣ GALERÍA</button>
          <button type="button">✎ NOTA DE AUTOR</button>
          <button type="button">✧ COLABORACIÓN</button>

          <div className="lore-ayuda-capitulo">
            <span>✦</span>
            <strong>Lore-Chan</strong>
            <p>¡Tu próxima página comienza aquí!</p>
          </div>

        </aside>

      </div>
    </main>
  )
}

export default CrearCapitulo
