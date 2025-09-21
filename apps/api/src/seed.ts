import { AppDataSource } from './data-source';
import { User, Task, Organization, TaskStatus } from '../../../libs/data/src';

async function seed() {
  await AppDataSource.initialize();

  const orgRepo = AppDataSource.getRepository(Organization);
  const userRepo = AppDataSource.getRepository(User);
  const taskRepo = AppDataSource.getRepository(Task);

  console.log('🧹 Clearing existing data...');
  await taskRepo.clear();
  await userRepo.clear();
  await orgRepo.clear();

  // Orgs
  const orgA = orgRepo.create({ name: 'Org A' });
  await orgRepo.save(orgA);

  const orgB = orgRepo.create({ name: 'Org B', parent: orgA });
  await orgRepo.save(orgB);

  // Users
  const owner = userRepo.create({
    email: 'owner@a.com',
    roles: ['Owner'],
    organization: orgA,
  });
  const admin = userRepo.create({
    email: 'admin@b.com',
    roles: ['Admin'],
    organization: orgB,
  });
  const viewer = userRepo.create({
    email: 'viewer@a.com',
    roles: ['Viewer'],
    organization: orgA,
  });
  await userRepo.save([owner, admin, viewer]);

  // Tasks
  await taskRepo.save([
    taskRepo.create({
      title: 'Org A task',
      organization: orgA,
      createdBy: owner,
      status: TaskStatus.PENDING,
    }),
    taskRepo.create({
      title: 'Child Org B task',
      organization: orgB,
      createdBy: admin,
      status: TaskStatus.IN_PROGRESS,
    }),
    taskRepo.create({
      title: 'Viewer personal task',
      organization: orgA,
      createdBy: viewer,
      assignedTo: viewer,
      status: TaskStatus.PENDING,
    }),
  ]);

  console.log('✅ Seeded sample orgs, users, and tasks');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
