import { SignJWT, jwtVerify } from "jose";

/**
 * Panel oturumu (K20). Tek admin hesabı; parola bcrypt hash'i ve imzalama anahtarı
 * ortam değişkenlerinde (PANEL_PASSWORD_HASH_B64, SESSION_SECRET). Üretimde rol bazlı
 * çoklu kullanıcı ve 2FA eklenecek (Bölüm 13.1).
 */

export const PANEL_SESSION_COOKIE = "revnak_panel_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 14; // 14 gün

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET tanımlı değil.");
  return new TextEncoder().encode(secret);
}

export async function createPanelSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey());
}

export async function verifyPanelSessionToken(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const panelSessionMaxAge = SESSION_DURATION_SECONDS;
