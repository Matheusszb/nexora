import { spawnSync } from "node:child_process";

if (process.env.VERCEL_ENV !== "production") process.exit(0);

if (!process.env.DATABASE_URL || !process.env.DIRECT_URL) {
  console.error("Configure DATABASE_URL e DIRECT_URL no ambiente Production da Vercel.");
  process.exit(1);
}

function run(script) {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(command, ["run", script], { stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

run("db:migrate");

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (Boolean(email) !== Boolean(password)) {
  console.error("Para criar o administrador, configure ADMIN_EMAIL e ADMIN_PASSWORD juntos.");
  process.exit(1);
}
if (email && password) run("admin:create");
