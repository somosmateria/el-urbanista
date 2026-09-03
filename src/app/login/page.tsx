import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="min-h-screen bg-rail flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="font-serif text-2xl text-text text-center mb-1">El Urbanista</div>
        <p className="text-text-faint text-[13px] text-center mb-8">
          Acceso interno del estudio
        </p>

        <form
          action={loginAction}
          className="rounded-xl border border-line bg-surface p-6"
        >
          <input type="hidden" name="next" value={next ?? "/"} />

          <label className="block font-mono text-[11px] text-text-faint mb-2">EMAIL</label>
          <input
            name="email"
            type="email"
            required
            autoFocus
            className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet mb-4"
          />

          <label className="block font-mono text-[11px] text-text-faint mb-2">CONTRASEÑA</label>
          <input
            name="password"
            type="password"
            required
            className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
          />

          {error && <p className="text-[12.5px] text-coral-ink mt-3">{error}</p>}

          <button
            type="submit"
            className="w-full mt-5 bg-violet hover:bg-violet-hover text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
          >
            Entrar
          </button>
        </form>

        <p className="text-text-faint text-[12px] text-center mt-5">
          Herramienta de uso interno — el alta se hace por invitación.
        </p>
      </div>
    </div>
  );
}
