import assert from "node:assert/strict";
import test from "node:test";
import { crearEncabezadosSupabase } from "./crearEncabezadosSupabase.js";

test("la nueva clave secreta se envía sin Authorization Bearer", () => {
  const encabezados = crearEncabezadosSupabase("sb_secret_de_prueba");

  assert.deepEqual(encabezados, {
    apikey: "sb_secret_de_prueba",
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates",
  });
});

test("la clave service_role antigua conserva Authorization Bearer", () => {
  const claveAntigua = "eyJ.service_role.de_prueba";
  const encabezados = crearEncabezadosSupabase(claveAntigua);

  assert.equal(encabezados.apikey, claveAntigua);
  assert.equal(encabezados.Authorization, `Bearer ${claveAntigua}`);
});

test("rechaza una clave publishable en la variable privada", () => {
  assert.throws(
    () => crearEncabezadosSupabase("sb_publishable_de_prueba"),
    /clave pública.*sb_secret/i,
  );
});
