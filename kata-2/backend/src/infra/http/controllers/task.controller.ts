import type { Request, Response } from 'express';
import type { CreateTask } from '../../../core/use-cases/create-task.use-case.js';
import type { ListTasks } from '../../../core/use-cases/list-tasks.use-case.js';
import type { TaskStatus } from '../../../shared/types.js';

export class TaskController {
  constructor(
    private createTask: CreateTask,
    private listTasks: ListTasks,
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
}