import { describe, expect, it, vi } from 'vitest';

import { CreateTask } from './create-task.use-case.js';

function createTaskRepositoryMock(overrides = {}) {
  return {
    create: vi.fn(async () => {}),
    findAll: vi.fn(async () => {
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
    ...overrides,
  };
}

describe('CreateTask', () => {
  it('creates a pending task and persists it', async () => {
    const repo = createTaskRepositoryMock();
    const useCase = new CreateTask(repo);

    const result = await useCase.execute({
      title: 'My title',
      description: 'My description',
    });

    expect(result.title).toBe('My title');
    expect(result.description).toBe('My description');
    expect(result.status).toBe('pending');
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith(result);
  });

  it('always sets status to pending', async () => {
    const repo = createTaskRepositoryMock();
    const useCase = new CreateTask(repo);

    const result = await useCase.execute({
      title: 'A',
      description: 'B',
    });

    expect(result.status).toBe('pending');
  });
});
