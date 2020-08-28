import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsIn, IsEmpty, IsNotEmpty } from 'class-validator';
export class GetTaskFilterDto{
    @IsOptional()
    @IsIn( [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE] )
    @IsNotEmpty()
    status: TaskStatus;

    search: string;
}