import express from "express";
import {
  createCategory,
  getAllCategory,
  removeCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  createProduct,
  getAllProduct,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { getAccountAdmin, loginAdmin } from "../controllers/auth.controller.js";
import { authMiddlewareAdmin } from "../middleware/auth.middleware.js";
import {
  getOrderByAdmin,
  removeOrder,
  updateOrder,
} from "../controllers/order.controller.js";
import {
  getReviewByAdmin,
  removeReview,
  updateReview,
} from "../controllers/review.controller.js";
import { getAllUser, updateUser } from "../controllers/user.controller.js";
import { validateMiddleWare } from "../middleware/validate.middleware.js";

import { loginAdminValidate } from "../validates/auth.validate.js";

import { statisticalDashboard } from "../services/statistical.js";
const router = express.Router();

router.post("/login", loginAdminValidate, validateMiddleWare, loginAdmin);
router.get("/account", authMiddlewareAdmin, getAccountAdmin);

router.post("/categories", authMiddlewareAdmin, createCategory);
router.get("/categories", authMiddlewareAdmin, getAllCategory);
router.put("/categories/:id", authMiddlewareAdmin, updateCategory);
router.delete("/categories/:id", authMiddlewareAdmin, removeCategory);

router.get("/products", authMiddlewareAdmin, getAllProduct);
router.get("/products/:id", authMiddlewareAdmin, getAllProduct);
router.post("/products", authMiddlewareAdmin, createProduct);
router.put("/products/:id", authMiddlewareAdmin, updateProduct);
router.delete("/products/:id", authMiddlewareAdmin, removeProduct);

router.get("/orders", authMiddlewareAdmin, getOrderByAdmin);
router.put("/orders/:id", authMiddlewareAdmin, updateOrder);
router.delete("/orders/:id", authMiddlewareAdmin, removeOrder);

router.get("/reviews", authMiddlewareAdmin, getReviewByAdmin);
router.put("/reviews/:id", authMiddlewareAdmin, updateReview);
router.delete("/reviews/:id", authMiddlewareAdmin, removeReview);

router.get("/users", authMiddlewareAdmin, getAllUser);
router.put("/users/:id", authMiddlewareAdmin, updateUser);

router.get("/statistical", authMiddlewareAdmin, statisticalDashboard);

export default router;
