import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  UseGuards,
  Get 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath 
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe'
        },
        token: 'eyJhbGciOiJIUzI1NiIs...'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      validUser: {
        value: {
          email: 'user@example.com',
          password: 'password123',
          name: 'John Doe'
        }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe'
        },
        token: 'eyJhbGciOiJIUzI1NiIs...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    type: LoginDto,
    examples: {
      validLogin: {
        value: {
          email: 'user@example.com',
          password: 'password123'
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')  // Añade esto
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200,
    description: 'Returns the current user profile',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        name: 'John Doe',
        createdAt: '2024-03-15T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@GetUser() user: any) {
    return this.authService.getProfile(user.id);
  }
}