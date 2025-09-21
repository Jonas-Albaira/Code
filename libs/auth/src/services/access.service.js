import { __decorate } from "tslib";
import { Injectable, ForbiddenException } from '@nestjs/common';
/**
 * Helper to centralize common access checks.
 * For this challenge we keep the rules simple.
 */
let AccessService = class AccessService {
    ensureOwnership(user, resource) {
        var _a;
        if (!user)
            throw new ForbiddenException('No user in request');
        const ownerId = (_a = resource === null || resource === void 0 ? void 0 : resource.createdBy) === null || _a === void 0 ? void 0 : _a.id;
        if (!ownerId || ownerId !== user.id)
            throw new ForbiddenException('Not the owner');
    }
    ensureOrgLevelAccess(user, resource) {
        if (!(user === null || user === void 0 ? void 0 : user.organization) || !(resource === null || resource === void 0 ? void 0 : resource.organization)) {
            throw new ForbiddenException('Org access denied');
        }
        const sameOrg = resource.organization.id === user.organization.id;
        const childOfUserOrg = resource.organization.parentId === user.organization.id;
        if (!(sameOrg || childOfUserOrg))
            throw new ForbiddenException('Outside of org scope');
    }
    /**
     * Scope a Task query builder to what the given user can see.
     */
    scopeTasksForUser(qb, user) {
        const roles = user.roles || [];
        qb.leftJoinAndSelect('task.organization', 'org')
            .leftJoinAndSelect('task.createdBy', 'creator')
            .leftJoinAndSelect('task.assignedTo', 'assignee');
        if (roles.includes('Owner') || roles.includes('Admin')) {
            qb.andWhere('(org.id = :oid OR org.parentId = :oid)', { oid: user.organization.id });
            return qb;
        }
        // Viewer
        qb.andWhere('(org.id = :oid) AND (creator.id = :uid OR assignee.id = :uid)', {
            oid: user.organization.id,
            uid: user.id,
        });
        return qb;
    }
};
AccessService = __decorate([
    Injectable()
], AccessService);
export { AccessService };
//# sourceMappingURL=access.service.js.map