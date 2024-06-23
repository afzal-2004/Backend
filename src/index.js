// require("dotenv").config();
import dotenv from "dotenv";
import mongoose from "mongoose";
// import { DB_NAME } from "./Constant";
import connectDB from "./Db/index.js";

dotenv.config({
  path: "./env",
});
connectDB();

// function connectDb() {}
// connectDb();

// import express from "express";
// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log(`App is not listen ${process.env.PORT} `);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(` App is listen`);
//     });
//   } catch (error) {
//     console.log("Error:", error);
//     throw error;
//   }
// })();
