import { z } from 'zod';

export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'completed']);
export type TaskStatusDTO = z.infer<typeof TaskStatusSchema>;

export const TaskPropsSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  status: TaskStatusSchema.optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type TaskPropsDTO = z.infer<typeof TaskPropsSchema>;

export const CreateTaskBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});
export type CreateTaskBodyDTO = z.infer<typeof CreateTaskBodySchema>;

export const ListTasksQuerySchema = z.object({
  status: TaskStatusSchema.optional(),
});
export type ListTasksQueryDTO = z.infer<typeof ListTasksQuerySchema>;

export const UpdateTaskParamsSchema = z.object({
  id: z.string().min(1),
});
export type UpdateTaskParamsDTO = z.infer<typeof UpdateTaskParamsSchema>;

export const UpdateTaskBodySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: TaskStatusSchema.optional(),
});
export type UpdateTaskBodyDTO = z.infer<typeof UpdateTaskBodySchema>;

export const DeleteTaskParamsSchema = z.object({
  id: z.string().min(1),
});
export type DeleteTaskParamsDTO = z.infer<typeof DeleteTaskParamsSchema>;
