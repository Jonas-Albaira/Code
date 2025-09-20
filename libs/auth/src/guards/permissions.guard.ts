import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Very simple permission system for the challenge.
 * Grants permissions derived from the user's roles:
 * - Owner: task:view, task:create, task:edit, task:delete
 * - Admin: task:view, task:edit
 * - Viewer: task:view
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as { roles?: string[] } | undefined;
    const roles: string[] = Array.isArray(user?.roles) ? user!.roles : (user ? [(user as any).role] : []);

    const userPermissions = new Set<string>();
    roles.forEach((role) => {
      if (role === 'Owner') {
        userPermissions.add('task:view');
        userPermissions.add('task:create');
        userPermissions.add('task:edit');
        userPermissions.add('task:delete');
      }
      if (role === 'Admin') {
        userPermissions.add('task:view');
        userPermissions.add('task:edit');
      }
      if (role === 'Viewer') {
        userPermissions.add('task:view');
      }
    });

    return requiredPermissions.every((p) => userPermissions.has(p));
  }
}
