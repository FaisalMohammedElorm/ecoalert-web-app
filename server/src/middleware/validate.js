import { validationResult } from 'express-validator';

// Centralized validation result handler for express-validator chains.
export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return the first validation error message for simplicity.
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
}

export default handleValidation;
