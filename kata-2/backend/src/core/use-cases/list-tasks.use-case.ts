import type { TaskStatus } from '../../shared/types.js';
import type { ITaskRepository } from '../../infra/repositories/ITask.repository.js';
import type { Task } from '../entities/task.entity.js';

interface ListTasksRequest {
  status?: TaskStatus;
}

export class ListTasks {
  constructor(private taskRepository: ITaskRepository) {}

  async execute({ status }: ListTasksRequest = {}): Promise<Task[]> {
    return this.taskRepository.findAll(status);
  }
}
