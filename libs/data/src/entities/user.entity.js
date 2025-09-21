import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
let User = class User {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: 'text', unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column('simple-array'),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    ManyToOne(() => Organization, (org) => org.users, { eager: true, nullable: false }),
    __metadata("design:type", Organization)
], User.prototype, "organization", void 0);
User = __decorate([
    Entity()
], User);
export { User };
//# sourceMappingURL=user.entity.js.map