import { useEffect, useState } from "react";
import { supabase } from "../config/supabase.js";
import {
  cerrarSesion as cerrarSesionEnSupabase,
  iniciarSesionConOAuth,
} from "../services/autenticacion.js";

function obtenerMensaje(error, mensajeAlternativo) {
  return error?.message || mensajeAlternativo;
}

export function useSesion() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoAcceso, setCargandoAcceso] = useState("");
  const [errorAcceso, setErrorAcceso] = useState("");

  useEffect(() => {
    if (!supabase) {
      setCargando(false);
      return;
    }

    let activo = true;

    const { data } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSesion(nuevaSesion);
      setCargando(false);
      setCargandoAcceso("");
      setErrorAcceso("");
    });

    supabase.auth
      .getSession()
      .then(({ data: resultado, error }) => {
        if (!activo) {
          return;
        }

        if (error) {
          throw error;
        }

        setSesion(resultado.session);
      })
      .catch((error) => {
        if (activo) {
          setErrorAcceso(
            obtenerMensaje(error, "No se pudo revisar la sesión."),
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
      data.subscription.unsubscribe();
    };
  }, []);

  async function iniciarSesion(proveedor) {
    setCargandoAcceso(proveedor);
    setErrorAcceso("");

    try {
      await iniciarSesionConOAuth(proveedor);
    } catch (error) {
      if (error.message.includes("provider is not enabled")) {
        const nombreProveedor =
          proveedor === "discord" ? "Discord" : "Google";

        setErrorAcceso(
          `${nombreProveedor} no está habilitado en Supabase. Actívalo en Authentication > Sign In / Providers.`,
        );
      } else {
        setErrorAcceso(obtenerMensaje(error, "No se pudo iniciar sesión."));
      }

      setCargandoAcceso("");
    }
  }

  async function cerrarSesion() {
    try {
      await cerrarSesionEnSupabase();
    } catch (error) {
      setErrorAcceso(obtenerMensaje(error, "No se pudo cerrar la sesión."));
    }
  }

  return {
    sesion,
    cargando,
    cargandoAcceso,
    errorAcceso,
    iniciarSesion,
    cerrarSesion,
  };
}
