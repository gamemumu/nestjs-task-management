import { Injectable, Get, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks.filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { create } from 'domain';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user-decorator';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ){}   
    
    getTask(
        filterDto: GetTaskFilterDto,
        user: User,
    ): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }

    // getAllTasks(): Task[]{
    //     return this.tasks;
    // }

    // getTaskWithFilters(filterDto: GetTaskFilterDto): Task[]{
    //     const {status, search } = filterDto;

    //     let tasks = this.getAllTasks();
    //     if(status){
    //         tasks = tasks.filter(task => task.status == status);
    //     }

    //     if(search){
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search),
    //         );
    //     }
    //     return tasks;
    // }

    async getTaskById(
        id: number,
        @GetUser() user: User,
    ): Promise<Task>{
        const found = await this.taskRepository.findOne({ where: {id, userId: user.id }});
        
        if(!found){
            throw new NotFoundException(`Task with ID  "${id}" not found`);
        }

        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
    ): Promise<Task>{
       return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(
        id: number,
        @GetUser() user: User,
    ): Promise<void>{
       const result = await this.taskRepository.delete({ id, userId: user.id});
       if(result.affected ===0){
         throw new NotFoundException(`Task with ID  "${id}" not found`);
       }
    }

    async updateTaskStatus(
        id:number, 
        status: TaskStatus,
        @GetUser() user: User): Promise<Task>{
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

}
