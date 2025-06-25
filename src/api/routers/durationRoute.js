import express from "express";
import { getDurationbyFilter } from "../controllers/durationController.js";
const router = express.Router();

router.get("/users/getDurationbyFilter",getDurationbyFilter);

export default router;