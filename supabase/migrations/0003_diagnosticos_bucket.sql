-- Bucket privado de Storage para los PDF de diagnóstico. Los archivos son
-- grandes (cientos de MB, sobre todo por cartografía incrustada), así que la
-- subida va directa del navegador a Storage con una signed upload URL — el
-- servidor de Next.js nunca recibe esos bytes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('diagnosticos', 'diagnosticos', false, 1073741824, array['application/pdf'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Sin políticas de storage.objects a propósito: las subidas usan una signed
-- upload URL generada en el servidor con la service role (que bypassa RLS),
-- no acceso directo del cliente con la anon key. Igual que el resto de
-- tablas (ver 0001_init.sql), esto se revisita al añadir Auth real.
