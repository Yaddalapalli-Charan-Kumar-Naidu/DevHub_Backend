import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { getConnections, getFeed, getRequests } from "../controllers/userController.js";
const userRouter=express.Router();

userRouter.get("/requests/received",authenticate,getRequests);
userRouter.get("/connections",authenticate,getConnections);
userRouter.get("/feed",authenticate,getFeed);


export default userRouter;