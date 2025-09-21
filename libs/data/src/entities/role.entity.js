import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';
let Role = class Role {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    Column({ unique: true, type: 'text' }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    ManyToMany(() => Permission),
    JoinTable(),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
__decorate([
    ManyToMany(() => User, user => user.roles),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
Role = __decorate([
    Entity()
], Role);
export { Role };
//# sourceMappingURL=role.entity.js.map