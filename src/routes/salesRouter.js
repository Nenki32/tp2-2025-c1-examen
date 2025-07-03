import express from "express";
import { getAllSales,getSaleById,getSalesWithTotal,getSalesByCustomerEmail,updateCouponUsed,getTopProducts } from "../controllers/salesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", getAllSales);
router.get("/total", getSalesWithTotal);
router.get("/top-products", getTopProducts);
router.get("/customer/:email", getSalesByCustomerEmail);
router.get("/:id", getSaleById);
router.patch("/:id/coupon", updateCouponUsed);

export default router;
