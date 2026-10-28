export function AccesoGoogle({ onEntrar, cargando, error }) {
  return (
    <main className="acceso">
      <section className="acceso__tarjeta">
        <h1>VIDECLUB</h1>
        <p>Accede con tu cuenta de Google para explorar el catálogo.</p>
        <button
          type="button"
          className="boton boton--principal"
          onClick={onEntrar}
          disabled={cargando}
        >
          {cargando ? "Entrando..." : "Entrar con Google"}
        </button>
        {error ? (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        ) : null}
      </section>
    </main>
  );
}
