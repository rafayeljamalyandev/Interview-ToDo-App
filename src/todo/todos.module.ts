import { Module } from '@nestjs/common';
import { TodosService } from 'src/todo/todos.service';
import { TodosController } from 'src/todo/todos.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
