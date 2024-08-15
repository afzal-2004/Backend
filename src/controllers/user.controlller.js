import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { user } from "../Models/user.model.js";
import { uploadResult } from "../Utils/cloudniary.js";
import { ApiResponce } from "../Utils/ApiResponce.js";

const genrateAccesAndrefressTokens = async (userId) => {
  try {
    const User = await user.findById(userId);
    const accessToken = User.genrateaccesToken();
    const refreshToken = User.genrateRefreshToken();
    User.refreshToken = refreshToken;
    await User.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something Went Wrong ");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "AfzalKhan",
  // });

  //  Take Data from frountend
  // validation-->not empty
  // Check User is already exist or not -->email or MobileNumber
  //Check For Image
  // Upload  image to cloudniary, avtar is upload or not
  // CREATE user object -->create entry in db
  // remove Password and refresh token field from response
  // Check for User Creation
  //  Return Response

  const { fullname, userName, email, Password } = req.body;
  console.log("email:", email);
  console.log("fullName:", fullname);
  console.log("userName:", userName);
  console.log("password:", Password);

  // if (fullName === "") {
  //   throw new ApiError(400, "Full Name is required");
  // }
  // else if (email === "") {
  //   throw new ApiError(400, "Full Name is required");
  // }
  //  else if (userName === "") {
  //   throw new ApiError(400, "Full Name is required");
  // }
  //  else if (password === "") {
  //   throw new ApiError(400, "Full Name is required");
  // }
  // SIMALERLY CHECK ONE BY ONE EVERY FIELD

  if (
    [fullname, email, userName, Password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, " All fiels are required");
  }
  const exectidUser = await user.findOne({
    $or: [{ userName }, { email }],
  });
  if (exectidUser) {
    throw new ApiError(409, " UserName or email is Already Existed");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const CoverImageLocalPath = req.files?.coverImage?.[0]?.path;
  let CoverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    CoverImageLocalPath = req.files.coverImage?.[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError("400", "Avtar image  is Required");
  }

  const avtar = await uploadResult(avatarLocalPath);
  const coverImage = await uploadResult(CoverImageLocalPath);

  if (!avtar) {
    throw new ApiError("400", "Avtar image  is Required");
  }
  const User = await user.create({
    fullname,
    avatar: avtar.url,
    coverImage: coverImage?.url || "",
    email,
    Password,
    userName: userName.toLowerCase(),
  });
  const CreatedUser = await user
    .findById(User._id)
    .select("-Password -refreshToken");
  if (!CreatedUser) {
    throw new ApiError(500, " SomeThing went Wrong while register the user ");
  }

  return res
    .status(201)
    .json(new ApiResponce(200, CreatedUser, "User registred succesFully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -->data
  // username or email
  // find the user
  // Password  Check
  // access and refresh token  genrated
  // send cookie
  const { userName, email, Password } = req.body;
  if (userName === "" || email === "") {
    throw new ApiError(400, "username or Password is required");
  }

  const User = await user.findOne({
    $or: [{ userName, email }],
  });
  if (!User) {
    throw new ApiError(404, "User Does Not exist");
  }

  const isPasswordValid = await User.isPasswordCorrect(Password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password Invalid ");
  }
  const { accessToken, refreshToken } = await genrateAccesAndrefressTokens(
    User._id
  );
  const loggedInUser = await user.findById(User._id);
  select("-Password -refreshToken");
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Loggedin Succefully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  user.findByIdAndUpdate(
    req.User._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, {}, "User Logged Out SuccesFully "));
});

export { registerUser, loginUser, logoutUser };
