import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, type: 'text' })
  name!: 'Owner' | 'Admin' | 'Viewer';

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions!: Permission[];

  @ManyToMany(() => User, user => user.roles)
  users!: User[];
}
