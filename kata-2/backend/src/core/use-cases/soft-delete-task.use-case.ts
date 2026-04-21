import type { ITaskRepository } from '../../infra/repositories/ITask.repository.js';
import type { ITaskProps } from '../../shared/task.types.js';
import { NotFoundError } from '../../errors/not-found-error.js';

interface SoftDeleteTaskRequest {
  id: string;
}

export class SoftDeleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute({ id }: SoftDeleteTaskRequest): Promise<ITaskProps> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError('Task');
    }

    if (!task.isDeleted) {
      task.softDelete();
      await this.taskRepository.update(task);
    }

    return task.toJSON();
  }
}
