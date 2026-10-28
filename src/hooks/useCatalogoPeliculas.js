import { useEffect, useState } from "react";
import {
  consultarPeliculaPorId,
  consultarPeliculas,
} from "../services/peliculas.js";

function obtenerMensaje(error, mensajeAlternativo) {
  return error?.message || mensajeAlternativo;
}

export function useCatalogoPeliculas(autenticado) {
  const [peliculas, setPeliculas] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [idAbierto, setIdAbierto] = useState(null);
  const [peliculaAbierta, setPeliculaAbierta] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState("");

  useEffect(() => {
    if (!autenticado) {
      setPeliculas([]);
      setTotal(0);
      setTotalPaginas(0);
      setCargando(false);
      return;
    }

    let activo = true;
    setCargando(true);
    setError("");

    consultarPeliculas({ busqueda, pagina })
      .then((resultado) => {
        if (!activo) {
          return;
        }

        setPeliculas(resultado.peliculas);
        setTotal(resultado.total);
        setTotalPaginas(resultado.paginas);
      })
      .catch((error) => {
        if (activo) {
          setPeliculas([]);
          setTotal(0);
          setTotalPaginas(0);
          setError(
            obtenerMensaje(error, "No se pudieron cargar las películas."),
          );
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [autenticado, busqueda, pagina]);

  useEffect(() => {
    if (!autenticado || idAbierto === null) {
      setPeliculaAbierta(null);
      setCargandoDetalle(false);
      setErrorDetalle("");
      return;
    }

    let activo = true;
    setCargandoDetalle(true);
    setPeliculaAbierta(null);
    setErrorDetalle("");

    consultarPeliculaPorId(idAbierto)
      .then((pelicula) => {
        if (!activo) {
          return;
        }

        if (!pelicula) {
          setErrorDetalle("Esta película ya no está disponible en la biblioteca.");
          return;
        }

        setPeliculaAbierta(pelicula);
      })
      .catch((error) => {
        if (activo) {
          setErrorDetalle(
            obtenerMensaje(error, "No se pudo cargar el detalle de la película."),
          );
        }
      })
      .finally(() => {
        if (activo) {
          setCargandoDetalle(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [autenticado, idAbierto]);

  function buscar(texto) {
    setBusqueda(texto);
    setPagina(1);
  }

  function paginaAnterior() {
    setPagina((paginaActual) => Math.max(1, paginaActual - 1));
  }

  function paginaSiguiente() {
    setPagina((paginaActual) => Math.min(totalPaginas, paginaActual + 1));
  }

  return {
    peliculas,
    total,
    totalPaginas,
    pagina,
    busqueda,
    cargando,
    error,
    peliculaAbierta,
    cargandoDetalle,
    errorDetalle,
    buscar,
    abrirDetalle: setIdAbierto,
    cerrarDetalle: () => setIdAbierto(null),
    paginaAnterior,
    paginaSiguiente,
  };
}
