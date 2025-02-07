import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
const requestRouter=express.Router();
import { sendRequest,reviewRequest } from "../controllers/requestController.js";

requestRouter.post("/send/:status/:userId", authenticate ,sendRequest);
requestRouter.post("/review/:status/:requestId",authenticate,reviewRequest);

export default requestRouter;