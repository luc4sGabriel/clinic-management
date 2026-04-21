import { Task } from '../entities/task.entity.js';
import type { ITaskRepository } from '../../infra/repositories/ITask.repository.js';
import type { ITaskProps } from '../../shared/task.types.js';

interface CreateTaskRequest {
  title: string;
  description: string;
}

export class CreateTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(data: CreateTaskRequest): Promise<ITaskProps> {
    const task = new Task({
      title: data.title,
      description: data.description,
      status: 'pending'
    });

    await this.taskRepository.create(task);
    return task.toJSON();
  }
}