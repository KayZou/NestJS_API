import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { SearchTaskDto } from './dto/SearchTask.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDecorator } from '../auth/GetUser.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query() searchDTO: SearchTaskDto,
    @GetUserDecorator() user: User,
  ): Promise<Task[]> {
    console.log(searchDTO);
    return this.tasksService.getAllTasks(searchDTO, user);
  }
  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUserDecorator() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }
  @Post()
  createTask(
    @Body() createTaskDTO: CreateTaskDto,
    @Body('status') status: TaskStatus,
    @GetUserDecorator() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO, status, user);
  }
  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() createTaskDTO: CreateTaskDto,
    @Body('status') status: TaskStatus,
    @GetUserDecorator() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, createTaskDTO, status, user);
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string, user: User) {
    return this.tasksService.deleteTask(id, user);
  }
}
