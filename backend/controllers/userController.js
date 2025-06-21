import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const handleRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }
  try {
    const userExists = await UserModel.findOne({ username });
    if (userExists) {
      return res
        .status(200)
        .json({ message: "User already exists", status: "error" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, password: hashedPassword });
    return res
      .status(200)
      .json({ message: "User created successfully", user, status: "success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const handleJoin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", status: "error" });
    }
    if (await bcrypt.compare(password, user.password)) {
      return res
        .status(200)
        .json({ message: "User joined successfully", user, status: "success" });
    } else {
      return res
        .status(200)
        .json({ message: "Unauthorized!", status: "error" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
