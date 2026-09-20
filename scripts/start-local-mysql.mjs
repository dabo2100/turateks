import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";

const root = process.cwd();
const mysqlHome = "C:/Program Files/MySQL/MySQL Server 8.4";
const mysqld = path.join(mysqlHome, "bin", "mysqld.exe");
const mysql = path.join(mysqlHome, "bin", "mysql.exe");
const dataDir = path.join(root, ".mysql-data");
const runtimeDir = path.join(root, ".mysql-runtime");
const configFile = path.join(runtimeDir, "my.ini");

function isListening(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitUntilListening(port, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isListening(port)) return true;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return false;
}

if (await isListening(3306)) {
  console.log("MySQL is already listening on 127.0.0.1:3306.");
  process.exit(0);
}

if (process.platform !== "win32" || !fs.existsSync(mysqld)) {
  console.error("MySQL 8.4 is not installed at the expected Windows path.");
  console.error("Install Oracle.MySQL with winget, or start the database configured in DATABASE_URL.");
  process.exit(1);
}

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(
  configFile,
  `[mysqld]\n` +
    `basedir=${mysqlHome}\n` +
    `datadir=${dataDir.replaceAll("\\", "/")}\n` +
    `port=3306\n` +
    `bind-address=127.0.0.1\n` +
    `character-set-server=utf8mb4\n` +
    `collation-server=utf8mb4_unicode_ci\n` +
    `log-error=${path.join(runtimeDir, "mysql-error.log").replaceAll("\\", "/")}\n` +
    `pid-file=${path.join(runtimeDir, "mysql.pid").replaceAll("\\", "/")}\n`,
);

if (!fs.existsSync(path.join(dataDir, "mysql"))) {
  const initialized = spawnSync(mysqld, [`--defaults-file=${configFile}`, "--initialize-insecure", "--console"], {
    stdio: "inherit",
  });
  if (initialized.status !== 0) process.exit(initialized.status ?? 1);
}

function startServer() {
  const server = spawn(mysqld, [`--defaults-file=${configFile}`], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  server.unref();
}

startServer();

let listening = await waitUntilListening(3306);
const errorLog = path.join(runtimeDir, "mysql-error.log");
const undoStartupConflict =
  !listening &&
  fs.existsSync(errorLog) &&
  fs.readFileSync(errorLog, "utf8").slice(-8_000).includes("Can't create UNDO tablespace");
if (undoStartupConflict) {
  // Preserve and replace conflicting local-dev undo files; imported data remains in its tablespaces.
  const backupDir = path.join(runtimeDir, `undo-recovery-${Date.now()}`);
  fs.mkdirSync(backupDir, { recursive: true });
  for (const name of fs.readdirSync(dataDir).filter((name) => name.startsWith("undo_"))) {
    fs.renameSync(path.join(dataDir, name), path.join(backupDir, name));
  }
  console.warn(`Recovered a local MySQL undo startup conflict; backup: ${backupDir}`);
  startServer();
  listening = await waitUntilListening(3306);
}

if (!listening) {
  console.error(`MySQL did not start. Check ${path.join(runtimeDir, "mysql-error.log")}.`);
  process.exit(1);
}

const createDatabases = spawnSync(
  mysql,
  [
    "--user=root",
    "--host=127.0.0.1",
    "--port=3306",
    "--execute=CREATE DATABASE IF NOT EXISTS turkey CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE DATABASE IF NOT EXISTS turkey_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
  ],
  { stdio: "inherit" },
);
if (createDatabases.status !== 0) process.exit(createDatabases.status ?? 1);

console.log("MySQL started on 127.0.0.1:3306.");
