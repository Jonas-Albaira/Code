import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column('simple-array')
  roles!: string[]; // 'Owner' | 'Admin' | 'Viewer'

  @ManyToOne(() => Organization, (org) => org.users, { eager: true, nullable: false })
  organization!: Organization;
}
