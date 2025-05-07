// src/validations/auth.validation.ts
import { body, ValidationChain } from "express-validator";

export const loginValidate: ValidationChain[] = [
  body("password")
    .trim()
    .notEmpty().withMessage("password is required")
    .escape(),
  body("password")
    .notEmpty().withMessage("password is required")
];

export const signupValidate: ValidationChain[] = [
  body("username")
    .trim()
    .isLength({ min: 4, max: 20 }).withMessage("username must be between 4 and 20 characters")
    .isAlphanumeric().withMessage("username can only contain letters and numbers")
    .escape(),
  body("email")
    .trim()
    .isEmail().withMessage("must provide a valid email")
    .normalizeEmail()
    .escape(),
  body("password")
    .isLength({ min: 6 }).withMessage("password must be at least 6 characters")
    .matches(/\d/).withMessage("password must include at least one number"),
  body("role")
    .optional()
    .isIn(["subscriber"]).withMessage("invalid role")
    .escape()
];

export const adminValidate: ValidationChain[] = [];