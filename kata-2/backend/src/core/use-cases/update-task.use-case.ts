import type { TaskStatus } from '../../shared/task.types.js';
import type { ITaskProps } from '../../shared/task.types.js';
import type { ITaskRepository } from '../../infra/repositories/ITask.repository.js';
import { NotFoundError } from '../../errors/not-found-error.js';
import { BadRequestError } from '../../errors/bad-request-error.js';

interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export class UpdateTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute({ id, title, description, status }: UpdateTaskRequest): Promise<ITaskProps> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError('Task');
    }

    if (task.isDeleted) {
      throw new BadRequestError('Task is deleted');
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
    return task.toJSON();
  }
}
