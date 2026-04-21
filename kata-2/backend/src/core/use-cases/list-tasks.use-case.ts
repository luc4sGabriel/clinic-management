import type { TaskStatus } from '../../shared/task.types.js';
import type { ITaskProps } from '../../shared/task.types.js';
import type { ITaskRepository } from '../../infra/repositories/ITask.repository.js';

interface ListTasksRequest {
  status?: TaskStatus;
}

export class ListTasks {
  constructor(private taskRepository: ITaskRepository) {}

  async execute({ status }: ListTasksRequest = {}): Promise<ITaskProps[]> {
    const tasks = await this.taskRepository.findAll(status);
    return tasks.map((task) => task.toJSON());
  }
}
