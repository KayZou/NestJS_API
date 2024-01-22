import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './task.repository';
import { TaskStatus } from './task.model';

const mockTasksRepository = () => ({
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  id: 'someId',
  username: 'hamid',
  password: 'hamid',
  tasks: [],
};

describe('Tasks service', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('Get tasks', () => {
    it('calls TasksRepository.getAllTasks and returns an array of all tasks for the authenticated user', async () => {
      tasksRepository.getAllTasks.mockResolvedValue([]);
      const res = await tasksService.getAllTasks(null, mockUser);
      expect(tasksRepository.getAllTasks).toHaveBeenCalled();
      expect(res).toEqual([]);
    });
  });

  describe('Get task by ID', () => {
    it('calls TasksRepository.findOne and returns a task with the specified id for the authenticated user', async () => {
      const mockTask = {
        id: 'someId',
        title: 'task',
        description: 'task',
        status: TaskStatus.OPEN,
      };

      tasksRepository.getTaskById.mockResolvedValue(mockTask);
      const res = await tasksService.getTaskById('someId', mockUser);
      expect(res).toEqual(mockTask);
    });
  });
});
