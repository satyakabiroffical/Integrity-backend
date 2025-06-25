import express from "express";
import { upload } from "../middlewares/multer.js";
import { getOneCompany, updateCompany } from "../controllers/companyController.js";
const router = express.Router();

router.get("/getOneCompany",getOneCompany);

router.put("/updateCompany",upload.fields([{name:"favIcon"},{name:"logo"}]),updateCompany);

export default router;