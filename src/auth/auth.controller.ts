import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User account has been successfully created.',
    schema: {
      example: {
        user: {
          id: 101,
          email: 'newuser@domain.com',
          name: 'Alice Johnson',
        },
        token: 'eyJhbGciOiJIUzUxfMiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error in user input' })
  @ApiResponse({
    status: 409,
    description: 'The email address is already in use',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      newUser: {
        value: {
          email: 'newuser@domain.com',
          password: 'MySecurePass123',
          name: 'Alice Johnson',
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and retrieve token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated and token provided.',
    schema: {
      example: {
        user: {
          id: 101,
          email: 'existinguser@domain.com',
          name: 'Bob Martin',
        },
        token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Incorrect email or password provided',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      validCredentials: {
        value: {
          email: 'existinguser@domain.com',
          password: 'MySecurePass123',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Access-Token')
  @ApiOperation({ summary: 'Fetch the profile of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile successfully retrieved.',
    schema: {
      example: {
        id: 101,
        email: 'existinguser@domain.com',
        name: 'Bob Martin',
        createdAt: '2024-03-15T08:23:45.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required for this endpoint',
  })
  async getProfile(@GetUser() user: User) {
    try {
      return this.authService.getProfile(user.id);
    } catch (error) {
      console.log(error);
    }
  }
}
