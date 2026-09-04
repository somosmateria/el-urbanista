// Tipos manuales que reflejan supabase/migrations/0001_init.sql.
// Cuando el proyecto esté enlazado con `supabase link`, se puede regenerar con:
//   npx supabase gen types typescript --linked > src/lib/supabase/types.ts
// (y luego reintroducir a mano los enums de aquí si el comando los aplana).

export type MotorTipo = "plantilla" | "rag" | "tabla";
export type CapituloEstado = "listo" | "revisar" | "tu_aportacion" | "sin_info";
export type SinInfoMotivo = "falta_dato" | "no_aplica";
export type DiagnosticoEstado = "procesando" | "listo" | "error";
export type VersionTipo = "generacion_automatica" | "edicion_manual";
export type EquipoRol = "admin" | "miembro";

export type EquipoRow = {
  id: string;
  nombre: string;
  created_at: string;
}

export type EquipoMiembroRow = {
  id: string;
  equipo_id: string;
  user_id: string;
  rol: EquipoRol;
  created_at: string;
}

export type MunicipioRow = {
  id: string;
  equipo_id: string;
  nombre: string;
  plan_vigente: string | null;
  fecha_plan_vigente: string | null;
  created_at: string;
}

export type MunicipioAccesoRow = {
  id: string;
  municipio_id: string;
  user_id: string;
  created_at: string;
}

export type DiagnosticoRow = {
  id: string;
  municipio_id: string;
  storage_path: string;
  nombre_archivo: string | null;
  estado: DiagnosticoEstado;
  error_mensaje: string | null;
  created_at: string;
}

export type DiagnosticoSeccionRow = {
  id: string;
  diagnostico_id: string;
  codigo: string;
  titulo: string | null;
  texto: string;
  orden: number;
  created_at: string;
}

export type MapeoCapituloRow = {
  id: string;
  capitulo_codigo: string;
  capitulo_padre: string | null;
  titulo_canonico: string;
  motor: MotorTipo;
  seccion_diagnostico_codigo: string | null;
  orden: number;
  opcional: boolean;
  activo: boolean;
  created_at: string;
}

export type CapituloRow = {
  id: string;
  municipio_id: string;
  codigo: string;
  titulo: string;
  motor: MotorTipo;
  estado: CapituloEstado;
  sin_info_motivo: SinInfoMotivo | null;
  contenido_html: string | null;
  orden: number;
  created_at: string;
  updated_at: string;
}

export type CapituloVersionRow = {
  id: string;
  capitulo_id: string;
  contenido_html: string;
  tipo: VersionTipo;
  created_at: string;
}

export type CapituloTablaRow = {
  id: string;
  capitulo_id: string;
  // null = tabla del capítulo completo (p.ej. MO.5); con valor = tabla de
  // un subepígrafe concreto dentro de un capítulo mixto (p.ej. "MO.3.2").
  subepigrafe_codigo: string | null;
  nombre_bloque: string;
  columnas: string[];
  filas: Record<string, string>[];
  orden: number;
  created_at: string;
  updated_at: string;
}

export type CapituloTablaVersionRow = {
  id: string;
  capitulo_tabla_id: string;
  columnas: string[];
  filas: Record<string, string>[];
  tipo: VersionTipo;
  created_at: string;
}

export type CapituloTextoRow = {
  id: string;
  capitulo_id: string;
  subepigrafe_codigo: string | null;
  titulo: string;
  contenido_html: string;
  orden: number;
  created_at: string;
  updated_at: string;
}

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      equipos: TableDef<
        EquipoRow,
        Omit<EquipoRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<EquipoRow, "id">>
      >;
      equipo_miembros: TableDef<
        EquipoMiembroRow,
        Omit<EquipoMiembroRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<EquipoMiembroRow, "id">>
      >;
      municipios: TableDef<
        MunicipioRow,
        Omit<MunicipioRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<MunicipioRow, "id">>
      >;
      municipio_accesos: TableDef<
        MunicipioAccesoRow,
        Omit<MunicipioAccesoRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<MunicipioAccesoRow, "id">>
      >;
      diagnosticos: TableDef<
        DiagnosticoRow,
        Omit<DiagnosticoRow, "id" | "created_at" | "estado" | "error_mensaje"> & {
          id?: string;
          estado?: DiagnosticoEstado;
          error_mensaje?: string | null;
        },
        Partial<Omit<DiagnosticoRow, "id">>
      >;
      diagnostico_secciones: TableDef<
        DiagnosticoSeccionRow,
        Omit<DiagnosticoSeccionRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<DiagnosticoSeccionRow, "id">>
      >;
      mapeo_capitulos: TableDef<
        MapeoCapituloRow,
        Omit<MapeoCapituloRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<MapeoCapituloRow, "id">>
      >;
      capitulos: TableDef<
        CapituloRow,
        Omit<CapituloRow, "id" | "created_at" | "updated_at"> & { id?: string },
        Partial<Omit<CapituloRow, "id">>
      >;
      capitulo_versiones: TableDef<
        CapituloVersionRow,
        Omit<CapituloVersionRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<CapituloVersionRow, "id">>
      >;
      capitulo_tablas: TableDef<
        CapituloTablaRow,
        Omit<CapituloTablaRow, "id" | "created_at" | "updated_at"> & { id?: string },
        Partial<Omit<CapituloTablaRow, "id">>
      >;
      capitulo_tablas_versiones: TableDef<
        CapituloTablaVersionRow,
        Omit<CapituloTablaVersionRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<CapituloTablaVersionRow, "id">>
      >;
      capitulo_textos: TableDef<
        CapituloTextoRow,
        Omit<CapituloTextoRow, "id" | "created_at" | "updated_at"> & { id?: string },
        Partial<Omit<CapituloTextoRow, "id">>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
