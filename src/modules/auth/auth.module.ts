import { Module } from '@nestjs/common';
import { AuthServiceV1 } from './v1/auth.service-v1';
import { AuthControllerV1 } from './v1/auth.controller-v1';
import { DbModule } from '../../config/db/prisma.module';
import { AuthRepository } from './auth.repository';
import { AuthMappingV1 } from './v1/mappings/auth.mappings-v1';

@Module({
  imports: [DbModule],
  providers: [AuthServiceV1, AuthRepository, AuthMappingV1],
  controllers: [AuthControllerV1],
})
export class AuthModule {}
