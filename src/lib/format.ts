/**
 * Formatea una lista de nombres al estilo español: "A", "A y B", "A, B y C".
 * Usado para mostrar autor + coautores de un libro.
 */
export function formatAuthorList(names: string[]): string {
  const list = names.filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} y ${list[list.length - 1]}`;
}
