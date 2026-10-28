import { useEffect } from "react";

export function DetallePelicula({ pelicula, onCerrar }) {
  useEffect(() => {
    function manejarTecla(evento) {
      if (evento.key === "Escape") {
        onCerrar();
      }
    }
    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [onCerrar]);

  if (!pelicula) return null;

  const fondo = pelicula.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${pelicula.backdrop_path}`
    : null;
  const anio = pelicula.fecha_estreno ? pelicula.fecha_estreno.slice(0, 4) : "—";
  const generos = Array.isArray(pelicula.generos)
    ? pelicula.generos.join(" · ")
    : "";
  const resumen = pelicula.resumen || "La sinopsis no está disponible todavía.";

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detalle-titulo"
    >
      <div
        className="modal__fondo"
        style={fondo ? { backgroundImage: `url(${fondo})` } : undefined}
        onClick={(evento) => {
          if (evento.target === evento.currentTarget) {
            onCerrar();
          }
        }}
      />
      <div className="modal__contenido">
        <button
          type="button"
          className="modal__cerrar"
          onClick={onCerrar}
          aria-label="Cerrar detalles"
        >
          ×
        </button>
        <p className="etiqueta">Detalle de la película</p>
        <h2 id="detalle-titulo">{pelicula.titulo}</h2>
        {pelicula.titulo_original && pelicula.titulo_original !== pelicula.titulo ? (
          <p className="modal__titulo-original">
            Título original: {pelicula.titulo_original}
          </p>
        ) : null}
        <p className="modal__meta">
          {anio} · ★ {pelicula.puntuacion ?? "—"} ·{" "}
          {pelicula.idioma_original || "Idioma no disponible"}
        </p>
        {generos ? <p className="modal__generos">{generos}</p> : null}
        <p className="modal__resumen">{resumen}</p>
      </div>
    </div>
  );
}
