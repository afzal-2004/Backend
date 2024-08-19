import { user } from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const VerifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "Unauthrized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
    const User = await user
      .findById(decodedToken?._id)
      .select("-Password -refreshToken");
    if (!User) {
      throw new ApiError(401, "Invalid Acces Token  ");
    }
    req.User = User;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Inavalid Accces Token ");
  }
});
