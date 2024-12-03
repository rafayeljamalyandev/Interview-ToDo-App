require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma.module';
import { AuthService } from './auth.service'; // Service to handle authentication
import { UsersModule } from './users/users.module'; // Module to interact with users
import { JwtMiddleware } from './middleware/jwt.middleware'; // Import the JwtMiddleware

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Secret key for signing JWT tokens
      signOptions: { expiresIn: '1h' }, // Set the expiration for the JWT
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtMiddleware, // Added JwtMiddleware as a provider as it is needed for injection
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
