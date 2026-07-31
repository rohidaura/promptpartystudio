export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTags(value: string) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
