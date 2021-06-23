import { body } from 'express-validator';

export const registrationValidators = [
  body('email').isEmail().withMessage('Enter email correctly'),
  body('password').isLength({min: 3, max: 32}).withMessage('Password length must be 3 - 32 symbols')
];