import express from "express";
import {
  createCity,
  updateCity,
  getCityById,
  getAllCity,
  deleteCityById,
} from "../controllers/cityController.js";

const router = express.Router();

router.post("/createCity", createCity);
router.put("/updateCity", updateCity);
router.get("/getCityById", getCityById);
router.get("/getAllCity", getAllCity);
router.delete("/deleteCityById", deleteCityById);

export default router;
