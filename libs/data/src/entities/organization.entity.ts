import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  name!: string;

  @ManyToOne(() => Organization, (org) => org.children, { nullable: true })
  parent?: Organization | null;

  @OneToMany(() => Organization, (org) => org.parent)
  children!: Organization[];

  @OneToMany(() => User, (u) => u.organization)
  users!: User[];

  @OneToMany(() => Task, (t) => t.organization)
  tasks!: Task[];
}
