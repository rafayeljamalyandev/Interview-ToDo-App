import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { httpStatus } from 'src/common/consts/http-status.const';
import { ErrorData } from 'src/common/interfaces/error-data.interface';

@Catch()
export class ResponseErrorInterceptor implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // assign request & response context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // assign message from thrown exception
    const message = exception.message;

    // get status code from thrown exception if stated when throwing, or ISE if not stated
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // error message string for response error_data & error object
    let errorMessage = '';

    // error object for thrown error_data
    let messageObject: ErrorData[];

    try {
      // if message is JSON stringified, parse it back to JS object
      messageObject = JSON.parse(message);
    } catch (error) {
      // if message is string, set default value for message object
      errorMessage = message;
      messageObject = [];
    }

    // error object for response error_data
    const errorDatas: ErrorData[] = [];

    // check if there is any DTO error, and push to error data message
    if (typeof exception.getResponse === 'function') {
      const resException = exception.getResponse();

      const errorDTOs =
        typeof resException === 'object'
          ? resException['message']
          : resException;
      if (Array.isArray(errorDTOs)) {
        for (const errorDTO of errorDTOs) {
          errorDatas.push({
            info: '',
            message: errorDTO,
          });
        }
      }
    }

    // map array error_data
    for (const itemError of messageObject) {
      // if message was not JS object, use thrown message
      errorMessage = itemError.message == '' ? message : itemError.message;

      const errorData: ErrorData = {
        info: itemError.info ?? '',
        message: errorMessage,
      };
      if (itemError.data) {
        errorData.data = itemError.data;
      }

      // push to error_data array
      errorDatas.push(errorData);
    }

    // log error
    console.error(exception);

    // set meta message
    let metaMsg: string = httpStatus[status];
    if (status == 500) {
      errorMessage = message;
      metaMsg = 'Something went wrong. Please try again.';
    }

    // build response
    const responseBody = {
      meta: {
        code: status,
        msg: metaMsg,
      },
      error: errorMessage,
      error_data: errorDatas,
    };

    response.status(status).json(responseBody);
  }
}
