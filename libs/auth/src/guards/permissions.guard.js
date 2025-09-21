import { __decorate, __metadata } from "tslib";
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
/**
 * Very simple permission system for the challenge.
 * Grants permissions derived from the user's roles:
 * - Owner: task:view, task:create, task:edit, task:delete
 * - Admin: task:view, task:edit
 * - Viewer: task:view
 */
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const roles = Array.isArray(user === null || user === void 0 ? void 0 : user.roles) ? user.roles : (user ? [user.role] : []);
        const userPermissions = new Set();
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
};
PermissionsGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector])
], PermissionsGuard);
export { PermissionsGuard };
//# sourceMappingURL=permissions.guard.js.map