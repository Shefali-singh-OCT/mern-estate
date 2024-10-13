import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import Userrouter from "./routes/user-route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from"./routes/listing.route.js"
import path from 'path'

dotenv.config();

mongoose
  .connect(process.env.mongo)
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const _dirname = path.resolve();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from React app
    credentials: true, // Allow sending cookies
  })
);

app.use("/api/user", Userrouter);
app.use("/api/auth", authRouter);
app.use('/api/listing', listingRouter)

app.use(express.static(path.join(_dirname, '/client/clientreact/dist')));
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "client", "clientreact", "build", "index.html")
  );
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(3000, () => {
  console.log("server is running in port 3000");
});


