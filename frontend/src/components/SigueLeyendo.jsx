
import { useRef } from "react";

function SigueLeyendo({ historias = [] }) {
  const carruselRef = useRef(null);

  const historiasRecientes = [...historias]
    .sort((a, b) => new Date(b.ultimaLectura || 0) - new Date(a.ultimaLectura || 0))
    .slice(0, 10);

  function moverCarrusel(direccion) {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({
        left: direccion * 240,
        behavior: "smooth"
      });
    }
  }

  return (
    <section className="seccion-sigue-leyendo">

      <div className="encabezado-carrusel">
        <h2>Sigue leyendo</h2>

        {historiasRecientes.length > 0 && (
          <div className="controles-carrusel">
            <button
              type="button"
              onClick={() => moverCarrusel(-1)}
              aria-label="Historias anteriores"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => moverCarrusel(1)}
              aria-label="Historias siguientes"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {historiasRecientes.length === 0 ? (
        <div className="mensaje-biblioteca-vacia">
          <p>No hay historias.</p>
          <span>Cuando agregues lecturas a tu biblioteca, aparecerán aquí. ✨</span>
        </div>
      ) : (
        <div className="carrusel-lecturas" ref={carruselRef}>
          {historiasRecientes.map((historia) => (
            <article className="tarjeta-lectura" key={historia.id}>

              <img
                src={historia.portada || "/imagenes/portada-predeterminada.png"}
                alt={`Portada de ${historia.titulo}`}
              />

              <h3>{historia.titulo}</h3>

              <div className="progreso-lectura">
                <div
                  className="progreso-lectura-actual"
                  style={{
                    width: `${Math.min(100, Math.max(0, historia.progreso || 0))}%`
                  }}
                />
              </div>

              <span>{historia.progreso || 0}% leído</span>

            </article>
          ))}
        </div>
      )}

    </section>
  );
}

export default SigueLeyendo;
