import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";
import connectDB from "./Db/index.js";

dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server is running  ${process.env.PORT} `);
    });
  })
  .catch((err) => console.log(" MONGO  db connection failed !!!", err));
