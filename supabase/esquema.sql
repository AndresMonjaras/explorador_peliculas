create table if not exists public.peliculas (
  tmdb_id bigint primary key,
  titulo text not null,
  titulo_original text,
  resumen text,
  fecha_estreno date,
  poster_path text,
  backdrop_path text,
  puntuacion numeric(4, 2) check (puntuacion between 0 and 10),
  idioma_original text,
  generos text[] not null default '{}',
  actualizado_en timestamptz not null default now()
);

alter table public.peliculas enable row level security;

drop policy if exists "Usuarios autenticados pueden leer peliculas"
  on public.peliculas;

create policy "Usuarios autenticados pueden leer peliculas"
  on public.peliculas
  for select
  to authenticated
  using (true);
