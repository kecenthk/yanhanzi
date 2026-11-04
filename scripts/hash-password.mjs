import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2] || process.env.ADMIN_PASSWORD;
if (!password) {
  console.error("用法：node scripts/hash-password.mjs <密码>");
  process.exit(1);
}
if (password.length < 10) {
  console.error("管理员密码至少 10 位。");
  process.exit(1);
}
const salt = randomBytes(16);
const digest = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
console.log(`scrypt$${salt.toString("base64url")}$${digest.toString("base64url")}`);
