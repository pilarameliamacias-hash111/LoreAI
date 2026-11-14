
import { useEffect, useState } from 'react'
import './PerfilPublico.css'

function PerfilPublico({ usuarioId, alVolver }) {
    const [perfil, setPerfil] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [seccionActiva, setSeccionActiva] = useState('sobre')
    const [mostrarMenu, setMostrarMenu] = useState(false)

    useEffect(() => {
        async function cargarPerfil() {
            setCargando(true)
            setError('')

            try {
                const respuesta = await fetch(
                    `http://localhost:3000/api/usuarios/${usuarioId}/publico`,
                    { credentials: 'include' }
                )

                const datos = await respuesta.json()

                if (!respuesta.ok) {
                    throw new Error(datos.error || 'No se pudo cargar el perfil.')
                }

                setPerfil(datos)
            } catch (error) {
                console.error('Error al cargar el perfil:', error)
                setError(error.message)
            } finally {
                setCargando(false)
            }
        }

        if (usuarioId) cargarPerfil()
    }, [usuarioId])

    if (cargando) return <p>Cargando perfil...</p>

    if (error) {
        return (
            <section>
                <button onClick={alVolver}>← Volver</button>
                <p>{error}</p>
            </section>
        )
    }

    if (!perfil) return <p>No encontramos este perfil.</p>

    return (
        <main className="perfil-publico">

            <button className="volver-perfil" onClick={alVolver}>
                ← Volver
            </button>

            <header className="cabecera-perfil-publico">

                <div className="portada-publica">
                    {perfil.portadaPerfil && (
                        <img src={perfil.portadaPerfil} alt="Portada del perfil" />
                    )}
                </div>

                <div className="datos-principales-publicos">

                    <div className="foto-publica">
                        {perfil.fotoPerfil ? (
                            <img src={perfil.fotoPerfil} alt="Foto de perfil" />
                        ) : (
                            <span>✦</span>
                        )}
                    </div>

                    <div className="nombre-y-acciones">
                        <h1>{perfil.nombrePublico}</h1>

                        <div className="acciones-perfil">
                            <button>Seguir</button>
                            <button>Carta</button>
                            <button>Solicitud de colaboración</button>

                            <div className="menu-perfil-contenedor">
                                <button
                                    onClick={() => setMostrarMenu(!mostrarMenu)}
                                >
                                    ⋮
                                </button>

                                {mostrarMenu && (
                                    <div className="menu-perfil-publico">
                                        <button>Silenciar</button>
                                        <button>Denunciar</button>
                                        <button>Bloquear</button>
                                        <button>Copiar enlace</button>
                                        <button>Agregar a autores favoritos</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="estadisticas-perfil">
                    <button>
                        <strong>{perfil.obras.length}</strong>
                        <span>Proyectos</span>
                    </button>

                    <button>
                        <strong>{perfil.siguiendo}</strong>
                        <span>Siguiendo</span>
                    </button>

                    <button>
                        <strong>{perfil.seguidores}</strong>
                        <span>Seguidores</span>
                    </button>

                    <button>
                        <strong>{perfil.colaboraciones}</strong>
                        <span>Colaboraciones</span>
                    </button>
                </div>

            </header>

            <nav className="navegacion-perfil-publico">
                <button
                    className={seccionActiva === 'sobre' ? 'activa' : ''}
                    onClick={() => setSeccionActiva('sobre')}
                >
                    Sobre {perfil.nombrePublico}
                </button>

                <button
                    className={seccionActiva === 'pizarron' ? 'activa' : ''}
                    onClick={() => setSeccionActiva('pizarron')}
                >
                    Pizarrón de {perfil.nombrePublico}
                </button>
            </nav>

            <section className="contenido-perfil-publico">

                {seccionActiva === 'sobre' && (
                    <div>
                        <h2>Sobre este autor</h2>

                        {perfil.descripcion ? (
                            <p>{perfil.descripcion}</p>
                        ) : (
                            <p>Este autor todavía no tiene una descripción pública.</p>
                        )}

                        <h2>Proyectos publicados</h2>

                        {perfil.obras.length > 0 ? (
                            <div className="obras-publicas">
                                {perfil.obras.map(obra => (
                                    <article key={obra.id}>
                                        <h3>{obra.titulo}</h3>
                                        <p>{obra.descripcion}</p>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p>Este autor todavía no tiene proyectos publicados.</p>
                        )}

                        <h2>Biblioteca pública</h2>
                        <p>Esta sección estará disponible próximamente.</p>
                    </div>
                )}

                {seccionActiva === 'pizarron' && (
                    <div>
                        <h2>Pizarrón de {perfil.nombrePublico}</h2>
                        <p>
                            El pizarrón estará disponible próximamente.
                            Sus publicaciones serán visibles para sus seguidores.
                        </p>
                    </div>
                )}

            </section>

        </main>
    )
}

export default PerfilPublico
