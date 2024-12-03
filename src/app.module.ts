import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataServicesModule } from './services/data-services/data-services.module';
import { UserUseCasesModule } from './use-cases/user/user-use-cases.module';
import { TodoUseCasesModule } from './use-cases/todo/todo-use-cases.module';
import {ApiModule} from "./controllers/module/api.module";
import {JwtModule, JwtService} from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DataServicesModule,
    UserUseCasesModule,
    TodoUseCasesModule,
    ApiModule,
  ],
  controllers: [],
  providers: [
    JwtService,
  ]
})
export class AppModule{}
