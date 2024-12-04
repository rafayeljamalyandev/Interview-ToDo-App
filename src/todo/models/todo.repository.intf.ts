import { Todo } from './todo.model';

export interface ITodoRepository {
  createTodo(todoInfo: Partial<Todo>): Promise<Todo>;
  getTodoList(userId: string): Promise<Todo[]>;
}
