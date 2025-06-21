import express from "express";
import cors from "cors";
import http from "http";
import { socketHandler } from "./controllers/socketController.js";
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/userRouter.js";

const app = express();
export const server = http.createServer(app);
app.use(cors());
app.use(express.json());

connectDB();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://roomifychat.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("✅ Roomify Chat server is running!");
});

socketHandler(server);

server.listen(process.env.PORT || 3001, () => {
  console.log("✅ Roomify Chat server is running on port 3001");
});
