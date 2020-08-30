import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilterDto } from './dto/get-tasks.filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException, Delete } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = { id: 12 ,username: 'Test user1'};
const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository},
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository',  async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');


            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const fileter: GetTaskFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some reach  query'}
            const result = await tasksService.getTask(fileter, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue')


        })
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = { title: 'Test task', decirption: 'Test description'};
            taskRepository.findOne.mockResolvedValue(mockTask);
            const resutl = await tasksService.getTaskById(1, mockUser);
            expect(resutl).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                }
            })
        });

        it('throw an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    })

    describe('createTask', () => {
        it('calls taskRepository.create() and returns the result', async () => {
          taskRepository.createTask.mockResolvedValue('someTask');
          expect(taskRepository.createTask).not.toHaveBeenCalled();
          const createTaskDto = { title: 'test task', description: ' Test desc'};
          const result = await tasksService.createTask(createTaskDto , mockUser);
          expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
          expect(result).toEqual('someTask');
        })
    })

    describe('deleteTask', () => {
        it('calls taskRepository.delete() and return void', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        });

        it('throw an error as task is not found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    })

    describe('updateTaskStatus', () => {
        it('calls taskRepository.update() and returns the result', async () => {
            const  save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});