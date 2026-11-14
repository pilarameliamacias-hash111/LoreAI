
import { useRef } from "react";

function RecomendadoParaTi({ historias = [] }) {
  const carruselRef = useRef(null);

  const recomendaciones = historias.slice(0, 15);

  function moverCarrusel(direccion) {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({
        left: direccion * 240,
        behavior: "smooth"
      });
    }
  }

  return (
    <section className="seccion-recomendados">

      <div className="encabezado-carrusel">
        <h2>Recomendado para ti</h2>

        {recomendaciones.length > 0 && (
          <div className="controles-carrusel">
            <button
              type="button"
              onClick={() => moverCarrusel(-1)}
              aria-label="Recomendaciones anteriores"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => moverCarrusel(1)}
              aria-label="Más recomendaciones"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {recomendaciones.length === 0 ? (
        <div className="mensaje-biblioteca-vacia">
          <p>Estamos preparando tus recomendaciones. ✨</p>
          <span>
            Pronto encontrarás historias relacionadas con tus gustos.
          </span>
        </div>
      ) : (
        <div className="carrusel-lecturas" ref={carruselRef}>
          {recomendaciones.map((historia) => (
            <article className="tarjeta-lectura" key={historia.id}>

              <img
                src={historia.portada || "/imagenes/portada-predeterminada.png"}
                alt={`Portada de ${historia.titulo}`}
              />

              <h3>{historia.titulo}</h3>

            </article>
          ))}
        </div>
      )}

    </section>
  );
}

export default RecomendadoParaTi;
