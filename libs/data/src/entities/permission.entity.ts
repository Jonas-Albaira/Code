import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true , type: 'text'})
  name!: string; // e.g., 'task.create', 'task.update', 'task.delete'
}
