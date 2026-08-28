import { createHmac } from "node:crypto";

export function paytrConfigured() {
  return Boolean(
    process.env.PAYTR_MERCHANT_ID &&
      process.env.PAYTR_MERCHANT_KEY &&
      process.env.PAYTR_MERCHANT_SALT,
  );
}

export function paytrTestMode() {
  return process.env.PAYTR_TEST_MODE === "1" ? "1" : "0";
}

export function paytrIframeToken(params: {
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: number;
  userBasket: string;
  noInstallment: number;
  maxInstallment: number;
  currency: string;
}) {
  const merchantId = process.env.PAYTR_MERCHANT_ID!;
  const key = process.env.PAYTR_MERCHANT_KEY!;
  const salt = process.env.PAYTR_MERCHANT_SALT!;
  const testMode = paytrTestMode();
  const hashStr =
    merchantId +
    params.userIp +
    params.merchantOid +
    params.email +
    String(params.paymentAmount) +
    params.userBasket +
    String(params.noInstallment) +
    String(params.maxInstallment) +
    params.currency +
    testMode;
  return Buffer.from(
    createHmac("sha256", key)
      .update(hashStr + salt)
      .digest(),
  ).toString("base64");
}

export function paytrCallbackValid(params: {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
}) {
  const key = process.env.PAYTR_MERCHANT_KEY!;
  const salt = process.env.PAYTR_MERCHANT_SALT!;
  const expected = Buffer.from(
    createHmac("sha256", key)
      .update(params.merchantOid + salt + params.status + params.totalAmount)
      .digest(),
  ).toString("base64");
  return expected === params.hash;
}
