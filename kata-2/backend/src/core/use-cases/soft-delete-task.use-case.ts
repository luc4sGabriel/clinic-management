import type { ITaskRepository } from '../../infra/repositories/ITask.repository.js';
import type { Task } from '../entities/task.entity.js';

interface SoftDeleteTaskRequest {
  id: string;
}

export class SoftDeleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute({ id }: SoftDeleteTaskRequest): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    if (!task.isDeleted) {
      task.softDelete();
      await this.taskRepository.update(task);
    }

    return task;
  }
}
