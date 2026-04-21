import { z } from 'zod';

export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'completed']);

export const TaskPropsSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string(),
  status: TaskStatusSchema.optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const TaskListResponseSchema = z.array(TaskPropsSchema);

export const DeleteTaskResponseSchema = z.object({
  message: z.string().min(1),
});

export const CreateTaskBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const ListTasksQuerySchema = z.object({
  status: TaskStatusSchema.optional(),
});

export const UpdateTaskParamsSchema = z.object({
  id: z.string().min(1),
});

export const UpdateTaskBodySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: TaskStatusSchema.optional(),
});

export const DeleteTaskParamsSchema = z.object({
  id: z.string().min(1),
});

export type TaskPropsDTO = z.infer<typeof TaskPropsSchema>;
export type TaskListResponseDTO = z.infer<typeof TaskListResponseSchema>;
export type DeleteTaskResponseDTO = z.infer<typeof DeleteTaskResponseSchema>;

export type DeleteTaskParamsDTO = z.infer<typeof DeleteTaskParamsSchema>;

export type UpdateTaskBodyDTO = z.infer<typeof UpdateTaskBodySchema>;

export type UpdateTaskParamsDTO = z.infer<typeof UpdateTaskParamsSchema>;

export type ListTasksQueryDTO = z.infer<typeof ListTasksQuerySchema>;

export type CreateTaskBodyDTO = z.infer<typeof CreateTaskBodySchema>;

export type TaskStatusDTO = z.infer<typeof TaskStatusSchema>;