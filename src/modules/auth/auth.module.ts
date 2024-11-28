import { Module } from '@nestjs/common';
import { AuthServiceV1 } from './v1/auth.service-v1';
import { AuthControllerV1 } from './v1/auth.controller-v1';
import { DbModule } from '../../config/db/prisma.module';

@Module({
  imports: [DbModule],
  providers: [AuthServiceV1],
  controllers: [AuthControllerV1],
})
export class AuthModule {}
