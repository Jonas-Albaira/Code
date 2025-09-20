import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../roles/role.enum';
import { getAllRoles } from '../roles/role.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    // Support both single role and array of roles
    const baseRoles: Role[] = Array.isArray(user?.roles) ? user.roles : (user?.role ? [user.role] : []);
    const userRoles = Array.from(new Set(baseRoles.flatMap(r => getAllRoles(r))));

    // ✅ deny if none of the required roles are in user's role hierarchy
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
