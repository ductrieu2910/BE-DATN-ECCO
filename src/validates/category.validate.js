import { body } from "express-validator";

export const createCategoryValidate = [
  body("name")
    .notEmpty()
    .withMessage("Vui lòng nhập tên danh mục")
    .isString()
    .withMessage("Tên danh mục phải là một chuỗi"),
];

// export const updateCategoryValidate = [
//   body("name")
//     .optional()
//     .notEmpty()
//     .withMessage("Vui lòng nhập tên danh mục")
//     .isString()
//     .withMessage("Tên danh mục phải là một chuỗi nếu được cung cấp"),
// ];
