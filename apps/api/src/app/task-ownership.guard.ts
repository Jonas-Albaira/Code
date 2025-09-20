import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from '@secure-task-manager/data';
import { AccessService } from '@secure-task-manager/auth';

@Injectable()
export class TaskOwnershipGuard implements CanActivate {
  private taskRepo: Repository<Task>;

  constructor(private readonly dataSource: DataSource, private readonly accessService: AccessService) {
    this.taskRepo = this.dataSource.getRepository(Task);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const id = req.params?.id as string;
    if (!id) throw new ForbiddenException('Missing task id');

    const task = await this.taskRepo.findOne({ where: { id }, relations: ['organization', 'createdBy', 'assignedTo'] });
    if (!task) throw new ForbiddenException('Task not found');

    try {
      // allow owner
      this.accessService.ensureOwnership(user, task);
      return true;
    } catch {
      // otherwise org-level
      this.accessService.ensureOrgLevelAccess(user, task);
      return true;
    }
  }
}
