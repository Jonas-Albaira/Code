import { DataSource } from 'typeorm';
import { User, Task, Organization } from '@secure-task-manager/data';

export const AppDataSource = new DataSource({
  type: 'sqlite', // or 'postgres'
  database: 'db.sqlite',
  entities: [User, Task, Organization],
  synchronize: true, // dev only
});
