"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createPanelSessionToken, PANEL_SESSION_COOKIE, panelSessionMaxAge } from "@/lib/panel-auth";

export type LoginResult = { ok: false; message: string } | never;

export async function panelLogin(_prev: LoginResult | null, formData: FormData): Promise<LoginResult> {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("sonra") ?? "/panel");

  // Base64 ile saklanır: bcrypt hash'i "$" içerir ve ortam değişkeni dosyalarında
  // (.env.local) değişken referansı sanılıp bozulabilir (K20'de yaşandı).
  const encoded = process.env.PANEL_PASSWORD_HASH_B64;
  if (!encoded) {
    return { ok: false, message: "Panel parolası yapılandırılmamış (PANEL_PASSWORD_HASH_B64 eksik)." };
  }
  const hash = Buffer.from(encoded, "base64").toString("utf8");

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return { ok: false, message: "Parola hatalı." };
  }

  const token = await createPanelSessionToken();
  const store = await cookies();
  store.set(PANEL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: panelSessionMaxAge,
  });

  redirect(nextPath.startsWith("/panel") ? nextPath : "/panel");
}

export async function panelLogout() {
  const store = await cookies();
  store.delete(PANEL_SESSION_COOKIE);
  redirect("/panel/giris");
}
