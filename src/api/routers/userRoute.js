import express from "express";
import { createUserByRole, signIn, forgetChangedPassaword, forgetPassword, verifyOtp , updateProfile, updatePassword, filterAllAgentOrUser, getProfile, getDashBoard} from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
import { auth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/createUserByRole", upload.fields([{name:"userImage"}, {name:"businessImage"}]), createUserByRole)
router.post("/signIn", signIn);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyOtp", verifyOtp);
router.put("/forgetChangedPassaword", forgetChangedPassaword);
router.get("/filterAllAgentOrUser",auth, filterAllAgentOrUser);
router.get("/getProfile", auth, getProfile);
router.get("/getDashBoard", auth, getDashBoard);



// router.post("/upload",  optimizedVideoUpload);



// user 
router.put("/updateProfile",auth, upload.single('userImage'), updateProfile);
router.put("/updatePassword",auth, updatePassword);






export default router;