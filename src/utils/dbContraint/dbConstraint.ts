export function dbConstraintFail(constraint: string) {
  return `${constraint.split('_')[1]} already exists`;
}
