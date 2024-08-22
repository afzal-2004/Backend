import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      // ONE WHO IS SUBSCRIBEING
      ref: "User",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      //     ONE TO WHOM SUBSCRIBE IS SUBSCRIBING
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
export const subscription = mongoose.model("subscription", subscriptionSchema);
