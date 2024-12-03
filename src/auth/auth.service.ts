import {
   Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
 } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService:JwtService) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password,10);
    try{
      return await this.prisma.user.create({
        data:{
          email,
          password:hashedPassword
        }
      })
    }catch(error){
      if(error instanceof PrismaClientKnownRequestError && error.code === 'P2002'){
        throw new ConflictException('Email already in use')
      }
      else if(error instanceof UnauthorizedException){
        throw error;
      }
      else{
        throw new InternalServerErrorException('An error occur during registration')
      }
    }
  }

  async login(email: string, password: string) {
    try{
      const user = await this.prisma.user.findUnique({ where: { email } });
      if(!user){
        throw new UnauthorizedException('Invalid credentials')
      }
      const isPasswordValid = await bcrypt.compare(password,user.password);
      if(!isPasswordValid){
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {email:user.email, sub:user.id};
      return {
        accessToken: this.jwtService.sign(payload)
      }

    }catch(error){
      console.log(error)
      if(error instanceof UnauthorizedException){
        throw error;
      }
      throw new InternalServerErrorException('An error occured during login')
    }
    
    }
  }
