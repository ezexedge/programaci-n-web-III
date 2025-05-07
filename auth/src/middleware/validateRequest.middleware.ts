// src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    res.status(400).send({
      status: "error",
      code: 400,
      codeMessageLanguage: "validationError",
      data: { errors: errors.array() }
    });
  };
};

export default validateRequest;