import { describe, expect, it, vi } from 'vitest';

import { UpdateTask } from './update-task.use-case.js';
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

describe('UpdateTask', () => {
  it('throws when task does not exist', async () => {
    const repo = createTaskRepositoryMock({ findByIdImpl: () => null });
    const useCase = new UpdateTask(repo);

    await expect(useCase.execute({ id: 'missing', title: 'New' })).rejects.toThrow('Task not found');

    expect(repo.findById).toHaveBeenCalledTimes(1);
    expect(repo.findById).toHaveBeenCalledWith('missing');
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('throws when task is soft-deleted', async () => {
    const deletedTask = new Task({
      id: 't1',
      title: 'Old',
      description: 'Desc',
      status: 'pending',
      isDeleted: true,
      createdAt: new Date('2000-01-01T00:00:00.000Z'),
      updatedAt: new Date('2000-01-01T00:00:00.000Z'),
    });

    const repo = createTaskRepositoryMock({ findByIdImpl: () => deletedTask });
    const useCase = new UpdateTask(repo);

    await expect(useCase.execute({ id: 't1', title: 'New title' })).rejects.toThrow('Task is deleted');

    expect(repo.update).not.toHaveBeenCalled();
  });

  it('updates only provided fields and persists changes', async () => {
    const originalUpdatedAt = new Date('2000-01-01T00:00:00.000Z');
    const task = new Task({
      id: 't1',
      title: 'Old title',
      description: 'Old desc',
      status: 'pending',
      isDeleted: false,
      createdAt: new Date('2000-01-01T00:00:00.000Z'),
      updatedAt: originalUpdatedAt,
    });

    const repo = createTaskRepositoryMock({ findByIdImpl: () => task });
    const useCase = new UpdateTask(repo);

    const result = await useCase.execute({
      id: 't1',
      title: 'New title',
    });

    expect(result).toBe(task);
    expect(result.title).toBe('New title');
    expect(result.description).toBe('Old desc');
    expect(result.status).toBe('pending');
    expect(result.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());

    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(repo.update).toHaveBeenCalledWith(task);
  });

  it('can update title, description and status together', async () => {
    const task = new Task({
      id: 't1',
      title: 'Old title',
      description: 'Old desc',
      status: 'pending',
    });

    const repo = createTaskRepositoryMock({ findByIdImpl: () => task });
    const useCase = new UpdateTask(repo);

    const result = await useCase.execute({
      id: 't1',
      title: 'New title',
      description: 'New desc',
      status: 'completed',
    });

    expect(result.title).toBe('New title');
    expect(result.description).toBe('New desc');
    expect(result.status).toBe('completed');
    expect(repo.update).toHaveBeenCalledTimes(1);
  });
});
