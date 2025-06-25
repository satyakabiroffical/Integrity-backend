import express from "express";
import { createTransaction, getTransactionById, getAllTransaction, transactionStatusUpdate, getWallet} from "../controllers/transactionController.js";
import { auth } from "../middlewares/authMiddleware.js";
const router = express.Router();

// for user
router.post("/createTransaction",auth, createTransaction);
router.get("/getTransactionById",auth, getTransactionById);
router.get("/userGetAllTransaction",auth, getAllTransaction);
router.get("/getWallet",auth, getWallet);



// for admin
router.get("/getAllTransaction",auth, getAllTransaction);
router.put("/transactionStatusUpdate",auth, transactionStatusUpdate);



export default router;