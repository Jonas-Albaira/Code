import { AccessService } from './access.service';
import { ForbiddenException } from '@nestjs/common';
describe('AccessService', () => {
    let service;
    beforeEach(() => {
        service = new AccessService();
    });
    it('allows owner access', () => {
        const user = { id: '123' };
        const resource = { owner: { id: '123' } };
        expect(service.ensureOwnership(user, resource)).toBe(true);
    });
    it('denies non-owner access', () => {
        const user = { id: '123' };
        const resource = { owner: { id: '456' } };
        expect(() => service.ensureOwnership(user, resource)).toThrow(ForbiddenException);
    });
    it('allows org member', () => {
        const user = { id: '123', organization: { id: '1' }, roles: [] };
        const resource = { organization: { id: '1' } };
        expect(service.ensureOrgLevelAccess(user, resource)).toBe(true);
    });
    it('denies different org without admin role', () => {
        const user = { id: '123', organization: { id: '1' }, roles: [] };
        const resource = { organization: { id: '2' } };
        expect(() => service.ensureOrgLevelAccess(user, resource)).toThrow(ForbiddenException);
    });
});
//# sourceMappingURL=access.service.spec.js.map