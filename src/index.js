import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";
import connectDB from "./Db/index.js";
const PORT = process.env.PORT ? parseInt(process.env.PORT.trim(), 10) : 8001;

dotenv.config({
  path: "./.env",
});
// console.log("Enviorment PORT :", PORT);
connectDB()
  .then(() => {
    app.listen(PORT || 8001, () => {
      console.log(`Server is running  ${PORT} `);
    });
  })
  .catch((err) => console.log(" MONGO  db connection failed !!!", err));
