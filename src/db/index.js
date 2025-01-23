import mongoose from "mongoose";

const DB_NAME = "standard-express";

export const connectDB = async () => {
  try {
    const connectionResponse = await mongoose.connect(
      `${process.env.MOGO_DB}/${DB_NAME}`
    );

    console.log("Connected successfully", connectionResponse.connection.host);
  } catch (err) {
    console.log("DB connection error", err);
    process.exit(1);
  }
};
