import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', default: TaskStatus.PENDING })
  status!: TaskStatus;

  @ManyToOne(() => Organization, (org) => org.tasks, { eager: true })
  @Index()
  organization!: Organization;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @Index()
  assignedTo?: User | null;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @Index()
  createdBy!: User;
}
