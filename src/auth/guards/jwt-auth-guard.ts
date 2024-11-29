import {Injectable, CanActivate,ExecutionContext} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class jwtAuthGuard extends AuthGuard('jwt'){}