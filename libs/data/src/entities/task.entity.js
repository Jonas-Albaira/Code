import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["COMPLETED"] = "completed";
})(TaskStatus || (TaskStatus = {}));
let Task = class Task {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    Column({ type: 'text', default: TaskStatus.PENDING }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    ManyToOne(() => Organization, (org) => org.tasks, { eager: true }),
    Index(),
    __metadata("design:type", Organization)
], Task.prototype, "organization", void 0);
__decorate([
    ManyToOne(() => User, { nullable: true, eager: true }),
    Index(),
    __metadata("design:type", User)
], Task.prototype, "assignedTo", void 0);
__decorate([
    ManyToOne(() => User, { eager: true, nullable: false }),
    Index(),
    __metadata("design:type", User)
], Task.prototype, "createdBy", void 0);
Task = __decorate([
    Entity()
], Task);
export { Task };
//# sourceMappingURL=task.entity.js.map