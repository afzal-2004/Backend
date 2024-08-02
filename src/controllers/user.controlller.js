import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { user } from "../Models/user.model.js";
import { uploadResult } from "../Utils/cloudniary.js";
import { ApiResponce } from "../Utils/ApiResponce.js";
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   // message: "AfzalKhan",
  // });

  //  Take Data from frountend
  // validation-->not empty
  // Check User is already exist or not -->email or MobileNUmber
  //Check For Image
  // Upload  image to cloudniary, avtar is uploa or not
  // CREATE user object -->create entry in db
  // remove Password and refresh token field from response
  // Check for User Creation
  //  Return Response

  const { fullName, userName, email, password } = req.body;
  console.log("email:", email);
  // if (fullName === "") {
  //   throw new ApiError(400, "Full Name is required");
  // } SIMALERLY CHECK ONE BY ONE EVERY FIELD

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, " All fiels are required");
  }
  const exectidUser = user.findOne({
    $or: [{ userName }, { email }],
  });
  if (exectidUser) {
    throw new ApiError(409, " UserName or email is Already Existed");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const CoverLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError("400", "Avtar image  is Required");
  }
  const avatar = await uploadResult(avatarLocalPath);
  const coverImage = await uploadResult(CoverLocalPath);
  if (!avatar) {
    throw new ApiError("400", "Avtar image  is Required");
  }
  const User = await user.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });
  const CreatedUser = await user
    .findById(User._id)
    .select("-password -refreshToken");
  if (!CreatedUser) {
    throw new ApiError(500, " SomeThing went Wrong while register the user ");
  }

  return res
    .status(201)
    .json(new ApiResponce(200, CreatedUser, "user registed succesFully"));
});

export { registerUser };
