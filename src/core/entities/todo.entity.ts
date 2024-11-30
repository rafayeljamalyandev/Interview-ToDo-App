import { TodoState } from './enums/todo-state.enum.dto';

export class Todo {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: number;
  state: TodoState;
  userId: number;
  createdAt: Date;
  updatedAt: Date;

}
