import { __awaiter, __decorate, __metadata, __param } from "tslib";
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Task, Organization, User, TaskStatus } from '@secure-task-manager/data';
import { AuditService } from '@secure-task-manager/auth';
let TasksService = class TasksService {
    constructor(dataSource, audit) {
        this.dataSource = dataSource;
        this.audit = audit;
        this.taskRepo = this.dataSource.getRepository(Task);
        this.orgRepo = this.dataSource.getRepository(Organization);
        this.userRepo = this.dataSource.getRepository(User);
    }
    /**
     * Return tasks visible to the user based on role/org rules.
     */
    listVisibleTasks(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = user.roles || [];
            const qb = this.taskRepo.createQueryBuilder('task')
                .leftJoinAndSelect('task.organization', 'org')
                .leftJoinAndSelect('task.createdBy', 'creator')
                .leftJoinAndSelect('task.assignedTo', 'assignee');
            // Owner: see everything within their org and its direct children
            if (roles.includes('Owner')) {
                qb.where('org.id = :oid OR org.parentId = :oid', { oid: user.organization.id });
                return qb.orderBy('task.title', 'ASC').getMany();
            }
            // Admin: see in their org and its direct children
            if (roles.includes('Admin')) {
                qb.where('org.id = :oid OR org.parentId = :oid', { oid: user.organization.id });
                return qb.orderBy('task.title', 'ASC').getMany();
            }
            // Viewer: see tasks they created or are assigned to (still only within their org)
            qb.where('(creator.id = :uid OR assignee.id = :uid)', { uid: user.id })
                .andWhere('org.id = :oid', { oid: user.organization.id });
            return qb.orderBy('task.title', 'ASC').getMany();
        });
    }
    create(user, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Organization
            let organization = user.organization;
            if (dto.organizationId) {
                const org = yield this.orgRepo.findOne({ where: { id: dto.organizationId } });
                if (!org)
                    throw new NotFoundException('Organization not found');
                // Only Owner/Admin can create in child orgs they own/admin
                const isSameOrg = org.id === user.organization.id;
                const isChild = org.parentId === user.organization.id;
                if (!(isSameOrg || (isChild && (user.roles || []).some(r => r === 'Owner' || r === 'Admin')))) {
                    throw new ForbiddenException('Not allowed to create in this organization');
                }
                organization = org;
            }
            // Permission: only Owner/Admin can create; Viewer cannot
            if (!((user.roles || []).includes('Owner') || (user.roles || []).includes('Admin'))) {
                throw new ForbiddenException('Only Owner/Admin can create tasks');
            }
            // Optional assignment
            let assignedTo = null;
            if (dto.assignedToId) {
                assignedTo = yield this.userRepo.findOne({ where: { id: dto.assignedToId } });
                if (!assignedTo)
                    throw new NotFoundException('Assignee not found');
            }
            const task = this.taskRepo.create({
                title: (_a = dto.title) !== null && _a !== void 0 ? _a : 'Untitled Task',
                description: (_b = dto.description) !== null && _b !== void 0 ? _b : '',
                status: TaskStatus.PENDING,
                organization,
                assignedTo: assignedTo !== null && assignedTo !== void 0 ? assignedTo : null,
                createdBy: user,
            });
            const saved = yield this.taskRepo.save(task);
            this.audit.log(user.id, 'create', 'task', saved.id, { orgId: organization.id });
            return saved;
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepo.findOne({ where: { id }, relations: ['organization', 'createdBy', 'assignedTo'] });
            if (!task)
                throw new NotFoundException('Task not found');
            return task;
        });
    }
    /**
     * Ensure the user can modify (edit/delete) the task.
     */
    ensureCanModify(user, task) {
        var _a, _b;
        const roles = user.roles || [];
        const sameOrg = task.organization.id === user.organization.id;
        const isChildOfUserOrg = task.organization.parentId === user.organization.id;
        if (roles.includes('Owner')) {
            if (!(sameOrg || isChildOfUserOrg)) {
                throw new ForbiddenException('Owner cannot modify outside their org tree');
            }
            return;
        }
        if (roles.includes('Admin')) {
            if (!(sameOrg || isChildOfUserOrg)) {
                throw new ForbiddenException('Admin cannot modify outside their org or children');
            }
            return;
        }
        // Viewer: only if they created it or are assigned
        const isCreator = ((_a = task.createdBy) === null || _a === void 0 ? void 0 : _a.id) === user.id;
        const isAssignee = ((_b = task.assignedTo) === null || _b === void 0 ? void 0 : _b.id) === user.id;
        if (!(isCreator || isAssignee)) {
            throw new ForbiddenException('Not allowed');
        }
    }
    update(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.findOne(id);
            this.ensureCanModify(user, task);
            if (dto.title !== undefined)
                task.title = dto.title;
            if (dto.description !== undefined)
                task.description = dto.description;
            if (dto.status !== undefined)
                task.status = dto.status;
            if (dto.assignedToId !== undefined) {
                if (dto.assignedToId === null) {
                    task.assignedTo = null;
                }
                else {
                    const assignee = yield this.userRepo.findOne({ where: { id: dto.assignedToId } });
                    if (!assignee)
                        throw new NotFoundException('Assignee not found');
                    task.assignedTo = assignee;
                }
            }
            const saved = yield this.taskRepo.save(task);
            this.audit.log(user.id, 'update', 'task', saved.id);
            return saved;
        });
    }
    remove(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.findOne(id);
            this.ensureCanModify(user, task);
            yield this.taskRepo.delete(task.id);
            this.audit.log(user.id, 'delete', 'task', id);
            return { deleted: true };
        });
    }
};
TasksService = __decorate([
    Injectable(),
    __param(0, InjectDataSource()),
    __metadata("design:paramtypes", [DataSource,
        AuditService])
], TasksService);
export { TasksService };
//# sourceMappingURL=task.service.js.map