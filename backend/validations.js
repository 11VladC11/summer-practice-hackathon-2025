import { body } from "express-validator";

export const loginValidation = [
  body("email", "Invalid email format").isEmail(),
  body("password", "Password must be at least 5 characters long").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Invalid email format").isEmail(),
  body("password", "Password must be at least 5 characters long").isLength({
    min: 5,
  }),
  body("fullName", "Please enter your name").isLength({ min: 3 }),
  body("avatarUrl", "Invalid avatar URL").optional().isURL(),
];


export const postCreateValidation = [
  body("title", "Enter the post name").isLength({ min: 3 }).isString(),
  body("text", "Enter the post text").isLength({ min: 10 }).isString(),
  body("tags", "Invalid tag format (provide an array)").optional().isString(),
  body("avatarUrl", "Invalid image URL").optional().isString(),
];