import express from "express";
import { createPurchase, getAllPurchaseByFilter } from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/users/createPurchase",createPurchase);
router.get("/users/getAllPurchaseByFilter",getAllPurchaseByFilter);
export default router;