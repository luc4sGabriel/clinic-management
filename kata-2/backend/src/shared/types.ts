export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ITaskProps {
    id?: string;
    title: string;
    description: string;
    status: TaskStatus;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}