import {
  ExecutionContext,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { TokenService } from '../../common/token/token.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let tokenService: Partial<TokenService>;

  beforeEach(() => {
    tokenService = {
      extractToken: jest.fn(),
      verify: jest.fn(),
    };
    authGuard = new AuthGuard(tokenService as TokenService);
  });

  it('should throw UnauthorizedException if token is not present', () => {
    (tokenService.extractToken as jest.Mock).mockReturnValue(null);

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as unknown as ExecutionContext;

    expect(() => authGuard.canActivate(mockContext)).toThrow(
      UnauthorizedException,
    );
    expect(tokenService.extractToken).toHaveBeenCalled();
  });

  it('should throw HttpException if token is invalid', () => {
    (tokenService.extractToken as jest.Mock).mockReturnValue('invalid-token');
    (tokenService.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer invalid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => authGuard.canActivate(mockContext)).toThrow(HttpException);
    expect(() => authGuard.canActivate(mockContext)).toThrow('Invalid token');
    expect(tokenService.extractToken).toHaveBeenCalled();
    expect(tokenService.verify).toHaveBeenCalledWith('invalid-token');
  });

  it('should allow access if token is valid', () => {
    (tokenService.extractToken as jest.Mock).mockReturnValue('valid-token');
    (tokenService.verify as jest.Mock).mockImplementation(() => true);

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer valid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = authGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(tokenService.extractToken).toHaveBeenCalled();
    expect(tokenService.verify).toHaveBeenCalledWith('valid-token');
  });
});
