import { useState } from 'react'
import './Acceso.css'

function Acceso({ alCerrar, alIniciarSesion }) {
  const [pantalla, setPantalla] = useState('opciones')

  // Datos de la cuenta
  const [usuario, setUsuario] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [error, setError] = useState('')
  const [registrando, setRegistrando] = useState(false)

// Datos del perfil inicial
const [diaCumpleanos, setDiaCumpleanos] = useState('')
const [mesCumpleanos, setMesCumpleanos] = useState('')
const [preferencia, setPreferencia] = useState('')

const [generosLectura, setGenerosLectura] = useState([])
const [generosEscritura, setGenerosEscritura] = useState([])

const [otroLectura, setOtroLectura] = useState('')
const [otroEscritura, setOtroEscritura] = useState('')

const [mostrarOtroLectura, setMostrarOtroLectura] = useState(false)
const [mostrarOtroEscritura, setMostrarOtroEscritura] = useState(false)

// DATOS DEL PERFIL
const [nombrePublico, setNombrePublico] = useState('')
const [descripcion, setDescripcion] = useState('')
const [visibilidadDescripcion, setVisibilidadDescripcion] = useState('')

// CONTROL DE LA CONFIRMACIÓN
const [mostrarConfirmacionDescripcion, setMostrarConfirmacionDescripcion] = useState(false)

// REDES SOCIALES
const [redesSociales, setRedesSociales] = useState([])

const [nuevoEnlaceSocial, setNuevoEnlaceSocial] = useState('')

// FOTO DE PERFIL
const [fotoPerfil, setFotoPerfil] = useState(null)
const [vistaPreviaFoto, setVistaPreviaFoto] = useState('')

function agregarRedSocial() {
  const enlace = nuevoEnlaceSocial.trim()

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
    setNuevoEnlaceSocial('')
    setError('')
  } catch {
    setError('Introduce un enlace válido, comenzando por https://')
  }
}

function eliminarRedSocial(enlace) {
  setRedesSociales(redesSociales.filter(red => red !== enlace))
}
 
function continuarCredenciales(evento) {
  evento.preventDefault()
  setError('')

  if (!usuario.trim() || !correo.trim() || !contrasena || !confirmarContrasena) {
    setError('Completa todos los campos para continuar.')
    return
  }

  if (usuario.trim().length < 3) {
    setError('Tu nombre de usuario debe tener al menos 3 caracteres.')
    return
  }

  if (contrasena.length < 8) {
    setError('Tu contraseña debe tener al menos 8 caracteres.')
    return
  }

  if (contrasena !== confirmarContrasena) {
    setError('Las contraseñas no coinciden.')
    return
  }

  setPantalla('siguiente')
}

function continuarPresentacion(evento) {
  evento.preventDefault()
  setError('')

  if (!diaCumpleanos || !mesCumpleanos) {
    setError('Cuéntanos cuándo es tu cumpleaños.')
    return
  }

  if (!preferencia) {
    setError('Selecciona qué te gustaría hacer en LoreAI.')
    return
  }

  setPantalla('generos')
}


async function iniciarSesion(evento) {
  evento.preventDefault()
  setError('')
  setRegistrando(true)

  try {
    const respuesta = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        usuario,
        contrasena
      })
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      setError(datos.error || 'No se pudo iniciar sesión.')
      return
    }

    const respuestaSesion = await fetch(
  'http://localhost:3000/api/usuarios/sesion',
  {
    credentials: 'include'
  }
)

const sesion = await respuestaSesion.json()

if (!respuestaSesion.ok || !sesion.autenticado) {
  setError('No pudimos recuperar los datos de tu perfil.')
  return
}

alIniciarSesion(sesion.usuario)
alCerrar()

  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    setError('No pudimos conectar con LoreAI. Comprueba que el servidor esté funcionando.')
  } finally {
    setRegistrando(false)
  }
}

async function registrarCuenta(visibilidadFinal) {
  setError('')
  setRegistrando(true)

  try {
    let fotoPerfilBase64 = null

if (fotoPerfil) {
  fotoPerfilBase64 = await new Promise((resolve, reject) => {
    const lector = new FileReader()

    lector.onload = () => resolve(lector.result)
    lector.onerror = () => reject(new Error('No se pudo leer la fotografía.'))

    lector.readAsDataURL(fotoPerfil)
  })
}
    const respuesta = await fetch('http://localhost:3000/api/usuarios/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        usuario,
        correo,
        contrasena,

        perfil: {
          diaCumpleanos,
          mesCumpleanos,
          preferencia,
          generosLectura,
          generosEscritura,
          nombrePublico,
          descripcion,
          visibilidadDescripcion: visibilidadFinal,
          redesSociales,
          fotoPerfil: fotoPerfilBase64
        }
      })
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      setError(datos.error || 'No se pudo crear tu cuenta.')
      return
    }
if (!respuesta.ok) {
  setError(datos.error || 'No se pudo iniciar sesión.')
  return
}

alIniciarSesion(datos.usuario)
setPantalla('bienvenida')
    

  } catch (error) {
    console.error('Error al registrar:', error)
    setError('No pudimos conectar con LoreAI. Comprueba que el servidor esté funcionando.')
  } finally {
    setRegistrando(false)
  }
}

function continuarPerfil(evento) {
  evento.preventDefault()
  setError('')

  if (!nombrePublico.trim()) {
    setError('Necesitamos saber cómo quieres que te conozcan.')
    return
  }

  if (!descripcion.trim()) {
    setMostrarConfirmacionDescripcion(true)
    return
  }

  if (!visibilidadDescripcion) {
    setError('Elige quién podrá ver tu descripción.')
    return
  }

  setMostrarConfirmacionDescripcion(false)
  registrarCuenta(visibilidadDescripcion)
}

// CATÁLOGO DE GÉNEROS
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

// SELECCIONAR Y QUITAR GÉNEROS
function alternarGenero(genero, categoria) {
  const actualizar = categoria === 'lectura'
    ? setGenerosLectura
    : setGenerosEscritura

  const seleccionados = categoria === 'lectura'
    ? generosLectura
    : generosEscritura

  if (seleccionados.includes(genero)) {
    actualizar(seleccionados.filter(item => item !== genero))
    return
  }

  if (seleccionados.length >= 3) {
    setError('¡Solo puedes elegir tres géneros por pregunta!')
    return
  }

  setError('')
  actualizar([...seleccionados, genero])
}

// AGREGAR GÉNEROS PERSONALIZADOS
function agregarOtro(categoria) {
  const esLectura = categoria === 'lectura'
  const texto = (esLectura ? otroLectura : otroEscritura).trim()
  const seleccionados = esLectura ? generosLectura : generosEscritura
  const actualizar = esLectura ? setGenerosLectura : setGenerosEscritura

  if (!texto) {
    setError('Escribe un género antes de agregarlo.')
    return
  }

  if (seleccionados.length >= 3) {
    setError('¡Ya elegiste tus tres géneros!')
    return
  }

  if (seleccionados.some(item => item.toLowerCase() === texto.toLowerCase())) {
    setError('Ese género ya está seleccionado.')
    return
  }

  actualizar([...seleccionados, texto])

  if (esLectura) {
    setOtroLectura('')
    setMostrarOtroLectura(false)
  } else {
    setOtroEscritura('')
    setMostrarOtroEscritura(false)
  }

  setError('')
}

// CONSTRUIR EL SELECTOR VISUAL
function selectorGeneros(
  titulo,
  categoria,
  seleccionados,
  otro,
  setOtro,
  mostrarOtro,
  setMostrarOtro
) {

  return (

    <div className="selector-generos">

      <h3>{titulo}</h3>
      <p>Elige hasta tres de tus géneros favoritos.</p>

      <div className="lista-generos">
        {catalogoGeneros.map(genero => (
          <button
            key={genero}
            type="button"
            className={seleccionados.includes(genero) ? 'genero-seleccionado' : ''}
            onClick={() => alternarGenero(genero, categoria)}
          >
            {seleccionados.includes(genero) ? '✓ ' : ''}
            {genero}
          </button>
        ))}

        <button
          type="button"
          className={mostrarOtro ? 'genero-seleccionado' : ''}
          onClick={() => {
            setMostrarOtro(!mostrarOtro)
            setError('')
          }}
        >
          {mostrarOtro ? '✕ Cancelar' : '+ Otro'}
        </button>
      </div>

      {mostrarOtro && (
        <div className="campo-otro-genero">
          <input
            type="text"
            value={otro}
            onChange={(e) => setOtro(e.target.value)}
            placeholder="Escribe otro género..."
            maxLength={40}
          />

          <button
            type="button"
            onClick={() => agregarOtro(categoria)}
          >
            Agregar
          </button>
        </div>
      )}

      <p className="contador-generos">
        {seleccionados.length}/3 géneros seleccionados
      </p>

            {seleccionados
        .filter(g => !catalogoGeneros.includes(g))
        .map(genero => (
          <button
            key={genero}
            type="button"
            className="genero-personalizado"
            onClick={() => alternarGenero(genero, categoria)}
          >
            {genero} ✕
          </button>
        ))}
    </div>
  )
}

    return (


    <div className="fondo-acceso">

      <section className="modal-acceso">
        <button
          className="cerrar-acceso"
          type="button"
          onClick={alCerrar}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {pantalla === 'opciones' && (
          <div className="contenido-acceso">
            <h2>¡Nos alegra tenerte aquí! ✨</h2>
            <p>¿Ya formas parte de nuestra comunidad?</p>

            <button type="button" onClick={() => setPantalla('login')}>
              Sí, ya tengo cuenta
            </button>

            <button type="button" onClick={() => setPantalla('registro')}>
              Aún no, quiero registrarme
            </button>
          </div>
        )}

        
{pantalla === 'login' && (
  <div className="contenido-acceso">
    <h2>¡Qué bueno verte de nuevo! 💚</h2>
    <p>Inicia sesión para continuar tu viaje.</p>

    <form onSubmit={iniciarSesion}>
      <input
        type="text"
        placeholder="Usuario o correo electrónico"
        value={usuario}
        onChange={(evento) => setUsuario(evento.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(evento) => setContrasena(evento.target.value)}
        required
      />

      {error && <p className="mensaje-error">{error}</p>}

      <button type="submit" disabled={registrando}>
        {registrando ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>

    <button
      type="button"
      onClick={() => {
        setError('')
        setPantalla('opciones')
      }}
    >
      Volver
    </button>
  </div>
)}


        {pantalla === 'registro' && (
          <div className="contenido-acceso">
            <h2>¡Una nueva estrella llega! ⭐</h2>
            <p>Comencemos creando tu cuenta.</p>

            <button type="button" onClick={() => setPantalla('credenciales')}>
              Continuar con el registro
            </button>

            <button type="button" onClick={() => setPantalla('opciones')}>
              Volver
            </button>
          </div>
        )}

        {pantalla === 'credenciales' && (
          <div className="contenido-acceso">
            <h2>Comencemos por el principio ✨</h2>
            <p>Primero, necesitamos los datos de tu cuenta.</p>

            <form onSubmit={continuarCredenciales}>
              <label htmlFor="registro-usuario">Nombre de usuario</label>
              <input
                id="registro-usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="¿Cómo te llamarás en LoreAI?"
                autoComplete="username"
              />

              <label htmlFor="registro-correo">Correo electrónico</label>
              <input
                id="registro-correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
              />

              <label htmlFor="registro-contrasena">Contraseña</label>
              <input
                id="registro-contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />

              <label htmlFor="registro-confirmar">Confirmar contraseña</label>
              <input
                id="registro-confirmar"
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                placeholder="Escribe tu contraseña otra vez"
                autoComplete="new-password"
              />

              {error && <p className="error-registro">{error}</p>}

              <button type="submit">
                Continuar
              </button>
            </form>

            <button type="button" onClick={() => {
              setError('')
              setPantalla('registro')
            }}>
              Volver
            </button>
          </div>
        )}

       {pantalla === 'siguiente' && (
  <div className="contenido-acceso">
    <h2>¡Queremos conocerte! 💚</h2>
    <p>
      Bienvenido/a. Completa este pequeño formulario para que podamos
      conocerte y brindarte una mejor experiencia.
    </p>

    <form onSubmit={continuarPresentacion}>
      <label>¿Cuándo es tu cumpleaños? 🎂</label>

      <div className="fecha-cumpleanos">
        <select
          value={diaCumpleanos}
          onChange={(e) => setDiaCumpleanos(e.target.value)}
        >
          <option value="">Día</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <select
          value={mesCumpleanos}
          onChange={(e) => setMesCumpleanos(e.target.value)}
        >
          <option value="">Mes</option>
          {[
            'Enero', 'Febrero', 'Marzo', 'Abril',
            'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ].map((mes, i) => (
            <option key={i + 1} value={i + 1}>{mes}</option>
          ))}
        </select>
      </div>

      <p className="nota-privacidad">
        Tu cumpleaños será privado. Lore-Chan lo tendrá presente
        para felicitarte en tu día. ⭐
      </p>

      <label>¿Qué prefieres hacer en LoreAI?</label>

      <div className="opciones-preferencia">
        {[
          { valor: 'leer', texto: '📖 Leer' },
          { valor: 'escribir', texto: '✍️ Escribir' },
          { valor: 'ambas', texto: '✨ Ambas' }
        ].map((opcion) => (
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

      {error && <p className="error-registro">{error}</p>}

      <button type="submit" disabled={registrando}>
  {registrando ? 'Creando tu cuenta...' : 'Finalizar registro'}
</button>
    </form>

    <button
      type="button"
      onClick={() => {
        setError('')
        setPantalla('credenciales')
      }}
    >
      Volver
    </button>
  </div>
)}

{pantalla === 'generos' && (
  <div className="contenido-acceso">
    <h2>¡Hablemos de historias! 📚</h2>
    <p>
      Queremos conocer tus gustos para ofrecerte recomendaciones
      y acompañarte en tus proyectos.
    </p>

    {error && <p className="error-registro">{error}</p>}

    {(preferencia === 'leer' || preferencia === 'ambas') &&
  selectorGeneros(
    '¿Qué prefieres leer?',
    'lectura',
    generosLectura,
    otroLectura,
    setOtroLectura,
    mostrarOtroLectura,
    setMostrarOtroLectura
  )
}

{(preferencia === 'escribir' || preferencia === 'ambas') &&
  selectorGeneros(
    '¿Qué escribes?',
    'escritura',
    generosEscritura,
    otroEscritura,
    setOtroEscritura,
    mostrarOtroEscritura,
    setMostrarOtroEscritura
  )
}

    <button
      type="button"
      onClick={() => {
        setError('')
        setPantalla('perfil')
      }}
    >
      Continuar
    </button>

    <button
      type="button"
      onClick={() => {
        setError('')
        setPantalla('siguiente')
      }}
    >
      Volver
    </button>
  </div>
)}

{pantalla === 'perfil' && (
  <div className="contenido-acceso">

    {!mostrarConfirmacionDescripcion ? (
      <>
        <h2>¡Tu espacio en LoreAI! ⭐</h2>

        <p>
          Cuéntanos cómo quieres presentarte ante nuestra comunidad.
        </p>

        <form onSubmit={continuarPerfil}>

          <label htmlFor="nombre-publico">
            ¿Cómo quieres que los demás te conozcan?
          </label>

          <input
            id="nombre-publico"
            type="text"
            value={nombrePublico}
            onChange={(e) => setNombrePublico(e.target.value)}
            placeholder="Tu nombre público"
            maxLength={30}
          />

<label htmlFor="foto-perfil">
  Tu foto de perfil (opcional)
</label>

<div className="selector-foto-perfil">

  {vistaPreviaFoto ? (
    <img
      src={vistaPreviaFoto}
      alt="Vista previa de tu foto de perfil"
      className="vista-previa-foto"
    />
  ) : (
    <div className="foto-perfil-vacia">
      ⭐
    </div>
  )}

  <input
  id="foto-perfil"
  type="file"
  accept="image/png, image/jpeg, image/webp"
  className="input-foto-oculto"
  onChange={(e) => {
    const archivo = e.target.files[0]

    if (!archivo) return

    if (archivo.size > 1 * 1024 * 1024) {
  setError('La imagen no puede superar 1 MB.')
      e.target.value = ''
      return
    }

    setFotoPerfil(archivo)
    setVistaPreviaFoto(URL.createObjectURL(archivo))
    setError('')
  }}
/>

<label htmlFor="foto-perfil" className="boton-subir-foto">
  <span className="icono-subir-foto">✦</span>
  <span>{vistaPreviaFoto ? 'Cambiar fotografía' : 'Elegir una fotografía'}</span>
</label>

<p className="mensaje-subir-foto">
  Dale una imagen a tu espacio en LoreAI. (Opcional)
</p>

  {vistaPreviaFoto && (
    <button
      type="button"
      onClick={() => {
        setFotoPerfil(null)
        setVistaPreviaFoto('')
        document.getElementById('foto-perfil').value = ''
      }}
    >
      Quitar foto
    </button>
  )}

</div>
          <label htmlFor="descripcion-perfil">
            ¡Cuéntanos sobre ti!
          </label>

          <textarea
            id="descripcion-perfil"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value)
              setVisibilidadDescripcion('')
            }}
            placeholder="¿Qué te gusta? ¿Qué escribes? ¿Qué te inspira?"
            maxLength={500}
            rows={4}
          />

          {descripcion.trim() && (
            <>
              <p>¿Quién podrá ver tu descripción?</p>

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

          {error && <p className="error-registro">{error}</p>}

          <div className="redes-sociales-perfil">

  <label htmlFor="enlace-social">
    Tus redes sociales (opcional)
  </label>

  <p>
    Comparte tus espacios creativos con la comunidad.
  </p>

  <input
    id="enlace-social"
    type="url"
    value={nuevoEnlaceSocial}
    onChange={(e) => setNuevoEnlaceSocial(e.target.value)}
    placeholder="https://..."
  />

  <button
    type="button"
    onClick={agregarRedSocial}
  >
    + Añadir enlace
  </button>

  {redesSociales.map((enlace) => (
    <div key={enlace} className="enlace-social-agregado">
      <span>{enlace}</span>

      <button
        type="button"
        onClick={() => eliminarRedSocial(enlace)}
      >
        ✕
      </button>
    </div>
  ))}

</div>

          <button type="submit">Continuar</button>

        </form>

        <button
          type="button"
          onClick={() => {
            setError('')
            setPantalla('generos')
          }}
        >
          Volver
        </button>
      </>
    ) : (
      <>
        <h2>¡Una cosita, estrellita! ⭐</h2>

        <p>
          ¿Seguro que querías dejar la descripción vacía?
          Recuerda que Lore-Chan te conocerá a través de lo que describas,
          si lo deseas puedes poner tu descripción en privado.
        </p>

        <button
  type="button"
  disabled={registrando}
  onClick={() => registrarCuenta('privada')}
>
  🔒 Privada
</button>

<button
  type="button"
  disabled={registrando}
  onClick={() => registrarCuenta('publica')}
>
  🌎 Pública
</button>

        <button
  type="button"
  disabled={registrando}
  onClick={() => {
    setDescripcion('')
    setVisibilidadDescripcion('ninguna')
    setMostrarConfirmacionDescripcion(false)
    registrarCuenta('ninguna')
  }}
>
  Ninguna
</button>

        <button
  type="button"
  onClick={() => setMostrarConfirmacionDescripcion(false)}
>
  Volver a escribir
</button>


      </>
    )}

  </div>
)}

{pantalla === 'bienvenida' && (
  <div className="contenido-acceso">
    <h2>¡Bienvenido/a a LoreAI! ⭐</h2>

    <p>
      ¡Tu cuenta está lista, {nombrePublico.trim()}!
    </p>

    <p>
      Ahora tienes un espacio para leer, escribir,
      descubrir historias y compartir tu creatividad.
    </p>

    <p>¡Lore-Chan te espera! 💚</p>

    <button
      type="button"
      onClick={alCerrar}
    >
      Entrar a LoreAI
    </button>
  </div>
)}

      </section>
    </div>
  )
}

export default Acceso

