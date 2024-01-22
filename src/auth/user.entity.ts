import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { OneToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @OneToOne((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
