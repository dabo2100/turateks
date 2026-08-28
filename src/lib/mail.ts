import nodemailer from "nodemailer";

function smtpUser() {
  return process.env.SMTP_USER || "";
}

function smtpPass() {
  return process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "";
}

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && smtpUser() && smtpPass());
}

function smtpSecure() {
  const raw = (process.env.SMTP_SECURE || "").toLowerCase();
  if (raw === "1" || raw === "true") return true;
  if (raw === "0" || raw === "false") return false;
  return Number(process.env.SMTP_PORT || 587) === 465;
}

async function sendTextEmail(to: string, subject: string, text: string, replyTo?: string) {
  if (!smtpReady()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP_NOT_CONFIGURED");
    }
    console.info(`[mail] SMTP yok — ${to}\n${subject}\n${text}`);
    return { queued: false, logged: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: smtpSecure(),
    auth: {
      user: smtpUser(),
      pass: smtpPass(),
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || smtpUser(),
    to,
    replyTo,
    subject,
    text,
  });
  return { queued: true, logged: false };
}

export async function sendOtpEmail(to: string, code: string, purpose: "login" | "checkout") {
  const subject =
    purpose === "checkout"
      ? "Turateks Yağmurluk — ödeme doğrulama kodu"
      : "Turateks Yağmurluk — giriş kodu";
  const text = `Doğrulama kodunuz: ${code}\n\nKod 10 dakika geçerlidir.\nBu e-postayı siz istemediyseniz yok sayın.`;
  return sendTextEmail(to, subject, text);
}

export async function sendAdminResetEmail(to: string, resetUrl: string) {
  const subject = "Turateks — yönetici şifre sıfırlama";
  const text = `Şifrenizi sıfırlamak için bu bağlantıyı açın:\n\n${resetUrl}\n\nBağlantı 1 saat geçerlidir. Siz istemediyseniz yok sayın.`;
  return sendTextEmail(to, subject, text);
}

export async function sendContactEmail(input: {
  to: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const subject = `Turateks iletişim formu — ${input.name}`;
  const text = `Ad: ${input.name}\nE-posta: ${input.email}\nTelefon: ${input.phone}\n\n${input.message}`;
  return sendTextEmail(input.to, subject, text, input.email);
}
