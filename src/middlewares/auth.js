import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyJwt = async (req, res, next) => {
  const incomingToken = req?.cookies?.accessToken || req?.header("Authorization")?.split(" ")[1];

  console.log(incomingToken);
  if (!incomingToken) {
    return res.status(401).json({ message: "Unauthorized Access 1" });
  }
  try {
    const decodedToken = jwt.verify(incomingToken,process.env.ACCESS_TOKEN_SECRET_KEY);

    const existingUser = await User.findById(decodedToken?._id).select(
      "-password -refresh_token"
    );

    if (!existingUser) {
      return res.status(401).json({ message: "Unauthorized Access 2" });
    }

    req.user = existingUser;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized Access 3" });
  }
};
