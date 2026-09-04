import { InvitacionBanner } from "@/components/InvitacionBanner";
import { getUsuarioActual, listInvitacionesPendientes } from "@/lib/data/equipos";

/**
 * Aislado en su propio Server Component async, envuelto en Suspense desde
 * AppShell — para que comprobar invitaciones pendientes no añada una
 * espera secuencial más a CADA navegación (antes vivía directo en
 * AppShell, bloqueando la cabecera y el contenido de la página hasta que
 * resolvía). Así el resto de la pantalla se pinta ya, y el aviso aparece
 * en cuanto está listo, sin retrasar nada más.
 */
export async function InvitacionBannerGate() {
  const usuario = await getUsuarioActual();
  const invitaciones = usuario?.email ? await listInvitacionesPendientes(usuario.email) : [];
  if (invitaciones.length === 0) return null;
  return <InvitacionBanner invitaciones={invitaciones} />;
}
