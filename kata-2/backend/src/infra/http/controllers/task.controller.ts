import type { Request, Response } from 'express';
import type { CreateTask } from '../../../core/use-cases/create-task.use-case.js';
import type { ListTasks } from '../../../core/use-cases/list-tasks.use-case.js';
import type { UpdateTask } from '../../../core/use-cases/update-task.use-case.js';
import type { SoftDeleteTask } from '../../../core/use-cases/soft-delete-task.use-case.js';
import type { TaskStatus } from '../../../shared/types.js';

export class TaskController {
  constructor(
    private createTask: CreateTask,
    private listTasks: ListTasks,
    private updateTask: UpdateTask,
    private softDeleteTask: SoftDeleteTask,
  ) {}

  async handleCreate(req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      const task = await this.createTask.execute({ title, description });
      return res.status(201).json(task.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleList(req: Request, res: Response) {
    try {
      const status = req.query.status as TaskStatus | undefined;
      const tasks = await this.listTasks.execute(status ? { status } : {});
      return res.status(200).json(tasks.map(task => task.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleUpdate(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({ error: 'Task id is required' });
      }
      const { title, description, status } = req.body as {
        title?: string;
        description?: string;
        status?: TaskStatus;
      };

      const task = await this.updateTask.execute({
        id,
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
      });
      return res.status(200).json(task.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleDelete(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({ error: 'Task id is required' });
      }
      const task = await this.softDeleteTask.execute({ id });
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}