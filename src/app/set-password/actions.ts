"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/server";

export async function setPasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmacion = String(formData.get("confirmacion") ?? "");

  if (password.length < 8) {
    redirect(
      `/set-password?error=${encodeURIComponent("La contraseña debe tener al menos 8 caracteres.")}`
    );
  }
  if (password !== confirmacion) {
    redirect(`/set-password?error=${encodeURIComponent("Las dos contraseñas no coinciden.")}`);
  }

  const supabase = await createServerAuthClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/set-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}
