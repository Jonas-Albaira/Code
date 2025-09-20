// libs/auth/src/roles/role.enum.ts
export enum Role {
  Owner = 'Owner',
  Admin = 'Admin',
  Viewer = 'Viewer',
}
// Define which roles inherit from which
export const RoleHierarchy: Record<Role, Role[]> = {
  [Role.Owner]: [Role.Admin, Role.Viewer],
  [Role.Admin]: [Role.Viewer],
  [Role.Viewer]: [],
};
