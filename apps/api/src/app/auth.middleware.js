import { __awaiter, __decorate, __metadata, __param } from "tslib";
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '@secure-task-manager/data';
/**
 * Very basic "auth" for the challenge:
 * - Reads X-User-Id from headers and attaches the matching User entity to req.user
 * - If absent, falls back to the first user in the database (useful for local dev).
 * DO NOT use in production.
 */
let HeaderAuthMiddleware = class HeaderAuthMiddleware {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.userRepo = this.dataSource.getRepository(User);
    }
    use(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (req.headers['x-user-id'] || req.headers['X-User-Id'] || '');
                if (id) {
                    const user = yield this.userRepo.findOne({ where: { id }, relations: ['organization'] });
                    if (user) {
                        req.user = user;
                        return next();
                    }
                }
                // Fallback to first user for local testing
                const first = yield this.userRepo.find({ take: 1, relations: ['organization'] });
                if (first.length)
                    req.user = first[0];
            }
            catch (e) {
                // ignore
            }
            next();
        });
    }
};
HeaderAuthMiddleware = __decorate([
    Injectable(),
    __param(0, InjectDataSource()),
    __metadata("design:paramtypes", [DataSource])
], HeaderAuthMiddleware);
export { HeaderAuthMiddleware };
//# sourceMappingURL=auth.middleware.js.map