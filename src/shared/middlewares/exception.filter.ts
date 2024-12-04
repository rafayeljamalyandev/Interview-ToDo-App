import {
  ArgumentsHost,
  BadRequestException,
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

    if (exception instanceof BadRequestException) {
      // Concatenate validation errors if there are one or many errors
      status = exception.getStatus();
      const exceptionObj: any = exception.getResponse();

      // if its not an Array, then its not coming from Custom Validation Pipe
      message = Array.isArray(exceptionObj.errors)
        ? exceptionObj.errors.join('\n')
        : exception.message;
    } else if (exception instanceof HttpException) {
      // set Status and Message if error is a HTTP error
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json(errorResponse(message, status));
  }
}
