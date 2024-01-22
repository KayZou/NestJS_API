import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { TaskStatus } from './task.model';
import { SearchTaskDto } from './dto/SearchTask.dto';
import { query } from 'express';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';
@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksController');
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async getAllTasks(
    { status, search }: SearchTaskDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();

    if (!tasks?.length) {
      throw new NotFoundException(`Couldn't retrieve tasks`);
    }
    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`Couldn't retrieve task with id; ${id}`);
    }
    return task;
  }
  async createTask(
    createTaskDTO: CreateTaskDto,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.create({ title, description, status, user });
    await task.save();
    if (!task) {
      throw new Error(`Couldn't create the task`);
    }
    return task;
  }
  async updateTask(
    id: string,
    createTaskDTO: CreateTaskDto,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task2update = await this.getTaskById(id, user);
    const { title, description } = createTaskDTO;
    task2update.title = title;
    task2update.description = description;
    task2update.status = status;
    await task2update.save();
    if (!task2update) {
      throw new Error(`Couldn't update this task!`);
    }
    return task2update;
  }
  async deleteTask(id: string, user: User) {
    const res = await this.delete({ id, user });
    if (res.affected === 0) {
      throw new NotFoundException(`Couldn't delete task with id; ${id}`);
    }
  }
}
