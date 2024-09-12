import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Userrouter from "./routes/user-route.js";
dotenv.config();

mongoose
  .connect(process.env.mongo)
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });


const app = express();

app.use("/api/user",Userrouter)

app.listen(3000, () => {
  console.log("server is running in port 3000");
});
