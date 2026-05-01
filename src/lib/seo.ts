export function toSafeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", String.raw`\u003c`);
}
