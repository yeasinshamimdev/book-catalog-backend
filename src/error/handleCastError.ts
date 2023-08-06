import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interface/error';

const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid ID',
    },
  ];

  const statusCode = 404;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;
