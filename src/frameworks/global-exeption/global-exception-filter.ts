import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
    Injectable
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()  // Important: Catch ALL exceptions
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
          exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: this.getErrorMessage(exception)
        };

        this.logger.error(
          `Error in ${request.method} ${request.url}`,
          JSON.stringify(errorResponse)
        );

        response
          .status(status)
          .json(errorResponse);
    }

    private getErrorMessage(exception: unknown): string {
        if (exception instanceof HttpException) {
            return exception.message;
        }
        if (exception instanceof Error) {
            return exception.message;
        }
        return 'Unexpected error occurred';
    }
}