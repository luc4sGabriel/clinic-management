import { describe, expect, it, vi } from 'vitest';

import { ListTasks } from './list-tasks.use-case.js';
import { Task } from '../entities/task.entity.js';

function createTaskRepositoryMock({ findAllImpl } = {}) {
  return {
    findAll: vi.fn(async (status) => (findAllImpl ? findAllImpl(status) : [])),
    create: vi.fn(async () => {
      throw new Error('not implemented');
    }),
    findById: vi.fn(async () => {
      throw new Error('not implemented');
    }),
    update: vi.fn(async () => {
      throw new Error('not implemented');
    }),
    delete: vi.fn(async () => {
      throw new Error('not implemented');
    }),
  };
}

describe('ListTasks', () => {
  it('calls repository.findAll without status by default', async () => {
    const expected = [
      new Task({ title: 'T1', description: 'D1', status: 'pending' }),
      new Task({ title: 'T2', description: 'D2', status: 'completed' }),
    ];

    const repo = createTaskRepositoryMock({
      findAllImpl: () => expected,
    });
    const useCase = new ListTasks(repo);

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(repo.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toBe(expected);
  });

  it('passes status through to repository.findAll', async () => {
    const expected = [new Task({ title: 'T1', description: 'D1', status: 'in_progress' })];

    const repo = createTaskRepositoryMock({
      findAllImpl: (status) => (status === 'in_progress' ? expected : []),
    });
    const useCase = new ListTasks(repo);

    const result = await useCase.execute({ status: 'in_progress' });

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(repo.findAll).toHaveBeenCalledWith('in_progress');
    expect(result).toBe(expected);
  });
});
