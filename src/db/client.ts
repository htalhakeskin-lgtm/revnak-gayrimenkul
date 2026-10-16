import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Veritabanı istemcisi (K20). HTTP sürücüsü: Vercel'in serverless fonksiyonlarında
 * ve edge ortamında bağlantı havuzu yönetmeden çalışır.
 */
function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL tanımlı değil. Yerelde çalıştırmak için `vercel env pull .env.local` komutunu çalıştırın.",
    );
  }
  return drizzle(neon(url), { schema });
}

let cached: ReturnType<typeof getDb> | undefined;

export function db() {
  if (!cached) cached = getDb();
  return cached;
}
