import { __awaiter, __decorate, __metadata, __param } from "tslib";
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuditService } from '@secure-task-manager/auth';
import { RolesGuard } from '@secure-task-manager/auth';
import { Roles } from '@secure-task-manager/auth';
import { Role } from '@secure-task-manager/auth';
let AuditController = class AuditController {
    constructor(audit) {
        this.audit = audit;
    }
    getAll(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Optionally, could scope to user's org here if needed
            return this.audit.all();
        });
    }
};
__decorate([
    Get(),
    Roles(Role.Owner, Role.Admin),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAll", null);
AuditController = __decorate([
    Controller('audit-log'),
    UseGuards(RolesGuard),
    __metadata("design:paramtypes", [AuditService])
], AuditController);
export { AuditController };
//# sourceMappingURL=audit.controller.js.map