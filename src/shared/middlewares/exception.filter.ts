import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { errorResponse } from '../utils';

// Global Exception Filter to handle unhandled exceptions
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // respond with Internal Server Error if error is not known
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    // set Status and Message if error is a HTTP error
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json(errorResponse(message, status));
  }
}
