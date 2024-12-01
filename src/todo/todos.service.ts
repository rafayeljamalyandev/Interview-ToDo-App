import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dtos/createTodo.dto';
import { UpdateTodoDto } from './dtos/updateTodo.dto';
import { ITodo } from '../common/interfaces/todo.interface';
import { UsersService } from '../users/users.service';
import { IUser } from '../common/interfaces/user.interface';
import {
  ERROR_MESSAGES,
  RESPONSE_MESSAGES,
} from '../common/constants/responseMessages.constant';

@Injectable()
export class TodosService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async createTodo(
    createTodoDto: CreateTodoDto,
    userId: number,
  ): Promise<ITodo> {
    const user: IUser = await this.usersService.findById(Number(userId));

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const toDoExists: ITodo = await this.prismaService.todo.findFirst({
      where: {
        title: createTodoDto.title,
        userId: userId,
      },
    });

    if (toDoExists) {
      throw new ConflictException(ERROR_MESSAGES.TODO_EXISTS);
    }
    const toDo = await this.prismaService.todo.create({
      data: {
        title: createTodoDto.title,
        userId: userId,
      },
    });

    return toDo;
  }

  async listUserTodos(userId: number): Promise<ITodo[]> {
    const todos: ITodo[] = await this.prismaService.todo.findMany({
      where: { userId },
    });

    if (!todos.length) {
      throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND);
    }
    return todos;
  }

  async updateTodo(
    id: number,
    userId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<ITodo> {
    if (isNaN(id)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_ID);
    }
    try {
      const updatedTodo = await this.prismaService.todo.update({
        where: { id, userId },
        data: { ...updateTodoDto },
      });

      return updatedTodo;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND);
      }
      throw new BadRequestException(error.message);
    }
  }

  async deleteTodo(id: number, userId: number): Promise<string> {
    if (isNaN(id)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_ID);
    }

    try {
      await this.prismaService.todo.delete({
        where: { id, userId },
      });

      return RESPONSE_MESSAGES.DELETED;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND);
      }

      throw new BadRequestException(error.message);
    }
  }
}
