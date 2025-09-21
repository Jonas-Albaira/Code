import { __awaiter, __decorate, __metadata } from "tslib";
import { Injectable, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Task } from '@secure-task-manager/data';
import { AccessService } from '@secure-task-manager/auth';
let TaskOwnershipGuard = class TaskOwnershipGuard {
    constructor(dataSource, accessService) {
        this.dataSource = dataSource;
        this.accessService = accessService;
        this.taskRepo = this.dataSource.getRepository(Task);
    }
    canActivate(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const req = context.switchToHttp().getRequest();
            const user = req.user;
            const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            if (!id)
                throw new ForbiddenException('Missing task id');
            const task = yield this.taskRepo.findOne({ where: { id }, relations: ['organization', 'createdBy', 'assignedTo'] });
            if (!task)
                throw new ForbiddenException('Task not found');
            try {
                // allow owner
                this.accessService.ensureOwnership(user, task);
                return true;
            }
            catch (_b) {
                // otherwise org-level
                this.accessService.ensureOrgLevelAccess(user, task);
                return true;
            }
        });
    }
};
TaskOwnershipGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DataSource, AccessService])
], TaskOwnershipGuard);
export { TaskOwnershipGuard };
//# sourceMappingURL=task-ownership.guard.js.map