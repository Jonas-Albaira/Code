import { __awaiter, __decorate, __metadata, __param } from "tslib";
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './task.service';
import { PermissionsGuard, Permissions } from '@secure-task-manager/auth';
import { CreateTaskDto, UpdateTaskDto } from '@secure-task-manager/data';
let TasksController = class TasksController {
    constructor(tasks) {
        this.tasks = tasks;
    }
    // Create task (permission check via guard)
    create(req, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tasks.create(req.user, dto);
        });
    }
    // List tasks visible to the current user (role/org scoped)
    list(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tasks.listVisibleTasks(req.user);
        });
    }
    // Edit task
    update(id, req, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tasks.update(req.user, id, dto);
        });
    }
    // Delete task
    remove(id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tasks.remove(req.user, id);
        });
    }
};
__decorate([
    Post(),
    Permissions('task:create'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "list", null);
__decorate([
    Put(':id'),
    Permissions('task:edit'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Permissions('task:delete'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
TasksController = __decorate([
    Controller('tasks'),
    UseGuards(PermissionsGuard),
    __metadata("design:paramtypes", [TasksService])
], TasksController);
export { TasksController };
//# sourceMappingURL=tasks.controller.js.map