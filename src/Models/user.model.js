import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, // cloudniary Service
      required: true,
    },
    coverImage: {
      type: String, //cloudniary url
    },
    WatchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    Password: {
      type: String,
      required: [true, "password  is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
//  THIS METHOD ENCYRYPT THE USER PASSWROD
userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next(); // IF PASSWORD IS NOT MODIFIED THEN SIMPLE RETURN next() FALG
  //  OTHERWISE ENCRYPT PASSWORD  IN HASH
  this.Password = await bcrypt.hash(this.Password, 10);
  next();
});

//   NOW USER ENTER  HIS PASSWORD THEN I  AM  CONVERT THIS IN ENCRYPTION DUE
//  TO CHECKING THAT USER ENTERD PASSWORD AND PASSWORD INSIDE DATABSE IS SAME

userSchema.methods.isPasswordCorrect = async function (Password) {
  return await bcrypt.compare(Password, this.Password);
};

//  USING JWT  AS KEY  FOR MY DATABASE
//  TO GENTARATE ACCES TOKEN
userSchema.methods.genrateaccesToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullname: this.fullname,
    },
    process.env.ACCES_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCES_TOKEN_EXPIRY,
    }
  );
};

//  TO GENRATE REFRESH TOKEN
userSchema.methods.genrateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRECT,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const user = mongoose.model("User", userSchema);
