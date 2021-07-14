import { param, body, validationResult } from 'express-validator';
import logger from '../utilities/logger';

const createValidationRules = () => [
  body('type').isString().isIn(['BUY', 'SELL']),
  body('tickerSymbol').isString().isUppercase().trim(),
  body('quantity').isInt({ min: 1 }),
  body('price').isFloat({ min: 0 }),
];

const updateValidationRules = () => [
  param('id').isString().trim(),
  body('type').isString().isIn(['BUY', 'SELL']).optional(),
  body('tickerSymbol').isString().isUppercase().trim()
    .optional(),
  body('quantity').isInt({ min: 1 }).optional(),
  body('price').isFloat({ min: 0 }).optional(),
];

const deleteValidationRules = () => [
  param('id').isString(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  logger.error('validate function', errors);
  const responseMessage = errors.array().map((err) => {
    const errMessage = {};
    errMessage[err.param] = err.msg;
    return errMessage;
  });
  return res.status(422).json({
    errors: responseMessage,
  });
};

export default {
  createValidationRules,
  updateValidationRules,
  deleteValidationRules,
  validate,
};
