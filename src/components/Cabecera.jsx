import { useState } from "react";

export function Cabecera({ onBuscar, onSalir, correoUsuario }) {
  const [texto, setTexto] = useState("");

  function manejarSubmit(evento) {
    evento.preventDefault();
    onBuscar(texto.trim());
  }

  return (
    <header className="cabecera">
      <span className="cabecera__marca">VIDECLUB</span>
      <form className="cabecera__busqueda" onSubmit={manejarSubmit}>
        <input
          type="search"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Buscar película..."
          aria-label="Buscar película"
        />
        <button type="submit" className="boton">Buscar</button>
      </form>
      <div className="cabecera__usuario">
        <span className="cabecera__correo">{correoUsuario}</span>
        <button type="button" className="boton" onClick={onSalir}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
