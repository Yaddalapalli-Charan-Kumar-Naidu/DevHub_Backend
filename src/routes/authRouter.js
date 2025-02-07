import express from "express";
const authRouter = express.Router();
import { authenticate } from "../middlewares/authenticate.js";
import validator from "validator";
import { signupValidator } from "../utils/validators.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

authRouter.post("/signup", async (req, res) => {
  try {
    signupValidator(req);
    const { firstName, lastName, password, email, age, gender, skills, about } =
      req?.body;
    const hashedPwd = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: hashedPwd,
      email,
      age,
      gender,
      skills,
      about,
    });
    await user.save();
    res.send("account created successfully");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req?.body;
    if (!validator.isEmail(email)) {
      throw new Error("Enter valid email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.comparePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login succesful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Error:" + err.message);
  }
});
authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.status(200).json({"msg":"Logout successful"})
})

authRouter.get("/profile", authenticate, (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

export default authRouter;
