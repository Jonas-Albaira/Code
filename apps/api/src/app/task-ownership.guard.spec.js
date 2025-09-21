import { __awaiter } from "tslib";
import { TaskOwnershipGuard } from './task-ownership.guard';
import { AccessService } from '../../../../libs/auth/src/services/access.service';
import { ForbiddenException } from '@nestjs/common';
describe('TaskOwnershipGuard', () => {
    let guard;
    let mockRepo;
    let access;
    beforeEach(() => {
        access = new AccessService();
        mockRepo = {
            findOne: jest.fn().mockResolvedValue({ id: 't1', owner: { id: '123' }, organization: { id: '1' } }),
        };
        const mockDS = { getRepository: () => mockRepo };
        guard = new TaskOwnershipGuard(mockDS, access);
    });
    it('grants access if user owns task', () => __awaiter(void 0, void 0, void 0, function* () {
        const ctx = {
            switchToHttp: () => ({
                getRequest: () => ({ params: { id: 't1' }, user: { id: '123' } }),
            }),
        };
        yield expect(guard.canActivate(ctx)).resolves.toBe(true);
    }));
    it('denies if user is not owner or org admin', () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.findOne.mockResolvedValue({ id: 't1', owner: { id: '456' }, organization: { id: '2' } });
        const ctx = {
            switchToHttp: () => ({
                getRequest: () => ({ params: { id: 't1' }, user: { id: '123', organization: { id: '1' }, roles: [] } }),
            }),
        };
        yield expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    }));
});
//# sourceMappingURL=task-ownership.guard.spec.js.map