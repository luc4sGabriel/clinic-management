import type { NextFunction, Request, Response } from 'express';
import type { CreateTask } from '../../../core/use-cases/create-task.use-case.js';
import type { ListTasks } from '../../../core/use-cases/list-tasks.use-case.js';
import type { UpdateTask } from '../../../core/use-cases/update-task.use-case.js';
import type { SoftDeleteTask } from '../../../core/use-cases/soft-delete-task.use-case.js';
import {
  CreateTaskBodySchema,
  type CreateTaskBodyDTO,
  DeleteTaskParamsSchema,
  type DeleteTaskParamsDTO,
  DeleteTaskResponseSchema,
  type DeleteTaskResponseDTO,
  ListTasksQuerySchema,
  type ListTasksQueryDTO,
  TaskListResponseSchema,
  type TaskListResponseDTO,
  TaskPropsSchema,
  type TaskPropsDTO,
  UpdateTaskBodySchema,
  type UpdateTaskBodyDTO,
  UpdateTaskParamsSchema,
  type UpdateTaskParamsDTO,
} from '../../../dtos/task.dto.js';

export class TaskController {
  constructor(
    private createTask: CreateTask,
    private listTasks: ListTasks,
    private updateTask: UpdateTask,
    private softDeleteTask: SoftDeleteTask,
  ) {}

  async handleCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description }: CreateTaskBodyDTO = CreateTaskBodySchema.parse(req.body);
      const task = await this.createTask.execute({ title, description });
      const response: TaskPropsDTO = TaskPropsSchema.parse(task);
      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async handleList(req: Request, res: Response, next: NextFunction) {
    try {
      const { status }: ListTasksQueryDTO = ListTasksQuerySchema.parse(req.query);
      const tasks = await this.listTasks.execute(status ? { status } : {});
      const response: TaskListResponseDTO = TaskListResponseSchema.parse(tasks);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async handleUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: UpdateTaskParamsDTO = UpdateTaskParamsSchema.parse(req.params);
      const { title, description, status }: UpdateTaskBodyDTO = UpdateTaskBodySchema.parse(req.body);

      const task = await this.updateTask.execute({
        id,
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
      });
      const response: TaskPropsDTO = TaskPropsSchema.parse(task);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async handleDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: DeleteTaskParamsDTO = DeleteTaskParamsSchema.parse(req.params);
      await this.softDeleteTask.execute({ id });
      const response: DeleteTaskResponseDTO = DeleteTaskResponseSchema.parse({ message: 'Task deleted successfully' });
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}