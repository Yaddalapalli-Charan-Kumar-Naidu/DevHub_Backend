import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import { connectDB } from "./config/dbConnect.js";

import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
import profileRouter from "./routes/profileRouter.js";
import requestRouter from "./routes/requestRouter.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import sendEmail from "./utils/sendEmail.js";
import "./utils/cronSchedule.js"
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
app.use("/user",userRouter)

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
