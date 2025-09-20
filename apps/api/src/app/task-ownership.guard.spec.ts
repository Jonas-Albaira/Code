import { TaskOwnershipGuard } from './task-ownership.guard';
import { AccessService } from '../../../../libs/auth/src/services/access.service';
import { ForbiddenException } from '@nestjs/common';

describe('TaskOwnershipGuard', () => {
  let guard: TaskOwnershipGuard;
  let mockRepo: any;
  let access: AccessService;

  beforeEach(() => {
    access = new AccessService();
    mockRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 't1', owner: { id: '123' }, organization: { id: '1' } }),
    };
    const mockDS: any = { getRepository: () => mockRepo };
    guard = new TaskOwnershipGuard(mockDS, access);
  });

  it('grants access if user owns task', async () => {
    const ctx: any = {
      switchToHttp: () => ({
        getRequest: () => ({ params: { id: 't1' }, user: { id: '123' } }),
      }),
    };
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('denies if user is not owner or org admin', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 't1', owner: { id: '456' }, organization: { id: '2' } });
    const ctx: any = {
      switchToHttp: () => ({
        getRequest: () => ({ params: { id: 't1' }, user: { id: '123', organization: { id: '1' }, roles: [] } }),
      }),
    };
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });
});
