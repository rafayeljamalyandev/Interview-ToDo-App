import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// Added authentication strategies
import { LocalStrategy } from './strategies/local.strategy';
// Added Passport for authentication
import { PassportModule } from '@nestjs/passport';
// Added Users module for user management
import { UsersModule } from 'src/users/users.module';
// Added JWT functionality
import { JwtModule } from '@nestjs/jwt';
// Added configuration management
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // Added Passport support for authentication
    PassportModule,
    // Added Users module for user operations
    UsersModule,
    // Added JWT configuration with async setup
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // Get JWT secret from environment variables
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          // Get JWT expiration from environment variables
          expiresIn: configService.getOrThrow('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  // Added authentication strategies to providers
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
