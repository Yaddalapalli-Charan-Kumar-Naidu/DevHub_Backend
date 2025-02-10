import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { editProfile, getProfile,changePassword } from "../controllers/profileController.js";
const profileRouter=express.Router();


profileRouter.get("/view",authenticate,getProfile);

profileRouter.put("/edit",authenticate,editProfile);

profileRouter.patch("/password",authenticate,changePassword);

export default profileRouter;