import { PrismaTaskRepository } from '../../infra/repositories/prisma/prisma-task.repository.js';
import { CreateTask } from '../../core/use-cases/create-task.use-case.js';
import { ListTasks } from '../../core/use-cases/list-tasks.use-case.js';
import { UpdateTask } from '../../core/use-cases/update-task.use-case.js';
import { SoftDeleteTask } from '../../core/use-cases/soft-delete-task.use-case.js';
import { TaskController } from '../../infra/http/controllers/task.controller.js';

export function makeTaskController() {
  const repository = new PrismaTaskRepository();
  
  const createTaskUseCase = new CreateTask(repository);
  const listTasksUseCase = new ListTasks(repository);
  const updateTaskUseCase = new UpdateTask(repository);
  const softDeleteTaskUseCase = new SoftDeleteTask(repository);
  
  return new TaskController(
    createTaskUseCase,
    listTasksUseCase,
    updateTaskUseCase,
    softDeleteTaskUseCase,
  );
}