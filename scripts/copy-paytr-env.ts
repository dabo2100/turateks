/**
 * Copies PayTR keys from the WP dump DB into `.env` if missing.
 * Does not print secret values.
 */
import { createConnection } from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

function phpString(blob: string, key: string) {
  const re = new RegExp(`s:\\d+:"${key}";s:\\d+:"(.*?)"`);
  return blob.match(re)?.[1];
}

async function main() {
  const envPath = path.resolve(process.cwd(), ".env");
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  if (/^PAYTR_MERCHANT_ID=/m.test(existing) && existing.match(/^PAYTR_MERCHANT_ID=(.+)$/m)?.[1]) {
    console.log("PayTR env already set — skipped.");
    return;
  }

  const wp = await createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "turkey_wp",
  });
  const [rows] = await wp.query(
    "SELECT option_value FROM wp_options WHERE option_name = 'woocommerce_paytr_payment_gateway_settings' LIMIT 1",
  );
  await wp.end();
  const blob = (rows as { option_value: string }[])[0]?.option_value;
  if (!blob) {
    console.log("PayTR WP settings not found — leave PAYTR_* empty in .env.");
    return;
  }

  const id = phpString(blob, "paytr_merchant_id");
  const key = phpString(blob, "paytr_merchant_key");
  const salt = phpString(blob, "paytr_merchant_salt");
  const test = phpString(blob, "paytr_test_mode") ?? phpString(blob, "test_mode") ?? "1";
  if (!id || !key || !salt) {
    console.log("PayTR fields incomplete in WP dump — skipped.");
    return;
  }

  const block = `
PAYTR_MERCHANT_ID=${id}
PAYTR_MERCHANT_KEY=${key}
PAYTR_MERCHANT_SALT=${salt}
PAYTR_TEST_MODE=${test === "0" ? "0" : "1"}
`;
  fs.appendFileSync(envPath, `\n# Copied from WP dump (local only)\n${block}`);
  console.log("PayTR keys written to .env (not printed).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
