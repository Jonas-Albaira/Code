import { __awaiter } from "tslib";
import { AppDataSource } from './data-source';
import { User, Task, Organization, TaskStatus } from '@secure-task-manager/data';
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield AppDataSource.initialize();
        const orgRepo = AppDataSource.getRepository(Organization);
        const userRepo = AppDataSource.getRepository(User);
        const taskRepo = AppDataSource.getRepository(Task);
        const orgA = orgRepo.create({ name: 'Org A' });
        yield orgRepo.save(orgA);
        const orgB = orgRepo.create({ name: 'Org B', parent: orgA });
        yield orgRepo.save(orgB);
        const owner = userRepo.create({ email: 'owner@a.com', roles: ['Owner'], organization: orgA });
        const admin = userRepo.create({ email: 'admin@b.com', roles: ['Admin'], organization: orgB });
        const viewer = userRepo.create({ email: 'viewer@a.com', roles: ['Viewer'], organization: orgA });
        yield userRepo.save([owner, admin, viewer]);
        yield taskRepo.save([
            taskRepo.create({ title: 'Org A task', organization: orgA, createdBy: owner, status: TaskStatus.PENDING }),
            taskRepo.create({ title: 'Child Org B task', organization: orgB, createdBy: admin, status: TaskStatus.IN_PROGRESS }),
            taskRepo.create({ title: 'Viewer personal task', organization: orgA, createdBy: viewer, assignedTo: viewer, status: TaskStatus.PENDING }),
        ]);
        console.log('✅ Seeded sample orgs, users, and tasks');
        yield AppDataSource.destroy();
    });
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map