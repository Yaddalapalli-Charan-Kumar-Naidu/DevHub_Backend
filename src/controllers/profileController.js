import { validateEdit } from "../utils/validators.js";
import bcrypt from 'bcrypt';
import { User } from "../models/user.js";
import validator from "validator";
export const getProfile=async(req,res)=>{
    try{
        res.status(200).json({
            user:req.user
        })
        
    }
    catch(err){
        res.status(500).send("Error:"+err.message);
    }
}

export const editProfile=async(req,res)=>{
    try{
    if(!validateEdit(req)){
        return res.status(400).json({ error: "Invalid edit request" });
    }
    const user=req.user;
    Object.keys(req.body).forEach(key=>
        (user[key]=req.body[key])
    )
    await user.save();
    res.status(201).json({
        "msg":`${user.firstName} details updated successfully`,
        "user":user
    })
    }catch(err){
    res.status(500).json({"Error":err.message});
    }
}


export const changePassword=async(req,res)=>{
    try{
    const {oldPassword,newPassword}=req.body;
    const {id}=req.user;
    const user=await User.findById(id);
    const isPassword=await bcrypt.compare(oldPassword,user.password)
    if(!isPassword){
        throw new Error("Incorrect password");
    }
    const isSamePassword=await bcrypt.compare(newPassword,user.password)
    if(isSamePassword){
        throw new Error("new and old password should not be same");
    }
    if(!validator.isStrongPassword(newPassword)){
        throw new Error("Enter a strong password"); 
    }
    const hashedPwd=await bcrypt.hash(newPassword,10);
    user.password=hashedPwd;

    user.save();
    res.status(200).json({"msg":"password changed successfully"});
    }catch(err){
    res.status(400).json({"Error":err.message});
}
    
}