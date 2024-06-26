import express from "express"
const router = express.Router();
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile); /* you can also write as this router.get("/profile", getUserProfile); router.put("/profile", updateUserProfile); */

export default router