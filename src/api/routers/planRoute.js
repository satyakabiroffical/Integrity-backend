import express from "express";
import { getPlan, createPlan, getPlanById } from "../controllers/planController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";


const router = express.Router();

// for all
router.get("/getPlan",auth, getPlan);
router.get("/getPlanById",auth, getPlanById);


// for admin
router.post("/createPlan",auth, upload.single("image"), createPlan);


export default router;