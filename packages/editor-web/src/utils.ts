export function formatId(id: string | number, length = 3): string {
  return id.toString().padStart(length, '0');
}
