import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import { Task } from '../../../core/entities/task.entity.js';
import type { ITaskRepository } from '../ITask.repository.js';
import type { TaskStatus } from '../../../shared/types.js';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://user:password@localhost:5432/kata2_tasks?schema=public';

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class PrismaTaskRepository implements ITaskRepository {
  async create(task: Task): Promise<void> {
    await prisma.task.create({
      data: task.toJSON(),
    });
  }

  async findAll(status?: TaskStatus): Promise<Task[]> {
    const data = await prisma.task.findMany({
      where: status ? { status } : {},
    });
    return data.map(item => new Task({ ...item, status: item.status as TaskStatus }));
  }

  async findById(id: string): Promise<Task | null> {
    const data = await prisma.task.findUnique({ where: { id } });
    return data ? new Task({ ...data, status: data.status as TaskStatus }) : null;
  }

  async update(task: Task): Promise<void> {
    await prisma.task.update({
      where: { id: task.id },
      data: task.toJSON(),
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }
}