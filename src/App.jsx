import { AccesoGoogle } from "./components/AccesoGoogle.jsx";
import { PiePagina } from "./components/PiePagina.jsx";
import { supabaseConfigurado } from "./config/supabase.js";
import { useSesion } from "./hooks/useSesion.js";
import { CatalogoPeliculas } from "./pages/CatalogoPeliculas.jsx";

function App() {
  const {
    sesion,
    cargando,
    cargandoAcceso,
    errorAcceso,
    iniciarSesion,
    cerrarSesion,
  } = useSesion();

  if (!supabaseConfigurado) {
    return (
      <main className="pantalla-configuracion">
        <section className="mensaje-configuracion">
          <p className="etiqueta">Videoclub</p>
          <h1>Conecta tu biblioteca de películas</h1>
          <p>
            Copia <code>.env.example</code> como <code>.env</code> y agrega la
            URL y la clave pública de tu proyecto Supabase.
          </p>
        </section>
      </main>
    );
  }

  if (cargando) {
    return (
      <main className="pantalla-carga" aria-live="polite">
        <p>Cargando tu sesión…</p>
      </main>
    );
  }

  if (!sesion) {
    return (
      <>
        <AccesoGoogle
          onEntrar={iniciarSesion}
          cargando={cargandoAcceso}
          error={errorAcceso}
        />
        <PiePagina />
      </>
    );
  }

  return (
    <>
      <CatalogoPeliculas
        sesion={sesion}
        errorSesion={errorAcceso}
        onCerrarSesion={cerrarSesion}
      />
      <PiePagina />
    </>
  );
}

export default App;
