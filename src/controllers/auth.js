import { User } from "../models/user.js";
import uploadFileToCloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  const profile_photo_path = req.files.profile_photo[0].path;
  const cover_photo_path = req.files.cover_photo[0].path;

  try {
    if ([username, email, password].some((field) => field?.trim() === "")) {
      res.status(400).json({ message: "All fields are required." });
      throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      res.status(409).json({ message: "Email or username is already exists." });
      throw new Error("Email or username is already exists.");
    }

    let profile_photo = "";
    let cover_photo = "";

    if (profile_photo_path && cover_photo_path) {
      console.log(profile_photo_path);
      profile_photo = await uploadFileToCloudinary(profile_photo_path);
      cover_photo = await uploadFileToCloudinary(cover_photo_path);
      console.log(cover_photo);
    }

    const user = await User.create({
      email,
      username: username.toLowerCase(),
      password,
      profile_photo,
      cover_photo,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return res
        .status(500)
        .json({ message: "Something went worng in registration new user." });
    }

    return res
      .status(200)
      .json({ userInfo: createdUser, message: "Registration is success." });
  } catch (error) {
    console.log(error);
    fs.unlinkSync(profile_photo_path);
    fs.unlinkSync(cover_photo_path);
  }
};

const genereateAccessTokenAndRefreshRoken = async (userId) => {
  try {
    const loggeduser = await User.findById(userId).select(
      "-password -refreshToken"
    );

    console.log(loggeduser);

    const accessToken = await loggeduser.generateAccessToken();

    const refreshToken = await loggeduser.generateRefreshToken();

    console.log(refreshToken);
    

    loggeduser.refresh_token = refreshToken;

    await loggeduser.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

export const loginController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (!existingUser) {
    return res.status(400).json({ message: "There have such User" });
  }

  const isMatch = await existingUser.isPasswordMatch(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Crenditails" });
  }

  const { accessToken, refreshToken } =
    await genereateAccessTokenAndRefreshRoken(existingUser._id);

  const loggeduser = await User.findById(existingUser._id).select(
    "-password -refresh_token"
  );

  const options = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({data : loggeduser,message : "Login Successfully🎉"})
};
