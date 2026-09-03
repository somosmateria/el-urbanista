-- El límite global de Storage del proyecto se fijó en 500MB (Supabase exige
-- que el límite global sea >= al de cualquier bucket individual). Se ajusta
-- el bucket de diagnósticos a juego; el diagnóstico más grande conocido
-- (Lora del Río) pesa ~411MB, así que sigue habiendo margen.
update storage.buckets
set file_size_limit = 524288000 -- 500MB
where id = 'diagnosticos';
