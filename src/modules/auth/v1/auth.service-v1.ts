import { ConflictException, Injectable } from '@nestjs/common';
import { ReqRegisterDTO } from './dto/request.dto';
import { AuthRepository } from '../auth.repository';
import { HashPassword } from 'src/lib/bcrypt/bcrypt';
import { IAuthCreateUser } from './interface/auth.interface';
import { ResRegisterDTO } from './dto/response.dto';

@Injectable()
export class AuthServiceV1 {
  constructor(private authRepository: AuthRepository) {}

  async register(body: ReqRegisterDTO): Promise<ResRegisterDTO> {
    const isUserExist = await this.authRepository.findOne(body.email);
    if (isUserExist) {
      throw new ConflictException(`User with ${body.email} already exist`);
    }
    const hashedPassword = await HashPassword(body.password);

    const newUserData: IAuthCreateUser = {
      email: body.email,
      password: hashedPassword,
    };

    return await this.authRepository.createUser(newUserData);
  }

  async login(email: string, password: string) {
    //   const user = await this.prisma.user.findUnique({ where: { email } });
    //   if (!user || !(await bcrypt.compare(password, user.password))) {
    //     throw new Error('Invalid credentials');
    //   }
    //   return jwt.sign({ userId: user.id }, 'some_secret_key');
    // }
  }
}
