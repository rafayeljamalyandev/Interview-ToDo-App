import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;
    const userEmail = req.user?.email ?? 'anonymous';

    this.logger.log(
      `${method} ${url} - User: ${userEmail} - Body: ${JSON.stringify(body)}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${method} ${url} - ${Date.now() - now}ms - User: ${userEmail}`,
        );
      }),
    );
  }
} 