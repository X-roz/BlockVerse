export function isExpired(exp: number) {
  return Math.floor(Date.now() / 1000) > exp;
}
