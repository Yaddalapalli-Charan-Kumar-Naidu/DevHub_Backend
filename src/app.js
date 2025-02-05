import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import { connectDB } from "./config/dbConnect.js";
import { signupValidator } from "./utils/validators.js";
import { User } from "./models/user.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/authenticate.js";
import validator from 'validator';


app.use(express.json());
app.use(cookieParser());


app.post("/signup",async (req,res)=>{
    try{
    signupValidator(req);
    const {firstName,lastName,password,email,age,gender,skills,about}=req?.body;
    const hashedPwd=await bcrypt.hash(password,10);
    const user=new User({firstName,lastName,password:hashedPwd,email,age,gender,skills,about})
        await user.save();
        res.send("account created successfully");
    }
    catch(err){
        res.status(400).send("Error:"+err.message);
    }

})
app.post("/login",async (req,res)=>{
    try{
    const {email,password}=req?.body;
    if(!validator.isEmail(Email)){
        throw new Error("Enter valid email");
    }
    const user=await User.findOne({email});
    if(!user){
        throw new Error("Invalid credentials");
    }
    const isValidPassword=await user.comparePassword(password);
    if(isValidPassword){
        const token=await user.getJWT();
        res.cookie("token",token);
        res.send("Login succesful");
    }
    else{
        throw new Error("Invalid credentials");
        
    }
}catch(err){
    res.status(500).send("Error:"+err.message);
}
})
app.get("/profile",authenticate,(req,res)=>{
    res.send(req.user);
})



try {
  connectDB().then(() => {
    console.log("Database connection successful");
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`server is running at: http://localhost:${PORT}`);
      })
      
  })
  .catch((err) => {
    console.log("Error:" + err.message);
  });
} catch (err) {
  console.log("Error:" + err.message);
}
