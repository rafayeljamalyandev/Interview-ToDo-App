import { BadRequestException, ValidationPipe } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const customErrors = errors.map((error) => {
          return `${error.property} - ${Object.values(error.constraints).join(', ')}`;
        });

        return new BadRequestException({
          message: 'Validation Failed',
          errors: customErrors,
        });
      },
    });
  }
}
