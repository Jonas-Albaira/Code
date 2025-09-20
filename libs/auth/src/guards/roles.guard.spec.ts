import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { Role } from '../roles/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {getAllRoles} from "../roles/role.utils";

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function mockContext(userRole: Role) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: userRole } }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  it('should allow Owner to access Admin route', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [Role.Admin];
      return [];
    });

    expect(guard.canActivate(mockContext(Role.Owner))).toBe(true);
  });

  it('should deny Viewer on Admin route', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [Role.Admin];
      return [];
    });

    expect(guard.canActivate(mockContext(Role.Viewer))).toBe(false);
  });

  it('should allow Admin on Viewer route', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [Role.Viewer];
      return [];
    });

    expect(guard.canActivate(mockContext(Role.Admin))).toBe(true);
  });

  console.log('getAllRoles(Viewer):', getAllRoles(Role.Viewer));
});
