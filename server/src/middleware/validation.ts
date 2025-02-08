import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateOrder = [
  body('items').isArray().notEmpty().withMessage('Items are required'),
  body('items.*.id').isNumeric().withMessage('Invalid item ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Invalid quantity'),
  body('total').isFloat({ min: 0 }).withMessage('Invalid total'),
  body('customerInfo.name').trim().notEmpty().withMessage('Name is required'),
  body('customerInfo.email').isEmail().withMessage('Invalid email'),
  body('customerInfo.phone').matches(/^\+?[\d\s-]{8,}$/).withMessage('Invalid phone number'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 