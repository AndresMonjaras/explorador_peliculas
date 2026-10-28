export function PiePagina() {
  return (
    <footer className="pie">
      <div className="pie__marca">
        <span className="pie__etiqueta">Créditos</span>
        <a
          className="pie__logo"
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/tmdb-logo.svg" alt="The Movie Database (TMDB)" />
        </a>
      </div>
      <p className="pie__aviso">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
