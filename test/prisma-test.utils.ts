import { PrismaService } from 'src/prisma/prisma.service';

export class PrismaTestUtils {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async createTestUser(data: {
    email: string;
    password: string;
    name?: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async createTestTodo(data: {
    title: string;
    description?: string;
    userId: number;
    completed?: boolean;
    dueDate?: Date;
  }) {
    return this.prisma.todo.create({
      data,
    });
  }

  async cleanupTestData() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Cleanup only allowed in test environment');
    }

    await this.prisma.cleanDatabase();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
