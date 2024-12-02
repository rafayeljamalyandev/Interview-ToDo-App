import { Todo as TodoModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Todo } from '../models/todo.model';
import { ITodoRepository } from '../models/todo.repository.intf';

export class TodoRepository implements ITodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  private TodoFromDBModel(todo: TodoModel): Todo {
    if (!todo) return null;
    return new Todo(
      todo.id.toString(),
      todo.title,
      todo.completed,
      todo.userId.toString(),
    );
  }

  private TodoArrayFromDBModel(todoList: TodoModel[]): Todo[] {
    if (!todoList) return [];
    return todoList.map((todo) => {
      return this.TodoFromDBModel(todo);
    });
  }

  async createTodo(todoInfo: Partial<Todo>): Promise<Todo> {
    try {
      const userId = parseInt(todoInfo.userId);
      const newTodo = await this.prisma.todo.create({
        data: { userId: userId, title: todoInfo.title },
      });

      return this.TodoFromDBModel(newTodo);
    } catch (err) {
      // Log Error
      throw err;
    }
  }

  async getTodoList(userId: string): Promise<Todo[]> {
    try {
      const id = parseInt(userId);
      const todoList = await this.prisma.todo.findMany({
        where: { userId: id },
      });

      return this.TodoArrayFromDBModel(todoList);
    } catch (err) {
      // Log Error
      throw err;
    }
  }
}
