import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Task, Organization, User, TaskStatus } from '@secure-task-manager/data';
import { AuditService } from '@secure-task-manager/auth';
import { CreateTaskDto, UpdateTaskDto } from '@secure-task-manager/data';

@Injectable()
export class TasksService {
  private readonly taskRepo: Repository<Task>;
  private readonly orgRepo: Repository<Organization>;
  private readonly userRepo: Repository<User>;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {
    this.taskRepo = this.dataSource.getRepository(Task);
    this.orgRepo = this.dataSource.getRepository(Organization);
    this.userRepo = this.dataSource.getRepository(User);
  }

  /**
   * Return tasks visible to the user based on role/org rules.
   */
  async listVisibleTasks(user: User): Promise<Task[]> {
    const roles = user.roles || [];
    const qb = this.taskRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.organization', 'org')
      .leftJoinAndSelect('task.createdBy', 'creator')
      .leftJoinAndSelect('task.assignedTo', 'assignee');

    // Owner: see everything within their org and its direct children
    if (roles.includes('Owner')) {
      qb.where('org.id = :oid OR org.parentId = :oid', { oid: user.organization.id });
      return qb.orderBy('task.title', 'ASC').getMany();
    }

    // Admin: see in their org and its direct children
    if (roles.includes('Admin')) {
      qb.where('org.id = :oid OR org.parentId = :oid', { oid: user.organization.id });
      return qb.orderBy('task.title', 'ASC').getMany();
    }

    // Viewer: see tasks they created or are assigned to (still only within their org)
    qb.where('(creator.id = :uid OR assignee.id = :uid)', { uid: user.id })
      .andWhere('org.id = :oid', { oid: user.organization.id });

    return qb.orderBy('task.title', 'ASC').getMany();
  }

  async create(user: User, dto: CreateTaskDto): Promise<Task> {
    // Organization
    let organization = user.organization;
    if (dto.organizationId) {
      const org = await this.orgRepo.findOne({ where: { id: dto.organizationId } });
      if (!org) throw new NotFoundException('Organization not found');
      // Only Owner/Admin can create in child orgs they own/admin
      const isSameOrg = org.id === user.organization.id;
      const isChild = (org as any).parentId === user.organization.id;
      if (!(isSameOrg || (isChild && (user.roles || []).some(r => r === 'Owner' || r === 'Admin')))) {
        throw new ForbiddenException('Not allowed to create in this organization');
      }
      organization = org;
    }

    // Permission: only Owner/Admin can create; Viewer cannot
    if (!((user.roles || []).includes('Owner') || (user.roles || []).includes('Admin'))) {
      throw new ForbiddenException('Only Owner/Admin can create tasks');
    }

    // Optional assignment
    let assignedTo: User | null = null;
    if (dto.assignedToId) {
      assignedTo = await this.userRepo.findOne({ where: { id: dto.assignedToId } });
      if (!assignedTo) throw new NotFoundException('Assignee not found');
    }

    const task = this.taskRepo.create({
      title: dto.title ?? 'Untitled Task',
      description: dto.description ?? '',
      status: TaskStatus.PENDING,
      organization,
      assignedTo: assignedTo ?? null,
      createdBy: user,
    });

    const saved = await this.taskRepo.save(task);
    this.audit.log(user.id, 'create', 'task', saved.id, { orgId: organization.id });
    return saved;
  }

  private async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['organization', 'createdBy', 'assignedTo'] });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  /**
   * Ensure the user can modify (edit/delete) the task.
   */
  private ensureCanModify(user: User, task: Task) {
    const roles = user.roles || [];
    const sameOrg = task.organization.id === user.organization.id;
    const isChildOfUserOrg = (task.organization as any).parentId === user.organization.id;

    if (roles.includes('Owner')) {
      if (!(sameOrg || isChildOfUserOrg)) {
        throw new ForbiddenException('Owner cannot modify outside their org tree');
      }
      return;
    }

    if (roles.includes('Admin')) {
      if (!(sameOrg || isChildOfUserOrg)) {
        throw new ForbiddenException('Admin cannot modify outside their org or children');
      }
      return;
    }

    // Viewer: only if they created it or are assigned
    const isCreator = task.createdBy?.id === user.id;
    const isAssignee = task.assignedTo?.id === user.id;
    if (!(isCreator || isAssignee)) {
      throw new ForbiddenException('Not allowed');
    }
  }

  async update(user: User, id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    this.ensureCanModify(user, task);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status as TaskStatus;

    if (dto.assignedToId !== undefined) {
      if (dto.assignedToId === null) {
        task.assignedTo = null;
      } else {
        const assignee = await this.userRepo.findOne({ where: { id: dto.assignedToId } });
        if (!assignee) throw new NotFoundException('Assignee not found');
        task.assignedTo = assignee;
      }
    }

    const saved = await this.taskRepo.save(task);
    this.audit.log(user.id, 'update', 'task', saved.id);
    return saved;
  }

  async remove(user: User, id: string): Promise<{ deleted: true }> {
    const task = await this.findOne(id);
    this.ensureCanModify(user, task);
    await this.taskRepo.delete(task.id);
    this.audit.log(user.id, 'delete', 'task', id);
    return { deleted: true };
  }
}
