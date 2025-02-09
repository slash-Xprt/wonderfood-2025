import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  status?: number;
  code?: string;
  errors?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    code: err.code
  });

  // Default error values
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';
  let errors = err.errors || null;

  // Handle Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    message = 'Validation Error';
    errors = err.message.split('\n');
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    status = 400;
    switch (err.code) {
      case 'P2002': // Unique constraint failed
        message = 'Duplicate entry';
        break;
      case 'P2014': // The change you are trying to make would violate the required relation
        message = 'Invalid relation';
        break;
      case 'P2003': // Foreign key constraint failed
        message = 'Related record not found';
        break;
      default:
        message = 'Database error';
    }
  }

  // Handle Prisma Unknown Request Errors
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    status = 500;
    message = 'Database error';
  }

  const errorResponse = {
    error: {
      message,
      status,
      ...(errors && { errors }),
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        code: err.code
      })
    }
  };

  console.error('Sending error response:', errorResponse);
  res.status(status).json(errorResponse);
}; 