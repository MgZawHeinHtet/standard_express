import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionResponse = await mongoose.connect(`${process.env.MOGO_DB}`);

    console.log("Connected successfully", connectionResponse.connection.host);
  } catch (err) {
    console.log("DB connection error", err);
    process.exit(1);
  }
};
