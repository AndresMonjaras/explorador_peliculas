# Videoclub: explorador de películas

Aplicación de React para consultar un catálogo de películas almacenado en Supabase. Permite iniciar sesión con Google, buscar títulos, recorrer resultados por páginas y consultar los detalles guardados de cada película.

## Tecnologías

- React y Vite
- Supabase Auth y PostgreSQL
- TMDB API para importar datos
- JavaScript y CSS

## Requisitos

- Node.js 20.6 o posterior
- Un proyecto de Supabase
- Un token de lectura de TMDB

## Instalación

```bash
npm install
cp .env.example .env
```

Agrega los valores de Supabase y TMDB a `.env`. Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` se usan en la aplicación. La clave `SUPABASE_SECRET_KEY` y el token de TMDB solo se usan en el proceso de importación; no agregues esos valores al código del navegador.

## Configurar Supabase

1. Abre el editor SQL de Supabase y ejecuta `supabase/esquema.sql`.
2. En Authentication, habilita Google como proveedor y agrega las credenciales OAuth de Google.
3. Configura la URL del sitio y las URL de redirección de Supabase. Para desarrollo local, permite `http://localhost:5173`.
4. Copia la URL del proyecto y la clave pública en las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
5. Copia la clave privada `sb_secret_...` en `SUPABASE_SECRET_KEY`. Si tu proyecto solo tiene la clave antigua `service_role`, colócala en `SUPABASE_SERVICE_ROLE_KEY`. Ambas se usan únicamente en Node y deben permanecer fuera del navegador y del control de versiones.

## Configurar TMDB

Obtén el API Read Access Token en la configuración de API de tu cuenta de TMDB y guárdalo como `TMDB_READ_ACCESS_TOKEN` dentro de `.env`.

Para llenar la biblioteca, ejecuta:

```bash
npm run importar:peliculas
```

El proceso importa hasta cinco páginas de películas populares en español y actualiza las existentes usando el identificador original de TMDB. Se ejecuta en Node.js y escribe en Supabase. El navegador consulta títulos y detalles desde Supabase; las portadas usan las rutas de imagen guardadas en esos registros.

## Ejecutar la aplicación

```bash
npm run dev
```

Vite mostrará la dirección local para abrir en el navegador. Para generar los archivos de producción:

```bash
npm run build
```

## Estructura

```text
scripts/             Importación desde TMDB
src/components/      Acceso, búsqueda, tarjetas y detalle
src/config/          Cliente de Supabase
src/hooks/           Sesión y estado del catálogo
src/pages/           Pantalla principal de películas
src/services/        Sesión y consultas de películas
supabase/            Esquema SQL y políticas de lectura
```

Las cuentas autenticadas pueden leer el catálogo. Las escrituras las realiza el importador con una clave de servicio y las políticas RLS no habilitan escrituras desde el navegador.

## Créditos

This product uses the TMDB API but is not endorsed or certified by TMDB. Consulta [The Movie Database](https://www.themoviedb.org/).
