import { Request } from '@nestjs/common';

export interface AuthorizedRequest extends Request {
  user: {
    id: number;
    email: string;
    iat: number;
    exp: number;
  };
}
