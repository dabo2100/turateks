export function tryToKurus(tryAmount: number) {
  return Math.round(tryAmount * 100);
}

export function kurusToTry(kurus: number) {
  return kurus / 100;
}
