// libs/auth/src/roles/role-hierarchy.ts
import { Role } from './role.enum';

export const RoleHierarchy: Record<Role, Role[]> = {
  [Role.Owner]: [Role.Admin, Role.Viewer],
  [Role.Admin]: [Role.Viewer],
  [Role.Viewer]: [],
};
