import assert from "node:assert/strict";
import test from "node:test";
import { eliminarPeliculasDuplicadas } from "./eliminarPeliculasDuplicadas.js";

test("conserva una película por TMDB ID y usa el registro más reciente", () => {
  const peliculas = [
    { tmdb_id: 10, titulo: "Título anterior" },
    { tmdb_id: 20, titulo: "Otra película" },
    { tmdb_id: 10, titulo: "Título actualizado" },
  ];

  assert.deepEqual(eliminarPeliculasDuplicadas(peliculas), [
    { tmdb_id: 10, titulo: "Título actualizado" },
    { tmdb_id: 20, titulo: "Otra película" },
  ]);
});
