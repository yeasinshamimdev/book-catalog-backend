/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import CustomApiError from '../../error/CustomError';
import handleCastError from '../../error/handleCastError';
import handleValidationError from '../../error/handleValidationError';
import handleZodValidationError from '../../error/handleZodValidationError';
import { IGenericErrorMessage } from '../../interface/error';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.env === 'development'
    ? console.log(`globalErrorHandler ~~`, { error })
    : console.log(`globalErrorHandler ~~`, error);

  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const errorResponse = handleValidationError(error);
    statusCode = errorResponse.statusCode;
    message = errorResponse.message;
    errorMessages = errorResponse.errorMessages;
  } else if (error instanceof ZodError) {
    const errorResponse = handleZodValidationError(error);
    statusCode = errorResponse.statusCode;
    message = errorResponse.message;
    errorMessages = errorResponse.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof CustomApiError) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
