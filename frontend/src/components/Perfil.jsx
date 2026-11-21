
import { useState, useEffect, useRef } from 'react'
import './Perfil.css'
import RecortadorImagen from './RecortadorImagen'

const catalogoGeneros = [
  'Fantasía',
  'Romance',
  'Aventura',
  'Misterio',
  'Ciencia ficción',
  'Terror',
  'Drama',
  'Comedia',
  'Fanfiction'
]

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

function Perfil({
  usuario,
  notificacionesSinLeer,
  alLeerNotificaciones,
  alActualizarNotificaciones,
  alVolver,
  alActualizarUsuario,
  alCerrarSesion,
  alAbrirConsola,
  alEditarHistoria
}) {
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false)
  const [vistaActual, setVistaActual] = useState('perfil')
const [categoriaNotificaciones, setCategoriaNotificaciones] = useState('sistema')
  const [descripcionExpandida, setDescripcionExpandida] = useState(true)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [borradores, setBorradores] = useState([])
const [cargandoBorradores, setCargandoBorradores] = useState(true)
const [errorBorradores, setErrorBorradores] = useState('')
const [libreriaExpandida, setLibreriaExpandida] = useState(true)
const carruselLibreriaRef = useRef(null)



useEffect(() => {
  async function cargarBorradores() {
    try {
      setCargandoBorradores(true)
      setErrorBorradores('')

      const respuesta = await fetch(
        'http://localhost:3000/api/historias',
        { credentials: 'include', cache: 'no-store' }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          datos.error || 'No se pudieron cargar tus historias.'
        )
      }

      setBorradores(
        datos.filter(historia => historia.estado === 'borrador')
      )
    } catch (error) {
      console.error('Error al cargar borradores:', error)
      setErrorBorradores(error.message)
    } finally {
      setCargandoBorradores(false)
    }
  }

  cargarBorradores()
}, [])


  useEffect(() => {
    
  
  if (!mensaje) return

  const temporizador = setTimeout(() => {
    setMensaje('')
  }, 5000)

  return () => clearTimeout(temporizador)
}, [mensaje])

  const editorRef = useRef(null)

useEffect(() => {
  if (editando && editorRef.current) {
    editorRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}, [editando])

  const [nombrePublico, setNombrePublico] = useState(
    usuario.nombrePublico || usuario.usuario || ''
  )

  const [dia, setDia] = useState(usuario.cumpleanos?.dia || '')
  const [mes, setMes] = useState(usuario.cumpleanos?.mes || '')
  const [preferencia, setPreferencia] = useState(usuario.preferencia || '')

  const [generosLectura, setGenerosLectura] = useState(
    usuario.generosLectura || []
  )

  const [generosEscritura, setGenerosEscritura] = useState(
    usuario.generosEscritura || []
  )

  const [descripcion, setDescripcion] = useState(usuario.descripcion || '')

  const [visibilidadDescripcion, setVisibilidadDescripcion] = useState(
    usuario.visibilidadDescripcion || 'privada'
  )

  const [redesSociales, setRedesSociales] = useState(
    usuario.redesSociales || []
  )

  const [nuevoEnlace, setNuevoEnlace] = useState('')

  const [fotoPerfil, setFotoPerfil] = useState(usuario.fotoPerfil || '')
const [portadaPerfil, setPortadaPerfil] = useState(usuario.portadaPerfil || '')

const [imagenPendiente, setImagenPendiente] = useState(null)
const [tipoImagenPendiente, setTipoImagenPendiente] = useState(null)

function limpiarMensaje() {
  if (mensaje) {
    setMensaje('')
  }
}

function seleccionarImagen(evento, tipo) {
  const archivo = evento.target.files[0]

  if (!archivo) return

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
    setError('Usa una imagen JPG, PNG o WEBP.')
    evento.target.value = ''
    return
  }

  if (archivo.size > 1024 * 1024) {
    setError('La imagen no puede superar 1 MB.')
    evento.target.value = ''
    return
  }

  const lector = new FileReader()

  lector.onload = () => {
    setImagenPendiente(lector.result)
    setTipoImagenPendiente(tipo)
    setError('')
  }

  lector.readAsDataURL(archivo)

  evento.target.value = ''
}

  function alternarGenero(genero, categoria) {
    const seleccionados = categoria === 'lectura'
      ? generosLectura
      : generosEscritura

    const actualizar = categoria === 'lectura'
      ? setGenerosLectura
      : setGenerosEscritura

    if (seleccionados.includes(genero)) {
      actualizar(seleccionados.filter(item => item !== genero))
      return
    }

    if (seleccionados.length >= 3) {
      setError('¡Solo puedes elegir tres géneros por categoría!')
      return
    }

    setError('')
    actualizar([...seleccionados, genero])
  }

  function agregarEnlace() {
    const enlace = nuevoEnlace.trim()

    if (!enlace) return

    try {
      const url = new URL(enlace)

      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        setError('Introduce un enlace válido.')
        return
      }

      if (redesSociales.includes(url.href)) {
        setError('Ese enlace ya fue añadido.')
        return
      }

      setRedesSociales([...redesSociales, url.href])
      setNuevoEnlace('')
      setError('')
    } catch {
      setError('Introduce un enlace válido, comenzando por https://')
    }
  }

  async function guardarPerfil(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    if (!nombrePublico.trim()) {
      setError('Necesitamos saber cómo quieres que te conozcan.')
      return
    }

    if (!dia || !mes) {
      setError('Selecciona tu cumpleaños.')
      return
    }

    if (!preferencia) {
      setError('Selecciona qué te gustaría hacer en LoreAI.')
      return
    }

    if (descripcion.trim() && !visibilidadDescripcion) {
      setError('Selecciona la privacidad de tu descripción.')
      return
    }

    setGuardando(true)

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/usuarios/perfil',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            nombrePublico: nombrePublico.trim(),
            fotoPerfil,
portadaPerfil,
            cumpleanos: {
              dia: Number(dia),
              mes: Number(mes)
            },
            preferencia,
            generosLectura,
            generosEscritura,
            descripcion: descripcion.trim(),
            visibilidadDescripcion: descripcion.trim()
              ? visibilidadDescripcion
              : 'ninguna',
            redesSociales
          })
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        setError(datos.error || 'No se pudo actualizar tu perfil.')
        return
      }

      alActualizarUsuario(datos.usuario)
      setMensaje('¡Tu perfil se actualizó correctamente! ✨')
      setEditando(false)

    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      setError('No pudimos conectar con LoreAI. Comprueba que el servidor esté funcionando.')
    } finally {
      setGuardando(false)
    }
  }

  function cancelarEdicion() {
    setNombrePublico(usuario.nombrePublico || usuario.usuario || '')
    setFotoPerfil(usuario.fotoPerfil || '')
setPortadaPerfil(usuario.portadaPerfil || '')
    setDia(usuario.cumpleanos?.dia || '')
    setMes(usuario.cumpleanos?.mes || '')
    setPreferencia(usuario.preferencia || '')
    setGenerosLectura(usuario.generosLectura || [])
    setGenerosEscritura(usuario.generosEscritura || [])
    setDescripcion(usuario.descripcion || '')
    setVisibilidadDescripcion(usuario.visibilidadDescripcion || 'privada')
    setRedesSociales(usuario.redesSociales || [])
    setNuevoEnlace('')
    setError('')
    setEditando(false)
  }

  const nombreVisible = usuario.nombrePublico || usuario.usuario

  return (
    <main className="pagina-perfil">

      <header className="encabezado-perfil">
        <button className="logo-perfil" onClick={alVolver}>
          <img src={`${import.meta.env.BASE_URL}Logo-LoreAI.png`} alt="LoreAI" />
        </button>

        <nav className="navegacion-perfil">
          <button onClick={alVolver}>EXPLORAR</button>
          <button onClick={alAbrirConsola}>CONSOLA</button>

          <div className="contenedor-menu-perfil">
            <button
  className="boton-menu-perfil"
  onClick={() => setMenuPerfilAbierto(!menuPerfilAbierto)}
>
  <span className="avatar-con-notificacion">
    {usuario?.fotoPerfil ? (
      <img
        src={usuario.fotoPerfil}
        alt="Foto de perfil"
        className="avatar-pequeno avatar-pequeno-imagen"
      />
    ) : (
      <span className="avatar-pequeno">✦</span>
    )}

    {notificacionesSinLeer?.some(notificacion => !notificacion.leida) && (
  <span
    className="indicador-notificacion"
    aria-label="Tienes notificaciones sin leer"
  />
)}
  </span>

  {nombreVisible}
  <span>⌄</span>
</button>

            {menuPerfilAbierto && (
              <div className="menu-desplegable-perfil">
                {[
  'Bandeja de entrada',
  'Notificaciones',
  'Biblioteca personal',
  'Proyectos',
  'Idioma',
  'Ajustes',
  'Ayuda',
  'Finalizar sesión'
].map(opcion => (
  <button
    key={opcion}
    onClick={() => {
  setMenuPerfilAbierto(false)

  if (opcion === 'Finalizar sesión') {
    alCerrarSesion()
  }
  if (opcion === 'Notificaciones') {
  setVistaActual('notificaciones')
}
}}
  >
  {opcion}

  {opcion === 'Notificaciones' &&
  notificacionesSinLeer?.some(notificacion => !notificacion.leida) && (
    <span className="indicador-notificacion-menu" />
  )}
</button>
))}
              </div>
            )}
          </div>
        </nav>
          </header>

{vistaActual === 'notificaciones' ? (
  <section className="pagina-notificaciones">

  <h1>Notificaciones</h1>

  <nav className="categorias-notificaciones">

  <button
    className={categoriaNotificaciones === 'entrada' ? 'categoria-activa' : ''}
    onClick={() => {
      if (categoriaNotificaciones === 'sistema') {
        alLeerNotificaciones()
      }
      setCategoriaNotificaciones('entrada')
    }}
  >
    Bandeja de entrada
  </button>

  <button
    className={categoriaNotificaciones === 'actualizaciones' ? 'categoria-activa' : ''}
    onClick={() => {
      if (categoriaNotificaciones === 'sistema') {
        alLeerNotificaciones()
      }
      setCategoriaNotificaciones('actualizaciones')
    }}
  >
    Actualizaciones
  </button>

  <button
    className={categoriaNotificaciones === 'sistema' ? 'categoria-activa' : ''}
    onClick={() => {
      setCategoriaNotificaciones('sistema')
      alLeerNotificaciones()
    }}
  >
    Notificaciones de sistema

    {notificacionesSinLeer?.some(notificacion => !notificacion.leida) && (
      <span className="indicador-notificacion-categoria" />
    )}
  </button>

  <button
    className={categoriaNotificaciones === 'comunidad' ? 'categoria-activa' : ''}
    onClick={() => {
      if (categoriaNotificaciones === 'sistema') {
        alLeerNotificaciones()
      }
      setCategoriaNotificaciones('comunidad')
    }}
  >
    Notificaciones de comunidad
  </button>

</nav>
  <div className="contenido-notificaciones">

    {categoriaNotificaciones === 'entrada' && (
      <p>Tu bandeja de entrada aparecerá aquí.</p>
    )}

    {categoriaNotificaciones === 'actualizaciones' && (
      <p>Aquí aparecerán las actualizaciones de las historias que sigues.</p>
    )}

    {categoriaNotificaciones === 'sistema' && (
      <div>
        <h2>Notificaciones de sistema</h2>

        {notificacionesSinLeer?.length > 0 ? (
          notificacionesSinLeer.map(notificacion => (
            <article key={notificacion.id} className="tarjeta-notificacion">
  <h3>{notificacion.titulo}</h3>

  {notificacion.conversacion ? (
  <>
    <div className="mensaje-original">
      <h4>Tu mensaje</h4>
      <p>{notificacion.conversacion.mensaje}</p>
      <small>
        {new Date(notificacion.conversacion.fechaMensaje).toLocaleString()}
      </small>
    </div>

    <div className="respuestas-notificacion">
      <h4>Conversación con el equipo LoreAI</h4>

      {notificacion.conversacion.respuestas.map(respuesta => (
        <div
          key={respuesta.id}
          className={
            respuesta.remitente === 'usuario'
              ? 'respuesta-notificacion respuesta-usuario'
              : 'respuesta-notificacion respuesta-equipo'
          }
        >
          <strong>
            {respuesta.remitente === 'usuario'
              ? 'Tú'
              : 'Equipo LoreAI'}
          </strong>

          <p>{respuesta.respuesta}</p>

          <small>
            {new Date(respuesta.fecha).toLocaleString()}
          </small>
        </div>
      ))}
    </div>

    <form
      className="formulario-respuesta-notificacion"
      onSubmit={async (e) => {
        e.preventDefault()

        const campo = e.currentTarget.elements.respuesta
        const texto = campo.value.trim()

        if (!texto) return

        try {
          const resultado = await fetch(
            `http://localhost:3000/api/mensajes/${notificacion.conversacion.id}/responder`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({ respuesta: texto })
            }
          )

          const datos = await resultado.json()

          if (!resultado.ok) {
            throw new Error(datos.mensaje || 'No se pudo enviar la respuesta.')
          }

          campo.value = ''

          // Actualizar la conversación sin recargar la página
          const actualizadas = await fetch(
            'http://localhost:3000/api/notificaciones',
            {
              credentials: 'include',
              cache: 'no-store'
            }
          )

          if (actualizadas.ok) {
            const nuevasNotificaciones = await actualizadas.json()
            alActualizarNotificaciones(nuevasNotificaciones)
          }

          alert('¡Tu respuesta se envió correctamente!')

        } catch (error) {
          console.error('Error al enviar respuesta:', error)
          alert(error.message)
        }
      }}
    >
      <textarea
        name="respuesta"
        placeholder="Escribe tu respuesta..."
        rows="3"
        required
      />

      <button type="submit">
        Enviar respuesta
      </button>
    </form>
  </>
) : (
  <p>{notificacion.contenido}</p>
)}
</article>
          ))
        ) : (
          <p>No tienes notificaciones nuevas.</p>
        )}
      </div>
    )}

    {categoriaNotificaciones === 'comunidad' && (
      <p>Aquí aparecerán los comentarios y respuestas de la comunidad.</p>
    )}

  </div>

</section>
    ) : (
      <>
        <section className="portada-perfil">
  <div className="imagen-portada-perfil">
    {usuario.portadaPerfil ? (
      <img
        src={usuario.portadaPerfil}
        alt="Portada del perfil"
        className="portada-guardada"
      />
    ) : (
      <span>Mi espacio creativo </span>
    )}
  </div>

  <div className="presentacion-perfil">

    {usuario?.fotoPerfil ? (
  <img
    src={usuario.fotoPerfil}
    alt="Foto de perfil"
    className="avatar-grande"
  />
) : (
  <div className="avatar-grande">✦</div>
)}
    

          <h1>{nombreVisible}</h1>

          <p className="usuario-perfil">@{usuario.usuario}</p>

          <div className="estadisticas-perfil">
            <button><strong>0</strong> Proyectos</button>
            <button><strong>0</strong> Seguidores</button>
            <button><strong>0</strong> Siguiendo</button>
            <button><strong>0</strong> Colaboraciones</button>
          </div>

          <button
            className="editar-perfil"
            onClick={() => {
  limpiarMensaje()
  setError('')
  setEditando(true)
}}
          >
            Editar perfil
          </button>
        </div>
      </section>

      {mensaje && <p className="mensaje-exito-perfil">{mensaje}</p>}

      {editando ? (
        <section
  ref={editorRef}
  className="contenido-perfil editor-perfil"
>
          <h2>Editar mi perfil </h2>
          <p>Este es tu espacio. ¡Personalízalo como quieras!</p>

          <form onSubmit={guardarPerfil}>

            <label>Nombre público</label>
            <input
              type="text"
              value={nombrePublico}
              onChange={e => setNombrePublico(e.target.value)}
              maxLength={30}
            />

{/* Personalización de imágenes */}
<div className="imagenes-editor-perfil">

  <h3>Personaliza tu espacio</h3>

  {/* Foto de perfil */}
  <div className="control-imagen-perfil">
    <label>Foto de perfil</label>

    {fotoPerfil ? (
      <img
        src={fotoPerfil}
        alt="Vista previa de foto de perfil"
        className="vista-previa-avatar"
      />
    ) : (
      <div className="vista-previa-avatar avatar-vacio">
        ✦
      </div>
    )}

    <input
  id="archivo-foto"
  className="input-imagen-oculto"
  type="file"
  accept="image/jpeg,image/png,image/webp"
  onChange={e => seleccionarImagen(e, 'foto')}
/>

<label htmlFor="archivo-foto" className="boton-imagen">
  <span>📷</span> Cambiar foto
</label>

    {fotoPerfil && (
      <button
        type="button"
        onClick={() => setFotoPerfil('')}
      >
        Quitar foto
      </button>
    )}
  </div>

  {/* Portada */}
  <div className="control-imagen-portada">
    <label>Imagen de portada</label>

    {portadaPerfil ? (
      <img
        src={portadaPerfil}
        alt="Vista previa de portada"
        className="vista-previa-portada"
      />
    ) : (
      <div className="vista-previa-portada portada-vacia">
        Mi espacio creativo ✨
      </div>
    )}

    <input
  id="archivo-portada"
  className="input-imagen-oculto"
  type="file"
  accept="image/jpeg,image/png,image/webp"
  onChange={e => seleccionarImagen(e, 'portada')}
/>

<label htmlFor="archivo-portada" className="boton-imagen">
  <span>🖼️</span> Cambiar portada
</label>

    {portadaPerfil && (
      <button
        type="button"
        onClick={() => setPortadaPerfil('')}
      >
        Quitar portada
      </button>
    )}
  </div>

</div>

            <label>Fecha de cumpleaños</label>
            <div className="fecha-cumpleanos">
              <select value={dia} onChange={e => setDia(e.target.value)}>
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select value={mes} onChange={e => setMes(e.target.value)}>
                <option value="">Mes</option>
                {meses.map((nombre, i) => (
                  <option key={i + 1} value={i + 1}>{nombre}</option>
                ))}
              </select>
            </div>

            <label>¿Qué prefieres hacer en LoreAI?</label>
            <div className="opciones-preferencia">
              {[
                { valor: 'leer', texto: '📖 Leer' },
                { valor: 'escribir', texto: '✍️ Escribir' },
                { valor: 'ambas', texto: '✨ Ambas' }
              ].map(opcion => (
                <button
                  key={opcion.valor}
                  type="button"
                  className={preferencia === opcion.valor ? 'seleccionada' : ''}
                  onClick={() => setPreferencia(opcion.valor)}
                >
                  {opcion.texto}
                </button>
              ))}
            </div>

            {(preferencia === 'leer' || preferencia === 'ambas') && (
              <div className="selector-generos">
                <h3>¿Qué prefieres leer?</h3>
                <p>Elige hasta tres géneros.</p>

                <div className="lista-generos">
                  {catalogoGeneros.map(genero => (
                    <button
                      key={genero}
                      type="button"
                      className={generosLectura.includes(genero) ? 'genero-seleccionado' : ''}
                      onClick={() => alternarGenero(genero, 'lectura')}
                    >
                      {generosLectura.includes(genero) ? '✓ ' : ''}
                      {genero}
                    </button>
                  ))}
                </div>
                <p>{generosLectura.length}/3 seleccionados</p>
              </div>
            )}

            {(preferencia === 'escribir' || preferencia === 'ambas') && (
              <div className="selector-generos">
                <h3>¿Qué escribes?</h3>
                <p>Elige hasta tres géneros.</p>

                <div className="lista-generos">
                  {catalogoGeneros.map(genero => (
                    <button
                      key={genero}
                      type="button"
                      className={generosEscritura.includes(genero) ? 'genero-seleccionado' : ''}
                      onClick={() => alternarGenero(genero, 'escritura')}
                    >
                      {generosEscritura.includes(genero) ? '✓ ' : ''}
                      {genero}
                    </button>
                  ))}
                </div>
                <p>{generosEscritura.length}/3 seleccionados</p>
              </div>
            )}

            <label>Sobre mí</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="¿Qué te gusta? ¿Qué te inspira?"
              maxLength={500}
              rows={4}
            />

            <p>{descripcion.length}/500 caracteres</p>

            {descripcion.trim() && (
              <>
                <label>¿Quién podrá ver tu descripción?</label>
                <div className="opciones-preferencia">
                  <button
                    type="button"
                    className={visibilidadDescripcion === 'publica' ? 'seleccionada' : ''}
                    onClick={() => setVisibilidadDescripcion('publica')}
                  >
                    🌎 Pública
                  </button>

                  <button
                    type="button"
                    className={visibilidadDescripcion === 'privada' ? 'seleccionada' : ''}
                    onClick={() => setVisibilidadDescripcion('privada')}
                  >
                    🔒 Privada
                  </button>
                </div>
              </>
            )}

            <label>Redes sociales</label>
            <p>Añade enlaces a tus espacios creativos.</p>

            <div className="redes-sociales-perfil">
              <input
                type="url"
                value={nuevoEnlace}
                onChange={e => setNuevoEnlace(e.target.value)}
                placeholder="https://..."
              />

              <button type="button" onClick={agregarEnlace}>
                + Añadir enlace
              </button>

              {redesSociales.map(enlace => (
                <div key={enlace} className="enlace-social-agregado">
                  <a href={enlace} target="_blank" rel="noreferrer">
                    {enlace}
                  </a>

                  <button
                    type="button"
                    onClick={() => setRedesSociales(
                      redesSociales.filter(red => red !== enlace)
                    )}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {error && <p className="mensaje-error">{error}</p>}

            <div className="acciones-editor-perfil">
              <button type="submit" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>

              <button
                type="button"
                onClick={cancelarEdicion}
                disabled={guardando}
              >
                Cancelar
              </button>
            </div>

          </form>
        </section>
      ) : (
        <section className="contenido-perfil">

          <article className="descripcion-perfil">
            <button
              className="titulo-descripcion"
              onClick={() => setDescripcionExpandida(!descripcionExpandida)}
            >
              Sobre mí
              <span>{descripcionExpandida ? '⌃' : '⌄'}</span>
            </button>

            {descripcionExpandida && (
              <div>
                <p>
                  {usuario.descripcion || '¡Completa tu perfil, Lore-Chan quiere conocerte mejor!'}
                </p>

                {usuario.redesSociales?.length > 0 && (
                  <div className="redes-perfil">
                    {usuario.redesSociales.map((enlace, indice) => (
                      <a
                        key={indice}
                        href={enlace}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {`Red social ${indice + 1}`}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </article>

          
<section className="seccion-perfil libreria-perfil">
  <div className="encabezado-libreria">
    <button
      type="button"
      className="titulo-seccion-perfil boton-titulo-libreria"
      onClick={() => setLibreriaExpandida(!libreriaExpandida)}
      aria-expanded={libreriaExpandida}
    >
      Mi Librería
      <span>{libreriaExpandida ? '⌃' : '⌄'}</span>
    </button>
  </div>

  {libreriaExpandida && (
    <div className="contenido-libreria">
      {cargandoBorradores ? (
        <p>Cargando tus historias...</p>
      ) : errorBorradores ? (
        <p>{errorBorradores}</p>
      ) : borradores.length === 0 ? (
        <p className="mensaje-vacio-biblioteca">
          Todavía no tienes borradores. ¡Tu próxima historia puede comenzar aquí! ✨
        </p>
      ) : (
        <div className="carrusel-libreria">
          <button
            type="button"
            className="flecha-libreria"
            aria-label="Historias anteriores"
            onClick={() =>
              carruselLibreriaRef.current?.scrollBy({
                left: -280,
                behavior: 'smooth'
              })
            }
          >
            ‹
          </button>

          <div className="lista-libreria-perfil" ref={carruselLibreriaRef}>
            {borradores.map(historia => (
              <article
                className="tarjeta-libreria-perfil"
                key={historia.id}
              >
                <img
                  src={historia.portada || '/imagenes/portada-predeterminada.png'}
                  alt={`Portada de ${historia.titulo}`}
                />

                <div className="informacion-libreria-perfil">
                  <h3>{historia.titulo}</h3>
                  <p>{historia.descripcion || 'Sin descripción.'}</p>
                  <span className="estado-borrador">BORRADOR</span>

                  <button
                    type="button"
                    onClick={() => alEditarHistoria(historia.id)}
                  >
                    CONTINUAR ESCRIBIENDO ✍️
                  </button>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="flecha-libreria"
            aria-label="Historias siguientes"
            onClick={() =>
              carruselLibreriaRef.current?.scrollBy({
                left: 280,
                behavior: 'smooth'
              })
            }
          >
            ›
          </button>
        </div>
      )}
    </div>
  )}
</section>


          <section className="seccion-perfil">
            <button className="titulo-seccion-perfil">
              Biblioteca <span>›</span>
            </button>
            <p>Aquí encontrarás tus historias guardadas.</p>
          </section>

        </section>
      )}

      {imagenPendiente && (
  <RecortadorImagen
    imagen={imagenPendiente}
    tipo={tipoImagenPendiente}
    alCancelar={() => {
      setImagenPendiente(null)
      setTipoImagenPendiente(null)
    }}
    alConfirmar={(imagenRecortada) => {
      if (tipoImagenPendiente === 'foto') {
        setFotoPerfil(imagenRecortada)
      } else {
        setPortadaPerfil(imagenRecortada)
      }

      setImagenPendiente(null)
      setTipoImagenPendiente(null)
    }}
  />
)}
      </>
    )}
<footer className="footer-perfil">
  2026 LoreAI · Encontramos la estrella y la ayudamos a brillar.
</footer>

</main>
  )
}

export default Perfil
