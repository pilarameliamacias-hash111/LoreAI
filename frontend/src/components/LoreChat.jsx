
import { useState, useRef, useEffect } from 'react'
import './LoreChat.css'

function LoreChat({ usuario, pantalla, historiaId }) {
  const [abierto, setAbierto] = useState(false)
  const [minimizado, setMinimizado] = useState(false)
  const [expandido, setExpandido] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [saludoMostrado, setSaludoMostrado] = useState(false)
  const [historiaCargadaId, setHistoriaCargadaId] = useState(null)
  const [generando, setGenerando] = useState(false)

const usuarioAutenticado = Boolean(usuario)

const modoGeneral = usuarioAutenticado && pantalla === 'inicio' && !historiaId

const [mensajes, setMensajes] = useState([])

const [posicion, setPosicion] = useState(null)

// COMPROBACIÓN TEMPORAL
console.log('LORECHAT - Usuario:', usuario)
console.log('LORECHAT - Autenticado:', usuarioAutenticado)
console.log('LORECHAT - Historia ID:', historiaId)
console.log('LORECHAT - Mensajes:', mensajes)

console.log('LORECHAT - Pantalla:', pantalla)
console.log('LORECHAT - Modo general:', modoGeneral)

const referenciaArrastre = useRef(null)

const mensajesFinRef = useRef(null)

// Desplazar el chat hasta el mensaje más reciente.
useEffect(() => {
  if (abierto && !minimizado) {
    mensajesFinRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }
}, [mensajes, generando, abierto, minimizado])

useEffect(() => {
  let cancelado = false

  setMensajes([])
  setHistoriaCargadaId(null)

  if (!usuarioAutenticado) return

  async function cargarHistorial() {
    try {

      // Elegimos qué conversación recuperar.
      const url = modoGeneral
        ? 'http://localhost:3000/api/lorechat/general'
        : `http://localhost:3000/api/lorechat?historiaId=${encodeURIComponent(historiaId)}`

      const respuesta = await fetch(url, {
        credentials: 'include'
      })

      if (!respuesta.ok) {
        throw new Error('No se pudo recuperar la conversación.')
      }

      const datos = await respuesta.json()

      if (!cancelado) {
        setMensajes(Array.isArray(datos) ? datos : [])

        // Identificamos qué historial acabamos de cargar.
        setHistoriaCargadaId(
          modoGeneral ? 'general' : String(historiaId)
        )
      }

    } catch (error) {
      console.error('Error al cargar LoreChat:', error)
    }
  }

  // Si no estamos en Inicio ni dentro de una historia,
  // no hay una conversación que recuperar.
  if (!modoGeneral && !historiaId) return

  cargarHistorial()

  return () => {
    cancelado = true
  }

}, [historiaId, usuarioAutenticado, modoGeneral])




useEffect(() => {

  const identificadorConversacion = modoGeneral
    ? 'general'
    : String(historiaId)

  if (
    !usuarioAutenticado ||
    (!modoGeneral && !historiaId) ||
    historiaCargadaId !== identificadorConversacion
  ) {
    return
  }

  async function guardarHistorial() {
    try {

      const url = modoGeneral
        ? 'http://localhost:3000/api/lorechat/general'
        : 'http://localhost:3000/api/lorechat'

      const datosConversacion = modoGeneral
        ? { mensajes }
        : { historiaId, mensajes }

      const respuesta = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(datosConversacion)
      })

      if (!respuesta.ok) {
        throw new Error('No se pudo guardar la conversación.')
      }

    } catch (error) {
      console.error('Error al guardar LoreChat:', error)
    }
  }

  guardarHistorial()

}, [
  mensajes,
  historiaId,
  historiaCargadaId,
  usuarioAutenticado,
  modoGeneral
])




function iniciarArrastre(evento) {
  if (evento.target.closest('button')) return

  const chat = evento.currentTarget.closest('.lore-chat')
  const rect = chat.getBoundingClientRect()

  referenciaArrastre.current = {
    inicioX: evento.clientX,
    inicioY: evento.clientY,
    posicionX: rect.left,
    posicionY: rect.top
  }

  setPosicion({
    x: rect.left,
    y: rect.top
  })

  evento.currentTarget.setPointerCapture(evento.pointerId)
}

function moverChat(evento) {
  if (!referenciaArrastre.current) return

  const inicio = referenciaArrastre.current
  const chat = evento.currentTarget.closest('.lore-chat')

  const nuevaX = inicio.posicionX + evento.clientX - inicio.inicioX
  const nuevaY = inicio.posicionY + evento.clientY - inicio.inicioY

  setPosicion({
    x: Math.max(0, Math.min(nuevaX, window.innerWidth - chat.offsetWidth)),
    y: Math.max(0, Math.min(nuevaY, window.innerHeight - chat.offsetHeight))
  })
}

function terminarArrastre(evento) {
  referenciaArrastre.current = null

  if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
    evento.currentTarget.releasePointerCapture(evento.pointerId)
  }
}

function abrirChat() {
  setAbierto(true)
  setMinimizado(false)

 if (!saludoMostrado) {
  setMensajes((anteriores) => anteriores.length > 0
    ? anteriores
    : [{
        texto: usuario
          ? '¡Hola! Soy Lore-Chan. ⭐ ¿Qué te gustaría crear hoy?'
          : '¡Hola! Soy Lore-Chan, la asistente de LoreAI. ¡Inicia sesión para que podamos conocernos mejor! ⭐',
        tipo: 'bot'
      }]
  )

  setSaludoMostrado(true)
}
}


function responder(texto) {
  const pregunta = texto.toLowerCase()
  let respuesta = ''

  // RESPUESTAS SEGÚN LA PANTALLA

  if (pantalla === 'consola') {
    if (
      pregunta.includes('obras') ||
      pregunta.includes('publicadas')
    ) {
      respuesta = '¡Las Obras son las historias que ya tienen al menos una parte publicada! Aquí puedes consultar y organizar tus publicaciones. ⭐'
    } else if (
      pregunta.includes('borradores') ||
      pregunta.includes('borrador')
    ) {
      respuesta = '¡Tus Borradores son las historias que todavía no tienen ninguna parte publicada! Puedes continuar trabajando en ellas cuando quieras.'
    } else if (
      pregunta.includes('colaboraciones') ||
      pregunta.includes('colaborar')
    ) {
      respuesta = 'En Colaboraciones encontrarás las historias que estás creando junto con otras personas. ¡Escribir en equipo también es una aventura!'
    } else if (
      pregunta.includes('colaboradores')
    ) {
      respuesta = 'En esta sección podrás consultar a las personas con quienes compartes tus proyectos.'
    } else if (
      pregunta.includes('crear') ||
      pregunta.includes('nueva historia')
    ) {
      respuesta = '¡Una nueva aventura te espera! Pulsa el botón CREAR para entrar al espacio de creación de historias.'
    } else {
      respuesta = '¡Estás en tu Consola! Desde aquí puedes organizar tus Obras, Borradores y Colaboraciones, además de comenzar nuevas historias.'
    }

    return respuesta
  }

  if (pantalla === 'crear') {
    respuesta = '¡Bienvenido a tu espacio creativo! Aquí podrás comenzar a construir una nueva historia. Recuerda que cada gran obra empieza con una idea. ⭐'
    return respuesta
  }

  if (pantalla === 'perfil') {
    respuesta = '¡Estás en tu perfil! Aquí puedes personalizar tu espacio, actualizar tu presentación y administrar tu información.'
    return respuesta
  }

  // RESPUESTAS GENERALES

  if (
    pregunta.includes('hola') ||
    pregunta.includes('buenas')
  ) {
    respuesta = '¡Hola! ⭐ ¿Qué te gustaría descubrir de LoreAI?'
  } else if (
    pregunta.includes('qué es loreai') ||
    pregunta.includes('que es loreai')
  ) {
    respuesta = 'LoreAI es un espacio dedicado a la lectura y la escritura. Queremos que las personas compartan sus historias y creatividad.'
  } else if (
    pregunta.includes('escribir') ||
    pregunta.includes('historia')
  ) {
    respuesta = '¡Las historias empiezan con una idea! Puedes visitar la Consola de LoreAI para explorar las herramientas disponibles.'
  } else if (
    pregunta.includes('libro') ||
    pregunta.includes('leer') ||
    pregunta.includes('recomienda')
  ) {
    respuesta = 'Las recomendaciones personalizadas serán una función futura de LoreAI.'
  } else if (
    pregunta.includes('cuenta') ||
    pregunta.includes('sesión') ||
    pregunta.includes('perfil')
  ) {
    respuesta = 'Puedes iniciar sesión para acceder a las funciones de tu cuenta.'
  } else if (pregunta.includes('ayuda')) {
    respuesta = 'Puedes preguntarme qué es LoreAI, cómo empezar a escribir o qué funciones están previstas.'
  } else {
    respuesta = 'Todavía soy una versión básica y no sé responder a todo. Prueba preguntándome qué es LoreAI o cómo empezar a escribir. ⭐'
  }

  return respuesta
}


  

async function enviarMensaje(evento) {
  evento.preventDefault()

  const texto = mensaje.trim()

  if (!texto || generando) return

  const mensajeUsuario = {
    texto,
    tipo: 'usuario'
  }

  setMensaje('')

  // Añadimos el mensaje del usuario inmediatamente.
  setMensajes((anteriores) => [
    ...anteriores,
    mensajeUsuario
  ])

  // Los usuarios autenticados pueden utilizar la IA
  // tanto en Inicio como dentro de una historia.
  if (usuarioAutenticado && (modoGeneral || historiaId)) {
    setGenerando(true)

    try {
      const historialParaIA = [
        ...mensajes,
        mensajeUsuario
      ]

      // Elegimos la ruta de IA según el contexto.
      const url = modoGeneral
        ? 'http://localhost:3000/api/lorechat/general/responder'
        : 'http://localhost:3000/api/lorechat/responder'

      // Enviamos los datos correspondientes.
      const datosConversacion = modoGeneral
        ? { mensajes: historialParaIA }
        : { historiaId, mensajes: historialParaIA }

      const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(datosConversacion)
      })

      if (!respuesta.ok) {
        throw new Error('No se pudo obtener una respuesta.')
      }

      const datos = await respuesta.json()

      if (!datos.respuesta) {
        throw new Error('La respuesta de Lore-Chan está vacía.')
      }

      setMensajes((anteriores) => [
        ...anteriores,
        {
          texto: datos.respuesta,
          tipo: 'bot'
        }
      ])

    } catch (error) {
      console.error('Error al comunicarse con Lore-Chan:', error)

      setMensajes((anteriores) => [
        ...anteriores,
        {
          texto: '¡Ups! Tuve un problemita al pensar mi respuesta. ¿Podrías intentarlo nuevamente? ⭐',
          tipo: 'bot'
        }
      ])

    } finally {
      setGenerando(false)
    }

    return
  }

  // Los visitantes y usuarios fuera de los contextos
  // compatibles con IA conservan las respuestas predefinidas.
  const respuesta = responder(texto)

  setMensajes((anteriores) => [
    ...anteriores,
    {
      texto: respuesta,
      tipo: 'bot'
    }
  ])
}



  function cerrarChat() {
    setAbierto(false)
    setMinimizado(false)
    setExpandido(false)
  }


function reiniciarChat() {
  setMensajes([
    {
      texto: '¡Hola! Soy Lore-Chan. ⭐ ¿Qué te gustaría conversar?',
      tipo: 'bot'
    }
  ])

  setSaludoMostrado(true)
}


  return (
    <>
      {!abierto && (
        <button
          className="lore-launcher"
          type="button"
          aria-label="Abrir chat de Lore-Chan"
          onClick={abrirChat}
        >
          <span className="lore-star">★</span>
        </button>
      )}

      {abierto && (
        <section
  className={`lore-chat ${minimizado ? 'lore-minimized' : ''} ${expandido ? 'lore-expanded' : ''}`}
  style={posicion ? {
    left: `${posicion.x}px`,
    top: `${posicion.y}px`,
    right: 'auto',
    bottom: 'auto'
  } : {}}
>
          <header
  className="lore-header"
  onPointerDown={iniciarArrastre}
  onPointerMove={moverChat}
  onPointerUp={terminarArrastre}
  onPointerCancel={terminarArrastre}
>
        
<div className="lore-avatar">
  <img
    src="/Lore-chan-perfil.png"
    alt="Perfil de Lore-Chan"
  />
</div>
            <div className="lore-heading">
              <strong>Lore-Chan</strong>
              <small>Cyber asistente de LoreAI</small>
            </div>


{modoGeneral && (
  <button
  className="lore-reset"
  type="button"
  title="Reiniciar conversación"
  aria-label="Reiniciar conversación"
  onClick={reiniciarChat}
  disabled={historiaCargadaId !== 'general'}
>
  ↻
</button>
)}


            <button
              type="button"
              aria-label="Minimizar"
              onClick={() => setMinimizado(!minimizado)}
            >
              −
            </button>

            <button
              type="button"
              aria-label="Expandir"
              onClick={() => {
                setExpandido(!expandido)
                setMinimizado(false)
              }}
            >
              □
            </button>

            <button
              type="button"
              aria-label="Cerrar"
              onClick={cerrarChat}
            >
              ×
            </button>

            
          </header>

          {!minimizado && (
            <>
              <div className="lore-messages">
                <p className="lore-disclaimer">
                  Saluda a Lore-Chan. Recuerda que soy una asistente
                  virtual y mis respuestas pueden contener errores.
                </p>

                {mensajes.map((item, indice) => (
                  <div
                    key={indice}
                    className={`lore-bubble ${
                      item.tipo === 'bot' ? 'lore-bot' : 'lore-user'
                    }`}
                  >
                    {item.texto}
                  </div>
                ))}

                {generando && (
                  <div className="lore-bubble lore-bot">
                    Lore-Chan está pensando... ⭐
                  </div>
                )}

                <div ref={mensajesFinRef} />

              </div>

              
<form className="lore-form" onSubmit={enviarMensaje}>
  <input
    type="text"
    value={mensaje}
    onChange={(evento) => setMensaje(evento.target.value)}
    placeholder={
      generando
        ? 'Lore-Chan está pensando...'
        : 'Escribe un mensaje...'
    }
    aria-label="Escribe un mensaje"
    disabled={generando}
  />

  <button
    type="submit"
    aria-label="Enviar mensaje"
    disabled={generando}
  >
    {generando ? '…' : '➤'}
  </button>
</form>

            </>
          )}
        </section>
      )}
    </>
  )
}

export default LoreChat
