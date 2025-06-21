import express from "express";
import { handleJoin, handleRegister } from "../controllers/userController.js";
export const userRouter = express.Router();

userRouter.post("/register", handleRegister);
userRouter.post("/join-chat", handleJoin);
