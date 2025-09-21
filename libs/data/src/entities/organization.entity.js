import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';
let Organization = class Organization {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Organization.prototype, "id", void 0);
__decorate([
    Column({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    ManyToOne(() => Organization, (org) => org.children, { nullable: true }),
    __metadata("design:type", Organization)
], Organization.prototype, "parent", void 0);
__decorate([
    OneToMany(() => Organization, (org) => org.parent),
    __metadata("design:type", Array)
], Organization.prototype, "children", void 0);
__decorate([
    OneToMany(() => User, (u) => u.organization),
    __metadata("design:type", Array)
], Organization.prototype, "users", void 0);
__decorate([
    OneToMany(() => Task, (t) => t.organization),
    __metadata("design:type", Array)
], Organization.prototype, "tasks", void 0);
Organization = __decorate([
    Entity()
], Organization);
export { Organization };
//# sourceMappingURL=organization.entity.js.map