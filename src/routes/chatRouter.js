import express from 'express';
const chatRouter=express.Router();
import { authenticate } from '../middlewares/authenticate.js';
import {getChats} from '../controllers/chatController.js';

chatRouter.get('/:targetUserId',authenticate,getChats);

export default chatRouter;