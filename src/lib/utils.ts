import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class GenerateTokenService {
  private readonly logger = new Logger(GenerateTokenService.name);

  constructor(private configService: ConfigService) {}

  generateToken(id: number): string {
    try {
      const token = this.configService.get<string>('JWT_SECRET');
      return sign({ id }, token, { expiresIn: '1h' });
    } catch (error) {
      this.logger.error('Error generating JWT token', error.stack);
      throw error;
    }
  }
}
