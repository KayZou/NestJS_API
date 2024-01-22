import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task.model';
import { SearchTaskDto } from './dto/SearchTask.dto';
import { query } from 'express';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}
  async getAllTasks(searchDTO: SearchTaskDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getAllTasks(searchDTO, user);
  }
  async getTaskById(id: string, user: User): Promise<Task> {
    return this.tasksRepository.getTaskById(id, user);
  }
  async createTask(
    createTaskDTO: CreateTaskDto,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO, status, user);
  }
  async updateTask(
    id: string,
    createTaskDTO: CreateTaskDto,
    status: TaskStatus,
    user: User,
  ) {
    return this.tasksRepository.updateTask(id, createTaskDTO, status, user);
  }
  async deleteTask(id: string, user: User) {
    return this.tasksRepository.deleteTask(id, user);
  }
}
