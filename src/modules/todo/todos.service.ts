import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto, UpdateTodoDto } from 'src/libs/dto/todo.dto';
import { BaseResponseDto } from 'src/libs/dto/reponse.dto';
import { Todo } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new TODO item for the specified user.
   * @param data - The DTO containing the title of the TODO.
   * @param userId - The ID of the user creating the TODO.
   * @returns A BaseResponseDto with the created TODO item.
   */
  async createTodo(
    data: CreateTodoDto,
    userId: number,
  ): Promise<BaseResponseDto<number, string, Todo>> {
    const { title } = data;

    try {
      const newTodo = await this.prisma.todo.create({
        data: {
          title: title.trim(),
          userId,
        },
      });

      return {
        status: 201,
        message: 'TODO created successfully.',
        data: newTodo,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create TODO. Please try again.');
    }
  }

  /**
   * Retrieves a list of TODOs for a specific user.
   * Throws an error if the user ID is invalid or if no TODOs are found.
   * @param {number} userId - The ID of the user whose TODOs are to be fetched.
   * @returns {Promise<object>} - The response containing the TODOs list.
   */
  async listTodos(userId: number) {
    // Validate the userId input
    if (!userId || typeof userId !== 'number') {
      throw new BadRequestException('Invalid user ID provided.');
    }

    try {
      const todos = await this.prisma.todo.findMany({
        where: { userId },
        orderBy: { title: 'desc' },
        select: {
          id: true,
          title: true,
          completed: true,
          userId: true,
        },
      });

      if (!todos.length) {
        throw new NotFoundException('No TODOs found for this user.');
      }

      return {
        status: 200,
        message: 'Todos fetched successfully.',
        data: todos,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(
        'Failed to retrieve TODOs. Please try again.',
      );
    }
  }

  /**
   * Fetches a TODO item by ID for the given user.
   * @param id - TODO ID.
   * @param userId - User ID.
   * @returns Retrieved TODO in a response DTO.
   * @throws BadRequestException, NotFoundException, ForbiddenException.
   */
  async getTodoById(
    id: number,
    userId: number,
  ): Promise<BaseResponseDto<number, string, Todo>> {
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('Invalid TODO ID provided.');
    }

    try {
      const todo = await this.prisma.todo.findFirst({
        where: { id, userId },
      });

      if (!todo) {
        throw new NotFoundException('TODO not found.');
      }

      if (todo.userId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to access this TODO.',
        );
      }

      return {
        status: 200,
        message: 'TODO retrieved successfully.',
        data: todo,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Failed to retrieve TODO. Please try again.',
      );
    }
  }

  /**
   * Updates a user's TODO item by ID, ensuring authorization and valid fields.
   *
   * @param id - The TODO ID.
   * @param userId - The ID of the user making the request.
   * @param data - The updated TODO data.
   * @returns The updated TODO item in a response DTO.
   * @throws BadRequestException, NotFoundException, ForbiddenException
   */
  async updateTodo(
    id: number,
    userId: number,
    data: UpdateTodoDto,
  ): Promise<BaseResponseDto<number, string, Todo>> {
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('Invalid TODO ID provided.');
    }

    const { title, completed } = data;

    try {
      const todo = await this.prisma.todo.findFirst({
        where: { id, userId },
      });

      if (!todo) {
        throw new NotFoundException('TODO not found.');
      }

      if (todo.userId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to update this TODO.',
        );
      }

      const updatedTodo = await this.prisma.todo.update({
        where: { id },
        data: {
          ...(title ? { title: title.trim() } : {}),
          ...(completed !== undefined ? { completed } : {}),
        },
      });

      return {
        status: 200,
        message: 'Todo updated successfully.',
        data: updatedTodo,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update TODO. Please try again.');
    }
  }

  /**
   * Deletes a TODO item for a user by ID.
   *
   * @param id - TODO item ID.
   * @param userId - ID of the user deleting the TODO.
   * @returns Response DTO with deletion result.
   * @throws BadRequestException, NotFoundException, or ForbiddenException.
   */
  async deleteTodo(
    id: number,
    userId: number,
  ): Promise<BaseResponseDto<number, string, Todo>> {
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('Invalid TODO ID provided.');
    }

    try {
      const todo = await this.prisma.todo.findFirst({
        where: { id, userId },
      });

      if (!todo) {
        throw new NotFoundException('TODO not found.');
      }

      if (todo.userId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to delete this TODO.',
        );
      }

      const deletedTodo = await this.prisma.todo.delete({
        where: { id },
      });

      return {
        status: 204,
        message: 'Todo deleted successfully.',
        data: deletedTodo,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to delete TODO. Please try again.');
    }
  }
}
