import { Cabecera } from "../components/Cabecera.jsx";
import { DetallePelicula } from "../components/DetallePelicula.jsx";
import { TarjetaPelicula } from "../components/TarjetaPelicula.jsx";
import { useCatalogoPeliculas } from "../hooks/useCatalogoPeliculas.js";

export function CatalogoPeliculas({ sesion, errorSesion, onCerrarSesion }) {
  const catalogo = useCatalogoPeliculas(Boolean(sesion));

  return (
    <>
      <Cabecera
        onBuscar={catalogo.buscar}
        onSalir={onCerrarSesion}
        correoUsuario={
          sesion.user.email || sesion.user.user_metadata?.full_name || "Mi cuenta"
        }
      />

      <main className="catalogo">
        <section className="presentacion">
          <p className="etiqueta">Una biblioteca para volver al cine</p>
          <h1>La próxima historia empieza aquí.</h1>
          <p>
            Películas elegidas para explorar, descubrir y guardar en la memoria.
          </p>
        </section>

        <section className="seccion-peliculas" aria-labelledby="titulo-catalogo">
          <div className="encabezado-catalogo">
            <div>
              <p className="etiqueta">
                {catalogo.busqueda ? "Resultados de búsqueda" : "Colección"}
              </p>
              <h2 id="titulo-catalogo">
                {catalogo.busqueda
                  ? `Películas sobre “${catalogo.busqueda}”`
                  : "En cartelera"}
              </h2>
            </div>
            <span className="contador-peliculas">
              {catalogo.total} {catalogo.total === 1 ? "película" : "películas"}
            </span>
          </div>

          {errorSesion ? (
            <p className="aviso aviso--error" role="alert">
              {errorSesion}
            </p>
          ) : null}

          {catalogo.error ? (
            <p className="aviso aviso--error" role="alert">
              {catalogo.error}
            </p>
          ) : null}

          {catalogo.cargando ? (
            <p className="aviso" role="status">
              Buscando en la biblioteca…
            </p>
          ) : null}

          {!catalogo.cargando && !catalogo.error && catalogo.peliculas.length === 0 ? (
            <div className="estado-vacio">
              <h3>
                {catalogo.busqueda
                  ? "No encontramos esa película"
                  : "Aún no hay películas"}
              </h3>
              <p>
                {catalogo.busqueda
                  ? "Prueba con otro título o revisa la escritura."
                  : "Importa películas desde TMDB para llenar esta biblioteca."}
              </p>
            </div>
          ) : null}

          {catalogo.peliculas.length > 0 ? (
            <div className="rejilla-peliculas">
              {catalogo.peliculas.map((pelicula) => (
                <TarjetaPelicula
                  key={pelicula.tmdb_id}
                  pelicula={pelicula}
                  onAbrir={catalogo.abrirDetalle}
                />
              ))}
            </div>
          ) : null}

          {catalogo.totalPaginas > 1 ? (
            <nav className="paginacion" aria-label="Paginación de películas">
              <button
                type="button"
                className="boton boton--secundario"
                onClick={catalogo.paginaAnterior}
                disabled={catalogo.pagina === 1 || catalogo.cargando}
              >
                Anterior
              </button>
              <span>
                Página {catalogo.pagina} de {catalogo.totalPaginas}
              </span>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={catalogo.paginaSiguiente}
                disabled={
                  catalogo.pagina === catalogo.totalPaginas || catalogo.cargando
                }
              >
                Siguiente
              </button>
            </nav>
          ) : null}
        </section>
      </main>

      {catalogo.cargandoDetalle ? (
        <div className="aviso-detalle" role="status">
          Cargando los detalles…
        </div>
      ) : null}
      {catalogo.errorDetalle ? (
        <div className="aviso-detalle aviso-detalle--error" role="alert">
          <p>{catalogo.errorDetalle}</p>
          <button
            type="button"
            className="boton boton--secundario"
            onClick={catalogo.cerrarDetalle}
          >
            Cerrar
          </button>
        </div>
      ) : null}
      {catalogo.peliculaAbierta ? (
        <DetallePelicula
          pelicula={catalogo.peliculaAbierta}
          onCerrar={catalogo.cerrarDetalle}
        />
      ) : null}
    </>
  );
}
