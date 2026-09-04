import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-[392px]">
        <div className="text-center mb-[34px]">
          <div className="font-serif font-normal text-[44px] leading-[1.05] tracking-[-0.02em]">
            El Urbanista
          </div>
          <div className="text-[10px] tracking-[0.24em] uppercase text-text-faint mt-3">
            Acceso interno del estudio
          </div>
        </div>

        <hr className="border-t border-line mb-[30px]" />

        <form action={loginAction}>
          <input type="hidden" name="next" value={next ?? "/"} />

          <div className="mb-[18px]">
            <label className="block text-[10px] tracking-[0.16em] uppercase text-text-faint mb-[7px]">
              Correo
            </label>
            <input
              name="email"
              type="email"
              required
              autoFocus
              className="w-full box-border bg-transparent border border-line rounded px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
            />
          </div>

          <div className="mb-[26px]">
            <label className="block text-[10px] tracking-[0.16em] uppercase text-text-faint mb-[7px]">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full box-border bg-transparent border border-line rounded px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
            />
          </div>

          {error && <p className="text-[12.5px] text-coral-ink mb-4">{error}</p>}

          <button type="submit" className="btn btn-primary w-full">
            Entrar
          </button>
        </form>

        <p className="text-center text-[11.5px] text-text-faint mt-6">
          Herramienta de uso interno — el alta se hace por invitación.
        </p>
      </div>
    </div>
  );
}
