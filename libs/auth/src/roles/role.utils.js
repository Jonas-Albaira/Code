import { RoleHierarchy } from './role.enum';
/** Expand a given role into itself + inherited roles */
export function getAllRoles(role) {
    const seen = new Set();
    function dfs(r) {
        if (seen.has(r))
            return;
        seen.add(r);
        for (const child of RoleHierarchy[r])
            dfs(child);
    }
    dfs(role);
    return Array.from(seen);
}
//# sourceMappingURL=role.utils.js.map