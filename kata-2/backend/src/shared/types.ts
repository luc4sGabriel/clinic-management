export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ITaskProps {
    id?: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt?: Date;
    updatedAt?: Date;
}