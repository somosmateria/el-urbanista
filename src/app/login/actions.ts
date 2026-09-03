"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  const supabase = await createServerAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent("Email o contraseña incorrectos.")}`);
  }

  redirect(next.startsWith("/") ? next : "/");
}

export async function signOutAction() {
  const supabase = await createServerAuthClient();
  await supabase.auth.signOut();
  redirect("/login");
}
