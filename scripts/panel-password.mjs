// Panel parolası için PANEL_PASSWORD_HASH_B64 değerini üretir (bcrypt hash'inin Base64 hâli, bkz. CLAUDE.md).
// Kullanım: npm run panel:parola -- "yeni-parola"
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error('Kullanım: npm run panel:parola -- "en-az-8-karakterli-parola"');
  process.exit(1);
}
console.log(Buffer.from(bcrypt.hashSync(password, 10), "utf8").toString("base64"));
