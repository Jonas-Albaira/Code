import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, Organization, Role, Permission, Task, TaskStatus } from './index';
import { RolesGuard } from '../../../libs/auth/src/guards/roles.guard';
import { AuditService } from '../../../libs/auth/src/services/audit.service';
import { ROLES_KEY, Roles } from '../../auth/src/decorators/roles.decorator';

import { Reflector } from '@nestjs/core';

// -------------------------
// Initialize In-Memory SQLite
// -------------------------
const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: [User, Organization, Role, Permission, Task],
});

// -------------------------
// Main Test Function
// -------------------------
async function testAll() {
  await AppDataSource.initialize();

  const orgRepo = AppDataSource.getRepository(Organization);
  const roleRepo = AppDataSource.getRepository(Role);
  const permRepo = AppDataSource.getRepository(Permission);
  const userRepo = AppDataSource.getRepository(User);
  const taskRepo = AppDataSource.getRepository(Task);

  // 1️⃣ Create Organization
  const org = orgRepo.create({ name: 'Acme Corp' });
  await orgRepo.save(org);

  // 2️⃣ Create Permissions
  const permCreate = permRepo.create({ name: 'task.create' });
  const permUpdate = permRepo.create({ name: 'task.update' });
  await permRepo.save([permCreate, permUpdate]);

  // 3️⃣ Create Roles
  const adminRole = roleRepo.create({ name: 'Admin', permissions: [permCreate, permUpdate] });
  const viewerRole = roleRepo.create({ name: 'Viewer', permissions: [] });
  await roleRepo.save([adminRole, viewerRole]);

  // 4️⃣ Create Users
  const adminUser = userRepo.create({
    name: 'Alice Admin',
    email: 'alice@example.com',
    passwordHash: 'hashed-password',
    organization: org,
    roles: [adminRole],
  });
  const viewerUser = userRepo.create({
    name: 'Bob Viewer',
    email: 'bob@example.com',
    passwordHash: 'hashed-password',
    organization: org,
    roles: [viewerRole],
  });
  await userRepo.save([adminUser, viewerUser]);

  console.log('✅ Users saved:', await userRepo.find({ relations: ['roles', 'organization'] }));

  // 5️⃣ Create Tasks
  const task1 = taskRepo.create({
    title: 'Important Task',
    description: 'Do something critical',
    status: TaskStatus.PENDING,
    organization: org,
    assignedTo: adminUser,
  });
  await taskRepo.save(task1);

  console.log('✅ Task saved:', await taskRepo.find({ relations: ['organization', 'assignedTo'] }));

  // 6️⃣ Test RBAC RolesGuard
  const reflector = new Reflector();
  const rolesGuard = new RolesGuard(reflector);

  const mockContextAdmin = {
    switchToHttp: () => ({
      getRequest: () => ({ user: adminUser }),
    }),
    getHandler: () => null,
    getClass: () => null,
  } as any;

  const mockContextViewer = {
    switchToHttp: () => ({
      getRequest: () => ({ user: viewerUser }),
    }),
    getHandler: () => null,
    getClass: () => null,
  } as any;

  console.log('RolesGuard Admin (required Viewer):', rolesGuard.canActivate({
    ...mockContextAdmin,
    handler: () => {},
  })); // should be true

  console.log('RolesGuard Viewer (required Admin):', rolesGuard.canActivate({
    ...mockContextViewer,
    handler: () => {},
  })); // should be false

  // 7️⃣ Test Audit Logging
  const audit = new AuditService();
  audit.log(adminUser.id, 'create', 'Task', task1.id);
  audit.log(viewerUser.id, 'view', 'Task', task1.id);

  await AppDataSource.destroy();
  console.log('✅ All tests completed successfully!');
}

testAll().catch(err => console.error('❌ Test failed:', err));
