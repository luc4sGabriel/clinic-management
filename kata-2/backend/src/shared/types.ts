import type { z } from 'zod';

import {
    TaskPropsSchema,
    TaskStatusSchema,
} from './dtos/task.dto.js';

export const TaskStatus = TaskStatusSchema;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskProps = TaskPropsSchema;
export type ITaskProps = z.infer<typeof TaskPropsSchema>;