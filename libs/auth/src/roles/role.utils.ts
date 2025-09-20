import { Role, RoleHierarchy } from './role.enum';

/** Expand a given role into itself + inherited roles */
export function getAllRoles(role: Role): Role[] {
  const seen = new Set<Role>();
  function dfs(r: Role) {
    if (seen.has(r)) return;
    seen.add(r);
    for (const child of RoleHierarchy[r]) dfs(child);
  }
  dfs(role);
  return Array.from(seen);
}
