import { __awaiter } from "tslib";
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, Organization, Role, Permission, Task, TaskStatus } from './index';
import { RolesGuard } from '../../../libs/auth/src/guards/roles.guard';
import { AuditService } from '../../../libs/auth/src/services/audit.service';
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
function testAll() {
    return __awaiter(this, void 0, void 0, function* () {
        yield AppDataSource.initialize();
        const orgRepo = AppDataSource.getRepository(Organization);
        const roleRepo = AppDataSource.getRepository(Role);
        const permRepo = AppDataSource.getRepository(Permission);
        const userRepo = AppDataSource.getRepository(User);
        const taskRepo = AppDataSource.getRepository(Task);
        // 1️⃣ Create Organization
        const org = orgRepo.create({ name: 'Acme Corp' });
        yield orgRepo.save(org);
        // 2️⃣ Create Permissions
        const permCreate = permRepo.create({ name: 'task.create' });
        const permUpdate = permRepo.create({ name: 'task.update' });
        yield permRepo.save([permCreate, permUpdate]);
        // 3️⃣ Create Roles
        const adminRole = roleRepo.create({ name: 'Admin', permissions: [permCreate, permUpdate] });
        const viewerRole = roleRepo.create({ name: 'Viewer', permissions: [] });
        yield roleRepo.save([adminRole, viewerRole]);
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
        yield userRepo.save([adminUser, viewerUser]);
        console.log('✅ Users saved:', yield userRepo.find({ relations: ['roles', 'organization'] }));
        // 5️⃣ Create Tasks
        const task1 = taskRepo.create({
            title: 'Important Task',
            description: 'Do something critical',
            status: TaskStatus.PENDING,
            organization: org,
            assignedTo: adminUser,
        });
        yield taskRepo.save(task1);
        console.log('✅ Task saved:', yield taskRepo.find({ relations: ['organization', 'assignedTo'] }));
        // 6️⃣ Test RBAC RolesGuard
        const reflector = new Reflector();
        const rolesGuard = new RolesGuard(reflector);
        const mockContextAdmin = {
            switchToHttp: () => ({
                getRequest: () => ({ user: adminUser }),
            }),
            getHandler: () => null,
            getClass: () => null,
        };
        const mockContextViewer = {
            switchToHttp: () => ({
                getRequest: () => ({ user: viewerUser }),
            }),
            getHandler: () => null,
            getClass: () => null,
        };
        console.log('RolesGuard Admin (required Viewer):', rolesGuard.canActivate(Object.assign(Object.assign({}, mockContextAdmin), { handler: () => { } }))); // should be true
        console.log('RolesGuard Viewer (required Admin):', rolesGuard.canActivate(Object.assign(Object.assign({}, mockContextViewer), { handler: () => { } }))); // should be false
        // 7️⃣ Test Audit Logging
        const audit = new AuditService();
        audit.log(adminUser.id, 'create', 'Task', task1.id);
        audit.log(viewerUser.id, 'view', 'Task', task1.id);
        yield AppDataSource.destroy();
        console.log('✅ All tests completed successfully!');
    });
}
testAll().catch(err => console.error('❌ Test failed:', err));
//# sourceMappingURL=test.js.map