import { Task } from '../../core/entities/task.entity.js';
import type { TaskStatus } from '../../shared/types.js';

export interface ITaskRepository {
  create(task: Task): Promise<void>;
  findAll(status?: TaskStatus): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}