const PROVEEDORES = [
  { id: "google", nombre: "Google" },
  { id: "discord", nombre: "Discord" },
];

export function AccesoSocial({ onEntrar, proveedorCargando, error }) {
  return (
    <main className="acceso">
      <section className="acceso__tarjeta">
        <h1>VIDECLUB</h1>
        <p>Accede con Google o Discord para explorar el catálogo.</p>

        <div className="acceso__proveedores">
          {PROVEEDORES.map((proveedor) => (
            <button
              key={proveedor.id}
              type="button"
              className="boton boton--principal"
              onClick={() => onEntrar(proveedor.id)}
              disabled={Boolean(proveedorCargando)}
            >
              {proveedorCargando === proveedor.id
                ? "Conectando..."
                : `Entrar con ${proveedor.nombre}`}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        ) : null}
      </section>
    </main>
  );
}
