import type { TaskStatus } from '../../shared/types.js';
import type { ITaskRepository } from '../../infra/repositories/ITask.repository.js';
import type { Task } from '../entities/task.entity.js';

interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export class UpdateTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute({ id, title, description, status }: UpdateTaskRequest): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.isDeleted) {
      throw new Error('Task is deleted');
    }

    if (title !== undefined) {
      task.updateTitle(title);
    }

    if (description !== undefined) {
      task.updateDescription(description);
    }

    if (status !== undefined) {
      task.updateStatus(status);
    }

    await this.taskRepository.update(task);
    return task;
  }
}
