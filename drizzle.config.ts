import { defineConfig } from "drizzle-kit";

// .env.local'daki DATABASE_URL'i kullanır (Vercel + Neon entegrasyonu, K20)
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
