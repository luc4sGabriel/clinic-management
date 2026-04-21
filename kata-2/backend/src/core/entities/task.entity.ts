import { v4 as uuidv4 } from 'uuid';
import type { ITaskProps, TaskStatus } from '../../shared/task.types.js';

export class Task {
  private props: Required<ITaskProps>;

  constructor(props: ITaskProps) {
    this.props = {
      ...props,
      id: props.id ?? uuidv4(),
      description: props.description,
      status: props.status ?? 'pending',
      isDeleted: props.isDeleted ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  public get id() { return this.props.id; }
  public get title() { return this.props.title; }
  public get description() { return this.props.description; }
  public get status() { return this.props.status; }
  public get isDeleted() { return this.props.isDeleted; }
  public get createdAt() { return this.props.createdAt; }
  public get updatedAt() { return this.props.updatedAt; }

  public updateStatus(status: TaskStatus) {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  public updateTitle(title: string) {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  public updateDescription(description: string) {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  public softDelete() {
    this.props.isDeleted = true;
    this.props.updatedAt = new Date();
  }

  public toJSON() {
    return { ...this.props };
  }
}