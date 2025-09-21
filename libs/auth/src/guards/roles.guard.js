import { __decorate, __metadata } from "tslib";
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { getAllRoles } from '../roles/role.utils';
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles)
            return true;
        const { user } = context.switchToHttp().getRequest();
        // Support both single role and array of roles
        const baseRoles = Array.isArray(user === null || user === void 0 ? void 0 : user.roles) ? user.roles : ((user === null || user === void 0 ? void 0 : user.role) ? [user.role] : []);
        const userRoles = Array.from(new Set(baseRoles.flatMap(r => getAllRoles(r))));
        // ✅ deny if none of the required roles are in user's role hierarchy
        return requiredRoles.some((role) => userRoles.includes(role));
    }
};
RolesGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector])
], RolesGuard);
export { RolesGuard };
//# sourceMappingURL=roles.guard.js.map