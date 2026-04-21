import { describe, expect, it, vi } from 'vitest';

import { SoftDeleteTask } from './soft-delete-task.use-case.js';
import { Task } from '../entities/task.entity.js';

function createTaskRepositoryMock({ findByIdImpl } = {}) {
  return {
    findById: vi.fn(async (id) => (findByIdImpl ? findByIdImpl(id) : null)),
    update: vi.fn(async () => {}),
    create: vi.fn(async () => {
      throw new Error('not implemented');
    }),
    findAll: vi.fn(async () => {
      throw new Error('not implemented');
    }),
    delete: vi.fn(async () => {
      throw new Error('not implemented');
    }),
  };
}

describe('SoftDeleteTask', () => {
  it('throws when task does not exist', async () => {
    const repo = createTaskRepositoryMock({ findByIdImpl: () => null });
    const useCase = new SoftDeleteTask(repo);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow('Task not found');
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('soft-deletes and persists when not deleted yet', async () => {
    const originalUpdatedAt = new Date('2000-01-01T00:00:00.000Z');
    const task = new Task({
      id: 't1',
      title: 'Title',
      description: 'Desc',
      status: 'pending',
      isDeleted: false,
      createdAt: new Date('2000-01-01T00:00:00.000Z'),
      updatedAt: originalUpdatedAt,
    });

    const repo = createTaskRepositoryMock({ findByIdImpl: () => task });
    const useCase = new SoftDeleteTask(repo);

    const result = await useCase.execute({ id: 't1' });

    expect(result).toBe(task);
    expect(result.isDeleted).toBe(true);
    expect(result.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(repo.update).toHaveBeenCalledWith(task);
  });

  it('does not persist when already deleted', async () => {
    const task = new Task({
      id: 't1',
      title: 'Title',
      description: 'Desc',
      status: 'pending',
      isDeleted: true,
    });

    const repo = createTaskRepositoryMock({ findByIdImpl: () => task });
    const useCase = new SoftDeleteTask(repo);

    const result = await useCase.execute({ id: 't1' });

    expect(result.isDeleted).toBe(true);
    expect(repo.update).not.toHaveBeenCalled();
  });
});
