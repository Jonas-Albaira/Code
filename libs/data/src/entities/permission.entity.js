import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
let Permission = class Permission {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Permission.prototype, "id", void 0);
__decorate([
    Column({ unique: true, type: 'text' }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
Permission = __decorate([
    Entity()
], Permission);
export { Permission };
//# sourceMappingURL=permission.entity.js.map