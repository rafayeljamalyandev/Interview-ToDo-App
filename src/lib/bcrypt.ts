import { Injectable, Logger } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BcryptService {
  private readonly logger = new Logger(BcryptService.name);

  constructor(private configService: ConfigService) {}

  // Hashing password with bcrypt
  async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = parseInt(
        this.configService.get<string>('BCRYPT_SALT'),
        10,
      );
      const salt = await genSalt(saltRounds);
      return await hash(password, salt);
    } catch (error) {
      this.logger.error(
        'Error occurred while trying to hash password',
        error.stack,
      );
      throw error;
    }
  }

  // Decrypting and comparing password hash
  async decryptPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await compare(password, hash);
    } catch (error) {
      this.logger.error(
        'Error occurred while comparing passwords',
        error.stack,
      );
      throw error;
    }
  }
}
