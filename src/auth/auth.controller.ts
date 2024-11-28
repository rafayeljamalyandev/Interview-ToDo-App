import { Controller, Post, Res, UseGuards } from '@nestjs/common';
// Added guard for local authentication strategy
import { LocalAuthGuard } from './guards/local-auth.guard';
// Custom decorator for accessing authenticated user

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { currentUser } from './current-user.decorator';
// Using Prisma-generated User type for type safety
import { User } from '@prisma/client';
// Added Response type for cookie handling
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Added guard to protect login route and handle authentication
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    // Using custom decorator to get authenticated user
    @currentUser() currentUser: User,
    // Added response object with passthrough for cookie handling
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(currentUser, response);
  }
}
