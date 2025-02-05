import jwt from "jsonwebtoken";
import { User } from "../models/user.js";


export const authenticate=async (req,res,next)=>{
    try{
    const {token}=req.cookies;

    if(!token){
        res.status(404).send("Unauthorized access");
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET);
    const {id}=decoded;
    const user=await User.findById(id);
    if(!user){
        res.status(404).send("Unauthorized access");
    }
    req.user=user;
    next();
}catch(err){
    res.status(500).send("error:"+err.messgae);
}
    
}