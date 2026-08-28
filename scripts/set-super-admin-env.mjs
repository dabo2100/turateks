import fs from "node:fs";

const email = "a_fattah_m@icloud.com";
const password = "Admin@123";
const path = ".env";
let s = fs.readFileSync(path, "utf8");
if (!/^SUPER_ADMIN_EMAIL=/m.test(s)) {
  s += `\nSUPER_ADMIN_EMAIL="${email}"\nSUPER_ADMIN_PASSWORD="${password}"\n`;
  fs.writeFileSync(path, s);
  console.log("SUPER_ADMIN env appended");
} else {
  console.log("SUPER_ADMIN env already present");
}
