import { Injectable, ForbiddenException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Task } from '@secure-task-manager/data';
import { Organization } from '@secure-task-manager/data';
import { User } from '@secure-task-manager/data';

/**
 * Helper to centralize common access checks.
 * For this challenge we keep the rules simple.
 */
@Injectable()
export class AccessService {
  ensureOwnership(user: User, resource: { createdBy?: User }) {
    if (!user) throw new ForbiddenException('No user in request');
    const ownerId = resource?.createdBy?.id;
    if (!ownerId || ownerId !== user.id) throw new ForbiddenException('Not the owner');
  }

  ensureOrgLevelAccess(user: User, resource: { organization?: Organization }) {
    if (!user?.organization || !resource?.organization) {
      throw new ForbiddenException('Org access denied');
    }
    const sameOrg = resource.organization.id === user.organization.id;
    const childOfUserOrg = (resource.organization as any).parentId === user.organization.id;
    if (!(sameOrg || childOfUserOrg)) throw new ForbiddenException('Outside of org scope');
  }

  /**
   * Scope a Task query builder to what the given user can see.
   */
  scopeTasksForUser(qb: SelectQueryBuilder<Task>, user: User): SelectQueryBuilder<Task> {
    const roles = user.roles || [];
    qb.leftJoinAndSelect('task.organization', 'org')
      .leftJoinAndSelect('task.createdBy', 'creator')
      .leftJoinAndSelect('task.assignedTo', 'assignee');

    if (roles.includes('Owner') || roles.includes('Admin')) {
      qb.andWhere('(org.id = :oid OR org.parentId = :oid)', { oid: user.organization.id });
      return qb;
    }

    // Viewer
    qb.andWhere('(org.id = :oid) AND (creator.id = :uid OR assignee.id = :uid)', {
      oid: user.organization.id,
      uid: user.id,
    });
    return qb;
  }
}
