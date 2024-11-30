import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TodoService } from '../../src/todos/todos.service';
import { mock } from 'node:test';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

jest.mock('../../src/prisma/prisma.service'); // Mock PrismaService



const prisma = new PrismaClient();

describe('TodoService', () => {

  beforeAll(async()=>{
    prisma.$connect;
  })
  let service: TodoService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
              findFirst: jest.fn(),
              findUnique: jest.fn()
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

//service test to get todo by user id
  describe('getTodosByUser', () => {
    it('should return todos for a user', async () => {
      const mockTodos = [{ id: 1, title: 'Test Todo', completed: false }];
      prismaService.todo.findMany = jest.fn().mockResolvedValue(mockTodos);

      const result = await service.getTodosByUser(1);
      expect(result).toEqual(mockTodos);
      
      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { id: 'desc' },
      });
    });
  });

//service test to create to do  
describe('create', () => {
    it('should create a todo', async () => {
      const mockTodo = {
        id: 1,
        title: 'New Todo', 
        completed: false ,
        userId: 1,             
        createdAt: new Date(),
        updatedAt: new Date(),
    };
      const createTodoDto = { title: 'New Todo' ,completed:"false"};
      jest.spyOn(prismaService.todo, 'create').mockResolvedValue(mockTodo);

      const result = await service.create(createTodoDto, 1);
    
      expect(result).toEqual(mockTodo);
      
      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: {...createTodoDto, userId: 1 },
      });
    });
  });

  afterAll(async()=>{
    await prisma.$disconnect;
  })
  

});
