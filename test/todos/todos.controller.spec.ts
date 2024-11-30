import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TodoController } from '../../src/todos/todos.controller';
import { TodoService } from '../../src/todos/todos.service';
import { Request } from 'express';
import { Prisma,PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeAll( async()=>{
    await prisma.$connect
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

//controller test to get todos by id
  describe('getTodosByUser', () => {
    it('should return todos', async () => {
      const mockTodos = [{ 
        id: 1, title: 'Test Todo', 
        completed: false ,
        userId: 1,             
        createdAt: new Date(),
        updatedAt: new Date(), 
    }];
      jest.spyOn(service, 'getTodosByUser').mockResolvedValue(mockTodos);

      const result = await controller.getTodosByUser({ user: { id: 1 } });
      expect(result).toEqual({
        data: mockTodos,
        message: 'Todos fetched successfully',
      });
      
    });

    it('should throw an error if no todos are found', async () => {
      jest.spyOn(service, 'getTodosByUser').mockResolvedValue([]);

      try {
        await controller.getTodosByUser({ user: { id: 1 } });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });


  //controller test to create todo
  describe('createTodo', () => {
    it('should create a todo', async () => {
      const createTodoDto = { title: 'Test Todo' };
      const mockTodo = { 
        id: 1,
        title: 'Test Todo', 
        completed: false ,
        userId: 1,             
        createdAt: new Date(),
        updatedAt: new Date(),
    };
      jest.spyOn(service, 'create').mockResolvedValue(mockTodo);

      const result = await controller.createTodo(createTodoDto, { user: { id: 1 } });
      expect(result).toEqual({
        data: mockTodo,
        message: 'Todo created successfully',
      });
      
    });
  });

  afterAll(async()=>{
    await prisma.$disconnect;
  })


});
