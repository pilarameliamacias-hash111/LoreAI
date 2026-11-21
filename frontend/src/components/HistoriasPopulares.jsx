
import { useState, useRef } from 'react'
import './HistoriasPopulares.css'

const historias = [
  {
    titulo: 'El estanque de los patos',
    portada: 'El estanque de los patos.png',
    descripcion: 'Una bailarina esclava visita todos los días el estanque de patos del palacio del faraón para encontrarse con un hombre del que se ha enamorado, sin saber que se trata del propio faraón.',
    principal: 'Romance',
    secundario: 'Drama',
    categoria: 'Historia Original',
    autor: 'Amalia V. Laurent'
  },
  {
    titulo: 'Las Aventuras de Ping-Giu',
    portada: 'Las Aventuras de Ping-Giu_ Círculos de Magia.png',
    descripcion: 'En un mundo moderno donde la magia ha dejado de ser necesaria, Giu Ima es una de las pocas sobrevivientes de un clan de magos exterminado hace diez años. Bajo la identidad masculina de Ping-Giu, cuida de su hermanita Gameyo, hasta que el antiguo heredero del clan aparece para reclutarla en una lucha por recuperar su hogar.',
    principal: 'Aventura',
    secundario: 'Ciencia ficción',
    categoria: 'Historia Original',
    autor: 'Ren Tsubaki'
  },
  {
    titulo: 'Cabaña Emma',
    portada: 'Cabaña Emma.jpg',
    descripcion: 'Una institución entrena a jóvenes con habilidades especiales para convertirse en exorcistas e investigadores paranormales. En un mundo que ya aceptó la existencia del mal, surge una pregunta: si ellos protegen a la gente normal, ¿quién los protege a ellos?',
    principal: 'Terror',
    secundario: 'Ciencia ficción',
    categoria: 'Historia Original',
    autor: 'Damián Blackwood'
  },
  {
    titulo: 'Cartas desde el Purgatorio',
    portada: 'Cartas del Purgatorio.jpg',
    descripcion: 'Una joven comparte su experiencia al descubrir que vive con depresión y el camino que recorrió para aprender a comprenderse, buscar apoyo y recuperar su bienestar.',
    principal: 'Slice of Life',
    categoria: 'Basado en hechos reales',
    autor: 'Elisa Montenegro'
  },
  {
    titulo: 'Vidrios',
    portada: 'Vidrios.jpg',
    descripcion: 'Un joven encuentra a una chica herida, descalza y con la mirada perdida. Ella parece no poder hablar. Cuando decide ayudarla y llevarla al hospital, su vida cambia de una manera que jamás habría imaginado.',
    principal: 'Suspenso',
    secundario: 'Misterio',
    categoria: 'Historia Original',
    autor: 'Adrián Soler'
  },
  {
    titulo: 'Lady Rallye',
    portada: 'Lady Rallye.jpg',
    descripcion: 'El duque Maximillian ha sido asesinado y la única sospechosa es su esposa, la duquesa Lady Rallye. Aunque todos parecen conocer su culpabilidad, sus damas nobles y su séquito están dispuestos a defenderla.',
    principal: 'Misterio',
    secundario: 'Drama',
    categoria: 'Historia Original',
    autor: 'Vivienne Ashford'
  },
  {
    titulo: 'Cómo podar el árbol familiar',
    portada: 'Cómo podar el árbol familiar.jpg',
    descripcion: 'Una guía para aprender a establecer límites, reconocer cuándo otras personas no los respetan y tomar distancia de relaciones que pueden hacernos daño, incluso cuando no existe una intención consciente de lastimar.',
    principal: 'Slice of Life',
    categoria: 'Guía o Instructivo',
    autor: 'Clara Montalvo'
  },
  {
    titulo: 'El arte de autoproducirse',
    portada: 'El arte de autoproducirse.png',
    descripcion: 'Una guía para abrirse camino como influencer, aprender a gestionar la propia imagen y evitar los tropiezos que pueden convertir una aventura en internet en una auténtica pesadilla.',
    principal: 'Slice of Life',
    categoria: 'Guía o Instructivo',
    autor: 'Micaela Rivers'
  },
  {
    titulo: 'El amor se puede explicar con ciencia',
    portada: 'El amor se puede explicar con ciencia.jpg',
    descripcion: 'Un fanfic ambientado en el universo de Dr. Stone que explora el amor y las relaciones desde una perspectiva llena de ciencia, humor y situaciones inesperadas.',
    principal: 'Romance',
    secundario: 'Comedia',
    categoria: 'Fanfic',
    autor: 'Natsu Akiyama'
  },
  {
    titulo: 'Luna Escarlata',
    portada: 'Luna Escarlata.jpg',
    descripcion: 'En un mundo donde humanos, monstruos, híbridos y bestias pensantes conviven, los vampiros llevan siglos extintos. Pero el heredero de una familia de cazadores resucita a la condesa Vanellia Van Lightnithing, quien recuerda una historia muy distinta sobre la desaparición de su pueblo.',
    principal: 'Ciencia ficción',
    secundario: 'Romance',
    categoria: 'Historia Original',
    autor: 'Valeria Nocturne'
  },
  {
    titulo: 'Copas',
    portada: 'Copas.jpg',
    descripcion: 'Detrás de la barra de un establecimiento, un bartender escucha y recopila las historias de sus clientes anónimos. Cada copa puede traer consigo una vida, un recuerdo o una confesión inesperada.',
    principal: 'Slice of Life',
    categoria: 'Basado en hechos reales',
    autor: 'Mateo Ferrer'
  },
  {
    titulo: 'Conejitos',
    portada: 'Conejitos.jpg',
    descripcion: 'Uxi, una estudiante de preparatoria, se enamora de su profesor de lengua y literatura. Lo que comienza con una confesión inesperada se convierte en una relación secreta marcada por una desigualdad de poder y señales que invitan a cuestionar sus verdaderas intenciones.',
    principal: 'Romance',
    secundario: 'Suspenso',
    categoria: 'Historia Original',
    autor: 'Iris Bellamy'
  },
  {
    titulo: 'Sin verte para quererte',
    portada: 'Sin verte para quererte.jpg',
    descripcion: 'Kitoa, un estudiante de secundaria con prosopagnosia, tiene dificultades para reconocer rostros. Tras varios desencuentros con Ana, una joven conocida por su carácter agresivo, descubre que puede reconocer su rostro. Un encuentro en el consultorio del neurólogo será el comienzo de una conexión inesperada.',
    principal: 'Romance',
    secundario: 'Slice of Life',
    categoria: 'Historia Original',
    autor: 'Noa Fujimoto'
  },
  {
    titulo: 'Mil anécdotas random',
    portada: 'Mil anécdotas random.jpg',
    descripcion: 'Una recopilación de anécdotas raras, increíbles y divertidas compartidas por distintos colaboradores. Porque la realidad también sabe escribir las historias más inesperadas.',
    principal: 'Slice of Life',
    secundario: 'Comedia',
    categoria: 'Basado en hechos reales',
    autor: 'Los Colaboradores'
  },
  {
    titulo: 'Te Amo',
    portada: 'Te amo.jpg',
    descripcion: 'Una colección de poemas para expresar el amor en todas sus formas: sus distintas emociones, sus matices y las maneras únicas en que cada persona puede experimentarlo.',
    principal: 'Slice of Life',
    secundario: 'Romance',
    categoria: 'Artístico',
    autor: 'Abril de los Santos'
  }
]

function HistoriasPopulares() {
  const [descripcionesAbiertas, setDescripcionesAbiertas] = useState([])
  const carruselRef = useRef(null)

  function desplazarCarrusel(direccion) {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({
        left: direccion * 350,
        behavior: 'smooth'
      })
    }
  }

  function alternarDescripcion(indice) {
    setDescripcionesAbiertas((actuales) =>
      actuales.includes(indice)
        ? actuales.filter((item) => item !== indice)
        : [...actuales, indice]
    )
  }

  return (
    <section className="seccion-populares">
      <h2>Historias populares ✨</h2>

      <div className="contenedor-carrusel-populares">

        <button
          className="flecha-carrusel"
          type="button"
          onClick={() => desplazarCarrusel(-1)}
          aria-label="Historias anteriores"
        >
          ❮
        </button>

        <div className="carrusel-populares" ref={carruselRef}>
          <div className="pista-populares">

            {historias.map((historia, indice) => {
              const abierta = descripcionesAbiertas.includes(indice)

              return (
                <article className="tarjeta-popular" key={historia.titulo}>
                  <img
                    className="portada-popular"
                    src={`${import.meta.env.BASE_URL}${encodeURIComponent(historia.portada).replace(/%2F/g, '/')}`}
                    alt={`Portada de ${historia.titulo}`}
                    loading="lazy"
                  />

                  <div className="contenido-popular">
                    <span className="puesto-popular">
                      Puesto {indice + 1} · Ranking de muestra
                    </span>

                    <h3>{historia.titulo}</h3>

                    <div className={`descripcion-popular ${abierta ? 'expandida' : ''}`}>
                      {historia.descripcion}
                    </div>

                    <button
                      type="button"
                      className="boton-ver-mas"
                      onClick={() => alternarDescripcion(indice)}
                      aria-expanded={abierta}
                    >
                      {abierta ? 'Ver menos' : 'Ver más'}
                    </button>

                    <div className="generos-popular">
                      <span className="genero-principal">
                        {historia.principal}
                      </span>

                      {historia.secundario && (
                        <span className="genero-secundario">
                          {historia.secundario}
                        </span>
                      )}
                    </div>

                    <p className="categoria-popular">
                      {historia.categoria}
                    </p>

                    <p className="autor-popular">
                      Autor: {historia.autor}
                    </p>
                  </div>
                </article>
              )
            })}

          </div>
        </div>

        <button
          className="flecha-carrusel"
          type="button"
          onClick={() => desplazarCarrusel(1)}
          aria-label="Historias siguientes"
        >
          ❯
        </button>

      </div>
    </section>
  )
}

export default HistoriasPopulares
