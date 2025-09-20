import { getAllRoles } from './role.utils';
import { Role } from './role.enum';

describe('getAllRoles', () => {
  it('should return just Viewer for Viewer', () => {
    const roles = getAllRoles(Role.Viewer);
    expect(roles).toEqual([Role.Viewer]);
  });

  it('should return Admin + Viewer for Admin', () => {
    const roles = getAllRoles(Role.Admin);
    expect(new Set(roles)).toEqual(new Set([Role.Admin, Role.Viewer]));
  });

  it('should return Owner + Admin + Viewer for Owner', () => {
    const roles = getAllRoles(Role.Owner);
    expect(new Set(roles)).toEqual(new Set([Role.Owner, Role.Admin, Role.Viewer]));
  });

  it('should not duplicate roles if already inherited', () => {
    const roles = getAllRoles(Role.Owner);
    const uniqueRoles = new Set(roles);
    expect(roles.length).toBe(uniqueRoles.size);
  });
});
